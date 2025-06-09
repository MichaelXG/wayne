import json
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from permissions.models import PermissionGroup, PermissionMenu, Permission

class Command(BaseCommand):
    help = 'Update permissions for existing groups from JSON files'

    def validate_json_structure(self, data):
        """Validate the JSON data structure"""
        if not data or not isinstance(data, list):
            return False, "Data must be a non-empty list"
        
        if not data[0].get('name'):
            return False, "Missing required field 'name'"
        
        if not isinstance(data[0].get('menus', []), list):
            return False, "Menus must be a list"
        
        for menu in data[0].get('menus', []):
            if not menu.get('name'):
                return False, "Each menu must have a name"
            if not isinstance(menu.get('permissions', {}), dict):
                return False, "Permissions must be a dictionary"
        
        return True, None

    def load_json_file(self, filename):
        """Load a JSON file from the data directory"""
        json_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            'data',
            filename
        )
        try:
            with open(json_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                is_valid, error_message = self.validate_json_structure(data)
                if not is_valid:
                    self.stdout.write(
                        self.style.ERROR(f'❌ Invalid JSON structure in {filename}: {error_message}')
                    )
                    return None
                return data
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(f'❌ File not found: {filename}')
            )
            return None
        except json.JSONDecodeError as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Invalid JSON in file {filename}: {str(e)}')
            )
            return None
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error reading {filename}: {str(e)}')
            )
            return None

    def update_menu_permissions(self, group, menu_data):
        """Update permissions for a single menu"""
        menu_name = menu_data.get('name')
        
        try:
            menu = PermissionMenu.objects.get(name=menu_name)
            permission, created = Permission.objects.get_or_create(
                group=group,
                menu=menu,
                defaults=menu_data.get('permissions', {})
            )

            if not created:
                # Update existing permissions
                for perm_key, perm_value in menu_data.get('permissions', {}).items():
                    setattr(permission, perm_key, perm_value)
                permission.save()

            return True, created, menu_name
        except PermissionMenu.DoesNotExist:
            return False, None, menu_name
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error updating permissions for menu {menu_name}: {str(e)}')
            )
            return False, None, menu_name

    def update_group_permissions(self, group_data):
        """Update permissions for a single group"""
        if not group_data or not isinstance(group_data, list) or not group_data[0].get('name'):
            return False

        group_name = group_data[0]['name']
        
        try:
            group = PermissionGroup.objects.get(name=group_name)
            self.stdout.write(f'📝 Updating permissions for group: {group_name}')

            success_count = 0
            error_count = 0

            for menu_data in group_data[0].get('menus', []):
                success, created, menu_name = self.update_menu_permissions(group, menu_data)
                
                if success:
                    status = '✨ Created' if created else '🔄 Updated'
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"{status} permissions for {group_name} - {menu_name}"
                        )
                    )
                    success_count += 1
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f"⚠️ Menu not found: {menu_name}"
                        )
                    )
                    error_count += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"✅ Updated {success_count} menus for {group_name} "
                    f"({error_count} errors)"
                )
            )
            return True

        except PermissionGroup.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(
                    f"❌ Group not found: {group_name}"
                )
            )
            return False
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f"❌ Error updating group {group_name}: {str(e)}"
                )
            )
            return False

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write(
            self.style.SUCCESS('🚀 Starting permission update...')
        )

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
            
            group_data = self.load_json_file(json_file)
            
            if group_data:
                if self.update_group_permissions(group_data):
                    success_count += 1
                else:
                    error_count += 1
            else:
                error_count += 1

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