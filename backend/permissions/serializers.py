from rest_framework import serializers
from .models import Permission, PermissionGroup, UserPermission


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


class PermissionGroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)  # ✅ Nested permissions

    class Meta:
        model = PermissionGroup
        fields = ['id', 'name', 'permissions']
        

class UserPermissionSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        queryset=PermissionGroup.objects.all(),
        many=True
    )

    class Meta:
        model = UserPermission
        fields = ['id', 'user', 'groups']
