from rest_framework import serializers
from .models import CustomUser, UserAvatar
from permissions.models import PermissionGroup 
from permissions.serializers import SimplePermissionGroupSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
import random
import string

CustomUser = get_user_model()


class UserAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAvatar
        fields = ['image']


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=True)
    avatar_data = UserAvatarSerializer(source='avatar', read_only=True)
    avatar_image = serializers.ImageField(write_only=True, required=False)

    groups = serializers.ListField(
        child=serializers.JSONField(),
        write_only=True,
        required=True,
        error_messages={'required': 'At least one permission group is required.'}
    )

    class Meta:
        model = CustomUser
        fields = [
            'id', 'first_name', 'last_name', 'email', 'birth_date', 'cpf', 'phone',
            'username', 'is_active', 'is_staff', 'is_superuser', 'inserted_by', 'inserted_in',
            'modified_by', 'modified_in', 'avatar_image', 'avatar_data', 'password', 'groups'
        ]
        read_only_fields = ['id', 'inserted_in', 'modified_in', 'avatar_data']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['groups'] = SimplePermissionGroupSerializer(instance.groups.all(), many=True).data 
        return rep

    def extract_group_ids(self, raw_groups):
        try:
            return [g['id'] if isinstance(g, dict) else int(g) for g in raw_groups]
        except Exception:
            raise ValidationError({"groups": "Invalid group format. Must be a list of IDs or dicts with 'id'."})

    def create(self, validated_data):
        avatar_image = validated_data.pop('avatar_image', None)
        group_data = validated_data.pop('groups', [])

        if not group_data:
            raise serializers.ValidationError({
                "groups": ["User must be associated with at least one permission group."]
            })

        group_ids = self.extract_group_ids(group_data)

        if not validated_data.get('username'):
            base = (validated_data.get('first_name', '') + validated_data.get('last_name', '')).lower()
            for _ in range(5):
                candidate = f"{base}-{''.join(random.choices(string.digits, k=4))}"
                if not CustomUser.objects.filter(username=candidate).exists():
                    validated_data['username'] = candidate
                    break
            else:
                raise serializers.ValidationError({
                    "username": ["Unable to generate a unique username. Please try again."]
                })

        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({"password": ["Password is required."]})

        user = CustomUser(**validated_data)
        user.set_password(password)
        user.is_staff = True
        user.save()

        user.groups.set(group_ids)

        if avatar_image:
            UserAvatar.objects.create(user=user, image=avatar_image)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        group_data = validated_data.pop('groups', None)
        avatar_image = validated_data.pop('avatar_image', None)

        if group_data is not None:
            group_ids = self.extract_group_ids(group_data)
            instance.groups.set(group_ids)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        if avatar_image:
            if hasattr(instance, 'avatar'):
                instance.avatar.image = avatar_image
                instance.avatar.save()
            else:
                UserAvatar.objects.create(user=instance, image=avatar_image)

        instance.save()
        return instance
