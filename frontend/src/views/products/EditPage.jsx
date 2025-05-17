import React, { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DataLoaderWrapper from '../../ui-component/dataGrid/DataLoaderWrapper';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import EditCard from './EditCard';
import { isDebug } from '../../App';

import { useProductIDContext } from '../../contexts/ProductIDContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import DynamicModal from '../../ui-component/modal/DynamicModal';

export default function EditPage({ productEditRef }) {
  const { id } = useParams();
  const productId = id ? Number(id) : 1;

  const [userData] = useLocalStorage('fake-store-user-data', {});
  const { setProductId } = useProductIDContext();

  const [openModal, setOpenModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (productId) setProductId(productId);
  }, [productId, setProductId]);

  const endpoint = useMemo(() => `${API_ROUTES.PRODUCTS}${productId}/`, [productId]);

  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    const token = userData?.authToken || null;
    if (!token) {
      isDebug && console.warn('⚠️ No auth token found');
      alert('User not authenticated. Please log in again.');
      return;
    }

    setIsSaving(true);

    try {
      const { formData, imageFiles = [] } = pendingFormData;

      const payload = new FormData();

      // Campos do formulário
      payload.append('title', formData.title ?? '');
      payload.append('description', formData.description ?? '');
      payload.append('category', formData.category ?? '');
      payload.append('code', formData.code ?? '');
      payload.append('sku', formData.sku ?? '');
      payload.append('gender', formData.gender ?? '');
      payload.append('quantity', formData.quantity ?? 0);
      payload.append('price_regular', formData.price_regular ?? 0);
      payload.append('price_sale', formData.price_sale ?? 0);
      payload.append('tax', formData.tax ?? 0);
      payload.append('is_active', formData.is_active ? 'true' : 'false');

      // Imagens: arquivos novos e URLs existentes
      imageFiles.forEach((img) => {
        if (img?.file) {
          payload.append('images', img.file);
        } else if (img?.url) {
          payload.append('existing_images', img.url);
        }
      });

      const response = await api.put(`${API_ROUTES.PRODUCTS}${productId}/`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      isDebug && console.log('✅ Product updated:', response.data);
      isDebug && alert('Product saved successfully!');
    } catch (error) {
      console.error('❌ Error saving product:', {
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers
      });
      isDebug && alert('Failed to save product.');
    } finally {
      setIsSaving(false);
      setOpenModal(false);
      setPendingFormData(null);
    }
  };

  const handleSubmitWithConfirmation = (formData, imageFiles = []) => {
    setPendingFormData({ formData, imageFiles });
    setOpenModal(true);
  };

  return (
    <>
      <DataLoaderWrapper endpoint={endpoint}>
        {(product, loading, error) => {
          if (error) return <IllustrationMessage type="error" title="Error" description="Failed to load product." />;
          if (!product) return <IllustrationMessage type="notFound" title="Not Found" description="Product not found." />;

          return <EditCard ref={productEditRef} product={product} onSubmit={handleSubmitWithConfirmation} />;
        }}
      </DataLoaderWrapper>

      <DynamicModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setPendingFormData(null);
        }}
        onSubmit={handleConfirmSave}
        title="Confirm Changes"
        description="Are you sure you want to save the changes to this product?"
        type="success"
        mode="confirm"
        submitLabel={isSaving ? 'Saving...' : 'Save'}
        loading={isSaving}
      />
    </>
  );
}
