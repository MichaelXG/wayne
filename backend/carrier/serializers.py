from rest_framework import serializers
from .models import Carrier

class CarrierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrier
        fields = ['id', 'name', 'prefix', 'slug', 'is_default', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        is_default = data.get('is_default', getattr(self.instance, 'is_default', False))

        if is_default:
            qs = Carrier.objects.filter(is_default=True)
            if self.instance:
                qs = qs.exclude(id=self.instance.id)
            if qs.exists():
                raise serializers.ValidationError("Another carrier is already marked as default.")
        return data
