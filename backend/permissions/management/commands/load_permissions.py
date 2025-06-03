from django.core.management.base import BaseCommand
from permissions.models import PermissionGroup, PermissionMenu, Permission

class Command(BaseCommand):
    help = 'Link all groups and menus with default permissions.'

    def handle(self, *args, **kwargs):
        groups = PermissionGroup.objects.all()
        menus = PermissionMenu.objects.all()

        for group in groups:
            for menu in menus:
                perm, created = Permission.objects.get_or_create(
                    group=group,
                    menu=menu,
                    defaults={
                        'can_create': False,
                        'can_read': True,
                        'can_update': False,
                        'can_delete': False,
                        'can_secret': False,
                        'can_export': False,
                        'can_import': False,
                        'can_download': False,
                        'can_upload': False,
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'✅ Linked {group.name} with {menu.name}'))
                else:
                    self.stdout.write(f'ℹ️ Permission already exists for {group.name} - {menu.name}')

        self.stdout.write(self.style.SUCCESS('🎉 All permissions initialized.'))
