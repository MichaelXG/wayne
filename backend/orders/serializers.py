from rest_framework import serializers
from .models import Order, OrderItem, OrderDelivery, OrderShipping, OrderPayment
from decimal import Decimal
from django.contrib.auth import get_user_model

User = get_user_model()

class OrderItemSerializer(serializers.ModelSerializer):
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'quantity', 'price', 'total_price']
        read_only_fields = ['id', 'total_price']

class UserSummarySerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

class OrderDeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDelivery
        fields = '__all__'
        reOrderShippingSerializerad_only_fields = ['tracking', 'created_at', 'speed']
        
class OrderShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderShipping
        fields = '__all__'

class OrderPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderPayment
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)
    items = OrderItemSerializer(many=True)
    delivery = OrderDeliverySerializer(source='orderDelivery', many=True, read_only=True)
    shipping = OrderShippingSerializer(source='orderShipping', many=True, read_only=True)
    payment = OrderPaymentSerializer(source='orderPayment', many=True, read_only=True)
    sub_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount = serializers.SerializerMethodField(read_only=True)
    tax = serializers.SerializerMethodField(read_only=True)
    shippingFee = serializers.SerializerMethodField(read_only=True)
    total = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 
            'code', 
            'user', 
            'items',
            'delivery',
            'shipping',
            'payment',
            'sub_total', 
            'discount', 
            'shippingFee', 
            'tax', 
            'total',
            'created_at', 
            'canceled_at',
            'completed_at',
            'status'
        ]
        read_only_fields = [
            'id', 
            'code', 
            'user', 
            'sub_total', 
            'discount', 
            'shippingFee', 
            'tax', 
            'total',
            'created_at', 
            'canceled_at',
            'completed_at',
        ]

    def get_discount(self, obj):
        return Decimal(obj.discount)

    def get_shippingFee(self, obj):
        return Decimal(obj.shippingFee)

    def get_tax(self, obj):
        return Decimal(obj.tax)

    def get_total(self, obj):
        return Decimal(obj.total)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("The order must contain at least one item.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(user=self.context['request'].user, **validated_data)
        for item_data in items_data:
            self._clean_item_data(item_data)
            OrderItem.objects.create(order=order, **item_data)
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                self._clean_item_data(item_data)
                OrderItem.objects.create(order=instance, **item_data)
        return instance

    def _clean_item_data(self, item_data):
        for extra_field in ['title', 'sku', 'image']:
            item_data.pop(extra_field, None)
