from django.core.management.base import BaseCommand
from permissions.models import PermissionGroup, PermissionMenu, Permission

class Command(BaseCommand):
    help = 'Link all groups and menus with default permissions. Admin group gets full access to "permissions" menu.'

    def handle(self, *args, **kwargs):
        groups = PermissionGroup.objects.all()
        menus = PermissionMenu.objects.all()

        for group in groups:
            for menu in menus:
                is_admin_permissions = group.name.lower() in ['administrator', 'admin', 'administrador'] and menu.name == 'permissions'

                defaults = {
                    'can_create': is_admin_permissions,
                    'can_read': True,
                    'can_update': is_admin_permissions,
                    'can_delete': is_admin_permissions,
                    'can_secret': is_admin_permissions,
                    'can_export': is_admin_permissions,
                    'can_import': is_admin_permissions,
                    'can_download': is_admin_permissions,
                    'can_upload': is_admin_permissions,
                }

                perm, created = Permission.objects.get_or_create(
                    group=group,
                    menu=menu,
                    defaults=defaults
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f'✅ Linked {group.name} with {menu.name}'))
                elif is_admin_permissions:
                    for field, value in defaults.items():
                        setattr(perm, field, value)
                    perm.save()
                    self.stdout.write(self.style.WARNING(f'🔁 Updated admin permission for "{menu.name}"'))
                else:
                    self.stdout.write(f'ℹ️ Permission already exists for {group.name} - {menu.name}')

        self.stdout.write(self.style.SUCCESS('🎉 All permissions initialized.'))
