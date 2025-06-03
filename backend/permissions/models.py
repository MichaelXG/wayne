from django.db import models


class PermissionGroup(models.Model):
    """
    Represents a group for permission management (e.g., Admin, Sales).
    """
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_permission_groups'
    )

    updated_by = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_permission_groups'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'permission_group'
        verbose_name = 'Permission Group'
        verbose_name_plural = 'Permission Groups'
        indexes = [
            models.Index(fields=['name'], name='permission_group_name_idx')
        ]

    def __str__(self):
        return self.name


class PermissionMenu(models.Model):
    """
    Represents an individual menu/module that permissions can be attached to.
    """
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_permission_menus'
    )
    updated_by = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_permission_menus'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'permission_menu'
        verbose_name = 'Permission Menu'
        verbose_name_plural = 'Permission Menus'
        indexes = [
            models.Index(fields=['name'], name='permission_menu_name_idx')
        ]

    def __str__(self):
        return self.name


class Permission(models.Model):
    """
    Represents the permissions assigned to a specific group and menu.
    """
    group = models.ForeignKey(
        PermissionGroup,
        on_delete=models.CASCADE,
        related_name='permissions',
        null=True,
        blank=True
    )
    
    menu = models.ForeignKey(
        PermissionMenu,
        on_delete=models.CASCADE,
        related_name='permissions'
    )

    can_create = models.BooleanField(default=False)
    can_read = models.BooleanField(default=False)
    can_update = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)
    can_secret = models.BooleanField(default=False)
    can_export = models.BooleanField(default=False)
    can_import = models.BooleanField(default=False)
    can_download = models.BooleanField(default=False)
    can_upload = models.BooleanField(default=False)

    class Meta:
        db_table = "permission"
        verbose_name = "Permission"
        verbose_name_plural = "Permissions"
        unique_together = ("group", "menu")
        indexes = [
            models.Index(fields=["group", "menu"], name="permission_group_menu_idx")
        ]

    def __str__(self):
        return f"{self.group.name} - {self.menu.name} permissions"


class UserPermission(models.Model):
    """
    Links a user to one or more permission groups.
    """
    user = models.OneToOneField(
        'accounts.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_permission'
    )

    groups = models.ManyToManyField(
        PermissionGroup,
        related_name='user_permission_groups'
    )

    def __str__(self):
        group_names = getattr(self, '_group_names_cache', None)
        if group_names is None:
            group_names = list(self.groups.values_list('name', flat=True))
        return f"{self.user.username} -> Groups: {', '.join(group_names)}"

    class Meta:
        db_table = "user_permission"
        verbose_name = "User Permission"
        verbose_name_plural = "User Permissions"
        indexes = [models.Index(fields=["user"], name="user_permission_user_idx")]
