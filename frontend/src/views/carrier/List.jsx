import React, { useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DefaultLayout from '../../layout/DefaultLayout';
import ListPage from './ListPage';
import { BaseDir, isDebug } from '../../App';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function CarrierList() {
  isDebug && console.log('CarrierList renderizado');

  const checkingAuth = useAuthGuard();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Carrier', href: `${BaseDir}/carrier/list` },
      { label: 'List' }
    ],
    []
  );

  const actionbutton = useMemo(
    () => ({
      label: 'Create',
      href: `/carrier/create`,
      icon: <AddIcon />,
      permission: { menu: 'carrier', action: 'can_create' }
    }),
    []
  );
  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente ListPage
  return (
    <DefaultLayout
      mainCardTitle="Carriers"
      subCardTitle="List"
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <ListPage />
    </DefaultLayout>
  );
}
