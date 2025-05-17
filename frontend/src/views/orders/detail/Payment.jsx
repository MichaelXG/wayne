import React, { useState, useEffect } from 'react';
import { Box, Chip, Button, Snackbar, Alert, Fade, Tooltip } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import DefaultCardLayout from '../card/DefaultCardLayout';
import PaymentModal from './PaymentModal';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { useOrderIDContext } from '../../../contexts/OrderIDContext';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import axios from 'axios';
import useFetchData from '../../../hooks/useFetchData';
import useLocalStorage from '../../../hooks/useLocalStorage';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CardActionsMenu from '../../../ui-component/cards/CardActionsMenu';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import OtpModal from '../../../ui-component/modal/OtpModal';
import NotificationList from '../../../layout/MainLayout/Header/NotificationSection/NotificationList';
import { useCsc } from '../../../contexts/CscContext';
import useOrderReadyForPayment from '../../../hooks/useOrderReadyForPayment';

export default function Payment() {
  const checkingAuth = useAuthGuard();
  const [userData] = useLocalStorage('fake-store-user-data', {});
  const { orderId } = useOrderIDContext();
  const { data: order } = useFetchData(`${API_ROUTES.ORDERS}${orderId}/`);
  const user_id = order?.user?.id || '';

  const [wallet, setWallet] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvc: '', status: 'active', is_primary: false });

  const [cscDialogOpen, setCscDialogOpen] = useState(false);
  const [cscGenerated, setCscGenerated] = useState('');
  const [cscInput, setCscInput] = useState('');
  const [locked, setLocked] = useState(false);
  const { setCsc } = useCsc();

  const { ready: canMakePayment, loading } = useOrderReadyForPayment(orderId);

  console.log('canMakePayment: ', canMakePayment);

  const token = userData?.authToken;

  const fetchWallet = async () => {
    if (!user_id) return;
    try {
      const { data } = await axios.get(API_ROUTES.WALLETS, { headers: { Authorization: `Bearer ${token}` } });
      setWallet(data);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    }
  };

  const fetchOrderPayment = async () => {
    try {
      const { data } = await axios.get(`${API_ROUTES.ORDERS_PAYMENT}?order=${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payment = (Array.isArray(data) ? data : data?.results)?.find((p) => !p.canceled);
      setLocked(!!payment);
    } catch (error) {
      console.error('Failed to fetch order payment:', error);
    }
  };

  const cancelOrderPayment = async () => {
    try {
      const { data } = await axios.get(`${API_ROUTES.ORDERS_PAYMENT}?order=${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payment = (Array.isArray(data) ? data : data?.results)?.find((p) => !p.canceled);
      if (payment) {
        await axios.patch(
          `${API_ROUTES.ORDERS_PAYMENT}${payment.id}/`,
          { canceled: true },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setLocked(false);
        setAlert({ open: true, severity: 'info', message: 'Order payment canceled. You can create a new one.' });
      }
    } catch (error) {
      console.error('Failed to cancel order payment:', error);
      setAlert({ open: true, severity: 'error', message: 'Failed to cancel order payment.' });
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchOrderPayment();
  }, [user_id]);

  const handleOpen = () => {
    setEditingCard(null);
    setCardForm({ number: '', name: '', expiry: '', cvc: '' });
    setOpenModal(true);
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setCardForm({
      number: card.number,
      name: card.name,
      expiry: card.expiry,
      cvc: card.cvc,
      status: card.status || 'active',
      is_primary: card.is_primary || false
    });
    setOpenModal(true);
  };

  const handleDelete = async (cardId) => {
    try {
      await axios.delete(`${API_ROUTES.WALLETS}${cardId}/`, { headers: { Authorization: `Bearer ${token}` } });
      setAlert({ open: true, severity: 'success', message: 'Card deleted successfully!' });
      fetchWallet();
    } catch (error) {
      console.error('Failed to delete card:', error);
      setAlert({ open: true, severity: 'error', message: 'Failed to delete card!' });
    }
  };

  const handleSave = async (cardData) => {
    try {
      const convertExpiryToDate = (expiry) => {
        const [month, year] = expiry.split('/');
        const fullYear = `20${year}`;
        return `${fullYear}-${month.padStart(2, '0')}-01`;
      };

      const payload = {
        number: cardData.number,
        name: cardData.name,
        expiry: convertExpiryToDate(cardData.expiry),
        cvc: cardData.cvc,
        status: cardData.status || 'active',
        is_primary: cardData.is_primary || false
      };

      if (editingCard) {
        await axios.put(`${API_ROUTES.WALLETS}${editingCard.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlert({ open: true, severity: 'success', message: 'Card updated successfully!' });
      } else {
        await axios.post(API_ROUTES.WALLETS, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlert({ open: true, severity: 'success', message: 'Card added successfully!' });
      }

      setOpenModal(false);
      fetchWallet();
    } catch (error) {
      console.error('❌ Failed to save card:', error);
      setAlert({ open: true, severity: 'error', message: 'Failed to save card!' });
    }
  };

  const requestCSC = async () => {
    try {
      const card = wallet[selectedCardIndex];
      const response = await axios.post(
        API_ROUTES.WALLETS_SEND_CSC_WHATSAPP(card.id),
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const { csc, message } = response.data;
      if (csc) {
        setCscGenerated(csc);
        setCsc(csc);
      }
      setAlert({ open: true, severity: 'success', message: message || 'CSC sent via WhatsApp!' });
      setCscDialogOpen(true);
    } catch (error) {
      console.error('Failed to request CSC via WhatsApp:', error);
      const errorMsg = error?.response?.data?.error || 'Failed to send CSC via WhatsApp';
      setAlert({ open: true, severity: 'error', message: errorMsg });
    }
  };

  const handleCscVerification = async () => {
    try {
      const card = wallet[selectedCardIndex];
      await axios.post(
        `${API_ROUTES.ORDERS_PAYMENT}`,
        {
          order: orderId,
          wallet: card.id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAlert({ open: true, severity: 'success', message: 'Payment completed!' });
      setCscDialogOpen(false);
      setLocked(true);

      const timeoutDuration =
        !isNaN(Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION)) / 2 ? Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION) / 2 : 1000;

      setTimeout(() => {
        window.location.reload();
      }, timeoutDuration);
    } catch (error) {
      const errMsg = error?.response?.data?.error || 'Erro ao processar pagamento';
      setAlert({ open: true, severity: 'error', message: errMsg });
    }
  };

  const handlePayment = () => {
    const card = wallet[selectedCardIndex];
    if (card?.status?.toLowerCase() !== 'active') return;
    requestCSC();
  };

  if (checkingAuth) return null;

  return (
    <DefaultCardLayout
      subCardTitle="Payment"
      actionbutton={
        locked
          ? {
              label: 'Cancel Payment',
              icon: <DeleteIcon />,
              onClick: cancelOrderPayment,
              disabled: order?.status === 'completed'
            }
          : { label: 'Add Card', icon: <AddIcon />, onClick: handleOpen }
      }
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          '& .swiper-button-prev, & .swiper-button-next': {
            color: '#b39ddb',
            fontWeight: 'bold',
            transition: '0.3s',
            '&:hover': { color: 'secondary.main' },
            '&.swiper-button-disabled': { opacity: 0.3 }
          }
        }}
      >
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          slidesPerView={1}
          onSlideChange={(swiper) => setSelectedCardIndex(swiper.activeIndex)}
          style={{ maxWidth: 400, width: '100%', height: 300 }}
        >
          {wallet.length > 0 ? (
            wallet.map((card) => (
              <SwiperSlide key={card.id}>
                <Fade in timeout={500}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '250px',
                      width: '100%',
                      padding: 1,
                      position: 'relative',
                      flexDirection: 'column',
                      backgroundColor: 'transparent'
                    }}
                  >
                    {card.is_primary && !locked && (
                      <Box sx={{ position: 'absolute', top: 12, left: 65 }}>
                        <Chip label="Primary" size="small" color="success" variant="outlined" />
                      </Box>
                    )}
                    {card.status && !locked && (
                      <Box sx={{ position: 'absolute', top: 15, right: 65 }}>
                        <Tooltip title={card.status.charAt(0).toUpperCase() + card.status.slice(1)} arrow placement="top">
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor:
                                card.status === 'active'
                                  ? 'success.main'
                                  : card.status === 'inactive'
                                    ? 'error.main'
                                    : card.status === 'expired'
                                      ? 'warning.main'
                                      : 'grey.500',
                              cursor: 'pointer'
                            }}
                          />
                        </Tooltip>
                      </Box>
                    )}
                    <Cards number={card.number} name={card.name} expiry={card.formatted_expiry?.replace('/', '')} cvc={card.cvc} />
                    {!locked && (
                      <Box sx={{ position: 'absolute', top: 40, right: 16 }}>
                        <CardActionsMenu
                          onEdit={() => handleEdit(card)}
                          onDelete={() => handleDelete(card.id)}
                          buttonProps={{
                            sx: {
                              bgcolor: 'secondary.light',
                              color: 'secondary.main',
                              '&:hover': {
                                bgcolor: 'secondary.main',
                                color: 'common.white'
                              }
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Fade>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide key="empty">
              <Fade in timeout={500}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '250px',
                    width: '100%',
                    padding: 1,
                    position: 'relative',
                    flexDirection: 'column',
                    backgroundColor: 'transparent'
                  }}
                >
                  <Cards number="0000 0000 0000 0000" name="No Card Found" expiry="--/--" cvc="---" />
                </Box>
              </Fade>
            </SwiperSlide>
          )}
        </Swiper>

        {!locked && wallet.length > 0 && (
          <Box sx={{ mt: 2, width: '60%', display: 'flex', justifyContent: 'center' }}>
            <AnimateButton>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handlePayment}
                disabled={!canMakePayment}
                sx={{
                  bgcolor: 'secondary.light',
                  color: 'secondary.main',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'secondary.main',
                    color: 'common.white'
                  }
                }}
              >
                Make Payment
              </Button>
            </AnimateButton>
          </Box>
        )}

        <OtpModal
          open={cscDialogOpen}
          onClose={() => setCscDialogOpen(false)}
          onConfirm={handleCscVerification}
          code={cscInput}
          setCode={setCscInput}
        />

        <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
          <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
            {alert.message}
          </Alert>
        </Snackbar>

        <PaymentModal open={openModal} onClose={() => setOpenModal(false)} card={cardForm} setCard={setCardForm} onSave={handleSave} />
      </Box>

      <NotificationList csc={cscGenerated} />
    </DefaultCardLayout>
  );
}
