import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

import DynamicModal from '../../ui-component/modal/DynamicModal';
import CreateCard from './CreateCard';
import { isDebug } from '../../App';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function CreatePage({ carrierEditRef }) {
  const [openModal, setOpenModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [carriers, setCarriers] = useState([]);
  const [userData] = useLocalStorage('wayne-user-data', {});
  const navigate = useNavigate();

  const token = userData?.authToken || null;

  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        const response = await api.get('/carrier/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCarriers(response.data?.results || []);
      } catch (error) {
        if (isDebug) console.error('❌ [DEBUG] Erro ao carregar carriers existentes:', error);
      }
    };

    if (token) fetchCarriers();
  }, [token]);

  const handleCreateCarrier = async (formData) => {
    if (!formData) return;

    const alreadyExists = carriers?.some((c) => c.prefix === formData.prefix);
    if (alreadyExists) {
      alert('❌ Um carrier com esse prefixo já existe.');
      return;
    }

    setIsSaving(true);

    const payload = new FormData();
    payload.append('name', formData.name ?? '');
    payload.append('slug', formData.slug ?? '');
    payload.append('prefix', formData.prefix ?? '');
    payload.append('is_default', formData.is_default ? 'true' : 'false');
    payload.append('is_active', formData.is_active ? 'true' : 'false');

    if (isDebug) {
      console.log('🧾 [DEBUG] Payload FormData:');
      for (let [key, value] of payload.entries()) {
        console.log(`${key}:`, value);
      }
    }

    try {
      const response = await api.post('/carrier/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (isDebug) {
        console.log('✅ [DEBUG] Carrier criado:', response.data);
      }

      // Atualiza a lista local
      setCarriers((prev) => [...prev, response.data]);

      if (carrierEditRef?.current?.resetForm) {
        carrierEditRef.current.resetForm();
      }

      setOpenModal(false);
      setPendingFormData(null);
      navigate('/carrier/list');
    } catch (err) {
      const errorData = err?.response?.data || err;
      if (isDebug) {
        console.error('❌ [DEBUG] Erro ao criar carrier:', errorData);
      }
      alert('Erro ao criar carrier!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitWithConfirmation = (formData = {}) => {
    if (isDebug) {
      console.log('[DEBUG] Submissão com confirmação acionada:', formData);
    }

    setPendingFormData({ formData });
    setOpenModal(true);
  };

  return (
    <>
      <CreateCard ref={carrierEditRef} onSubmit={handleSubmitWithConfirmation} />

      <DynamicModal
        open={openModal}
        onClose={() => {
          if (isDebug) console.log('[DEBUG] Modal cancelado');
          setOpenModal(false);
          setPendingFormData(null);
        }}
        onSubmit={() => {
          if (pendingFormData) {
            if (isDebug) console.log('[DEBUG] Modal confirmado — criando carrier...');
            handleCreateCarrier(pendingFormData.formData);
          }
        }}
        title="Confirm Carrier Creation"
        description="Are you sure you want to create this new carrier?"
        type="success"
        mode="confirm"
        submitLabel={isSaving ? 'Creating...' : 'Create'}
        loading={isSaving}
      />
    </>
  );
}
