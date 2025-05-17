// assets
import { IconBarcode, IconDetails, IconEdit, IconList, IconPlus, IconTruckDelivery } from '@tabler/icons-react';

// constant
const icons = {
  IconBarcode,
  IconList,
  IconPlus,
  IconDetails,
  IconTruckDelivery,
  IconEdit
};

// ==============================|| CARRIERS MENU ITEMS ||============================== //

const carrier = {
  id: 'carrier',
  title: 'Carriers',
  icon: icons.IconTruckDelivery, // <- Ícone principal ajustado
  type: 'group',
  children: [
    {
      id: 'carriers-menu',
      title: 'Carriers',
      type: 'collapse',
      icon: icons.IconTruckDelivery,
      children: [
        {
          id: 'carrier-list',
          title: 'List',
          type: 'item',
          url: '/carrier/list',
          icon: icons.IconList,
          breadcrumbs: false
        },
        {
          id: 'carrier-detail',
          title: 'Detail',
          type: 'item',
          url: '/carrier/detail',
          icon: icons.IconDetails,
          breadcrumbs: false
        },
        {
          id: 'carrier-create',
          title: 'Create',
          type: 'item',
          url: '/carrier/create',
          icon: icons.IconPlus,
          breadcrumbs: false
        },
        {
          id: 'carrier-edit',
          title: 'Edit',
          type: 'item',
          url: '/carrier/edit',
          icon: icons.IconEdit,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default carrier;
