import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

import DynamicModal from '../../ui-component/modal/DynamicModal';
import CreateCard from './CreateCard';
import { isDebug } from '../../App';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function AddressCreatePage({ addressEditRef }) {
  const [openModal, setOpenModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [userData] = useLocalStorage('fake-store-user-data', {});
  const navigate = useNavigate();

  const token = userData?.authToken || null;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/address/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(response.data?.results || []);
      } catch (error) {
        if (isDebug) console.error('❌ [DEBUG] Failed to fetch existing addresses:', error);
      }
    };

    if (token) fetchAddresses();
  }, [token]);

  const handleCreateAddress = async (formData) => {
    if (!formData) return;

    const requiredFields = ['street', 'number', 'city', 'state', 'neighborhood', 'postal_code'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Field "${field.replace('_', ' ')}" is required.`);
        return;
      }
    }

    const alreadyExists = addresses.some(
      (a) =>
        a.street === formData.street &&
        a.number === formData.number &&
        a.city === formData.city &&
        a.state === formData.state &&
        a.neighborhood === formData.neighborhood
    );

    if (alreadyExists) {
      alert('❌ An address with the same details already exists.');
      return;
    }

    setIsSaving(true);

    const payload = {
      street: formData.street,
      number: formData.number,
      neighborhood: formData.neighborhood || '',
      city: formData.city,
      state: formData.state,
      postal_code: (formData.postal_code || '').replace(/\D/g, ''),
      country: formData.country || 'Brazil',
      complement: formData.complement || '',
      reference: formData.reference || '',
      is_default: !!formData.is_default,
      is_active: formData.is_active !== false // garante true por padrão
    };

    try {
      const response = await api.post('/address/', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (isDebug) console.log('✅ [DEBUG] Address created:', response.data);

      setAddresses((prev) => [...prev, response.data]);
      addressEditRef?.current?.resetForm?.();

      setOpenModal(false);
      setPendingFormData(null);
      navigate('/address/list');
    } catch (err) {
      const errorData = err?.response?.data || err;
      if (isDebug) console.error('❌ [DEBUG] Failed to create address:', errorData);
      alert('Error while creating address!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitWithConfirmation = (formData = {}) => {
    if (isDebug) console.log('[DEBUG] Submit with confirmation triggered:', formData);

    setPendingFormData({ formData });
    setOpenModal(true);
  };

  return (
    <>
      <CreateCard ref={addressEditRef} onSubmit={handleSubmitWithConfirmation} />

      <DynamicModal
        open={openModal}
        onClose={() => {
          if (isDebug) console.log('[DEBUG] Modal canceled');
          setOpenModal(false);
          setPendingFormData(null);
        }}
        onSubmit={() => {
          if (pendingFormData) {
            if (isDebug) console.log('[DEBUG] Modal confirmed — creating address...');
            handleCreateAddress(pendingFormData.formData);
          }
        }}
        title="Confirm Address Creation"
        description="Are you sure you want to create this new address?"
        type="success"
        mode="confirm"
        submitLabel={isSaving ? 'Creating...' : 'Create'}
        loading={isSaving}
      />
    </>
  );
}
