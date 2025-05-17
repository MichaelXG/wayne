import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Snackbar, Alert, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import DefaultCardLayout from '../card/DefaultCardLayout';
import AddIcon from '@mui/icons-material/Add';
import MapIcon from '@mui/icons-material/Map';
import { useOrderIDContext } from '../../../contexts/OrderIDContext';
import { customSvgEditIcon, isDebug } from '../../../App';
import DynamicModal from '../../../ui-component/modal/DynamicModal';
import ShippingModal from './ShippingModal';
import AddressBlock from '../../address/AddressBlock';
import useOrderLockStatus from '../../../hooks/useOrderLockStatus';

export default function Shipping({ onSelectShipping }) {
  const checkingAuth = useAuthGuard();
  const [userData] = useLocalStorage('fake-store-user-data', {});
  const { orderId } = useOrderIDContext();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { canEdit, loading: lockLoading } = useOrderLockStatus(orderId);

  const token = userData?.authToken;

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(API_ROUTES.ADDRESS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(data?.results || data || []);
    } catch (error) {
      console.error('❌ Failed to fetch Addresses:', error);
    }
  };

  const fetchOrderShipping = async () => {
    try {
      const orderRes = await axios.get(`${API_ROUTES.ORDERS}${orderId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const order = orderRes.data;
      const isOrderCanceled = order.status === 'canceled';

      const shippingRes = await axios.get(`${API_ROUTES.ORDERS_SHIPPING}?order=${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allShippings = Array.isArray(shippingRes.data) ? shippingRes.data : shippingRes.data?.results || [];

      const selectedShipping = isOrderCanceled
        ? [...allShippings].reverse().find((s) => s.canceled)
        : allShippings.find((s) => !s.canceled);

      if (selectedShipping) {
        const addressRes = await axios.get(`${API_ROUTES.ADDRESS}${selectedShipping.address}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSelectedAddress(addressRes.data);
      } else {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error('❌ Failed to fetch shipping info:', error);
      setSelectedAddress(null);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (addresses.length > 0 && orderId) {
      fetchOrderShipping();
    }
  }, [addresses, orderId]);

  useEffect(() => {
    if (!openModal) {
      fetchOrderShipping();
    }
  }, [openModal]);

  const handleConfirmAddress = async (address) => {
    if (!canEdit) return;
    try {
      const payload = { order: orderId, address: address.id };

      await axios.post(API_ROUTES.ORDERS_SHIPPING, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAlert({ open: true, severity: 'success', message: 'Shipping saved to order!' });
      setOpenModal(false);

      // const timeoutDuration =
      //   !isNaN(Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION)) / 2 ? Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION) / 2 : 1000;

      // setTimeout(() => {
      //   window.location.reload();
      // }, timeoutDuration);
    } catch (error) {
      console.error('Failed to create OrderShipping:', error);
      setAlert({ open: true, severity: 'error', message: 'Failed to save address!' });
    }
  };

  const handleCancelDelivery = async () => {
    if (!canEdit) return;
    try {
      setIsSaving(true);
      const { data } = await axios.get(`${API_ROUTES.ORDERS_SHIPPING}?order=${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const shipping = Array.isArray(data) ? data[0] : data?.results?.[0];
      if (!shipping?.id) return;

      await axios.patch(
        `${API_ROUTES.ORDERS_SHIPPING}${shipping.id}/`,
        { canceled: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedAddress(null);
      setAlert({ open: true, severity: 'info', message: 'Shipping removed. You can add a new one.' });
      setOpenModal(true);
      // const timeoutDuration =
      //   !isNaN(Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION)) / 2 ? Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION) / 2 : 1000;

      // setTimeout(() => {
      //   window.location.reload();
      // }, timeoutDuration);
    } catch (error) {
      console.error('❌ Failed to cancel shipping:', error);
      setAlert({ open: true, severity: 'error', message: 'Failed to cancel address!' });
    } finally {
      setIsSaving(false);
      setShowDeleteModal(false);
    }
  };

  // Novas funções protegidas por `canEdit`
  const openEditModal = () => {
    if (canEdit) setShowDeleteModal(true);
  };

  const openAddModal = () => {
    if (canEdit) setOpenModal(true);
  };

  // Botão de ação com proteção
  const actionbutton = useMemo(() => {
    if (selectedAddress) {
      return {
        label: 'Edit Shipping',
        icon: customSvgEditIcon,
        onClick: openEditModal,
        disabled: !canEdit
      };
    }
    return {
      label: 'Add Shipping',
      icon: <AddIcon />,
      onClick: openAddModal,
      disabled: !canEdit
    };
  }, [canEdit, selectedAddress]);

  if (checkingAuth) return null;

  return (
    <DefaultCardLayout subCardTitle="Shipping" actionbutton={actionbutton}>
      {selectedAddress ? (
        <Box width="100%">
          <Card variant="outlined" sx={{ p: 2, width: '100%' }}>
            <CardContent sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2}>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={10}>
                  <Typography variant="body1" fontWeight={500}>
                    <AddressBlock address={selectedAddress} />
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box
          sx={{
            height: '100%',
            minHeight: 150,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              textAlign: 'center',
              gap: 2,
              '& svg': {
                fontSize: 100,
                height: '100%',
                color: 'grey.400',
                '& path': {
                  stroke: 'currentColor'
                }
              }
            }}
          >
            <MapIcon sx={{ fontSize: 160, color: 'grey.400' }} />
            <Typography variant="h5" fontWeight={500}>
              No address selected
            </Typography>
          </Box>
        </Box>
      )}

      <ShippingModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        addresses={addresses}
        selectedAddressId={selectedAddress?.id}
        onSelect={setSelectedAddress}
        onConfirm={(address) => handleConfirmAddress(address)}
      />

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>

      <DynamicModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSubmit={handleCancelDelivery}
        title="Remove shipping?"
        description="Do you want to cancel this shipping and choose another address?"
        type="warning"
        mode="confirm"
        submitLabel={isSaving ? 'Removing...' : 'Confirm'}
        loading={isSaving}
      />
    </DefaultCardLayout>
  );
}
