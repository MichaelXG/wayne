import React, { useMemo } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DetailPage from './DetailPage';
import { useUserIDContext } from '../../contexts/UserIDContext';
import { BaseDir, customSvgEditIcon, isDebug } from '../../App';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function UserDetail() {
  isDebug && console.log('UserDetail renderizado');

  const checkingAuth = useAuthGuard();

  const { userId } = useUserIDContext();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'User', href: `${BaseDir}/users/list` },
      { label: 'Detail' }
    ],
    []
  );

  const actionbutton = useMemo(
    () => ({
      label: 'Edit',
      href: `/users/edit/${userId}`,
      icon: customSvgEditIcon
    }),
    [userId]
  );
  
  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente DetailPage
  return (
    <DefaultLayout
      mainCardTitle="Users"
      subCardTitle="Detail"
      backButton={{ type: 'link', link: `/users/list/` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <DetailPage />
    </DefaultLayout>
  );
}
