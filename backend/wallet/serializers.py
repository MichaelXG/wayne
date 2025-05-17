from rest_framework import serializers
from datetime import datetime, date
from .models import Wallet


class WalletSerializer(serializers.ModelSerializer):
    last4_digits = serializers.SerializerMethodField()
    masked_number = serializers.SerializerMethodField()
    formatted_expiry = serializers.SerializerMethodField()

    class Meta:
        model = Wallet
        fields = [
            'id', 'user', 'name', 'number', 'expiry', 'brand',
            'status', 'is_primary', 'created_at',
            'last4_digits', 'masked_number', 'formatted_expiry'
        ]
        read_only_fields = [
            'id', 'user', 'brand', 'created_at',
            'last4_digits', 'masked_number', 'formatted_expiry'
        ]

    def create(self, validated_data):
        number = validated_data.get('number', '')
        validated_data['brand'] = self.detect_card_brand(number)
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def detect_card_brand(self, number: str) -> str:
        number = number.replace(' ', '').replace('-', '')
        if not number.isdigit():
            return 'Unknown'
        prefix = number[:6]
        if number.startswith('4'):
            return 'Visa'
        elif number.startswith(('51', '52', '53', '54', '55')) or 222100 <= int(prefix) <= 272099:
            return 'MasterCard'
        elif number.startswith(('34', '37')):
            return 'American Express'
        elif number.startswith(('60', '62', '64', '65')):
            return 'Discover'
        elif number.startswith('35'):
            return 'JCB'
        elif number.startswith(('30', '36', '38', '39')):
            return 'Diners Club'
        elif number.startswith(('50', '56', '57', '58', '63', '67')):
            return 'Maestro'
        elif number.startswith('62'):
            return 'UnionPay'
        return 'Unknown'

    def get_last4_digits(self, obj):
        return str(obj.number)[-4:] if obj.number else None

    def get_masked_number(self, obj):
        return f"**** **** **** {str(obj.number)[-4:]}" if obj.number and len(obj.number) >= 4 else None

    def get_formatted_expiry(self, obj):
        if isinstance(obj.expiry, date):
            return obj.expiry.strftime('%m/%y')
        return None

    def validate_number(self, value):
        value = value.replace(' ', '').replace('-', '')
        if not value.isdigit():
            raise serializers.ValidationError("Card number must contain only digits.")
        if len(value) not in [13, 15, 16]:
            raise serializers.ValidationError("Card number must be 13, 15 or 16 digits long.")
        return value

    def validate_expiry(self, value):
        if isinstance(value, str):
            try:
                value = datetime.strptime(value, '%Y-%m-%d').date()
            except ValueError:
                raise serializers.ValidationError("Expiry must be a valid date in format YYYY-MM-DD.")

        if value < date.today().replace(day=1):
            raise serializers.ValidationError("The expiry date must be today or in the future.")

        return value
