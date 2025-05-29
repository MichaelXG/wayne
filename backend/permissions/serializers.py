from rest_framework import serializers
from .models import Permission, PermissionGroup, UserPermission


# 🎯 Serializer completo (com permissões aninhadas)
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


class PermissionGroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True)  # ✅ Nested permissions

    class Meta:
        model = PermissionGroup
        fields = '__all__'


# 🎯 Serializer simples (somente id e nome)
class SimplePermissionGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionGroup
        fields = ['id', 'name']


# 🎯 Serializer de vínculo usuário-permissão com group detalhado
class UserPermissionSerializer(serializers.ModelSerializer):
    group = PermissionGroupSerializer()  # ou troque por SimplePermissionGroupSerializer se quiser simplificar

    class Meta:
        model = UserPermission
        fields = '__all__'
