from rest_framework import serializers
from .models import Product, ProductImage
import random
import string


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'url', 'image']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    price = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'category', 'code', 'sku', 'quantity',
            'price_regular', 'price_sale', 'tax', 'price',
            'rating', 'images', 'is_active', 'is_secret'
        ]

    def get_price(self, obj):
        return {
            "regular": obj.price_regular,
            "sale": obj.price_sale,
            "tax": obj.tax
        }

    def get_rating(self, obj):
        return {
            "rate": obj.rating_rate,
            "count": obj.rating_count
        }

    def to_representation(self, instance):
        # Get the user from the request
        request = self.context.get('request')
        user = request.user if request and hasattr(request, 'user') else None

        # Check if the product is secret and if the user has permission to view it
        if instance.is_secret:
            # If user is not authenticated or doesn't have the Secret group, exclude this product
            if not user or not user.is_authenticated or not user.groups.filter(name='Secret').exists():
                return None

        # If not secret or user has permission, proceed with normal serialization
        representation = super().to_representation(instance)
        return representation

    def create(self, validated_data):
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is required.")

        product = Product.objects.create(**validated_data)

        # Geração automática de código e SKU, se não informados
        updated = False
        if not product.code:
            product.code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            updated = True
        if not product.sku:
            product.sku = f"SKU-{product.id:04d}"
            updated = True
        if updated:
            product.save(update_fields=['code', 'sku'])

        # Importação de imagens - suporte a múltiplas imagens enviadas
        images = request.FILES.getlist('images')
        for image in images:
            ProductImage.objects.create(product=product, image=image)

        return product

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is required.")

        # Atualizar campos do produto
        for field in [
            'title', 'description', 'category', 'code', 'sku', 'quantity',
            'price_regular', 'price_sale', 'tax', 'is_active', 'is_secret'
        ]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.save()

        # Sincronização de imagens
        existing_urls = request.data.getlist('existing_images', [])
        # Remove imagens que não estão mais presentes
        instance.images.exclude(url__in=existing_urls).delete()

        # Adiciona novas imagens
        new_images = request.FILES.getlist('images')
        for uploaded_file in new_images:
            ProductImage.objects.create(product=instance, image=uploaded_file)

        return instance
