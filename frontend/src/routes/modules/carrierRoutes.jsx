import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';

const CarrierListPage = Loadable(lazy(() => import('views/carrier/List')));
const CarrierDetailPage = Loadable(lazy(() => import('views/carrier/Detail')));
const CarrierCreatePage = Loadable(lazy(() => import('views/carrier/Create')));
const CarrierEditPage = Loadable(lazy(() => import('views/carrier/Edit')));

const carrierRoutes = {
  path: 'carrier',
  children: [
    { index: true, element: <CarrierListPage /> },
    { path: 'list', element: <CarrierListPage /> },
    { path: 'detail', element: <Navigate to="1" replace /> },
    { path: 'detail/:id', element: <CarrierDetailPage /> },
    { path: 'create', element: <CarrierCreatePage /> },
    { path: 'edit', element: <Navigate to="1" replace /> },
    { path: 'edit/:id', element: <CarrierEditPage /> }
  ]
};

export default carrierRoutes; 