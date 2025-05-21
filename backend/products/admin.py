from django.contrib import admin
from django.utils.html import format_html
from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['preview', 'url', 'image']
    readonly_fields = ['preview']

    def preview(self, obj):
        url = obj.image.url if obj.image else obj.url
        if url:
            return format_html('<img src="{}" width="100" style="object-fit: contain;" />', url)
        return "-"
    preview.short_description = "Preview"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "title", "category", "code", "sku", "price_regular", "price_sale", "quantity",
        "rating_rate", "rating_count", "is_active", "inserted_in", "modified_in"
    )
    readonly_fields = ("inserted_in", "modified_in")
    inlines = [ProductImageInline]

    fieldsets = (
        (None, {'fields': ['title', 'description', 'category', 'code', 'sku', 'is_active']}),
        ('Pricing', {'fields': ['price_regular', 'price_sale', 'tax']}),
        ('Inventory', {'fields': ['quantity']}),
        ('Rating', {'fields': ['rating_rate', 'rating_count']}),
        ('Timestamps', {'fields': ['inserted_in', 'modified_in']}),
    )

    search_fields = ['title', 'code', 'sku']
    list_filter = ['category', 'is_active']
    ordering = ['-inserted_in']


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'preview', 'url']
    readonly_fields = ['preview']
    search_fields = ['product__title']
    list_filter = ['product__category']

    def preview(self, obj):
        url = obj.image.url if obj.image else obj.url
        if url:
            return format_html('<img src="{}" width="80" style="object-fit: contain;" />', url)
        return "-"
    preview.short_description = "Preview"
