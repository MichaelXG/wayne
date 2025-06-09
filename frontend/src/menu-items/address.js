// assets
import { IconMapPin, IconDetails, IconEdit, IconList, IconPlus } from '@tabler/icons-react';

// constant
const icons = {
  IconMapPin,
  IconList,
  IconPlus,
  IconDetails,
  IconEdit
};

// ==============================|| ADDRESS MENU ITEMS ||============================== //

const address = {
  id: 'address',
  title: 'Addresses',
  icon: icons.IconMapPin,
  type: 'group',
  permission: { menu: 'address', action: 'can_read' },
  children: [
    {
      id: 'address-menu',
      title: 'Addresses',
      type: 'collapse',
      icon: icons.IconMapPin,
      permission: { menu: 'address', action: 'can_read' },
      children: [
        {
          id: 'address-list',
          title: 'List',
          type: 'item',
          url: '/address/list',
          icon: icons.IconList,
          breadcrumbs: false,
          permission: { menu: 'address', action: 'can_read' }
        },
        {
          id: 'address-detail',
          title: 'Detail',
          type: 'item',
          url: '/address/detail',
          icon: icons.IconDetails,
          breadcrumbs: false,
          permission: { menu: 'address', action: 'can_read' }
        },
        {
          id: 'address-create',
          title: 'Create',
          type: 'item',
          url: '/address/create',
          icon: icons.IconPlus,
          breadcrumbs: false,
          permission: { menu: 'address', action: 'can_create' }
        },
        {
          id: 'address-edit',
          title: 'Edit',
          type: 'item',
          url: '/address/edit',
          icon: icons.IconEdit,
          breadcrumbs: false,
          permission: { menu: 'address', action: 'can_update' }
        }
      ]
    }
  ]
};

export default address;
