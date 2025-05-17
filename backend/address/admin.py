from django.contrib import admin
from django.utils.html import format_html
from .models import Address  # certifique-se de importar seu modelo Address

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_full_address']
    readonly_fields = ['get_full_address']

    def get_full_address(self, obj):
        line1 = ', '.join(filter(None, [obj.street, obj.number, obj.complement]))
        line2 = ' - '.join(filter(None, [
            obj.postal_code, obj.neighborhood, obj.city, obj.state, obj.country
        ]))
        line3 = obj.reference if obj.reference else ''
        return format_html(f"<strong>{line1}</strong><br>{line2}{f'<br>{line3}' if line3 else ''}")

    get_full_address.short_description = "Formatted Address"
