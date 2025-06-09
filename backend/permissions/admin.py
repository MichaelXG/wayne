from django.contrib import admin
from .models import PermissionGroup, PermissionMenu, Permission, UserPermission


class PermissionInline(admin.TabularInline):
    model = Permission
    extra = 0
    fields = (
        'menu',
        'can_create', 'can_read', 'can_update',
        'can_delete', 'can_secret',
        'can_export', 'can_import', 'can_download', 'can_upload'
    )
    show_change_link = False


@admin.register(PermissionGroup)
class PermissionGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_by', 'updated_by', 'list_menus')
    list_filter = ('is_active', 'name')
    search_fields = ('name', 'created_by__username')
    inlines = [PermissionInline]

    def list_menus(self, obj):
        menus = Permission.objects.filter(group=obj).select_related('menu')
        return ", ".join(set([p.menu.name for p in menus if p.menu]))
    list_menus.short_description = "Menus"


@admin.register(PermissionMenu)
class PermissionMenuAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)


@admin.register(UserPermission)
class UserPermissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'get_groups')
    search_fields = ('user__username', 'user__email')

    def get_groups(self, obj):
        return ", ".join([g.name for g in obj.groups.all()])
    get_groups.short_description = 'Groups'
