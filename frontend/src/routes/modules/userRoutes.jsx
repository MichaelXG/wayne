import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';

const UserListPage = Loadable(lazy(() => import('views/users/List')));
const UserDetailPage = Loadable(lazy(() => import('views/users/Detail')));
const UserEditPage = Loadable(lazy(() => import('views/users/Edit')));

const userRoutes = {
  path: 'users',
  children: [
    { index: true, element: <UserListPage /> },
    { path: 'list', element: <UserListPage /> },
    { path: 'detail', element: <Navigate to="1" replace /> },
    { path: 'detail/:id', element: <UserDetailPage /> },
    { path: 'edit', element: <Navigate to="1" replace /> },
    { path: 'edit/:id', element: <UserEditPage /> }
  ]
};

export default userRoutes; 