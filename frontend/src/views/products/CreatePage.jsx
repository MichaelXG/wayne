import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

import DynamicModal from '../../ui-component/modal/DynamicModal';
import CreateCard from './CreateCard';
import { isDebug } from '../../App';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function ProductCreatePage({ productEditRef }) {
  const [openModal, setOpenModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userData] = useLocalStorage('wayne-user-data', {});
  const navigate = useNavigate();

  const token = userData?.authToken || null;

  const sanitizeDecimal = (value) => {
    if (typeof value === 'string') {
      return value.replace(',', '.').replace(/[^\d.]/g, '');
    }
    return value;
  };

  const handleCreateProduct = async (formData, imageFiles = []) => {
    if (!formData) return;
    setIsSaving(true);

    const payload = new FormData();

    const regularPrice = Number(sanitizeDecimal(formData.price_regular));
    const taxValue = Number(sanitizeDecimal(formData.tax));
    const priceSale = regularPrice + (regularPrice * taxValue) / 100 ?? 0;

    payload.append('title', formData.title ?? '');
    payload.append('description', formData.description ?? '');
    payload.append('category', formData.category ?? '');
    payload.append('quantity', formData.quantity ?? 0);
    payload.append('price_regular', !isNaN(regularPrice) ? regularPrice.toFixed(2) : '0.00');
    payload.append('price_sale', priceSale.toFixed(2));
    payload.append('tax', !isNaN(taxValue) ? taxValue.toFixed(2) : '0.00');
    payload.append('is_active', formData.is_active ? 'true' : 'false');

    imageFiles.forEach((img, idx) => {
      if (img?.file) {
        payload.append('images', img.file);
        if (isDebug) {
          console.log(`[DEBUG] Imagem ${idx + 1}:`, img.file.name);
        }
      }
    });

    if (isDebug) {
      console.log('🧾 [DEBUG] Payload FormData:');
      for (let [key, value] of payload.entries()) {
        console.log(`${key}:`, value);
      }
    }

    try {
      const response = await api.post('/products/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (isDebug) {
        console.log('✅ [DEBUG] Produto criado:', response.data);
      }
      isDebug && alert('Produto criado com sucesso!');

      if (productEditRef?.current?.resetForm) {
        productEditRef.current.resetForm();
      }

      setOpenModal(false);
      setPendingFormData(null);
      navigate('/products/list');
    } catch (err) {
      const errorData = err?.response?.data || err;
      if (isDebug) {
        console.error('❌ [DEBUG] Erro ao criar produto:', errorData);
      }
      isDebug && alert('Erro ao criar produto!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitWithConfirmation = (formData, imageFiles = []) => {
    if (isDebug) {
      console.log('[DEBUG] Submissão com confirmação acionada:', formData, imageFiles);
    }

    setPendingFormData({ formData, imageFiles });
    setOpenModal(true);
  };

  return (
    <>
      <CreateCard ref={productEditRef} onSubmit={handleSubmitWithConfirmation} />

      <DynamicModal
        open={openModal}
        onClose={() => {
          if (isDebug) console.log('[DEBUG] Modal cancelado');
          setOpenModal(false);
          setPendingFormData(null);
        }}
        onSubmit={() => {
          if (pendingFormData) {
            if (isDebug) console.log('[DEBUG] Modal confirmado — criando produto...');
            handleCreateProduct(pendingFormData.formData, pendingFormData.imageFiles);
          }
        }}
        title="Confirm Product Creation"
        description="Are you sure you want to create this new product?"
        type="success"
        mode="confirm"
        submitLabel={isSaving ? 'Creating...' : 'Create'}
        loading={isSaving}
      />
    </>
  );
}
