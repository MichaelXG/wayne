from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from django.db import transaction

from .models import PermissionGroup, Permission
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
                    merged[key]["can_create"] |= perm.can_create
                    merged[key]["can_read"] |= perm.can_read
                    merged[key]["can_update"] |= perm.can_update
                    merged[key]["can_delete"] |= perm.can_delete
                    merged[key]["can_secret"] |= perm.can_secret

        return Response({
            "username": username,
            "groups": group_list,
            "permissions": list(merged.values())
        }, status=status.HTTP_200_OK)


# ========================================================
# 🌳 View: Estrutura de permissões para árvore RichTreeView
# ========================================================
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


# ========================================================
# 💾 View: Salvar permissões atualizadas de um grupo
# ========================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_group_permissions(request):
    """
    Salva as permissões (create, read, update...) para um determinado grupo.
    Espera:
    {
      "groupId": 1,
      "permissions": [
        {
          "menu_name": "users",
          "can_create": true,
          "can_read": false,
          ...
        },
        ...
      ]
    }
    """
    data = request.data
    group_id = data.get('groupId')
    permissions = data.get('permissions', [])

    if not group_id:
        return Response({"detail": "groupId is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        group = PermissionGroup.objects.get(id=group_id)
    except PermissionGroup.DoesNotExist:
        return Response({"detail": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

    with transaction.atomic():
        # Remove permissões antigas
        Permission.objects.filter(group=group).delete()

        # Cria novas permissões
        for perm_data in permissions:
            Permission.objects.create(
                group=group,
                menu_name=perm_data.get('menu_name', '').lower(),
                can_create=perm_data.get('can_create', False),
                can_read=perm_data.get('can_read', False),
                can_update=perm_data.get('can_update', False),
                can_delete=perm_data.get('can_delete', False),
                can_secret=perm_data.get('can_secret', False),
            )

    return Response({"detail": "Permissions saved successfully"}, status=status.HTTP_200_OK)
