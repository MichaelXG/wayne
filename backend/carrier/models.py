from django.db import models
from django.utils.text import slugify

class Carrier(models.Model):
    name = models.CharField("Carrier Name", max_length=100, unique=True)
    prefix = models.CharField("Prefix", max_length=4, unique=True)
    slug = models.CharField("Slug", unique=True, blank=True)
    is_default = models.BooleanField("Is Default", default=False, db_index=True)
    is_active = models.BooleanField("Is Active", default=True, db_index=True)
    created_at = models.DateTimeField("Created At", auto_now_add=True)
    updated_at = models.DateTimeField("Updated At", auto_now=True)

    class Meta:
        db_table = "carrier"
        verbose_name = "Carrier"
        verbose_name_plural = "Carriers"
        ordering = ["name"]
        indexes = [
            models.Index(fields=["name"], name="carrier_name_idx"),
            models.Index(fields=["slug"], name="carrier_slug_idx"),
            models.Index(fields=["prefix"], name="carrier_prefix_idx"),
        ]

    def __str__(self):
        return f"{self.name} ({'Active' if self.is_active else 'Inactive'})"

    def save(self, *args, **kwargs):
        if not self.prefix:
            base_prefix = ''.join([c for c in self.name.upper() if c.isalpha()][:3]).ljust(3, 'X')
            prefix = base_prefix
            counter = 1
            while Carrier.objects.exclude(pk=self.pk).filter(prefix=prefix).exists():
                suffix = str(counter)
                prefix = (base_prefix[:3 - len(suffix)] + suffix).ljust(3, 'X')
                counter += 1
            self.prefix = prefix

        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Carrier.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        self.prefix = self.prefix.upper()
        super().save(*args, **kwargs)
