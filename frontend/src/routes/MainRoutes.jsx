import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy-loaded pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

//  Rotas de produtos
const ListPage = Loadable(lazy(() => import('views/products/List')));
const DetailPage = Loadable(lazy(() => import('views/products/Detail')));
const ProductCreatePage = Loadable(lazy(() => import('views/products/Create')));
const EditPage = Loadable(lazy(() => import('views/products/Edit')));

// Rotas de Orders
const OrderListPage = Loadable(lazy(() => import('views/orders/List')));
const OrderDetailPage = Loadable(lazy(() => import('views/orders/Detail')));

// Rotas de carrier
const CarrierListPage = Loadable(lazy(() => import('views/carrier/List')));
const CarrierDetailPage = Loadable(lazy(() => import('views/carrier/Detail')));
const CreatePage = Loadable(lazy(() => import('views/carrier/Create')));
const CarrierEditPage = Loadable(lazy(() => import('views/carrier/Edit')));

// Rotas de Address
const AddressListPage = Loadable(lazy(() => import('views/address/List')));
const AddressDetailPage = Loadable(lazy(() => import('views/address/Detail')));
const AddressCreatePage = Loadable(lazy(() => import('views/address/Create')));
const AddressEditPage = Loadable(lazy(() => import('views/address/Edit')));

// Rotas de utilitários
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// Página de exemplo
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// Wrapper para proteger todas as rotas

function ProtectedRoutesWrapper() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
} // ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <MainLayout>
      <ProtectedRoutesWrapper /> {/* ?? Todas as rotas dentro do MainLayout est�o protegidas */}
    </MainLayout>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'products',
      children: [
        { index: true, element: <ListPage /> },
        { path: 'list', element: <ListPage /> },
        { path: 'detail', element: <Navigate to="1" replace /> },
        { path: 'detail/:id', element: <DetailPage /> },
        { path: 'create', element: <ProductCreatePage /> },
        { path: 'edit', element: <Navigate to="1" replace /> },
        { path: 'edit/:id', element: <EditPage /> }
      ]
    },
    {
      path: 'orders',
      children: [
        { index: true, element: <OrderListPage /> },
        { path: 'list', element: <OrderListPage /> },
        { path: 'detail', element: <Navigate to="1" replace /> },
        { path: 'detail/:id', element: <OrderDetailPage /> }
      ]
    },
    {
      path: 'carrier',
      children: [
        { index: true, element: <CarrierListPage /> },
        { path: 'list', element: <CarrierListPage /> },
        { path: 'detail', element: <Navigate to="1" replace /> },
        { path: 'detail/:id', element: <CarrierDetailPage /> },
        { path: 'create', element: <CreatePage /> },
        { path: 'edit', element: <Navigate to="1" replace /> },
        { path: 'edit/:id', element: <CarrierEditPage /> }
      ]
    },
    {
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
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
