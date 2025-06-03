from rest_framework import serializers
from .models import PermissionGroup, PermissionMenu, Permission


# 🔐 Serializer: Permissões individuais (CRUD sobre ações)
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        exclude = ['menu']  # menu é atribuído via contexto no menu pai


# 📂 Serializer: Menu com permissões associadas
class PermissionMenuSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True)

    class Meta:
        model = PermissionMenu
        fields = ['id', 'menu_name', 'permissions']

    def create(self, validated_data):
        permissions_data = validated_data.pop('permissions', [])
        menu = PermissionMenu.objects.create(**validated_data)
        Permission.objects.bulk_create([
            Permission(menu=menu, **perm) for perm in permissions_data
        ])
        return menu

    def update(self, instance, validated_data):
        permissions_data = validated_data.pop('permissions', [])

        instance.menu_name = validated_data.get('menu_name', instance.menu_name)
        instance.save()

        instance.permissions.all().delete()
        Permission.objects.bulk_create([
            Permission(menu=instance, **perm) for perm in permissions_data
        ])

        return instance


# 🧩 Serializer: Grupo completo com menus e permissões
class PermissionGroupSerializer(serializers.ModelSerializer):
    menus = PermissionMenuSerializer(many=True)

    class Meta:
        model = PermissionGroup
        fields = ['id', 'name', 'menus']

    def create(self, validated_data):
        menus_data = validated_data.pop('menus', [])
        group = PermissionGroup.objects.create(**validated_data)

        for menu_data in menus_data:
            permissions_data = menu_data.pop('permissions', [])
            menu = PermissionMenu.objects.create(group=group, **menu_data)
            Permission.objects.bulk_create([
                Permission(menu=menu, **perm) for perm in permissions_data
            ])

        return group

    def update(self, instance, validated_data):
        menus_data = validated_data.pop('menus', [])

        instance.name = validated_data.get('name', instance.name)
        instance.save()

        instance.menus.all().delete()

        for menu_data in menus_data:
            permissions_data = menu_data.pop('permissions', [])
            menu = PermissionMenu.objects.create(group=instance, **menu_data)
            Permission.objects.bulk_create([
                Permission(menu=menu, **perm) for perm in permissions_data
            ])

        return instance


# 🎯 Serializer simplificado para seleção/listagem leve
class SimplePermissionGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionGroup
        fields = ['id', 'name', 'is_active']
