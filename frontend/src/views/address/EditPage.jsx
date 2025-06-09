import React, { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DataLoaderWrapper from '../../ui-component/dataGrid/DataLoaderWrapper';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import EditCard from './EditCard';
import { isDebug } from '../../App';

import useLocalStorage from '../../hooks/useLocalStorage';
import DynamicModal from '../../ui-component/modal/DynamicModal';
import { useAddressIDContext } from '../../contexts/AddressIDContext';

export default function EditPage({ addressEditRef }) {
  const { id } = useParams();
  const addressId = id ? Number(id) : 1;

  const [userData] = useLocalStorage('wayne-user-data', {});
  const { setAddressId } = useAddressIDContext();

  const [openModal, setOpenModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (addressId) setAddressId(addressId);
  }, [addressId, setAddressId]);

  const endpoint = useMemo(() => `${API_ROUTES.ADDRESS}${addressId}/`, [addressId]);

  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    const token = userData?.authToken;
    if (!token) {
      isDebug && console.warn('⚠️ No auth token found');
      alert('User not authenticated. Please log in again.');
      return;
    }

    setIsSaving(true);

    try {
      const { formData } = pendingFormData;

      const payload = {
        street: formData.street,
        number: formData.number,
        complement: formData.complement || '',
        reference: formData.reference || '',
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country || 'Brazil',
        is_active: !!formData.is_active,
        is_default: !!formData.is_default
      };

      const response = await api.put(`${API_ROUTES.ADDRESS}${addressId}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      isDebug && console.log('✅ Address updated:', response.data);
      alert('Address updated successfully!');
    } catch (error) {
      console.error('❌ Error saving address:', error?.response?.data || error);
      alert('Failed to update the address.');
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
        {(address, loading, error) => {
          if (error) {
            return <IllustrationMessage type="error" title="Error" description="Failed to load address." />;
          }
          if (!address) {
            return <IllustrationMessage type="notFound" title="Not Found" description="Address not found." />;
          }

          return <EditCard ref={addressEditRef} address={address} onSubmit={handleSubmitWithConfirmation} />;
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
        description="Are you sure you want to save the changes to this address?"
        type="success"
        mode="confirm"
        submitLabel={isSaving ? 'Saving...' : 'Save'}
        loading={isSaving}
      />
    </>
  );
}
