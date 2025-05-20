import React, { useMemo, useState } from 'react';
import { BaseDir, customSvgEditIcon, isDebug } from '../../App';
import { IconShieldX, IconShieldCheck, IconCheck, IconBan } from '@tabler/icons-react';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import DetailPage from './DetailPage';
import { useOrderIDContext } from '../../contexts/OrderIDContext';
import useFetchData from '../../hooks/useFetchData';
import { API_ROUTES } from '../../routes/ApiRoutes';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../ui-component/extended/Breadcrumbs';
import AnimateButton from '../../ui-component/extended/AnimateButton';
import { Stack, Box, Grid, IconButton, Tooltip, useMediaQuery, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from '../../ui-component/cards/MainCard';
import SubCard from '../../ui-component/cards/SubCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { IconClockHour4, IconPackage, IconTruckDelivery } from '@tabler/icons-react';
import axios from 'axios';
import useCancelOrderAndDependencies from '../../hooks/useCancelOrderAndDependencies';
import DynamicModal from '../../ui-component/modal/DynamicModal';
import useOrderLockStatus from '../../hooks/useOrderLockStatus';
import useLocalStorage from '../../hooks/useLocalStorage';
import { statusColors, statusIcons } from '../../utils/statusUtils';

export default function OrderDetail() {
  const [userData] = useLocalStorage('wayne-user-data', {}); // Adicione isso

  isDebug && console.log('OrderDetail renderizado');

  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const checkingAuth = useAuthGuard();
  const { orderId } = useOrderIDContext();

  const { data: order, setData: setOrder } = useFetchData(`${API_ROUTES.ORDERS}${orderId}/`);

  const mainCardTitle = 'Order';
  const backButton = { type: 'link', link: `/orders/list` };

  const { hasPayment, hasShipping, hasDelivery, isCanceled, isCompleted, canEdit } = useOrderLockStatus(orderId);

  const { cancelOrderAndDependencies } = useCancelOrderAndDependencies();
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [showCompleteOrderModal, setShowCompleteOrderModal] = useState(false);
  const [completing, setCompleting] = useState(false);

  const breadcrumbs = useMemo(
    () => [
      { label: 'Dashboard', href: `${BaseDir}/dashboard/default` },
      { label: 'Order', href: `${BaseDir}/orders/list` },
      { label: 'Detail' }
    ],
    []
  );

  const handleMarkAsCompletedConfirm = async () => {
    setCompleting(true);
    try {
      const response = await axios.patch(
        `${API_ROUTES.ORDERS}${orderId}/`,
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${userData?.authToken}`
          }
        }
      );
      setOrder(response.data);

      const timeoutDuration =
        !isNaN(Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION)) / 2 ? Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION) / 2 : 1000;

      setTimeout(() => {
        window.location.reload();
      }, timeoutDuration);
    } catch (error) {
      console.error('❌ Failed to mark order as completed:', error);
      alert('Failed to complete order. Make sure payment and delivery are properly set.');
    } finally {
      setCompleting(false);
      setShowCompleteOrderModal(false);
    }
  };

  const handleCancelAll = async () => {
    setCanceling(true);
    try {
      await cancelOrderAndDependencies(orderId);

      const timeoutDuration =
        !isNaN(Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION)) / 2 ? Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION) / 2 : 1000;

      setTimeout(() => {
        window.location.reload();
      }, timeoutDuration);
    } finally {
      setCanceling(false);
      setShowCancelOrderModal(false);
    }
  };

  const actionCompleted = useMemo(() => {
    if (!isCanceled && !isCompleted && hasPayment && hasShipping && hasDelivery) {
      return {
        label: 'Mark as Completed',
        icon: <IconCheck size={20} />,
        onClick: () => setShowCompleteOrderModal(true)
      };
    }
    return null;
  }, [isCanceled, isCompleted, hasPayment, hasShipping, hasDelivery]);

  const actionCanceled = useMemo(() => {
    if (!isCanceled && (canEdit || hasShipping || hasDelivery)) {
      return {
        label: 'Cancel Order',
        icon: <IconBan size={20} />,
        onClick: () => setShowCancelOrderModal(true)
      };
    }
    return null;
  }, [isCanceled, canEdit, hasShipping, hasDelivery]);

  const actionbutton = useMemo(
    () => ({
      label: 'Edit',
      href: '#', // ou remova essa linha se não for necessário
      icon: customSvgEditIcon,
      disabled: true // 🔒 Permanentemente desabilitado
    }),
    [] // sem dependências, já que está sempre desabilitado
  );

  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : null;

  const orderCode = order?.code || '0000';
  const orderStatus = order?.status || 'pending';

  const authIcon = checkingAuth ? (
    <Tooltip
      title="User authenticated"
      placement="top"
      componentsProps={{
        tooltip: {
          sx: (theme) => ({
            backgroundColor: theme.palette.success.main,
            color: theme.palette.common.white,
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            boxShadow: theme.shadows[2]
          })
        }
      }}
    >
      <IconShieldCheck color={theme.palette.success.main} size={20} />{' '}
    </Tooltip>
  ) : (
    <Tooltip
      title="Authentication failed"
      placement="top"
      componentsProps={{
        tooltip: {
          sx: (theme) => ({
            backgroundColor: theme.palette.error.main,
            color: theme.palette.common.white,
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            boxShadow: theme.shadows[2]
          })
        }
      }}
    >
      <IconShieldX color={theme.palette.error.main} size={20} />
    </Tooltip>
  );

  const renderBackButton = () => {
    const iconButtonStyles = (theme) => ({
      mt: 1,
      mb: 2,
      width: 24,
      height: 24,
      padding: '3px',
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[600],
      borderRadius: '50%',
      '&:hover': {
        backgroundColor: theme.palette.grey[600],
        color: theme.palette.common.white
      }
    });

    const handleBackClick = () => {
      if (backButton?.type === 'link' && backButton.link) {
        navigate(backButton.link);
      } else {
        navigate('/dashboard/default');
      }
    };

    return (
      <Tooltip
        title="Go Back"
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: theme.palette.grey[600],
              color: theme.palette.common.white,
              fontSize: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              boxShadow: theme.shadows[2]
            }
          }
        }}
      >
        <IconButton onClick={handleBackClick} sx={iconButtonStyles}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  };

  if (checkingAuth) return null;

  return (
    <MainCard
      title={mainCardTitle}
      secondary={
        <Box display="flex" alignItems="center" gap={1}>
          {authIcon}
        </Box>
      }
    >
      <Grid item xs={12} sx={{ width: '100%', margin: 0 }}>
        <SubCard
          title={
            <Box sx={{ width: '100%' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Stack spacing={0.5} direction="column">
                  <Box display="flex" alignItems="center" gap={1}>
                    {renderBackButton()}
                    <Typography
                      variant={downMD ? 'h4' : 'h3'}
                      sx={(theme) => ({
                        color: theme.palette.grey[600],
                        fontWeight: 600
                      })}
                    >
                      #{orderCode}
                    </Typography>
                    <Chip
                      label={orderStatus}
                      icon={statusIcons[orderStatus] || null}
                      color={statusColors[orderStatus] || 'default'}
                      size="small"
                      sx={{ fontWeight: 500, textTransform: 'capitalize', px: 1.2, height: 28 }}
                    />
                  </Box>
                  {orderDate && (
                    <Typography
                      variant="body2"
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                        fontSize: theme.typography.body2.fontSize,
                        lineHeight: theme.typography.body2.lineHeight
                      })}
                    >
                      {orderDate}
                    </Typography>
                  )}
                </Stack>

                <Box display="flex" gap={1}>
                  {actionCompleted && (
                    <AnimateButton>
                      <Tooltip
                        title={actionCompleted.label || 'Completed'}
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: (theme) => ({
                              backgroundColor: theme.palette.success.main,
                              color: theme.palette.common.white,
                              fontSize: 12,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              boxShadow: theme.shadows[2]
                            })
                          }
                        }}
                      >
                        <IconButton
                          onClick={actionCompleted.onClick}
                          sx={(theme) => ({
                            color: theme.palette.success.main,
                            backgroundColor: theme.palette.success.light,
                            '&:hover': {
                              backgroundColor: theme.palette.success.main,
                              color: theme.palette.common.white
                            }
                          })}
                        >
                          {actionCompleted.icon}
                        </IconButton>
                      </Tooltip>
                    </AnimateButton>
                  )}

                  {actionCanceled && (
                    <AnimateButton>
                      <Tooltip
                        title={actionCanceled.label || 'Cancel'}
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: (theme) => ({
                              backgroundColor: theme.palette.error.main,
                              color: theme.palette.common.white,
                              fontSize: 12,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              boxShadow: theme.shadows[2]
                            })
                          }
                        }}
                      >
                        <IconButton
                          onClick={actionCanceled.onClick}
                          sx={(theme) => ({
                            color: theme.palette.error.main,
                            backgroundColor: theme.palette.error.light,
                            '&:hover': {
                              backgroundColor: theme.palette.error.main,
                              color: theme.palette.common.white
                            }
                          })}
                        >
                          {actionCanceled.icon}
                        </IconButton>
                      </Tooltip>
                    </AnimateButton>
                  )}

                  {actionbutton && (
                    <AnimateButton>
                      <Tooltip
                        title={actionbutton.label || 'Edit'}
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: (theme) => ({
                              backgroundColor: theme.palette.grey[600],
                              color: theme.palette.common.white,
                              fontSize: 12,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              boxShadow: theme.shadows[2]
                            })
                          }
                        }}
                      >
                        <IconButton
                          disabled={actionbutton.disabled ?? false}
                          color={actionbutton.color || theme.palette.grey[600]}
                          size="medium"
                          href={actionbutton.href}
                          onClick={actionbutton.onClick}
                          type={actionbutton.type || 'button'}
                          sx={(theme) => ({
                            backgroundColor: theme.palette.grey[300],
                            '&:hover': {
                              backgroundColor: theme.palette.grey[600],
                              color: theme.palette.common.white
                            }
                          })}
                        >
                          {actionbutton.icon}
                        </IconButton>
                      </Tooltip>
                    </AnimateButton>
                  )}
                </Box>
              </Box>

              {breadcrumbs?.length > 0 && (
                <Box mt={1}>
                  <Breadcrumbs>
                    {breadcrumbs.map((item, index) =>
                      item.href ? (
                        <Typography
                          key={index}
                          component="a"
                          href={item.href}
                          variant="body2"
                          fontWeight={500}
                          sx={(theme) => ({
                            color: theme.palette.grey[600],
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          })}
                        >
                          {item.label}
                        </Typography>
                      ) : (
                        <Typography
                          key={index}
                          variant="body2"
                          fontWeight={500}
                          sx={(theme) => ({
                            color: theme.palette.text.primary
                          })}
                        >
                          {item.label}
                        </Typography>
                      )
                    )}
                  </Breadcrumbs>
                </Box>
              )}
            </Box>
          }
        >
          <Grid item xs={12} sx={{ width: '100%', margin: 0 }} container>
            <DetailPage />
          </Grid>
        </SubCard>
      </Grid>

      <DynamicModal
        open={showCancelOrderModal}
        onClose={() => setShowCancelOrderModal(false)}
        onSubmit={handleCancelAll}
        title="Cancel entire order?"
        description="Are you sure you want to cancel this order and all its related data (payment, shipping, delivery)?"
        type="warning"
        mode="confirm"
        submitLabel={canceling ? 'Cancelling...' : 'Confirm'}
        loading={canceling}
      />

      <DynamicModal
        open={showCompleteOrderModal}
        onClose={() => setShowCompleteOrderModal(false)}
        onSubmit={handleMarkAsCompletedConfirm}
        title="Mark order as completed?"
        description="Are you sure you want to mark this order as completed? This action cannot be undone."
        type="success"
        mode="confirm"
        submitLabel={completing ? 'Completing...' : 'Confirm'}
        loading={completing}
      />
    </MainCard>
  );
}
