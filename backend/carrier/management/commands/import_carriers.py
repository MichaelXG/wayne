import requests
from django.core.management.base import BaseCommand
from carrier.models import Carrier
from django.conf import settings
from django.db import IntegrityError
import re
import string

AFTERSHIP_API_URL = "https://api.aftership.com/v4/couriers/all"

def generate_unique_prefix(slug, existing_prefixes):
    base = re.sub(r'[^a-zA-Z]', '', slug).upper()[:4] or 'CRRX'
    if len(base) < 4:
        base = (base + 'XXXX')[:4]

    prefix = base
    i = 0
    while prefix in existing_prefixes:
        i += 1
        suffix = string.ascii_uppercase[i % 26]
        prefix = (base[:3] + suffix)[:4]
        if i >= 999:
            prefix = f"{base[:2]}Z9"
            break

    return prefix

class Command(BaseCommand):
    help = "Automatically import carriers from AfterShip"

    def handle(self, *args, **kwargs):
        headers = {
            "aftership-api-key": settings.AFTERSHIP_API_KEY,
            "Content-Type": "application/json"
        }

        try:
            response = requests.get(AFTERSHIP_API_URL, headers=headers)
            response.raise_for_status()
            carriers = response.json().get('data', {}).get('couriers', [])
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"❌ Error searching for carriers: {e}"))
            return

        if not carriers:
            self.stdout.write(self.style.WARNING("⚠️ No carrier returned by API."))
            return

        Carrier.objects.update(is_default=False)

        created_count = 0
        updated_count = 0
        existing_prefixes = set(Carrier.objects.values_list("prefix", flat=True))

        default_carrier_name = "Brazil Correios"
        default_slug = "brazil-correios"
        default_found = False

        for carrier in carriers:
            slug = carrier.get("slug", "").lower()
            name = carrier.get("name")
            if not slug or not name:
                continue

            prefix = generate_unique_prefix(slug, existing_prefixes)
            is_default = slug == default_slug
            if is_default:
                default_found = True

            try:
                obj, created = Carrier.objects.update_or_create(
                    slug=slug,
                    defaults={
                        "name": name,
                        "prefix": prefix,
                        "is_default": is_default
                    }
                )
                existing_prefixes.add(prefix)

                msg = f"{'🆕 Created' if created else '♻️ Updated'}: {name} ({slug}, prefix={prefix})"
                if is_default:
                    msg += " ✅ [DEFAULT]"
                self.stdout.write(msg)

                if created:
                    created_count += 1
                else:
                    updated_count += 1
            except IntegrityError as e:
                self.stderr.write(f"❌ Error saving {name} ({slug}): {e}")

        default_info = f"Default: {default_carrier_name}" if default_found else "⚠️ Default 'Brazil Correios' not found."
        self.stdout.write(self.style.SUCCESS(
            f"✅ {created_count} created / {updated_count} updated | {default_info}"
        ))
