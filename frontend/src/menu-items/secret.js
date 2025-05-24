// assets
import { IconLock } from '@tabler/icons-react';

// constants
const icons = {
  secret: IconLock
};

// ==============================|| SECRET MENU ITEMS ||============================== //

const secret = {
  id: 'secret',
  title: 'Secret Home',
  type: 'group',
  icon: icons.secret,
  children: [
    {
      id: 'secret-home',
      title: 'Home',
      type: 'item',
      url: '/secret/home',
      icon: icons.secret,
      breadcrumbs: false
    }
  ]
};

export default secret;
