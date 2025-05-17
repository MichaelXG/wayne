from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import CustomUser, UserAvatar


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = (
        'first_name', 'last_name', 'email', 'birth_date', 'cpf', 'phone',
        'is_staff', 'is_superuser', 'is_active'
    )
    search_fields = ('first_name', 'last_name', 'email', 'cpf')
    ordering = ('first_name', 'inserted_in')
    readonly_fields = ('inserted_in', 'modified_in')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'birth_date', 'cpf', 'phone')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Timestamps', {'fields': ('inserted_in', 'modified_in')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'first_name', 'last_name', 'email',
                'birth_date', 'cpf', 'phone',
                'password1', 'password2',
                'is_staff', 'is_superuser', 'is_active'
            ),
        }),
    )


@admin.register(UserAvatar)
class UserAvatarAdmin(admin.ModelAdmin):
    list_display = ('user', 'avatar_preview', 'uploaded_at')
    readonly_fields = ('avatar_preview',)
    search_fields = ('user__email', 'user__first_name')
    list_filter = ('uploaded_at',)

    def avatar_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="80" style="object-fit: contain;" />', obj.image.url)
        return "-"
    avatar_preview.short_description = "Preview"


admin.site.register(CustomUser, CustomUserAdmin)
