// assets
import { IconDetails, IconEdit, IconList, IconPlus, IconShoppingCart, IconCheck } from '@tabler/icons-react';

// constant
const icons = {IconList, IconPlus, IconDetails, IconShoppingCart, IconEdit, IconCheck };

// ==============================|| ORDER MENU ITEMS ||============================== //

const order = {
  id: 'order',
  title: 'Order',
  icon: icons.IconShoppingCart,
  type: 'group',
  children: [
    {
      id: 'Order',
      title: 'Order',
      type: 'collapse',
      icon: icons.IconShoppingCart,
      children: [
        {
          id: 'Order',
          title: 'List',
          type: 'item',
          url: '/orders/list',
          icon: icons.IconList,
          breadcrumbs: false
        },
        {
          id: 'detailOrder',
          title: 'Detail',
          type: 'item',
          url: '/orders/detail',
          icon: icons.IconDetails,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default order;
