import React, { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DataLoaderWrapper from '../../ui-component/dataGrid/DataLoaderWrapper';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import EditCard from './EditCard';
import { isDebug } from '../../App';

import { useCarrierIDContext } from '../../contexts/CarrierIDContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import DynamicModal from '../../ui-component/modal/DynamicModal';

export default function EditPage({ carrierEditRef }) {
  const { id } = useParams();
  const carrierId = id ? Number(id) : 1;

  const [userData] = useLocalStorage('wayne-user-data', {});
  const { setCarrierId } = useCarrierIDContext();

  const [openModal, setOpenModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (carrierId) setCarrierId(carrierId);
  }, [carrierId, setCarrierId]);

  const endpoint = useMemo(() => `${API_ROUTES.CARRIER}${carrierId}/`, [carrierId]);

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
      const { formData } = pendingFormData;

      const payload = new FormData();

      // Campos do formulário
      payload.append('name', formData.name ?? '');
      payload.append('slug', formData.slug ?? '');
      payload.append('prefix', formData.prefix ?? '');
      payload.append('is_default', formData.is_default ? 'true' : 'false');
      payload.append('is_active', formData.is_active ? 'true' : 'false');

      const response = await api.put(`${API_ROUTES.CARRIER}${carrierId}/`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      isDebug && console.log('✅ Carrier updated:', response.data);
      isDebug && alert('Carrier saved successfully!');
    } catch (error) {
      console.error('❌ Error saving carrier:', {
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers
      });
      isDebug && alert('Failed to save carrier.');
    } finally {
      setIsSaving(false);
      setOpenModal(false);
      setPendingFormData(null);
    }
  };

  const handleSubmitWithConfirmation = (formData) => {
    setPendingFormData({ formData });
    setOpenModal(true);
  };

  return (
    <>
      <DataLoaderWrapper endpoint={endpoint}>
        {(carrier, loading, error) => {
          if (error) return <IllustrationMessage type="error" title="Error" description="Failed to load carrier." />;
          if (!carrier) return <IllustrationMessage type="notFound" title="Not Found" description="Carrier not found." />;

          return <EditCard ref={carrierEditRef} carrier={carrier} onSubmit={handleSubmitWithConfirmation} />;
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
        description="Are you sure you want to save the changes to this carrier?"
        type="success"
        mode="confirm"
        submitLabel={isSaving ? 'Saving...' : 'Save'}
        loading={isSaving}
      />
    </>
  );
}
