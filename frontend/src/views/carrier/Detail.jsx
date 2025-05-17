import React, { useMemo } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DetailPage from './DetailPage';
import { useCarrierIDContext } from '../../contexts/CarrierIDContext';
import { BaseDir, customSvgEditIcon, isDebug } from '../../App';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function CarrierDetail() {
  isDebug && console.log('CarrierDetail renderizado');

  const checkingAuth = useAuthGuard();

  const { carrierId } = useCarrierIDContext();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Carrier', href: `${BaseDir}/carrier/list` },
      { label: 'Detail' }
    ],
    []
  );

  const actionbutton = useMemo(
    () => ({
      label: 'Edit',
      href: `${BaseDir}/carrier/edit/${carrierId}`,
      icon: customSvgEditIcon
    }),
    [carrierId]
  );
  
  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente DetailPage
  return (
    <DefaultLayout
      mainCardTitle="Carriers"
      subCardTitle="Detail"
      backButton={{ type: 'link', link: `/carrier/list/` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <DetailPage />
    </DefaultLayout>
  );
}
