import React, { useMemo, useRef } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useCarrierIDContext } from '../../contexts/CarrierIDContext';
import { BaseDir, isDebug } from '../../App';
import SaveIcon from '@mui/icons-material/Save';
import CreatePage from './CreatePage';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function CarrierEdit() {
  isDebug && console.log('CarrierEdit renderizado');

  const checkingAuth = useAuthGuard();

  const { carrierId } = useCarrierIDContext();

  const carrierEditRef = useRef();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Carrier', href: `${BaseDir}/carrier/list` },
      { label: 'Create' }
    ],
    [carrierId]
  );

  const isActive = carrierEditRef.current?.isActive ?? true; // fallback true na primeira renderização

  const actionbutton = useMemo(
    () => ({
      type: 'submit',
      label: 'Save',
      icon: <SaveIcon />,
      disabled: !isActive,
      permission: { menu: 'carrier', action: 'can_create' },
      onClick: () => {
        carrierEditRef.current?.submitForm();
      }
    }),
    [carrierEditRef.current?.isActive]
  );

  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente EditPage
  return (
    <DefaultLayout
      mainCardTitle="Carriers"
      subCardTitle="Create Carrier"
      backButton={{ type: 'link', link: `/carrier/list` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <CreatePage carrierEditRef={carrierEditRef} />
    </DefaultLayout>
  );
}
