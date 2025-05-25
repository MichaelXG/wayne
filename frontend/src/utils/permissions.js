export const canAccess = (item, userPermissions) => {
  if (!item.permission) return true;

  const perm = userPermissions.find((p) => p.menu_name === item.permission.menu);
  if (!perm) return false;

  return !!perm[item.permission.action];
};


export const filterMenuItems = (items, userPermissions) => {
  return items
    .filter(item => canAccess(item, userPermissions))
    .map(item => ({
      ...item,
      children: item.children
        ? filterMenuItems(item.children, userPermissions)
        : undefined
    }));
};
