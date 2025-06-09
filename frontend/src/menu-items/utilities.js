// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  permission: { menu: 'utilities', action: 'can_read' },  
  children: [
    {
      id: 'util-typography',
      title: 'Typography',
      type: 'item',
      url: '/typography',
      icon: icons.IconTypography,
      breadcrumbs: false,
      permission: { menu: 'typography', action: 'can_read' }  
    },
    {
      id: 'util-color',
      title: 'Color',
      type: 'item',
      url: '/color',
      icon: icons.IconPalette,
      breadcrumbs: false,
      permission: { menu: 'color', action: 'can_read' }  
    },
    {
      id: 'util-shadow',
      title: 'Shadow',
      type: 'item',
      url: '/shadow',
      icon: icons.IconShadow,
      breadcrumbs: false,
      permission: { menu: 'shadow', action: 'can_read' }  
    }
  ]
};

export default utilities;
