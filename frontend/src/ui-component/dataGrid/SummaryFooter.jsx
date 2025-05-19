import React, { useMemo, useState } from 'react';
import { Box, Paper, Typography, Divider, IconButton, Grid, Tooltip } from '@mui/material';
import {
  LocalMall as LocalMallIcon,
  Inventory2 as InventoryIcon,
  AttachMoney as MoneyIcon,
  Insights as InsightsIcon,
  TrendingUp as UpIcon,
  TrendingDown as DownIcon,
  Discount as DiscountIcon,
  LocalShipping as ShippingIcon,
  ReceiptLong as TaxIcon,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import AnimateButton from '../../ui-component/extended/AnimateButton';
import Decimal from 'decimal.js';
import { useTheme } from '@mui/material/styles';

export default function SummaryFooter({ data = [] }) {
  const theme = useTheme();
  const [showSummary, setShowSummary] = useState(true);

  const summary = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);
    const totalProducts = data.length;
    const averagePrice = totalItems > 0 ? total / totalItems : 0;
    const mostExpensive = Math.max(...data.map((item) => item.price || 0));
    const cheapest = Math.min(...data.map((item) => item.price || 0));
    const estimatedDiscount = data
      .filter((item) => item.price > 500)
      .reduce((sum, item) => sum + item.price * item.quantity * Decimal('0.1'), 0);
    const shippingFee = total > 500 ? 0 : 15;
    const estimatedTax = total * Decimal(0.08);
    const grandTotal = total + estimatedTax + shippingFee - estimatedDiscount;

    return {
      total,
      totalItems,
      totalProducts,
      averagePrice,
      mostExpensive,
      cheapest,
      estimatedDiscount,
      shippingFee,
      estimatedTax,
      grandTotal
    };
  }, [data]);

  if (!data.length) return null;

  return (
    <Paper
      elevation={3}
      sx={{ p: 2, mt: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Order Summary
        </Typography>
        {/* Botão para mostrar/ocultar resumo */}

        <AnimateButton>
          <Tooltip
            title={showSummary ? 'Hide' : 'Display'}
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
              color="secondary"
              size="medium"
              onClick={() => setShowSummary((prev) => !prev)}
              sx={{
                backgroundColor: theme.palette.grey[300],
                '&:hover': {
                  backgroundColor: theme.palette.grey[600],
                  color: theme.palette.common.white
                }
              }}
            >
              {showSummary ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Tooltip>
        </AnimateButton>
      </Box>

      {showSummary && (
        <Grid container spacing={2}>
          {/* Coluna 1 */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Totals
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body2">
              <InventoryIcon fontSize="small" color="primary" /> Products: <strong>{summary.totalProducts}</strong>
            </Typography>
            <Typography variant="body2">
              <LocalMallIcon fontSize="small" color="primary" /> Items: <strong>{summary.totalItems}</strong>
            </Typography>
            <Typography variant="body2">
              <InsightsIcon fontSize="small" color="info" /> Average price: <strong>${summary.averagePrice.toFixed(2)}</strong>
            </Typography>
            <Typography variant="body2">
              <MoneyIcon fontSize="small" color="success" /> Sub. Total: <strong>${summary.total.toFixed(2)}</strong>
            </Typography>
          </Grid>

          {/* Coluna 2 */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Estimates
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2">
                <UpIcon fontSize="small" color="error" /> More expensive: <strong>${summary.mostExpensive.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2">
                <DownIcon fontSize="small" color="warning" /> Cheaper: <strong>${summary.cheapest.toFixed(2)}</strong>
              </Typography>
            </Box>
            <Typography variant="body2">
              <DiscountIcon fontSize="small" color="secondary" /> Discount: <strong>${summary.estimatedDiscount.toFixed(2)}</strong>
            </Typography>

            <Typography variant="body2">
              <ShippingIcon fontSize="small" color="primary" /> ShippingFee: <strong>${summary.shippingFee.toFixed(2)}</strong>
            </Typography>
            <Typography variant="body2">
              <TaxIcon fontSize="small" color="info" /> Tax: <strong>${summary.estimatedTax.toFixed(2)}</strong>
            </Typography>
          </Grid>
        </Grid>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Total Final (sempre visível) */}
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <Typography variant="h4" fontWeight={600}>
          Total:{' '}
          <Box component="span" color="primary.main">
            ${summary.grandTotal.toFixed(2)}
          </Box>
        </Typography>
      </Box>
    </Paper>
  );
}
