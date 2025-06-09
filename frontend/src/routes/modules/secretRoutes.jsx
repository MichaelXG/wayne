import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

const SecretHomePage = Loadable(lazy(() => import('views/secret-page/home-secret')));
const SecurityProtocolsPage = Loadable(lazy(() => import('views/secret-page/SecurityProtocols')));
const InventoryStatusPage = Loadable(lazy(() => import('views/secret-page/InventoryStatus')));
const WantedListPage = Loadable(lazy(() => import('views/secret-page/WantedList')));
const CitySecurityStatusPage = Loadable(lazy(() => import('views/secret-page/CitySecurityStatus')));
const CityMonitoringPage = Loadable(lazy(() => import('views/secret-page/CityMonitoring')));

const secretRoutes = {
  path: 'secret-page',
  children: [
    { index: true, element: <SecretHomePage /> },
    { path: 'security-protocols', element: <SecurityProtocolsPage /> },
    { path: 'inventory-status', element: <InventoryStatusPage /> },
    { path: 'wanted-list', element: <WantedListPage /> },
    { path: 'city-security', element: <CitySecurityStatusPage /> },
    { path: 'monitoring', element: <CityMonitoringPage /> }
  ]
};

export default secretRoutes; 