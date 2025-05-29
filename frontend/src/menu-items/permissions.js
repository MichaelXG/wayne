// assets
import { IconSettings, IconLock, IconHierarchy } from '@tabler/icons-react';

// constant
const icons = {
  IconSettings,
  IconLock,
  IconHierarchy
};

// ==============================|| PERMISSION MENU ITEMS ||============================== //

const permissions = {
  id: 'permissions',
  title: 'Settings',
  caption: 'Permissions Groups Settings',
  icon: icons.IconSettings,
  type: 'group',
  permission: { menu: 'permissions', action: 'can_read' }, // ✅ Permissão no grupo
  children: [
    {
      id: 'permissions-menu',
      title: 'Permissions',
      type: 'collapse',
      icon: icons.IconLock,
      permission: { menu: 'permissions', action: 'can_read' },
      children: [
        {
          id: 'permissions-groups',
          title: 'Groups',
          type: 'item',
          icon: icons.IconHierarchy,
          url: '/permissions/permissions-groups',
          breadcrumbs: false,
          permission: { menu: 'permissions', action: 'can_read' }
        }
      ]
    }
  ]
};

export default permissions;
