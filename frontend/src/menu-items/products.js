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
  children: [
    {
      id: 'products',
      title: 'Products',
      type: 'collapse',
      icon: icons.IconBarcode,
      children: [
        {
          id: 'product',
          title: 'List',
          type: 'item',
          url: '/products/list',
          icon: icons.IconList,
          breadcrumbs: false
        },
        {
          id: 'detailProduct',
          title: 'Detail',
          type: 'item',
          url: '/products/detail',
          icon: icons.IconDetails,
          breadcrumbs: false
        },
        {
          id: 'newProduct',
          title: 'Create',
          type: 'item',
          url: '/products/create',
          icon: icons.IconPlus,
          breadcrumbs: false
        },
        {
          id: 'editProduct',
          title: 'Edit',
          type: 'item',
          url: '/products/edit',
          icon: icons.IconEdit,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default products;
