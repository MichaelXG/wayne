// assets
import { IconKey, IconUserPlus, IconLogin, IconUserCog, IconUserExclamation } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconUserPlus,
  IconLogin,
  IconUserCog,
  IconUserExclamation
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Account',
  // caption: 'Pages Caption',
  icon: icons.IconKey,
  type: 'group',
  permission: { menu: 'pages', action: 'can_read' }, // ✅ permissão para o grupo
  children: [
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,
      permission: { menu: 'pages', action: 'can_read' },
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          icon: icons.IconLogin,
          url: '/pages/login',
          target: true
          // permission: { menu: 'login', action: 'can_read' }
        },
        {
          id: 'register',
          title: 'Register',
          type: 'item',
          icon: icons.IconUserPlus,
          url: '/pages/register',
          target: true,
          permission: { menu: 'register', action: 'can_read' }
        },
        {
          id: 'recover',
          title: 'Recover',
          type: 'item',
          icon: icons.IconUserExclamation,
          url: '/pages/recover',
          target: true,
          permission: { menu: 'recover', action: 'can_read' }
        }
        // Se precisar fazer um reset de senha use o recover
        // {
        //   id: 'reset',
        //   title: 'Reset',
        //   type: 'item',
        //   icon: icons.IconUserCog,
        //   url: '/pages/reset',
        //   target: true,
        //   permission: { menu: 'pages', action: 'can_read' }  
        // }
      ]
    }
  ]
};

export default pages;
