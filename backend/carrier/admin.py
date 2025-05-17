from django.contrib import admin
from .models import Carrier


@admin.register(Carrier)
class CarrierAdmin(admin.ModelAdmin):
    list_display = ['name', 'prefix', 'slug', 'is_default', 'is_active', 'created_at', 'updated_at']
    list_filter = ['is_default','is_active', 'created_at']
    search_fields = ['name', 'prefix']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['name']

    fieldsets = (
        (None, {
            'fields': ('name', 'prefix', 'slug', 'is_default', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
