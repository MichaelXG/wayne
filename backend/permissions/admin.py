from django.contrib import admin
from .models import PermissionGroup, UserPermission

@admin.register(PermissionGroup)
class PermissionGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'list_permissions')  
    list_filter = ('name',)  
    filter_horizontal = ('permissions',)  

    def list_permissions(self, obj):
        return ", ".join([perm.menu_name for perm in obj.permissions.all()])
    list_permissions.short_description = "Permissions"


@admin.register(UserPermission)
class UserPermissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'group')
    list_filter = ('group',)
