import React, { useMemo, useState } from 'react';
import { Box, Dialog, Typography, Chip, Grid, FormControl, Stack } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import CheckIcon from '@mui/icons-material/Check';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DefaultMinimalLayout from '../../../layout/DefaultMinimalLayout';
import AddressBlock from '../../address/AddressBlock';
import { useTheme } from '@mui/material/styles';

export default function ShippingModal({ open, onClose, addresses = [], selectedAddressId, onSelect, onConfirm }) {
  const theme = useTheme();
  const checkingAuth = useAuthGuard();
  const [localSelectedId, setLocalSelectedId] = useState(selectedAddressId);

  const handleSelect = (address) => {
    setLocalSelectedId(address.id);
    onSelect?.(address);
  };

  const handleSave = () => {
    const selected = addresses.find((c) => c.id === localSelectedId);
    if (selected) {
      onConfirm?.(selected);
    }
  };

  const actionbutton = {
    label: 'Save',
    icon: <CheckIcon />,
    onClick: handleSave,
    disabled: !localSelectedId
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
        mainCardTitle="Shipping"
        subCardTitle={selectedAddressId ? 'Edit Address' : 'Add Address'}
        actionbutton={actionbutton}
        actionClose={actionClose}
        checkingAuth={!checkingAuth}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControl sx={{ flex: 1 }}>
                {addresses.length > 0 ? (
                  <Box
                    sx={{
                      padding: 2,
                      position: 'relative',
                      overflow: 'visible',
                      zIndex: 10,
                      '.swiper-button-prev': { left: '-1px' },
                      '.swiper-button-next': { right: '-1px' }
                    }}
                  >
                    <Swiper modules={[Navigation]} navigation spaceBetween={8} slidesPerView={1} style={{ padding: 2, width: '100%' }}>
                      {addresses.map((address) => (
                        <SwiperSlide key={address.id}>
                          <Box
                            onClick={() => handleSelect(address)}
                            sx={(theme) => ({
                              border: localSelectedId === address.id ? `2px solid ${theme.palette.grey[600]}` : '1px solid',
                              borderColor: localSelectedId === address.id ? theme.palette.grey[600] : theme.palette.divider,
                              borderRadius: 2,
                              boxShadow: localSelectedId === address.id ? 4 : 1,
                              p: 2,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                borderColor: theme.palette.grey[600],
                                boxShadow: 4
                              },
                              m: 2,
                              mr: 3,
                              ml: 3
                            })}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Stack direction="row" spacing={1}>
                                {address.is_default && <Chip label="Default" size="small" color="primary" />}
                                <Chip
                                  label={address.is_active ? 'Active' : 'Inactive'}
                                  size="small"
                                  sx={(theme) => ({
                                    color: address.is_active ? theme.palette.success.main : theme.palette.error.main,
                                    borderColor: address.is_active ? theme.palette.success.main : theme.palette.error.main,
                                    borderStyle: 'solid',
                                    borderWidth: 1,
                                    bgcolor: 'transparent'
                                  })}
                                />
                              </Stack>
                            </Box>
                            <AddressBlock address={address} />
                          </Box>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Box>
                ) : (
                  <Typography color="text.secondary" textAlign="center" py={4}>
                    No addresses available.
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
