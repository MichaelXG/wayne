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
  title: 'Pages',
  caption: 'Pages Caption',
  icon: icons.IconKey,
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          icon: icons.IconLogin,
          url: '/pages/login',
          target: true
        },
        {
          id: 'register',
          title: 'Register',
          type: 'item',
          icon: icons.IconUserPlus,
          url: '/pages/register',
          target: true
        },
        {
          id: 'recover',
          title: 'Recover',
          type: 'item',
          icon: icons.IconUserExclamation,
          url: '/pages/recover',
          target: true
        }
        // Se precisar faerz um reset de senha use o recover
        // {
        //   id: 'reset',
        //   title: 'Reset',
        //   type: 'item',
        //   icon: icons.IconUserCog,
        //   url: '/pages/reset',
        //   target: true
        // }
      ]
    }
  ]
};

export default pages;
