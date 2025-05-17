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
            'gender', 'price_regular', 'price_sale', 'tax', 'price',
            'rating', 'images', 'is_active'
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

    def create(self, validated_data):
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is required.")

        images = request.FILES.getlist('images')

        product = Product.objects.create(**validated_data)

        # Apenas se o modelo não tiver tratado código/sku na save()
        if not product.code:
            product.code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        if not product.sku:
            product.sku = f"SKU-{product.id:04d}"
        product.save(update_fields=['code', 'sku'])

        for image in images:
            ProductImage.objects.create(product=product, image=image)

        return product

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is required.")

        existing_urls = request.data.getlist('existing_images', [])

        # Remover imagens que não estão mais presentes
        instance.images.exclude(url__in=existing_urls).delete()

        # Adicionar novas imagens
        for uploaded_file in request.FILES.getlist('images'):
            ProductImage.objects.create(product=instance, image=uploaded_file)

        # Atualizar campos do produto
        for field in [
            'title', 'description', 'category', 'code', 'sku', 'quantity',
            'gender', 'price_regular', 'price_sale', 'tax', 'is_active'
        ]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.save()
        return instance
