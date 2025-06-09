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
                is_secret_group = group.name.lower() == 'secret'

                if is_secret_menu:
                    # Para o menu secret, todas as permissões são false exceto para o grupo secret
                    if is_secret_group:
                        defaults = {
                            'can_create': True,
                            'can_read': True,
                            'can_update': True,
                            'can_delete': True,
                            'can_secret': True,
                            'can_export': True,
                            'can_import': True,
                            'can_download': True,
                            'can_upload': True,
                        }
                    else:
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
                        'can_secret': is_secret_group,  # True apenas para grupo secret
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
                    # Atualiza permissões do menu secret baseado no grupo
                    for field, value in defaults.items():
                        setattr(perm, field, value)
                    perm.save()
                    if is_secret_group:
                        self.stdout.write(self.style.SUCCESS(f'🔐 Set all permissions to True for secret group in secret menu'))
                    else:
                        self.stdout.write(self.style.WARNING(f'🔒 Reset all permissions to False for {group.name} in secret menu'))
                elif is_admin_permissions:
                    # Atualiza todas as permissões para admin no menu de permissions
                    for field, value in defaults.items():
                        setattr(perm, field, value)
                    perm.save()
                    self.stdout.write(self.style.WARNING(f'🔁 Updated admin permission for "{menu.name}"'))
                else:
                    # Atualiza can_secret baseado no grupo
                    if perm.can_secret != is_secret_group:
                        perm.can_secret = is_secret_group
                        perm.save()
                        if is_secret_group:
                            self.stdout.write(self.style.SUCCESS(f'🔐 Added secret permission for secret group in {menu.name}'))
                        else:
                            self.stdout.write(self.style.WARNING(f'🔒 Removed secret permission from {group.name} for {menu.name}'))
                    else:
                        self.stdout.write(f'ℹ️ Permission already exists for {group.name} - {menu.name}')

        self.stdout.write(self.style.SUCCESS('🎉 All permissions initialized.'))
