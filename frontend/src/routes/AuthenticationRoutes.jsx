import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// maintenance routing
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('views/pages/authentication/Register')));
const RecoverPage = Loadable(lazy(() => import('views/pages/authentication/Recover')));
const ResetPage = Loadable(lazy(() => import('views/pages/authentication/Reset')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/login',
      element: <LoginPage />
    },
    {
      path: '/pages/register',
      element: <RegisterPage />
    },
    {
      path: '/pages/recover',
      element: <RecoverPage />
    },
    {
      path: "/pages/reset/:uidb64/:token/:timestamp",
      element: <ResetPage />
    }
  ]
};

export default AuthenticationRoutes;
