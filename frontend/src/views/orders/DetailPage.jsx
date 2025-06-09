import React, { useEffect, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';

import { API_ROUTES } from '../../routes/ApiRoutes';
import { useOrderIDContext } from '../../contexts/OrderIDContext';
import DataLoaderWrapper from '../../ui-component/dataGrid/DataLoaderWrapper';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import { isDebug } from '../../App';
import DetailItem from './detail/DetailItem';
import DetailCustomer from './detail/Customer';
import Payment from './detail/Payment';
import Delivery from './detail/Delivery';
import Shipping from './detail/Shipping';
import History from './detail/History';
import { useTheme } from '@mui/material/styles';

export default function DetailPage() {
  const theme = useTheme();
  const { id } = useParams();
  const orderId = id ? Number(id) : 1;

  const { setOrderId } = useOrderIDContext();

  useEffect(() => {
    if (orderId) setOrderId(orderId);
  }, [orderId, setOrderId]);

  console.log('📦 [DetailPage] orderId:', orderId);

  const endpoint = useMemo(() => `${API_ROUTES.ORDERS}${orderId}/`, [orderId]);

  isDebug && console.log('📦 [DetailPage] endpoint:', endpoint);

  const emptyMessage = {
    type: 'notFound',
    title: 'Order not found',
    description: 'We could not find the order you are looking for.'
  };

  const errorMessage = {
    type: 'error',
    title: 'Something went wrong',
    description: 'Failed to fetch order data. Please try again later.'
  };

  return (
    <DataLoaderWrapper endpoint={endpoint} emptyMessage={emptyMessage}>
      {(order, loading, error) => {
        if (isDebug) {
          console.log('%c📦 [DetailPage] Loaded order:', 'color: #00A76F; font-weight: bold;', order);
          if (loading) console.log('%c⏳ Loading...', 'color: #FFA726;');
          if (error) console.log('%c❌ Error fetching order', 'color: #FF5630;', error);
        }

        return error ? (
          <IllustrationMessage type={errorMessage.type} customTitle={errorMessage.title} customDescription={errorMessage.description} />
        ) : !order ? (
          <IllustrationMessage type={emptyMessage.type} customTitle={emptyMessage.title} customDescription={emptyMessage.description} />
        ) : (
          <Box
            sx={(theme) => ({
              px: 2,
              py: 3,
              height: '100%',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              boxSizing: 'border-box',
              maxWidth: '1500px',
              width: '100%',
              margin: '0 auto',
              fontFamily: theme.typography.fontFamily, // usa a fonte padrão do tema (ex: Roboto)
              fontSize: '0.875rem',
              fontWeight: 400,
              lineHeight: '1.334em',
              color: theme.palette.text.primary, // substitui '#364152'
              WebkitFontSmoothing: 'antialiased',
              WebkitTextSizeAdjust: '100%',
              WebkitTapHighlightColor: 'transparent',
              backgroundColor: theme.palette.background.default // modo claro/escuro compatível
            })}
          >
            <Grid container spacing={2} alignItems="flex-start" justifyContent="space-between">
              {/* Coluna 1 - Itens do pedido */}
              <Grid item xs={12} md={7} container spacing={1} direction="column">
                <DetailItem />

                <History />
              </Grid>

              {/* Coluna 2 - Dados do cliente + pagamento */}
              <Grid item xs={12} md={5} container spacing={1} direction="column">
                <Grid item>
                  <DetailCustomer />
                </Grid>

                <Grid item>
                  <Shipping onSelectAddress={(address) => console.log('Selecionado:', address)} />
                </Grid>

                <Grid item>
                  <Delivery onSelectCarrier={(carrier) => console.log('Selecionado:', carrier)} />
                </Grid>

                <Grid item>
                  <Payment />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      }}
    </DataLoaderWrapper>
  );
}
