from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = [
        'first_name', 'last_name', 'email', 'birth_date',
        'cpf', 'is_active', 'is_staff', 'is_superuser'
    ]
    search_fields = ['first_name', 'last_name', 'email', 'cpf']
    ordering = ['first_name', 'inserted_in']
    readonly_fields = ['inserted_in', 'modified_in']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'birth_date', 'cpf')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups')
        }),
        ('Timestamps', {'fields': ('inserted_in', 'modified_in')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'first_name', 'last_name', 'email', 'birth_date', 'cpf',
                'password1', 'password2', 'is_active', 'is_staff', 'is_superuser'
            ),
        }),
    )
