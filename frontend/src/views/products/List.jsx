import React, { useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DefaultLayout from '../../layout/DefaultLayout';
import ListPage from './ListPage';
import { BaseDir, isDebug } from '../../App';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function ProductList() {
  isDebug && console.log('ProductList renderizado');

  const checkingAuth = useAuthGuard();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Product', href: `${BaseDir}/products/list` },
      { label: 'List' }
    ],
    []
  );

  const actionbutton = useMemo(
    () => ({
      label: 'Create',
      href: `/products/create`,
      icon: <AddIcon />,
      permission: { menu: 'products', action: 'can_create'}
    }),
    []
  );
  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente ListPage
  return (
    <DefaultLayout
      mainCardTitle="Products"
      subCardTitle="List"
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <ListPage />
    </DefaultLayout>
  );
}
