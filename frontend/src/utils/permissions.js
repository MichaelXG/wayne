export const canAccess = (item, userPermissions) => {
  if (!item.permission) return true; // Se o item não exige permissão

  if (!Array.isArray(userPermissions)) return false;

  const perm = userPermissions.find((p) => p.menu_name === item.permission.menu);
  if (!perm || !perm.permissions) return false;

  return !!perm.permissions[item.permission.action];
};

export const filterMenuItems = (items, userPermissions) => {
  return items
    .filter((item) => canAccess(item, userPermissions))
    .map((item) => ({
      ...item,
      children: item.children
        ? filterMenuItems(item.children, userPermissions)
        : undefined
    }));
};
