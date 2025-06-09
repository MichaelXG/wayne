import React, { useMemo, useState } from 'react';
import { Box, Dialog, Typography, Chip, Grid, FormControl, Stack } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import CheckIcon from '@mui/icons-material/Check';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DefaultMinimalLayout from '../../../layout/DefaultMinimalLayout';
import { useTheme } from '@mui/material/styles';

export default function DeliveryModal({ open, onClose, carriers = [], selectedCarrierId, onSelect, onConfirm }) {
  const theme = useTheme();
  const checkingAuth = useAuthGuard();
  const [localSelectedId, setLocalSelectedId] = useState(selectedCarrierId);

  const handleSelect = (carrier) => {
    setLocalSelectedId(carrier.id);
    onSelect?.(carrier);
  };

  const handleSave = () => {
    const selected = carriers.find((c) => c.id === localSelectedId);
    if (selected) {
      onConfirm?.(selected);
    }
  };

  const actionbutton = {
    label: 'Save',
    icon: <CheckIcon />,
    onClick: handleSave,
    disabled: !localSelectedId,
    permission: { menu: 'orders', action: 'can_update' },
  };

  const actionClose = useMemo(
    () => ({
      label: 'Cancel',
      icon: <CloseRoundedIcon />,
      onClick: onClose
    }),
    [onClose]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DefaultMinimalLayout
        mainCardTitle="Delivery"
        subCardTitle={selectedCarrierId ? 'Edit Carrier' : 'Add Carrier'}
        actionbutton={actionbutton}
        actionClose={actionClose}
        checkingAuth={!checkingAuth}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControl
                sx={(theme) => ({
                  flex: 1,
                  // mr: 2,
                  '& label.Mui-focused': { color: theme.palette.grey[600] },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.grey[600]
                  }
                })}
              >
                {carriers.length > 0 ? (
                  <Box
                    sx={{
                      padding: 2,
                      position: 'relative', // necessário para alinhar corretamente
                      overflow: 'visible', // permite os botões ultrapassarem os limites do swiper
                      zIndex: 10, // traz para frente
                      '.swiper-button-prev': {
                        left: '-1px' // mova mais para fora/dentro conforme desejar
                      },
                      '.swiper-button-next': {
                        right: '-1px' // idem
                      }
                    }}
                  >
                    <Swiper modules={[Navigation]} navigation spaceBetween={8} slidesPerView={1} style={{ padding: 2, width: '100%' }}>
                      {carriers.map((carrier) => (
                        <SwiperSlide key={carrier.id}>
                          <Box
                            onClick={() => handleSelect(carrier)}
                            sx={(theme) => ({
                              border: localSelectedId === carrier.id ? `2px solid ${theme.palette.grey[600]}` : '1px solid',
                              borderColor: localSelectedId === carrier.id ? theme.palette.grey[600] : theme.palette.divider,
                              borderRadius: 2,
                              boxShadow: localSelectedId === carrier.id ? 4 : 1,
                              p: 1,
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                borderColor: theme.palette.grey[600],
                                boxShadow: 4
                              },
                              margin: '30px'
                            })}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="h6">{carrier.name}</Typography>
                              <Stack direction="row" spacing={1}>
                                {carrier.is_default && (
                                  <Chip
                                    label="Default"
                                    size="small"
                                    color="primary"
                                    sx={(theme) => ({
                                      fontWeight: theme.typography.fontWeightBold,
                                      bgcolor: theme.palette.primary.main,
                                      color: theme.palette.common.white
                                    })}
                                  />
                                )}

                                <Chip
                                  label={carrier.is_active ? 'Active' : 'Inactive'}
                                  size="small"
                                  color={carrier.is_active ? 'success' : 'error'}
                                  sx={(theme) => ({
                                    fontWeight: theme.typography.fontWeightBold,
                                    bgcolor: theme.palette[carrier.is_active ? 'success' : 'error'].dark,
                                    color: theme.palette.common.white
                                  })}
                                />
                              </Stack>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Prefix: <strong>{carrier.prefix || 'N/A'}</strong>
                            </Typography>
                          </Box>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Box>
                ) : (
                  <Typography color="text.secondary" textAlign="center" py={4}>
                    No carriers available.
                  </Typography>
                )}
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </DefaultMinimalLayout>
    </Dialog>
  );
}
