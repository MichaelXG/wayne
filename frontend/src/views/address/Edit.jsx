import React, { useMemo, useRef } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import EditPage from './EditPage';
import { BaseDir, isDebug } from '../../App';
import SaveIcon from '@mui/icons-material/Save';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { useAddressIDContext } from '../../contexts/AddressIDContext';

export default function AddressEdit() {
  isDebug && console.log('AddressEdit renderizado');
  // Verifica se o token é válido
  const checkingAuth = useAuthGuard();

  const { addressId } = useAddressIDContext();
  const addressEditRef = useRef();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Address', href: `${BaseDir}/address/detail/${addressId}` },
      { label: 'Edit' }
    ],
    [addressId]
  );

  const isActive = addressEditRef.current?.isActive ?? true; // fallback true na primeira renderização

  const actionbutton = useMemo(
    () => ({
      type: 'submit',
      label: 'Save',
      icon: <SaveIcon />,
      disabled: !isActive,
      permission: { menu: 'address', action: 'can_update' },
      onClick: () => {
        addressEditRef.current?.submitForm();
      }
    }),
    [addressEditRef.current?.isActive]
  );
  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente EditPage
  return (
    <DefaultLayout
      mainCardTitle="Addresses"
      subCardTitle="Edit"
      backButton={{ type: 'link', link: `/address/detail/${addressId}` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <EditPage addressEditRef={addressEditRef} />
    </DefaultLayout>
  );
}
