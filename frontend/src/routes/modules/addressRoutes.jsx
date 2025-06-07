import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';

const AddressListPage = Loadable(lazy(() => import('views/address/List')));
const AddressDetailPage = Loadable(lazy(() => import('views/address/Detail')));
const AddressCreatePage = Loadable(lazy(() => import('views/address/Create')));
const AddressEditPage = Loadable(lazy(() => import('views/address/Edit')));

const addressRoutes = {
  path: 'address',
  children: [
    { index: true, element: <AddressListPage /> },
    { path: 'list', element: <AddressListPage /> },
    { path: 'detail', element: <Navigate to="1" replace /> },
    { path: 'detail/:id', element: <AddressDetailPage /> },
    { path: 'create', element: <AddressCreatePage /> },
    { path: 'edit', element: <Navigate to="1" replace /> },
    { path: 'edit/:id', element: <AddressEditPage /> }
  ]
};

export default addressRoutes; 