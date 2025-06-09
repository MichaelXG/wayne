import json
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from permissions.models import PermissionGroup, PermissionMenu, Permission

class Command(BaseCommand):
    help = 'Update permissions for existing groups from JSON files'

    def load_json_file(self, filename):
        """Load a JSON file from the data directory"""
        json_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            'data',
            filename
        )
        try:
            with open(json_path, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(f'❌ File not found: {filename}')
            )
            return None
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR(f'❌ Invalid JSON in file: {filename}')
            )
            return None

    def update_group_permissions(self, group_data):
        """Update permissions for a single group"""
        if not group_data or not isinstance(group_data, list) or not group_data[0].get('label'):
            return False

        group_name = group_data[0]['label']
        
        try:
            # Verificar se o grupo existe
            group = PermissionGroup.objects.get(name=group_name)
            self.stdout.write(f'📝 Updating permissions for group: {group_name}')

            # Atualizar permissões para cada menu
            for menu_data in group_data[0].get('menus', []):
                menu_name = menu_data.get('name')
                
                try:
                    # Verificar se o menu existe
                    menu = PermissionMenu.objects.get(name=menu_name)
                    
                    # Obter ou criar a permissão
                    permission, created = Permission.objects.get_or_create(
                        group=group,
                        menu=menu
                    )

                    # Atualizar as permissões
                    for perm_key, perm_value in menu_data['permissions'].items():
                        setattr(permission, perm_key, perm_value)
                    
                    permission.save()
                    
                    status = '✨ Created' if created else '🔄 Updated'
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"{status} permissions for {group_name} - {menu_name}"
                        )
                    )

                except PermissionMenu.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(
                            f"⚠️ Menu not found: {menu_name}"
                        )
                    )
                    continue

            return True

        except PermissionGroup.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(
                    f"❌ Group not found: {group_name}"
                )
            )
            return False

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write(
            self.style.SUCCESS('🚀 Starting permission update...')
        )

        # Lista de arquivos JSON para processar
        json_files = [
            'administrator.json',
            'sales.json',
            'intern.json',
            'security.json',
            'seller.json',
            'support.json'
        ]

        success_count = 0
        error_count = 0

        for json_file in json_files:
            self.stdout.write(
                self.style.SUCCESS(f'\n📄 Processing {json_file}...')
            )
            
            # Carregar dados do arquivo
            group_data = self.load_json_file(json_file)
            
            if group_data:
                # Atualizar permissões
                if self.update_group_permissions(group_data):
                    success_count += 1
                else:
                    error_count += 1
            else:
                error_count += 1

        # Relatório final
        self.stdout.write('\n📊 Update Summary:')
        self.stdout.write(
            self.style.SUCCESS(f'✅ Successfully updated: {success_count} groups')
        )
        if error_count > 0:
            self.stdout.write(
                self.style.ERROR(f'❌ Errors: {error_count} groups')
            )

        self.stdout.write(
            self.style.SUCCESS('\n✨ Permission update completed!')
        ) 