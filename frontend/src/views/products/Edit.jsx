import React, { useMemo, useRef } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import EditPage from './EditPage';
import { useProductIDContext } from '../../contexts/ProductIDContext';
import { BaseDir, isDebug } from '../../App';
import SaveIcon from '@mui/icons-material/Save';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function ProductEdit() {
  isDebug && console.log('ProductEdit renderizado');
  // Verifica se o token é válido
  const checkingAuth = useAuthGuard();

  const { productId } = useProductIDContext();
  const productEditRef = useRef();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Product', href: `${BaseDir}/products/detail/${productId}` },
      { label: 'Edit' }
    ],
    [productId]
  );

  const isActive = productEditRef.current?.isActive ?? true; // fallback true na primeira renderização

  const actionbutton = useMemo(
    () => ({
      type: 'submit',
      label: 'Save',
      icon: <SaveIcon />,
      disabled: !isActive,
      onClick: () => {
        productEditRef.current?.submitForm();
      }
    }),
    [productEditRef.current?.isActive]
  );
  // Previne renderização antes da validação
  if (checkingAuth) return null;

  // Renderiza o layout padrão com o título e o componente EditPage
  return (
    <DefaultLayout
      mainCardTitle="Products"
      subCardTitle="Edit"
      backButton={{ type: 'link', link: `/products/detail/${productId}` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <EditPage productEditRef={productEditRef} />
    </DefaultLayout>
  );
}
