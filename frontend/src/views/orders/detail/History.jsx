import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Snackbar, Alert, Card, CardContent, Grid, Stack, Fade } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import DefaultCardLayout from '../card/DefaultCardLayout';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconTimeline } from '@tabler/icons-react';
import { useOrderIDContext } from '../../../contexts/OrderIDContext';
import useOrderLockStatus from '../../../hooks/useOrderLockStatus';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CancelIcon from '@mui/icons-material/Cancel';
import { isDebug } from '../../../App';

export default function History() {
  const checkingAuth = useAuthGuard();
  const [userData] = useLocalStorage('wayne-user-data', {});
  const { orderId } = useOrderIDContext();

  const [historyItems, setHistoryItems] = useState([]);
  const [summaryItems, setSummaryItems] = useState([]);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  const {
    hasPayment,
    hasShipping,
    hasDelivery,
    isCanceled,
    isCompleted,
    canEdit,
    canPay,
    canceledPayment,
    loading: lockLoading
  } = useOrderLockStatus(orderId);

  const token = userData?.authToken;

  const fetchOrderHistory = async () => {
    try {
      const [orderRes, deliveryRes, shippingRes, paymentRes] = await Promise.all([
        axios.get(`${API_ROUTES.ORDERS}${orderId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_ROUTES.ORDERS_DELIVERY}?order=${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_ROUTES.ORDERS_SHIPPING}?order=${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_ROUTES.ORDERS_PAYMENT}?order=${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const order = orderRes.data;
      const deliveryList = Array.isArray(deliveryRes.data) ? deliveryRes.data : deliveryRes.data?.results || [];
      const shippingList = Array.isArray(shippingRes.data) ? shippingRes.data : shippingRes.data?.results || [];
      const paymentList = Array.isArray(paymentRes.data) ? paymentRes.data : paymentRes.data?.results || [];

      const delivery = deliveryList[0] || null;
      const shipping = shippingList[0] || null;
      const payment = paymentList[0] || null;

      isDebug && console.log('🧾 order.completed_at:', order.completed_at);

      const timeline = [];

      if (order.created_at) timeline.push({ label: 'Order created', type: 'order', date: order.created_at });
      if (shipping?.created_at) timeline.push({ label: 'Shipping started', type: 'shipping', date: shipping.created_at });
      if (delivery?.created_at) timeline.push({ label: 'Delivery started', type: 'delivery', date: delivery.created_at });
      if (payment?.created_at) timeline.push({ label: 'Payment processed', type: 'payment', date: payment.created_at });
      if (order.completed_at) timeline.push({ label: 'Order completed', type: 'completed', date: order.completed_at });
      if (order.canceled_at) timeline.push({ label: 'Order canceled', type: 'canceled', date: order.canceled_at });

      const sortedTimeline = timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
      if (sortedTimeline.length > 0) sortedTimeline[0].completed = true;

      const formattedTimeline = sortedTimeline.map((item) => ({
        ...item,
        date:
          item.date && !isNaN(new Date(item.date).getTime())
            ? new Intl.DateTimeFormat('default', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.date))
            : 'Invalid date'
      }));

      const summary = sortedTimeline.map((item) => ({
        title: item.label,
        value: item.date && !isNaN(new Date(item.date).getTime()) ? new Date(item.date).toLocaleString() : '—'
      }));

      setHistoryItems(formattedTimeline);
      setSummaryItems(summary);
    } catch (error) {
      console.error('❌ Failed to fetch order history:', error);
      setAlert({ open: true, severity: 'error', message: 'Failed to fetch order history!' });
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [orderId]);

  const actionbutton = useMemo(
    () => ({
      label: 'Refresh',
      icon: <RefreshIcon />,
      onClick: fetchOrderHistory,
      disabled: false
    }),
    []
  );

  if (checkingAuth) return null;

  const renderIcon = (type, completed) => {
    const props = {
      fontSize: 'small',
      sx: { position: 'absolute', left: 0, top: 4, color: completed ? 'success.main' : 'grey.400' }
    };
    switch (type) {
      case 'order':
        return <ShoppingCartIcon {...props} />;
      case 'payment':
        return <PaymentIcon {...props} />;
      case 'delivery':
        return <LocalShippingIcon {...props} />;
      case 'shipping':
        return <LocalPostOfficeIcon {...props} />;
      case 'completed':
        return <CheckCircleIcon {...props} />;
      case 'canceled':
        return <CancelIcon {...props} />;
      default:
        return <FiberManualRecordIcon {...props} />;
    }
  };

  return (
    <DefaultCardLayout subCardTitle="History" actionbutton={actionbutton}>
      {historyItems.length > 0 ? (
        <Card variant="outlined" sx={{ p: 1.5, width: '100%', border: 'none' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack
                  spacing={2}
                  position="relative"
                  sx={{
                    '&::before': { content: '""', position: 'absolute', top: 8, left: 10, bottom: 0, width: '2px', bgcolor: 'grey.300' }
                  }}
                >
                  {historyItems.map((item, index) => (
                    <Fade key={index} in timeout={500}>
                      <Box display="flex" alignItems="flex-start" gap={2} sx={{ position: 'relative', pl: 4 }}>
                        {renderIcon(item.type, item.completed)}
                        <Box>
                          <Typography variant="subtitle1" fontWeight={item.completed ? 700 : 500}>
                            {item.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.date}
                          </Typography>
                        </Box>
                      </Box>
                    </Fade>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box border="1px dashed #ddd" borderRadius={2} p={2} sx={{ backgroundColor: 'background.paper' }}>
                  {summaryItems.map((item, index) => (
                    <Box key={index} mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        {item.title}
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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
              gap: 2
            }}
          >
            <IconTimeline sx={{ fontSize: 160, color: 'grey.400' }} />
            <Typography variant="h5" fontWeight={500}>
              No history
            </Typography>
          </Box>
        </Box>
      )}

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </DefaultCardLayout>
  );
}
