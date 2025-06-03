from django.db import models
from django.conf import settings
from encrypted_model_fields.fields import EncryptedCharField


class Wallet(models.Model):
    STATUS_ACTIVE = 'active'
    STATUS_INACTIVE = 'inactive'
    STATUS_EXPIRED = 'expired'

    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Active'),
        (STATUS_INACTIVE, 'Inactive'),
        (STATUS_EXPIRED, 'Expired'),
    ]

    user = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.CASCADE,
        related_name='wallets'
    )

    name = models.CharField(max_length=255)
    number = EncryptedCharField(max_length=20)  
    expiry = models.DateField(help_text="Expiration date in format YYYY-MM-DD")
    cvc = EncryptedCharField(max_length=4)      
    brand = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "wallet"
        verbose_name = "Wallet Card"
        verbose_name_plural = "Wallet Cards"
        ordering = ['-is_primary', '-status', '-created_at']
        indexes = [
            models.Index(fields=["user"], name="wallet_user_idx"),
            models.Index(fields=["status"], name="wallet_status_idx"),
            models.Index(fields=["is_primary"], name="wallet_primary_idx"),
        ]

    def __str__(self):
        user_email = getattr(self.user, "email", "Unknown user")
        return f"{user_email} - {self.brand or 'Card'} ending {self.last4_digits}"

    @property
    def last4_digits(self):
        if self.number and len(self.number) >= 4:
            return self.number[-4:]
        return '****'

    def save(self, *args, **kwargs):
        if self.is_primary:
            Wallet.objects.filter(user=self.user, is_primary=True).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)