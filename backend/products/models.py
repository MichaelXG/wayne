from django.db import models
from django.utils.deconstruct import deconstructible
from django.core.validators import FileExtensionValidator
import os
import uuid
import random
import string

# ✅ Caminho customizado para upload de imagens de produtos
@deconstructible
class ProductImageUploadPath:
    def __init__(self, prefix='products'):
        self.prefix = prefix

    def __call__(self, instance, filename):
        if not filename or not isinstance(filename, str):
            filename = f"default_{uuid.uuid4().hex[:6]}.jpg"

        ext = filename.split('.')[-1] if '.' in filename else 'jpg'
        product_id = getattr(instance.product, 'id', None) or f"temp_{uuid.uuid4().hex[:6]}"
        new_filename = f"product_{product_id}_{uuid.uuid4().hex[:8]}.{ext}"
        return os.path.join(self.prefix, new_filename)

class Product(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True, blank=True)
    sku = models.CharField(max_length=50, unique=True, blank=True)
    quantity = models.PositiveIntegerField()

    price_regular = models.DecimalField(max_digits=10, decimal_places=2)
    price_sale = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)

    rating_rate = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    rating_count = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)
    is_secret = models.BooleanField(default=False)
    inserted_in = models.DateTimeField(auto_now_add=True)
    modified_in = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)

        if is_new:
            updated = False
            if not self.sku:
                self.sku = f"SKU-{self.id:04d}"
                updated = True
            if not self.code:
                self.code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
                updated = True
            if updated:
                super().save(update_fields=['sku', 'code'])

    def __str__(self):
        return self.title

    class Meta:
        db_table = "products"
        verbose_name = "Product"
        verbose_name_plural = "Products"
        indexes = [
            models.Index(fields=["title"], name="product_title_idx"),
            models.Index(fields=["sku"], name="product_sku_idx"),
            models.Index(fields=["code"], name="product_code_idx"),
        ]

ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg']

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    url = models.URLField(blank=True, null=True)
    image = models.ImageField(
        upload_to=ProductImageUploadPath(),
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=ALLOWED_IMAGE_EXTENSIONS)]
    )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # ✅ Atualiza o campo URL se imagem local foi enviada
        if self.image and (not self.url or self.url != self.image.url):
            self.url = self.image.url
            super().save(update_fields=["url"])

    def delete(self, *args, **kwargs):
        # ✅ Remove o arquivo físico da imagem se for local
        if self.image and self.image.name:
            try:
                image_path = self.image.path
                if os.path.isfile(image_path):
                    os.remove(image_path)
            except Exception as e:
                print(f"⚠️ Error deleting image file: {e}")
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"Image for {self.product.title}"

    class Meta:
        db_table = "product_images"
        verbose_name = "Product Image"
        verbose_name_plural = "Product Images"
        ordering = ['product', 'id']
        indexes = [
            models.Index(fields=["product"], name="product_image_product_idx"),
            models.Index(fields=["url"], name="product_image_url_idx"),
        ]
