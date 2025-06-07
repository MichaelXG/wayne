import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';

const ListPage = Loadable(lazy(() => import('views/products/List')));
const DetailPage = Loadable(lazy(() => import('views/products/Detail')));
const ProductCreatePage = Loadable(lazy(() => import('views/products/Create')));
const EditPage = Loadable(lazy(() => import('views/products/Edit')));

const productRoutes = {
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
};

export default productRoutes; 