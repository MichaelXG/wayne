from rest_framework import serializers
from .models import Permission, PermissionGroup, UserPermission


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


class PermissionGroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True)  # ✅ Nested permissions

    class Meta:
        model = PermissionGroup
        fields = '__all__'


class UserPermissionSerializer(serializers.ModelSerializer):
    group = PermissionGroupSerializer()  # ✅ Nested group with permissions

    class Meta:
        model = UserPermission
        fields = '__all__'
