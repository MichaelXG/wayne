// assets
import { IconDetails, IconEdit, IconList, IconPlus, IconShoppingCart, IconCheck } from '@tabler/icons-react';

// constant
const icons = { IconList, IconPlus, IconDetails, IconShoppingCart, IconEdit, IconCheck };

// ==============================|| ORDER MENU ITEMS ||============================== //

const order = {
  id: 'order',
  title: 'Order',
  icon: icons.IconShoppingCart,
  type: 'group',
  permission: { menu: 'order', action: 'can_read' },  
  children: [
    {
      id: 'Order',
      title: 'Order',
      type: 'collapse',
      icon: icons.IconShoppingCart,
      permission: { menu: 'order', action: 'can_read' },  
      children: [
        {
          id: 'Order',
          title: 'List',
          type: 'item',
          url: '/orders/list',
          icon: icons.IconList,
          breadcrumbs: false,
          permission: { menu: 'order', action: 'can_read' } 
        },
        {
          id: 'detailOrder',
          title: 'Detail',
          type: 'item',
          url: '/orders/detail',
          icon: icons.IconDetails,
          breadcrumbs: false,
          permission: { menu: 'order', action: 'can_read' }  
        }
      ]
    }
  ]
};

export default order;
