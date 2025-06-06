import os
import logging
from rest_framework import viewsets, status
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from .models import Product
from .serializers import ProductSerializer

logger = logging.getLogger(__name__)

class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing products.
    Applies permission based on user's group permissions.
    """
    serializer_class = ProductSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    
    def get_permissions(self):
        if self.request.method in ['GET']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Filter products based on user permissions:
        - If user is not authenticated or doesn't have Secret group, exclude secret products
        - If user has Secret group, show all products
        """
        queryset = Product.objects.all().order_by('id')
        
        # Check if user has Secret group permission
        user = self.request.user
        has_secret_permission = user.is_authenticated and user.groups.filter(name='Secret').exists()
        
        # If user doesn't have Secret permission, exclude secret products
        if not has_secret_permission:
            queryset = queryset.filter(Q(is_secret=False))
            
        return queryset

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
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """
        Filter products based on user permissions:
        - If user doesn't have Secret group, exclude secret products
        - If user has Secret group, show all products
        """
        queryset = Product.objects.all()
        
        # Check if user has Secret group permission
        user = self.request.user
        has_secret_permission = user.is_authenticated and user.groups.filter(name='Secret').exists()
        
        # If user doesn't have Secret permission, exclude secret products
        if not has_secret_permission:
            queryset = queryset.filter(Q(is_secret=False))
            
        return queryset
