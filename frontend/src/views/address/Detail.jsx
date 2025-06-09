import React, { useMemo } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DetailPage from './DetailPage';
import { BaseDir, customSvgEditIcon, isDebug } from '../../App';
import { IconEdit } from '@tabler/icons-react';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { useAddressIDContext } from '../../contexts/AddressIDContext';

export default function AddressDetail() {
  isDebug && console.log('AddressDetail renderizado');

  const checkingAuth = useAuthGuard();

  const { addressId } = useAddressIDContext();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Address', href: `${BaseDir}/address/list` },
      { label: 'Detail' }
    ],
    []
  );

  const actionbutton = useMemo(
    () => ({
      label: 'Edit',
      href: `/address/edit/${addressId}`,
      icon: customSvgEditIcon,
      permission: { menu: 'address', action: 'can_update' }
    }),
    [addressId]
  );
  
  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente DetailPage
  return (
    <DefaultLayout
      mainCardTitle="Addresses"
      subCardTitle="Detail"
      backButton={{ type: 'link', link: `/address/list/` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <DetailPage />
    </DefaultLayout>
  );
}
