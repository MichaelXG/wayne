// assets
import { IconLock } from '@tabler/icons-react';

// constants
const icons = {
  secret: IconLock
};

// ==============================|| SECRET MENU ITEMS ||============================== //

const secret = {
  id: 'secret',
  title: 'Secret',
  type: 'group',
  icon: icons.secret,
  permission: { menu: 'secret', action: 'can_read' }, 
  children: [
    {
      id: 'secret-home',
      title: 'Home',
      type: 'item',
      url: '/secret/home',
      icon: icons.secret,
      breadcrumbs: false,
      permission: { menu: 'secret', action: 'can_read' }  
    }
  ]
};

export default secret;
