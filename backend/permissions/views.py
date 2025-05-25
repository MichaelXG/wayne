from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from .models import PermissionGroup
from .serializers import PermissionGroupSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class PermissionGroupViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage permission groups.
    Only admins can access, except for list/retrieve.
    """
    queryset = PermissionGroup.objects.all()
    serializer_class = PermissionGroupSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class MyPermissionsView(APIView):
    """
    API endpoint to return the authenticated user's permission groups and detailed merged permissions.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        username = f"{user.first_name} {user.last_name}".strip()

        groups = user.groups.all()

        group_data = []
        merged_permissions = {}

        for group in groups:
            group_data.append({
                "id": group.id,
                "name": group.name
            })

            for perm in group.permissions.all():
                key = perm.menu_name
                if key not in merged_permissions:
                    merged_permissions[key] = {
                        "menu_name" : perm.menu_name,
                        "can_create": perm.can_create,
                        "can_read"  : perm.can_read,
                        "can_update": perm.can_update,
                        "can_delete": perm.can_delete,
                        "can_secret": perm.can_secret,
                    }
                else:
                    # Merge: If any group has True, set to True
                    merged_permissions[key]["can_create"] |= perm.can_create
                    merged_permissions[key]["can_read"]   |= perm.can_read
                    merged_permissions[key]["can_update"] |= perm.can_update
                    merged_permissions[key]["can_delete"] |= perm.can_delete
                    merged_permissions[key]["can_secret"] |= perm.can_secret

        return Response({
            "username": username,
            "groups": group_data,
            "permissions": list(merged_permissions.values())
        }, status=status.HTTP_200_OK)
