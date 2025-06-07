import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';

const OrderListPage = Loadable(lazy(() => import('views/orders/List')));
const OrderDetailPage = Loadable(lazy(() => import('views/orders/Detail')));

const orderRoutes = {
  path: 'orders',
  children: [
    { index: true, element: <OrderListPage /> },
    { path: 'list', element: <OrderListPage /> },
    { path: 'detail', element: <Navigate to="1" replace /> },
    { path: 'detail/:id', element: <OrderDetailPage /> }
  ]
};

export default orderRoutes; 