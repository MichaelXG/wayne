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
                is_secret_menu = menu.name.lower() == 'secret'

                if is_secret_menu:
                    # Para o menu secret, todas as permissões são false para qualquer grupo
                    defaults = {
                        'can_create': False,
                        'can_read': False,
                        'can_update': False,
                        'can_delete': False,
                        'can_secret': False,
                        'can_export': False,
                        'can_import': False,
                        'can_download': False,
                        'can_upload': False,
                    }
                else:
                    # Para outros menus, segue a lógica normal
                    defaults = {
                        'can_create': is_admin_permissions,
                        'can_read': True,
                        'can_update': is_admin_permissions,
                        'can_delete': is_admin_permissions,
                        'can_secret': False,  # Sempre falso para todos os grupos
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
                elif is_secret_menu:
                    # Força atualização de todas as permissões para false no menu secret
                    for field, value in defaults.items():
                        setattr(perm, field, value)
                    perm.save()
                    self.stdout.write(self.style.WARNING(f'🔒 Reset all permissions to False for {group.name} in secret menu'))
                elif is_admin_permissions:
                    # Atualiza todas as permissões para admin no menu de permissions
                    for field, value in defaults.items():
                        setattr(perm, field, value)
                    perm.save()
                    self.stdout.write(self.style.WARNING(f'🔁 Updated admin permission for "{menu.name}"'))
                else:
                    # Garante que can_secret seja False para todos
                    if perm.can_secret:
                        perm.can_secret = False
                        perm.save()
                        self.stdout.write(self.style.WARNING(f'🔒 Removed secret permission from {group.name} for {menu.name}'))
                    else:
                        self.stdout.write(f'ℹ️ Permission already exists for {group.name} - {menu.name}')

        self.stdout.write(self.style.SUCCESS('🎉 All permissions initialized.'))
