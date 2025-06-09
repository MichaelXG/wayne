from django.core.management.base import BaseCommand
from carrier.models import Carrier
from django.db import IntegrityError
import json
import os
import re
import string

# Caminho para o arquivo JSON local
CARRIERS_JSON_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    '..', 'data', 'aftership_carriers_flat.json'
)

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
    help = "Import carriers from local JSON file instead of AfterShip API"

    def handle(self, *args, **kwargs):
        if not os.path.exists(CARRIERS_JSON_PATH):
            self.stderr.write(self.style.ERROR(f"❌ File not found: {CARRIERS_JSON_PATH}"))
            return

        try:
            with open(CARRIERS_JSON_PATH, "r", encoding="utf-8") as f:
                carriers = json.load(f)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"❌ Error reading JSON: {e}"))
            return

        if not carriers:
            self.stdout.write(self.style.WARNING("⚠️ No carriers found in JSON file."))
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
