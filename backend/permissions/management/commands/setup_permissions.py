from django.core.management.base import BaseCommand
from permissions.models import Permission, PermissionGroup

class Command(BaseCommand):
    help = 'Creates default permissions and groups for roles including a secret group.'

    def handle(self, *args, **kwargs):
        menus = ['dashboard', 'secret', 'products', 'order', 'carrier', 'address', 'pages', 'register', 'recover',  'utilities', 'typography', 'color', 'shadow', 'other', 'sample-page', 'about-page']

        permissions = []

        # ✅ Create basic permissions
        for menu in menus:
            perm, created = Permission.objects.get_or_create(
                menu_name=menu,
                defaults={
                    'can_create': False,
                    'can_read'  : True,
                    'can_update': False,
                    'can_delete': False,
                    'can_secret': False,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Permission for menu "{menu}" created.'))
            else:
                self.stdout.write(f'Permission for menu "{menu}" already exists.')
            permissions.append(perm)

        # ✅ Groups to be created
        # Administrador → Administrator
        # Segurança → Security
        # Comercial → Sales
        # Estagiário → Intern
        # Suporte → Support
        # Vendedor → Seller
        # Secreto → Secret
        group_names = ['Administrator', 'Security', 'Sales', 'Intern', 'Support', 'Seller', 'Secret']

        for group_name in group_names:
            group, created = PermissionGroup.objects.get_or_create(name=group_name)
            group.permissions.set(permissions)
            group.save()

            if created:
                self.stdout.write(self.style.SUCCESS(f'Group "{group_name}" created and permissions assigned.'))
            else:
                self.stdout.write(f'Group "{group_name}" already exists. Permissions updated.')

        self.stdout.write(self.style.SUCCESS('All groups and permissions created successfully.'))
