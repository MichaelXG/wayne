from django.core.management.base import BaseCommand
from permissions.models import PermissionGroup
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create default permission groups.'

    def handle(self, *args, **kwargs):
        group_names = ['Administrator', 'Security', 'Sales', 'Intern', 'Support', 'Seller', 'Secret']
        system_user = User.objects.filter(is_superuser=True).first()

        if not system_user:
            self.stdout.write(self.style.ERROR('❌ No superuser found.'))
            return

        for name in group_names:
            group, created = PermissionGroup.objects.get_or_create(
                name=name,
                defaults={'created_by': system_user, 'updated_by': system_user}
            )
            if not created:
                group.updated_by = system_user
                group.save()
                self.stdout.write(f'ℹ️ Group "{name}" already exists. Updated metadata.')
            else:
                self.stdout.write(self.style.SUCCESS(f'✅ Created group: {name}'))

        self.stdout.write(self.style.SUCCESS('🎉 Finished loading permission groups.'))
