from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth import get_user_model

from .models import PermissionGroup
from .serializers import PermissionGroupSerializer

User = get_user_model()


# ========================================================
# 🔐 ViewSet: Gerenciar Grupos de Permissão
# ========================================================
class PermissionGroupViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage permission groups.
    Only admins can create/update/delete.
    Public access to list/retrieve.
    """
    queryset = PermissionGroup.objects.all()
    serializer_class = PermissionGroupSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


# ========================================================
# 👤 View: Permissões mescladas do usuário autenticado
# ========================================================
class MyPermissionsView(APIView):
    """
    Returns merged permission set for the authenticated user.
    Merges all permissions across user's groups.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        username = f"{user.first_name} {user.last_name}".strip()

        group_list = []
        merged = {}

        for group in user.groups.prefetch_related('permissions').all():
            group_list.append({
                "id": group.id,
                "name": group.name
            })

            for perm in group.permissions.all():
                key = perm.menu_name
                if key not in merged:
                    merged[key] = {
                        "menu_name": perm.menu_name,
                        "can_create": perm.can_create,
                        "can_read": perm.can_read,
                        "can_update": perm.can_update,
                        "can_delete": perm.can_delete,
                        "can_secret": perm.can_secret
                    }
                else:
                    # Se qualquer grupo tiver permissão, ela será true
                    merged[key]["can_create"] |= perm.can_create
                    merged[key]["can_read"]   |= perm.can_read
                    merged[key]["can_update"] |= perm.can_update
                    merged[key]["can_delete"] |= perm.can_delete
                    merged[key]["can_secret"] |= perm.can_secret

        return Response({
            "username": username,
            "groups": group_list,
            "permissions": list(merged.values())
        }, status=status.HTTP_200_OK)

class PermissionsTreeView(APIView):
    """
    Returns permission groups structured for RichTreeView:
    - group (Administrator, Sales...)
      └─ menu (Dashboard, Users...)
         └─ permission (Create, Read...)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        groups = PermissionGroup.objects.prefetch_related('permissions').all()
        tree_data = []

        for group in groups:
            group_id = f"group-{group.id}"
            group_node = {
                "id": group_id,
                "label": group.name,
                "type": "group",
                "children": []
            }

            # Agrupar permissões por menu
            menu_map = {}

            for perm in group.permissions.all():
                menu_name = perm.menu_name
                if menu_name not in menu_map:
                    menu_id = f"menu-{group.id}-{menu_name}"
                    menu_map[menu_name] = {
                        "id": menu_id,
                        "label": menu_name.capitalize(),
                        "type": "menu",
                        "children": []
                    }

                for action in ["can_create", "can_read", "can_update", "can_delete", "can_secret"]:
                    menu_map[menu_name]["children"].append({
                        "id": f"perm-{group.id}-{menu_name}-{action}",
                        "label": action.replace("can_", "").capitalize(),
                        "type": "permission",
                        "checked": getattr(perm, action, False),
                        "permissionKey": action,
                        "menu_name": menu_name,
                        "groupId": group.id
                    })

            group_node["children"].extend(menu_map.values())
            tree_data.append(group_node)

        return Response(tree_data, status=status.HTTP_200_OK)
