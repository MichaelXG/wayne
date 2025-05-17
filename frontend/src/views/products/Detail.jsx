import React, { useMemo } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DetailPage from './DetailPage';
import { useProductIDContext } from '../../contexts/ProductIDContext';
import { BaseDir, customSvgEditIcon, isDebug } from '../../App';
import { IconEdit } from '@tabler/icons-react';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function ProductDetail() {
  isDebug && console.log('ProductDetail renderizado');

  const checkingAuth = useAuthGuard();

  const { productId } = useProductIDContext();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Product', href: `${BaseDir}/products/list` },
      { label: 'Detail' }
    ],
    []
  );

  const actionbutton = useMemo(
    () => ({
      label: 'Edit',
      href: `${BaseDir}/products/edit/${productId}`,
      icon: customSvgEditIcon
    }),
    [productId]
  );
  
  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente DetailPage
  return (
    <DefaultLayout
      mainCardTitle="Products"
      subCardTitle="Detail"
      backButton={{ type: 'link', link: `/products/list/` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <DetailPage />
    </DefaultLayout>
  );
}
