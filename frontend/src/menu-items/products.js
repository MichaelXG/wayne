// assets
import { IconBarcode, IconDetails, IconEdit, IconList, IconPlus, IconShoppingCart } from '@tabler/icons-react';

// constant
const icons = { IconBarcode, IconList, IconPlus, IconDetails, IconShoppingCart, IconEdit };

// ==============================|| PRODUCTS MENU ITEMS ||============================== //

const products = {
  id: 'products',
  title: 'Products',
  icon: icons.IconBarcode,
  type: 'group',
  permission: { menu: 'products', action: 'can_read' },

  children: [
    {
      id: 'products',
      title: 'Products',
      type: 'collapse',
      icon: icons.IconBarcode,
      permission: { menu: 'products', action: 'can_read' },

      children: [
        {
          id: 'product',
          title: 'List',
          type: 'item',
          url: '/products/list',
          icon: icons.IconList,
          breadcrumbs: false,
          permission: { menu: 'products', action: 'can_read' }
        },
        {
          id: 'detailProduct',
          title: 'Detail',
          type: 'item',
          url: '/products/detail',
          icon: icons.IconDetails,
          breadcrumbs: false,
          permission: { menu: 'products', action: 'can_read' }
        },
        {
          id: 'newProduct',
          title: 'Create',
          type: 'item',
          url: '/products/create',
          icon: icons.IconPlus,
          breadcrumbs: false,
          permission: { menu: 'products', action: 'can_create' }
        },
        {
          id: 'editProduct',
          title: 'Edit',
          type: 'item',
          url: '/products/edit',
          icon: icons.IconEdit,
          breadcrumbs: false,
          permission: { menu: 'products', action: 'can_update' }
        }
      ]
    }
  ]
};

export default products;
