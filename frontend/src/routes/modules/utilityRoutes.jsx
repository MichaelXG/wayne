import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

const UtilityTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilityColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilityShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

const utilityRoutes = [
  {
    path: 'utils',
    children: [
      {
        path: 'util-typography',
        element: <UtilityTypography />
      }
    ]
  },
  {
    path: 'utils',
    children: [
      {
        path: 'util-color',
        element: <UtilityColor />
      }
    ]
  },
  {
    path: 'utils',
    children: [
      {
        path: 'util-shadow',
        element: <UtilityShadow />
      }
    ]
  }
];

export default utilityRoutes; 