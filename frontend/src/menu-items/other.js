// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  type: 'group',
  permission: { menu: 'other', action: 'can_read' },
  children: [
    {
      id: 'sample-page',
      title: 'Sample Page',
      type: 'item',
      url: '/sample-page',
      icon: icons.IconBrandChrome,
      breadcrumbs: false,
      permission: { menu: 'sample-page', action: 'can_read' }
    },
    {
      id: 'about-page',
      title: 'About',
      type: 'item',
      url: '/about-page',
      icon: icons.IconHelp,
      breadcrumbs: false,
      permission: { menu: 'about-page', action: 'can_read' }
    }
  ]
};

export default other;
