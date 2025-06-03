// assets
import { IconUser, IconList, IconDetails } from '@tabler/icons-react';

// constant
const icons = {
  IconUser,
  IconList,
  IconDetails
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const users = {
  id: 'users',
  title: 'Users',
  caption: 'Users settings',
  icon: icons.IconUser,

  type: 'group',
  permission: { menu: 'users', action: 'can_read' }, 
  children: [
    {
      id: 'user',
      title: 'User',
      type: 'collapse',
      icon: icons.IconUser,
      permission: { menu: 'users', action: 'can_read' },
      children: [
        {
          id: 'user-list',
          title: 'List',
          type: 'item',
          icon: icons.IconList,
          url: '/users/list',
          breadcrumbs: false,
          permission: { menu: 'users', action: 'can_read' }
        },
        {
          id: 'user-detail',
          title: 'Detail',
          type: 'item',
          icon: icons.IconDetails,
          url: '/users/detail',
          breadcrumbs: false,
          permission: { menu: 'users', action: 'can_read' }
        }
      ]
    }
  ]
};

export default users;
