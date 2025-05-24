from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from .models import PermissionGroup, UserPermission
from .serializers import PermissionGroupSerializer, UserPermissionSerializer


class PermissionGroupViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage permission groups.
    Only admins can access.
    """
    queryset = PermissionGroup.objects.all()
    serializer_class = PermissionGroupSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class UserPermissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage user permissions.
    Only admins can access.
    """
    queryset = UserPermission.objects.all()
    serializer_class = UserPermissionSerializer
    permission_classes = [IsAdminUser]


class MyPermissionsView(APIView):
    """
    API endpoint to return the authenticated user's permissions.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_perm = UserPermission.objects.get(user=request.user)
            group = user_perm.group

            if not group:
                return Response({"detail": "No permission group assigned."}, status=status.HTTP_403_FORBIDDEN)

            permissions = []

            for perm in group.permissions.all():
                permissions.append({
                    "menu_name": perm.menu_name,
                    "can_view": perm.can_view,
                    "can_create": perm.can_create,
                    "can_update": perm.can_update,
                    "can_delete": perm.can_delete
                })

            return Response({
                "username": request.user.username,
                "group": group.name,
                "permissions": permissions
            }, status=status.HTTP_200_OK)

        except UserPermission.DoesNotExist:
            return Response({
                "username": request.user.username,
                "group": None,
                "permissions": []
            }, status=200)
