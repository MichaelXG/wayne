from django.core.management.base import BaseCommand
from permissions.models import PermissionMenu
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create default permission menus.'


    def handle(self, *args, **kwargs):
        menus = [
            'dashboard', 'secret', 'products', 'order', 'carrier', 'address', 'pages',
            'utilities', 'other', 'settings', 'profile', 
            'register', 'recover', 'users', 'permissions',
            'typography', 'color', 'shadow', 'sample-page', 'about-page'
        ]
        system_user = User.objects.filter(is_superuser=True).first()

        if not system_user:
            self.stdout.write(self.style.ERROR('❌ No superuser found.'))
            return

        for name in menus:
            menu, created = PermissionMenu.objects.get_or_create(
                name=name,
                defaults={'created_by': system_user, 'updated_by': system_user}
            )
            if not created:
                menu.updated_by = system_user
                menu.save()
                self.stdout.write(f'ℹ️ Menu "{name}" already exists. Updated metadata.')
            else:
                self.stdout.write(self.style.SUCCESS(f'✅ Created menu: {name}'))

        self.stdout.write(self.style.SUCCESS('🎉 Finished loading permission menus.'))
