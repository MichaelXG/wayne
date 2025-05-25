import os
import logging
from rest_framework import viewsets, status
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product
from .serializers import ProductSerializer
from permissions.permissions import GroupMenuPermission

logger = logging.getLogger(__name__)


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing products.
    Applies permission based on user's group permissions.
    """
    queryset = Product.objects.all().order_by('id')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, GroupMenuPermission]
    menu_name = 'products'
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_serializer_context(self):
        """Pass the request to the serializer context."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        """Create a new product."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Update a product with full or partial data."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        """Delete a product and all associated images (including physical files)."""
        instance = self.get_object()
        for image in instance.images.all():
            if image.image and image.image.name:
                try:
                    file_path = image.image.path
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                        logger.info(f"🗑️ Deleted image from disk: {file_path}")
                except Exception as e:
                    logger.warning(f"⚠️ Error deleting image file: {e}")
            image.delete()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductDetailView(RetrieveAPIView):
    """
    Retrieve details of a single product by ID.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, GroupMenuPermission]
    menu_name = 'products'
    lookup_field = 'id'
