from rest_framework import viewsets, status
from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.response import Response
from .models import Carrier
from .serializers import CarrierSerializer


class MixedPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class CarrierViewSet(viewsets.ModelViewSet):
    queryset = Carrier.objects.all().order_by('-is_default', 'name')
    serializer_class = CarrierSerializer
    permission_classes = [MixedPermission]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', '').strip()
        if Carrier.objects.filter(name__iexact=name).exists():
            return Response({'error': 'A carrier with this name already exists.'},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            'message': 'Carrier created successfully.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Detect if any field has changed
        if not any(getattr(instance, field) != value for field, value in serializer.validated_data.items()):
            return Response({'message': 'No changes detected.'}, status=status.HTTP_200_OK)

        self.perform_update(serializer)
        return Response({
            'message': 'Carrier updated successfully.',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        name = instance.name
        instance.delete()
        return Response({'message': f'Carrier "{name}" deleted successfully.'},
                        status=status.HTTP_204_NO_CONTENT)
