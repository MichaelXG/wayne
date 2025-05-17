from rest_framework import serializers
from .models import Address

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']
        extra_kwargs = {
            'street': {'required': True},
            'number': {'required': True},
            'neighborhood': {'required': False, 'allow_blank': True},
            'city': {'required': True},
            'state': {'required': True},
            'postal_code': {'required': True},
            'country': {'required': False, 'default': 'Brazil'},
            'is_default': {'required': False},
            'is_active': {'required': False},
            'complement': {'required': False, 'allow_blank': True},
            'reference': {'required': False, 'allow_blank': True},
        }

    def validate(self, data):
        user = self.context['request'].user
        is_default = data.get('is_default', getattr(self.instance, 'is_default', False))

        if is_default:
            qs = Address.objects.filter(user=user, is_default=True)
            if self.instance:
                qs = qs.exclude(id=self.instance.id)
            if qs.exists():
                raise serializers.ValidationError("This user already has a default address.")
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AddressReadSerializer(serializers.ModelSerializer):
    full_address = serializers.SerializerMethodField()

    class Meta:
        model = Address
        fields = [
            'id', 'user', 'street', 'number', 'complement', 'reference',
            'neighborhood', 'city', 'state', 'postal_code', 'country',
            'is_default', 'is_active', 'created_at', 'updated_at', 'full_address'
        ]
        read_only_fields = fields
        
    def get_full_address(self, obj):
        line1_parts = filter(None, [obj.street, obj.number, obj.complement])
        line1 = ', '.join(line1_parts)

        line2_parts = filter(None, [
            obj.postal_code,
            obj.neighborhood,
            obj.city,
            obj.state,
            obj.country
        ])
        line2 = ' - '.join(line2_parts)

        line3 = obj.reference if obj.reference else ''

        return f"""<strong>{line1}</strong><br>{line2}{f'<br>{line3}' if line3 else ''}"""

