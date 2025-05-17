import React, { useMemo, useRef } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import EditPage from './EditPage';
import { BaseDir, isDebug } from '../../App';
import SaveIcon from '@mui/icons-material/Save';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { useCarrierIDContext } from '../../contexts/CarrierIDContext';

export default function CarrierEdit() {
  isDebug && console.log('CorrierEdit renderizado');
  // Verifica se o token é válido
  const checkingAuth = useAuthGuard();

  const { carrierId } = useCarrierIDContext();
  const carrierEditRef = useRef();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Carrier', href: `${BaseDir}/carrier/detail/${carrierId}` },
      { label: 'Edit' }
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
      subCardTitle="Edit"
      backButton={{ type: 'link', link: `/carrier/detail/${carrierId}` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <EditPage carrierEditRef={carrierEditRef} />
    </DefaultLayout>
  );
}
