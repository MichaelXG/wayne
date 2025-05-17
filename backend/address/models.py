from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    street = models.CharField("Street", max_length=255)
    number = models.CharField("Number", max_length=20)
    neighborhood = models.CharField("Neighborhood", max_length=100, blank=True, null=True)
    complement = models.CharField("Complement", max_length=100, blank=True, null=True)
    reference = models.CharField("Reference", max_length=255, blank=True, null=True)
    city = models.CharField("City", max_length=100)
    state = models.CharField("State", max_length=100)
    postal_code = models.CharField("Postal Code", max_length=20)
    country = models.CharField("Country", max_length=100, default='Brazil')
    is_default = models.BooleanField("Default Address", default=False)
    is_active = models.BooleanField("Is Active", default=True, db_index=True)
    created_at = models.DateTimeField("Created At", auto_now_add=True)
    updated_at = models.DateTimeField("Updated At", auto_now=True)

    class Meta:
        db_table = "address"
        verbose_name = "Address"
        verbose_name_plural = "Addresses"
        ordering = ["city", "state"]
        indexes = [
            models.Index(fields=["user"], name="address_user_idx"),
            models.Index(fields=["city"], name="address_city_idx"),
            models.Index(fields=["state"], name="address_state_idx"),
        ]

    def __str__(self):
        return f"{self.street}, {self.number} - {self.neighborhood}, {self.city}, {self.state}"
