import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Snackbar, Alert, Card, CardContent, Link, Grid } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import DefaultCardLayout from '../card/DefaultCardLayout';
import DeliveryModal from './DeliveryModal';
import AddIcon from '@mui/icons-material/Add';
import { IconTruckDelivery } from '@tabler/icons-react';
import { useOrderIDContext } from '../../../contexts/OrderIDContext';
import { customSvgEditIcon, isDebug } from '../../../App';
import DynamicModal from '../../../ui-component/modal/DynamicModal';
import useOrderLockStatus from '../../../hooks/useOrderLockStatus';

export default function Delivery({ onSelectCarrier }) {
  const checkingAuth = useAuthGuard();
  const [userData] = useLocalStorage('fake-store-user-data', {});
  const { orderId } = useOrderIDContext();

  const [carriers, setCarriers] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [speed, setSpeed] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { canEdit, loading: lockLoading } = useOrderLockStatus(orderId);

  const token = userData?.authToken;

  const fetchCarriers = async () => {
    try {
      const { data } = await axios.get(API_ROUTES.CARRIER, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarriers(data?.results || data || []);
    } catch (error) {
      console.error('❌ Failed to fetch carriers:', error);
    }
  };

  const fetchOrderDelivery = async () => {
    try {
      // Buscar status da order
      const orderRes = await axios.get(`${API_ROUTES.ORDERS}${orderId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const isOrderCanceled = orderRes.data.status === 'canceled';
      isDebug && console.log('📦 Order status:', orderRes.data.status, '| Is canceled?', isOrderCanceled);

      // Buscar todos os deliveries
      const deliveryRes = await axios.get(`${API_ROUTES.ORDERS_DELIVERY}?order=${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allDeliveries = Array.isArray(deliveryRes.data) ? deliveryRes.data : deliveryRes.data?.results || [];

      isDebug && console.log('📦 All deliveries fetched:', allDeliveries);

      // Se a order está cancelada → pegar o último cancelado
      const selectedDelivery = isOrderCanceled
        ? [...allDeliveries].reverse().find((d) => d.canceled)
        : allDeliveries.find((d) => !d.canceled);

      isDebug && console.log('✅ Selected delivery:', selectedDelivery);

      if (selectedDelivery) {
        const carrier = carriers.find((c) => c.id === selectedDelivery.carrier);
        isDebug && console.log('🚚 Matched carrier:', carrier);
        if (carrier) {
          setSelectedCarrier(carrier);
          setTrackingNumber(selectedDelivery.tracking);
          setSpeed(selectedDelivery.speed);
        }
      } else {
        isDebug && console.warn('⚠️ No delivery selected');
        setSelectedCarrier(null);
        setTrackingNumber('');
        setSpeed('');
      }
    } catch (error) {
      isDebug && console.error('❌ Failed to fetch delivery info:', error);
      setSelectedCarrier(null);
      setTrackingNumber('');
      setSpeed('');
    }
  };

  useEffect(() => {
    fetchCarriers();
  }, []);

  useEffect(() => {
    if (carriers.length > 0 && orderId) {
      fetchOrderDelivery();
    }
  }, [carriers, orderId]);

  useEffect(() => {
    if (!openModal) {
      fetchOrderDelivery();
    }
  }, [openModal]);

  const handleConfirmCarrier = async (carrier) => {
    try {
      const payload = { order: orderId, carrier: carrier.id };

      await axios.post(API_ROUTES.ORDERS_DELIVERY, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAlert({ open: true, severity: 'success', message: 'Carrier saved to order!' });
      setOpenModal(false);
      onSelectCarrier?.(carrier);

      const timeoutDuration =
        !isNaN(Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION)) / 2 ? Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION) / 2 : 1000;

      setTimeout(() => {
        window.location.reload();
      }, timeoutDuration);
    } catch (error) {
      console.error('Failed to create OrderDelivery:', error);
      setAlert({ open: true, severity: 'error', message: 'Failed to save carrier!' });
    }
  };

  const handleCancelDelivery = async () => {
    try {
      setIsSaving(true);
      const { data } = await axios.get(`${API_ROUTES.ORDERS_DELIVERY}?order=${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const delivery = Array.isArray(data) ? data[0] : data?.results?.[0];
      if (!delivery?.id) return;

      await axios.patch(
        `${API_ROUTES.ORDERS_DELIVERY}${delivery.id}/`,
        { canceled: true },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSelectedCarrier(null);
      setTrackingNumber('');
      setSpeed('');
      setAlert({ open: true, severity: 'info', message: 'Carrier removed. You can add a new one.' });
      setOpenModal(true);

      const timeoutDuration =
        !isNaN(Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION)) / 2 ? Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION) / 2 : 1000;

      setTimeout(() => {
        window.location.reload();
      }, timeoutDuration);
    } catch (error) {
      console.error('❌ Failed to cancel delivery:', error);
      setAlert({ open: true, severity: 'error', message: 'Failed to cancel carrier!' });
    } finally {
      setIsSaving(false);
      setShowDeleteModal(false);
    }
  };

  const openEditModal = () => {
    if (canEdit) setShowDeleteModal(true);
  };

  const openAddModal = () => {
    if (canEdit) setOpenModal(true);
  };

  const actionbutton = useMemo(() => {
    if (selectedCarrier) {
      return {
        label: 'Edit Carrier',
        icon: customSvgEditIcon,
        onClick: openEditModal,
        disabled: !canEdit
      };
    }
    return {
      label: 'Add Carrier',
      icon: <AddIcon />,
      onClick: openAddModal,
      disabled: !canEdit
    };
  }, [canEdit, selectedCarrier]);

  const { isCompleted } = useOrderLockStatus(orderId);

  const carrierSlug = selectedCarrier?.slug;
  const showTrackingLink = isCompleted && trackingNumber && carrierSlug;
  const trackingLink = `https://track.aftership.com/${carrierSlug}/${trackingNumber}`;

  if (checkingAuth) return null;

  return (
    <DefaultCardLayout subCardTitle="Delivery" actionbutton={actionbutton}>
      {selectedCarrier ? (
        <Box width="100%">
          <Card variant="outlined" sx={{ p: 3, width: '100%' }}>
            <CardContent sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Ship by
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedCarrier?.name || '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Speed
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="body1" fontWeight={500}>
                    {speed ? `${speed[0].toUpperCase()}${speed.slice(1)}` : '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Tracking No.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Link
                    href={showTrackingLink ? trackingLink : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    fontWeight="medium"
                    color="primary"
                  >
                    {trackingNumber || '-'}
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box sx={{ height: '100%', minHeight: 150, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                fontSize: 160,
                width: '100%',
                height: '100%',
                color: 'grey.400',
                '& path': {
                  stroke: 'currentColor'
                }
              }
            }}
          >
            <IconTruckDelivery sx={{ fontSize: 160, color: 'grey.400' }} />
            <Typography variant="h5" fontWeight={500}>
              No carrier selected
            </Typography>
          </Box>
        </Box>
      )}

      <DeliveryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        carriers={carriers}
        selectedCarrierId={selectedCarrier?.id}
        onSelect={setSelectedCarrier}
        onConfirm={(carrier) => handleConfirmCarrier(carrier)}
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
        title="Remove delivery?"
        description="Do you want to cancel this delivery and choose another carrier?"
        type="warning"
        mode="confirm"
        submitLabel={isSaving ? 'Removing...' : 'Confirm'}
        loading={isSaving}
      />
    </DefaultCardLayout>
  );
}
