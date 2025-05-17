import { createBrowserRouter, Navigate } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const basename = import.meta.env.VITE_APP_BASE_NAME || '/';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={`/pages/login`} replace /> // 🔹 Sempre inicia no login respeitando o basename
  },
  AuthenticationRoutes,
  MainRoutes
], {
  basename
});

export default router;
