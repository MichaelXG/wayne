from django.db import models
from django.contrib.auth import get_user_model
from django.utils.functional import cached_property
from django.core.exceptions import ValidationError
from django.utils.timezone import now
import random
from decimal import Decimal
from carrier.models import Carrier
from address.models import Address
from wallet.models import Wallet

User = get_user_model()

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('canceled', 'Canceled'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    code = models.CharField(max_length=10, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    canceled_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        is_update = bool(self.pk)
        old_status = None

        if not self.code:
            last_order = Order.objects.filter(user=self.user).order_by('-id').first()
            next_code = int(last_order.code) + 1 if last_order and last_order.code.isdigit() else 1
            self.code = f'{next_code:04d}'

        if is_update:
            old_status = Order.objects.filter(pk=self.pk).values_list('status', flat=True).first()

        if self.status == 'completed' and self.completed_at is None:
            if not self.orderPayments.filter(canceled=False).exists():
                raise ValidationError("Cannot complete order: missing valid payment.")
            if not self.deliveries.filter(canceled=False).exists():
                raise ValidationError("Cannot complete order: missing valid delivery.")
            if not self.shippings.filter(canceled=False).exists():
                raise ValidationError("Cannot complete order: missing valid shipping.")
            
            self.completed_at = now()
            super().save(*args, **kwargs)

            # ✅ Enviar notificação para AfterShip
            try:
                from .services import send_confirmation_aftership  # coloque a função num arquivo separado
                send_confirmation_aftership(self)
            except Exception as e:
                print(f"⚠️ AfterShip notification failed: {e}")
            return

        if self.status == 'canceled' and self.canceled_at is None:
            now_value = now()
            self.canceled_at = now_value
            self.deliveries.filter(canceled=False).update(canceled=True, canceled_at=now_value)
            self.shippings.filter(canceled=False).update(canceled=True, canceled_at=now_value)
            self.orderPayments.filter(canceled=False).update(canceled=True, canceled_at=now_value)

        super().save(*args, **kwargs)


    def __str__(self):
        return f'Order #{self.code} - {self.user.username}'

    @cached_property
    def sub_total(self):
        return sum(item.total_price for item in self.items.all())

    @cached_property
    def discount(self):
        return round(
            sum(
                item.price * item.quantity * Decimal('0.1')
                for item in self.items.all()
                if item.price > 500
            ),
            2
        )

    @cached_property
    def shippingFee(self):
        return 0 if self.sub_total > 500 else 15

    @cached_property
    def tax(self):
        base = self.sub_total + self.shippingFee - self.discount
        return round(base * Decimal('0.08'), 2)

    @cached_property
    def total(self):
        return round(self.sub_total + self.shippingFee + self.tax - self.discount, 2)

    class Meta:
        db_table = "order"
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['user']),
            models.Index(fields=['status']),
        ]

    def update_status_from_related_data(self):
        if self.status in ['completed', 'canceled']:
            return

        latest_status = 'pending'
        payment = self.orderPayments.filter(order_id=self.id, canceled=False).order_by('-created_at').first()
        delivery = self.deliveries.filter(order_id=self.id, canceled=False).order_by('-created_at').first()
        shipping = self.shippings.filter(order_id=self.id, canceled=False).order_by('-created_at').first()

        events = []
        if payment:
            events.append(('paid', payment.created_at))
        if delivery:
            events.append(('processing', delivery.created_at))
        if shipping:
            events.append(('shipped', shipping.created_at))
        if events:
            events.sort(key=lambda e: e[1], reverse=True)
            latest_status = events[0][0]
            if latest_status == 'shipped' and self.deliveries.filter(order_id=self.id, canceled=False, carrier__isnull=False).exists():
                latest_status = 'delivered'

        self.status = latest_status
        self.save(update_fields=['status'])

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_id = models.IntegerField()
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'Product #{self.product_id} (x{self.quantity})'

    @property
    def total_price(self):
        return self.quantity * self.price

    class Meta:
        db_table = "orderItem"
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['product_id']),
        ]

class OrderDelivery(models.Model):
    SPEED_CHOICES = [
        ('standard', 'Standard'),
        ('express', 'Express'),
        ('overnight', 'Overnight'),
    ]

    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='deliveries')
    carrier = models.ForeignKey('carrier.Carrier', on_delete=models.PROTECT, related_name='deliveries')
    speed = models.CharField(max_length=20, choices=SPEED_CHOICES, default='standard')
    tracking = models.CharField(max_length=20, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    canceled = models.BooleanField(default=False)
    canceled_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Tracking {self.tracking or "N/A"} for Order {self.order_id}'

    def clean(self):
        if self.speed not in dict(self.SPEED_CHOICES):
            raise ValidationError({'speed': 'Invalid delivery speed option.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        if not self.tracking and self.carrier:
            self.tracking = self.generate_unique_tracking_code(self.carrier.prefix or "TRK")
        super().save(*args, **kwargs)
        self.order.update_status_from_related_data()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.order.update_status_from_related_data()

    @staticmethod
    def generate_tracking_code(prefix):
        number = ''.join(str(random.randint(0, 9)) for _ in range(12))
        return f"{prefix.upper()}{number}"

    def generate_unique_tracking_code(self, prefix):
        for _ in range(10):
            code = self.generate_tracking_code(prefix)
            if not OrderDelivery.objects.filter(tracking=code).exists():
                return code
        raise Exception("Unable to generate unique tracking code after 10 attempts.")

    class Meta:
        db_table = "orderDelivery"
        verbose_name = "Order Delivery"
        verbose_name_plural = "Order Deliveries"
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['carrier']),
            models.Index(fields=['tracking']),
        ]

class OrderShipping(models.Model):
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='shippings')
    address = models.ForeignKey('address.Address', on_delete=models.PROTECT, related_name='order_shippings')
    created_at = models.DateTimeField(auto_now_add=True)
    canceled = models.BooleanField(default=False)
    canceled_at = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return f"Shipping for Order #{self.order_id} to {self.address}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.order.update_status_from_related_data()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.order.update_status_from_related_data()

    class Meta:
        db_table = "orderShipping"
        verbose_name = "Order Shipping"
        verbose_name_plural = "Order Shippings"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order'], name='idx_ordershipping_order'),
            models.Index(fields=['address'], name='idx_ordershipping_address'),
            models.Index(fields=['canceled'], name='idx_ordershipping_canceled'),
        ]

class OrderPayment(models.Model):
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='orderPayments')
    wallet = models.ForeignKey('wallet.Wallet', on_delete=models.PROTECT, related_name='orderPayments')
    created_at = models.DateTimeField(auto_now_add=True)
    canceled = models.BooleanField(default=False)
    canceled_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Payment for Order #{self.order_id} using {self.wallet}"

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if not self.canceled and is_new:
            self.order.status = 'paid'
            self.order.save(update_fields=['status'])
        else:
            self.order.update_status_from_related_data()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        if not self.order.orderPayments.filter(canceled=False).exists():
            self.order.status = 'canceled'
            self.order.save(update_fields=['status'])
        else:
            self.order.update_status_from_related_data()

    class Meta:
        db_table = "orderPayment"
        verbose_name = "Order Payment"
        verbose_name_plural = "Order Payments"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order'], name='idx_orderPayment_order'),
            models.Index(fields=['wallet'], name='idx_orderPayment_wallet'),
            models.Index(fields=['canceled'], name='idx_orderPayment_canceled'),
        ]
