import React, { useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DefaultLayout from '../../layout/DefaultLayout';

import { BaseDir, isDebug } from '../../App';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import ListPage from './ListPage';

export default function OrderList() {
  isDebug && console.log('OrderList renderizado');

  const checkingAuth = useAuthGuard();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Order', href: `${BaseDir}/orders/list` },
      { label: 'List' }
    ],
    []
  );

  const actionbutton = useMemo(
    () => ({
      label: 'Create',
      href: `${BaseDir}/orders/create`,
      icon: <AddIcon />
    }),
    []
  );
  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente ListPage
  return (
    <DefaultLayout
      mainCardTitle="Order's"
      subCardTitle="List"
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <ListPage />
    </DefaultLayout>
  );
}
