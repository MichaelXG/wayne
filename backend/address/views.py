from rest_framework import viewsets, status
from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from .models import Address
from .serializers import AddressSerializer, AddressReadSerializer


class MixedPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return obj.user == request.user or request.user.is_staff
        return obj.user == request.user or request.user.is_staff


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all().order_by('-is_default', '-updated_at')
    permission_classes = [MixedPermission]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return AddressReadSerializer
        return AddressSerializer

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Address.objects.none()

        if user.is_staff and self.request.query_params.get('all') == 'true':
            return Address.objects.all()

        queryset = Address.objects.filter(user=user)
        if 'is_default' in self.request.query_params:
            is_default = self.request.query_params.get('is_default').lower() == 'true'
            queryset = queryset.filter(is_default=is_default)

        return queryset

    def perform_create(self, serializer):
        if not self.request.user or not self.request.user.is_authenticated:
            raise PermissionDenied("You must be logged in to create an address.")
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user and not request.user.is_staff:
            raise PermissionDenied("You can only delete your own address.")
        self.perform_destroy(instance)
        return Response({"detail": "Address deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='default')
    def get_default_address(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        address = Address.objects.filter(user=request.user, is_default=True).first()
        if not address:
            return Response({'detail': 'No default address found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(address)
        return Response(serializer.data)
