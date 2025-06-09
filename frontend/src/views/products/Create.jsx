import React, { useMemo, useRef } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useProductIDContext } from '../../contexts/ProductIDContext';
import { BaseDir, isDebug } from '../../App';
import SaveIcon from '@mui/icons-material/Save';
import ProductCreatePage from './CreatePage';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function ProductEdit() {
  isDebug && console.log('ProductEdit renderizado');

  const checkingAuth = useAuthGuard();

  const { productId } = useProductIDContext();

  const productEditRef = useRef();

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Product', href: `${BaseDir}/products/list` },
      { label: 'Create' }
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
      permission: { menu: 'products', action: 'can_create' },
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
      subCardTitle="Create Product"
      backButton={{ type: 'link', link: `/products/list` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <ProductCreatePage productEditRef={productEditRef} />
    </DefaultLayout>
  );
}
