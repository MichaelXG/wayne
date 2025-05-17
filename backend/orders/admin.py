from django.contrib import admin
from .models import Order, OrderItem, OrderDelivery, OrderShipping


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_id', 'quantity', 'price', 'total_price')
    can_delete = False
    show_change_link = True

    def total_price(self, obj):
        return obj.total_price
    total_price.short_description = "Total"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'code', 'user', 'status', 'created_at', 'total']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'code', 'id']
    readonly_fields = ['code', 'sub_total', 'discount', 'shippingFee', 'tax', 'total']
    inlines = [OrderItemInline]
    ordering = ['-created_at']

    def sub_total(self, obj):
        return obj.sub_total
    def discount(self, obj):
        return obj.discount
    def shippingFee(self, obj):
        return obj.shippingFee
    def tax(self, obj):
        return obj.tax
    def total(self, obj):
        return obj.total


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product_id', 'quantity', 'price', 'total_price']
    search_fields = ['order__code', 'product_id']
    readonly_fields = ['total_price']


@admin.register(OrderDelivery)
class OrderDeliveryAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'carrier', 'speed', 'tracking', 'created_at']
    list_filter = ['carrier', 'speed', 'created_at']
    search_fields = ['tracking', 'order__code']
    readonly_fields = ['tracking', 'created_at']
    
    
@admin.register(OrderShipping)
class OrderShippingAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'address', 'canceled', 'created_at']
    list_filter = ['canceled', 'created_at', 'address']
    search_fields = ['order__code', 'address__street', 'address__city']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

    fieldsets = (
        (None, {
            'fields': ('order', 'address', 'canceled', 'created_at')
        }),
    )