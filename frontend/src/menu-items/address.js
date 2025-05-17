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
  children: [
    {
      id: 'address-menu',
      title: 'Addresses',
      type: 'collapse',
      icon: icons.IconMapPin,
      children: [
        {
          id: 'address-list',
          title: 'List',
          type: 'item',
          url: '/address/list',
          icon: icons.IconList,
          breadcrumbs: false
        },
        {
          id: 'address-detail',
          title: 'Detail',
          type: 'item',
          url: '/address/detail',
          icon: icons.IconDetails,
          breadcrumbs: false
        },
        {
          id: 'address-create',
          title: 'Create',
          type: 'item',
          url: '/address/create',
          icon: icons.IconPlus,
          breadcrumbs: false
        },
        {
          id: 'address-edit',
          title: 'Edit',
          type: 'item',
          url: '/address/edit',
          icon: icons.IconEdit,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default address;
