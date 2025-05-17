import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Avatar,
  Box,
  Grid,
  IconButton,
  InputBase,
  Stack
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DefaultMinimalLayout from '../../layout/DefaultMinimalLayout';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import useProductData from '../../hooks/useProductData';

export default function StoredOrderEditModal({ open, onClose, item, onSave }) {
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(0);
  const checkingAuth = useAuthGuard();

  // Protege o hook de execução quando item é null
  const { data: product, loading } = useProductData(item?.id);
  const image = product?.images?.[0]?.url || product?.images?.image || item?.image || '';

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity || 1);
      setStock(item.stock || 0);
    }
  }, [item]);

  const handleSave = useCallback(() => {
    const qty = Number(quantity);
    if (isNaN(qty)) return;
    if (qty <= 0) {
      onSave(null);
    } else {
      onSave({ ...item, quantity: qty });
    }
  }, [quantity, item, onSave]);

  const actionbutton = useMemo(
    () => ({
      label: 'Save',
      icon: <CheckIcon />,
      onClick: handleSave,
      disabled: quantity === item?.quantity
    }),
    [handleSave, quantity, item?.quantity]
  );

  const actionClose = useMemo(
    () => ({
      label: 'Cancel',
      icon: <CloseRoundedIcon />,
      onClick: onClose
    }),
    [onClose]
  );

  if (!item) return null;

  const handleIncrease = () => {
    if (quantity < stock) setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <DefaultMinimalLayout
          mainCardTitle="Update Product"
          subCardTitle="Modify order quantity"
          actionbutton={actionbutton}
          actionClose={actionClose}
          checkingAuth={!checkingAuth}
        >
          <Grid container spacing={2} alignItems="flex-start" mt={1}>
            <Grid item xs={12} md={8}>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Avatar
                  alt={item.title}
                  src={image}
                  variant="rounded"
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#f9f9f9',
                    objectFit: 'contain'
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" noWrap>
                    <Box component="span" fontWeight="bold">
                      SKU:
                    </Box>{' '}
                    {item.skuCode || item.sku || '—'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Quantity
                </Typography>

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    border: '1px solid rgba(145, 158, 171, 0.2)',
                    borderRadius: '8px',
                    px: 1,
                    py: 0.5,
                    backgroundColor: '#fff'
                  }}
                >
                  <IconButton onClick={handleDecrease} size="small" disabled={quantity <= 0}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <InputBase
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(stock, Number(e.target.value)));
                      setQuantity(val);
                    }}
                    inputProps={{
                      min: 0,
                      max: stock,
                      style: {
                        width: 40,
                        textAlign: 'center',
                        fontWeight: 600
                      }
                    }}
                    sx={{ mx: 1 }}
                  />

                  <IconButton onClick={handleIncrease} size="small" disabled={quantity >= stock}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box width="100%" textAlign="right">
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Available: {stock - quantity} of {stock}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </DefaultMinimalLayout>
      </DialogContent>
    </Dialog>
  );
}
