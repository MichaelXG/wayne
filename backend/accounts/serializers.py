from rest_framework import serializers
from .models import CustomUser, UserAvatar
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
import random
import string


class UserAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAvatar
        fields = ['image']


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    avatar_data = UserAvatarSerializer(source='avatar', read_only=True)
    avatar_image = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'first_name', 'last_name', 'email', 'birth_date', 'cpf', 'phone',
            'username', 'is_active', 'is_staff', 'inserted_by', 'inserted_in',
            'modified_by', 'modified_in', 'avatar_image', 'avatar_data', 'password'
        ]
        read_only_fields = ['id', 'inserted_in', 'modified_in', 'avatar_data']

    def create(self, validated_data):
        avatar_image = validated_data.pop('avatar_image', None)

        # Auto-generate a unique username if not provided
        if not validated_data.get('username'):
            base = (validated_data['first_name'] + validated_data['last_name']).lower()
            for _ in range(5):
                candidate = f"{base}-{''.join(random.choices(string.digits, k=4))}"
                if not CustomUser.objects.filter(username=candidate).exists():
                    validated_data['username'] = candidate
                    break
            else:
                raise serializers.ValidationError("Unable to generate a unique username. Please try again.")

        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.is_staff = True
        user.save()

        if avatar_image:
            UserAvatar.objects.create(user=user, image=avatar_image)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed('Invalid credentials.')

        if not user.check_password(password):
            raise AuthenticationFailed('Invalid credentials.')

        return {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'birth_date': user.birth_date,
            'cpf': user.cpf,
            'phone': user.phone,
            'avatar': user.avatar.image.url if hasattr(user, 'avatar') and user.avatar.image else None,
            'authToken': getattr(user, 'token', None)
        }
