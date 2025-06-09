import React, { useMemo, useRef } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import EditPage from './EditPage';
import { useUserIDContext } from '../../contexts/UserIDContext';
import { BaseDir, isDebug } from '../../App';
import SaveIcon from '@mui/icons-material/Save';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function UserEdit() {
  isDebug && console.log('UserEdit renderizado');
  // Verifica se o token é válido
  const checkingAuth = useAuthGuard();

  const { userId } = useUserIDContext();
  const userEditRef = useRef();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Users', href: `${BaseDir}/users/detail/${userId}` },
      { label: 'Edit' }
    ],
    [userId]
  );

  const isActive = userEditRef.current?.isActive ?? true; // fallback true na primeira renderização

  const actionbutton = useMemo(
    () => ({
      type: 'submit',
      label: 'Save',
      icon: <SaveIcon />,
      disabled: !isActive,
      permission: { menu: 'users', action: 'can_update' },
      onClick: () => {
        userEditRef.current?.submitForm();
      }
    }),
    [userEditRef.current?.isActive]
  );
  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente EditPage
  return (
    <DefaultLayout
      mainCardTitle="Users"
      subCardTitle="Edit"
      backButton={{ type: 'link', link: `/users/detail/${userId}` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <EditPage userEditRef={userEditRef} />
    </DefaultLayout>
  );
}
