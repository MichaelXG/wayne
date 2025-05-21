from django.core.management.base import BaseCommand, CommandError
from products.models import Product, ProductImage
import random
import string
import json
import os

class Command(BaseCommand):
    help = 'Imports products from local JSON into the database'

    def handle(self, *args, **kwargs):
        try:
            # Correct path to ../data/wayne_products_import_ready.json
            base_dir = os.path.dirname(os.path.abspath(__file__))
            json_path = os.path.join(base_dir, '..', 'data', 'wayne_products_import_ready.json')

            if not os.path.exists(json_path):
                raise FileNotFoundError(f"File not found: {json_path}")

            with open(json_path, "r", encoding="utf-8") as file:
                products = json.load(file)

            for item in products:
                product, created = Product.objects.update_or_create(
                    sku=item.get("sku"),
                    defaults={
                        "title": item.get("title"),
                        "description": item.get("description"),
                        "category": item.get("category"),
                        "code": item.get("code", ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))),
                        "quantity": item.get("quantity", 0),
                        "price_regular": item.get("price_regular"),
                        "price_sale": item.get("price_sale"),
                        "tax": item.get("tax", 10),
                        "rating_rate": item.get("rating_rate", 0),
                        "rating_count": item.get("rating_count", 0),
                        "is_active": item.get("is_active", True),
                    }
                )

                # Clear and update product images
                product.images.all().delete()
                image_url = item.get("image")
                if image_url:
                    ProductImage.objects.create(product=product, url=image_url)

                status_msg = "🆕 Created" if created else "♻️ Updated"
                self.stdout.write(f"{status_msg}: {product.title}")

            self.stdout.write(self.style.SUCCESS("✅ Products imported successfully!"))

        except Exception as e:
            raise CommandError(f"❌ Failed to import products: {e}")
