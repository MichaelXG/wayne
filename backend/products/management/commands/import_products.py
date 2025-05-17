from django.core.management.base import BaseCommand, CommandError
import requests
import random
import string
from products.models import Product, ProductImage

class Command(BaseCommand):
    help = 'Imports products from FakeStore API into the local database'

    def handle(self, *args, **kwargs):
        try:
            response = requests.get("https://fakestoreapi.com/products")
            response.raise_for_status()
            products = response.json()

            for item in products:
                # Prepare prices and fields
                price_sale = item.get("price")
                price_regular = round(price_sale / 1.10, 2)
                tax = 10

                # Create or update product
                product, created = Product.objects.update_or_create(
                    sku=f"SKU-{item['id']:04d}",
                    defaults={
                        "title": item.get("title"),
                        "description": item.get("description"),
                        "category": item.get("category"),
                        "code": ''.join(random.choices(string.ascii_uppercase + string.digits, k=8)),
                        "quantity": random.randint(0, 100),
                        "gender": random.choice(["men", "women", "kids", "unisex", "others"]),
                        "price_regular": price_regular,
                        "price_sale": price_sale,
                        "tax": tax,
                        "rating_rate": item.get("rating", {}).get("rate", 0),
                        "rating_count": item.get("rating", {}).get("count", 0),
                        "is_active": True,   
                    }
                )

                # Clear existing images
                product.images.all().delete()

                # Add image(s)
                images = [item.get("image")] if isinstance(item.get("image"), str) else item.get("images", [])
                for img_url in images:
                    ProductImage.objects.create(product=product, url=img_url)

                status_msg = "🆕 Created" if created else "♻️ Updated"
                self.stdout.write(f"{status_msg}: {product.title}")

            self.stdout.write(self.style.SUCCESS("✅ Products imported successfully!"))

        except Exception as e:
            raise CommandError(f"❌ Failed to import products: {e}")
