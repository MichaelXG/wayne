import React, { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { API_ROUTES } from '../../routes/ApiRoutes';

import DataLoaderWrapper from '../../ui-component/dataGrid/DataLoaderWrapper';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import EditCard from './EditCard';
import { isDebug } from '../../App';

import { useUserIDContext } from '../../contexts/UserIDContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import DynamicModal from '../../ui-component/modal/DynamicModal';

export default function EditPage({ userEditRef }) {
  const { id } = useParams();
  const userId = id ? Number(id) : 1;

  const [userData] = useLocalStorage('wayne-user-data', {});
  const { setUserId } = useUserIDContext();

  const [openModal, setOpenModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userId) setUserId(userId);
  }, [userId, setUserId]);

  const endpoint = useMemo(() => `${API_ROUTES.USERS}${userId}/`, [userId]);

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
      const { formData, avatarImage } = pendingFormData;
      const payload = new FormData();

      // 🔧 Remover máscara de CPF e telefone
      const cleanCpf = (formData.cpf || '').replace(/\D/g, '');
      const cleanPhone = (formData.phone || '').replace(/\D/g, '');

      // Campos básicos
      if (formData.first_name) payload.append('first_name', formData.first_name);
      if (formData.last_name) payload.append('last_name', formData.last_name);
      if (cleanCpf) payload.append('cpf', cleanCpf);
      if (formData.birth_date) payload.append('birth_date', formData.birth_date);
      if (cleanPhone) payload.append('phone', cleanPhone);
      if (formData.email) payload.append('email', formData.email);

      // Campos booleanos
      payload.append('is_superuser', formData.is_superuser ? 'true' : 'false');
      payload.append('is_staff', formData.is_staff ? 'true' : 'false');
      payload.append('is_active', formData.is_active ? 'true' : 'false');

      // Grupos
      if (Array.isArray(formData.groups)) {
        formData.groups.forEach((group) => {
          const id = typeof group === 'object' ? group.id : group;
          if (!isNaN(id)) {
            payload.append('groups', parseInt(id, 10));
          }
        });
      }

      // Avatar
      if (avatarImage instanceof File) {
        payload.append('avatar', avatarImage);
      }

      const response = await api.put(`${API_ROUTES.USERS}${userId}/`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      isDebug && console.log('✅ User updated:', response.data);
      isDebug && alert('User saved successfully!');
    } catch (error) {
      console.error('❌ Error saving user:', {
        status: error?.response?.status,
        data: error?.response?.data,
        headers: error?.response?.headers
      });
      alert(JSON.stringify(error?.response?.data, null, 2));
      isDebug && alert('Failed to save user.');
    } finally {
      setIsSaving(false);
      setOpenModal(false);
      setPendingFormData(null);
    }
  };

  const handleSubmitWithConfirmation = (formData, avatarImage) => {
    setPendingFormData({ formData, avatarImage });
    setOpenModal(true);
  };

  return (
    <>
      <DataLoaderWrapper endpoint={endpoint}>
        {(user, loading, error) => {
          if (error) return <IllustrationMessage type="error" title="Error" description="Failed to load user." />;
          if (!user) return <IllustrationMessage type="notFound" title="Not Found" description="User not found." />;

          return (
            <EditCard ref={userEditRef} user={user} onSubmit={handleSubmitWithConfirmation} canEditSuperUser={!!userData?.is_superuser} />
          );
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
        description="Are you sure you want to save the changes to this user?"
        type="success"
        mode="confirm"
        submitLabel={isSaving ? 'Saving...' : 'Save'}
        loading={isSaving}
      />
    </>
  );
}
