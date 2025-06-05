// assets
import {
  IconLock,
  IconShield,
  IconBox,
  IconUserSearch,
  IconBuildingBank,
  IconCamera
} from '@tabler/icons-react';

// constants
const icons = {
  secret: IconLock,
  shield: IconShield,
  inventory: IconBox,
  wanted: IconUserSearch,
  city: IconBuildingBank,
  camera: IconCamera
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
      url: '/secret-page',
      icon: icons.secret,
      breadcrumbs: false,
      permission: { menu: 'secret', action: 'can_read' }
    },
    {
      id: 'security-protocols',
      title: 'Security Protocols',
      type: 'item',
      url: '/secret-page/security-protocols',
      icon: icons.shield,
      breadcrumbs: false,
      permission: { menu: 'secret', action: 'can_read' }
    },
    {
      id: 'inventory-status',
      title: 'Inventory Status',
      type: 'item',
      url: '/secret-page/inventory-status',
      icon: icons.inventory,
      breadcrumbs: false,
      permission: { menu: 'secret', action: 'can_read' }
    },
    {
      id: 'wanted-list',
      title: 'Wanted List',
      type: 'item',
      url: '/secret-page/wanted-list',
      icon: icons.wanted,
      breadcrumbs: false,
      permission: { menu: 'secret', action: 'can_read' }
    },
    {
      id: 'city-security',
      title: 'City Security',
      type: 'item',
      url: '/secret-page/city-security',
      icon: icons.city,
      breadcrumbs: false,
      permission: { menu: 'secret', action: 'can_read' }
    },
    {
      id: 'city-monitoring',
      title: 'Monitoring',
      type: 'item',
      url: '/secret-page/monitoring',
      icon: icons.camera,
      breadcrumbs: false,
      permission: { menu: 'secret', action: 'can_read' }
    }
  ]
};

export default secret;
