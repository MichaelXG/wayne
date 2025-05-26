from rest_framework.permissions import BasePermission

class GroupMenuPermission(BasePermission):
    """
    Checks if the authenticated user's groups have permission for the given menu and action.
    """

    def has_permission(self, request, view):
        # ✅ Superuser always has permission
        if request.user and request.user.is_superuser:
            return True

        # ✅ Block unauthenticated users
        if not request.user or not request.user.is_authenticated:
            return False

        menu = getattr(view, 'menu_name', None)
        if not menu:
            return False

        # ✅ Obtém todos os grupos do usuário
        user_groups = request.user.groups.all()

        if not user_groups.exists():
            return False

        # ✅ Para cada grupo, verifica permissão
        for group in user_groups:
            permission = group.permissions.filter(menu_name=menu).first()

            if not permission:
                continue

            # ✅ Verifica a ação
            if view.action == 'create' and permission.can_create:
                return True
            if view.action in ['list', 'retrieve'] and permission.can_read:
                return True
            if view.action in ['update', 'partial_update'] and permission.can_update:
                return True
            if view.action == 'destroy' and permission.can_delete:
                return True

        # ❌ Nenhum grupo do usuário tem permissão
        return False
