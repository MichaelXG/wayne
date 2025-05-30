// assets
import { IconSettings, IconLock, IconHierarchy, IconEdit } from '@tabler/icons-react';

// constant
const icons = {
  IconSettings,
  IconLock,
  IconHierarchy,
  IconEdit
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
          id: 'permissions-groups-editor',
          title: 'Edit',
          type: 'item',
          icon: icons.IconEdit,
          url: '/permissions/edit',
          breadcrumbs: false,
          permission: { menu: 'permissions', action: 'can_read' }
        }
      ]
    }
  ]
};

export default permissions;
