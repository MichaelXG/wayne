import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Box,
  Card,
  Stack,
  Typography,
  Divider,
  TextField,
  Chip,
  CardHeader,
  InputAdornment,
  Rating,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch
} from '@mui/material';
import ImageUpload from '../../ui-component/image/ImageUploader';
import { isDebug } from '../../App';
import CategorySelect from './CategorySelect';
import DynamicModal from '../../ui-component/modal/DynamicModal';

const EditCard = forwardRef(({ product, onSubmit }, ref) => {
  if (isDebug) {
    console.log('🛠️ EditCard received product:', product);
  }

  const { id, title, images = [], category, description, code, sku, quantity, price, rating, is_active } = product || {};

  const methods = useForm({
    defaultValues: {
      title: title || '',
      description: description || '',
      category: category || '',
      code: code || '',
      sku: sku || '',
      quantity: quantity || '',
      price_regular: price?.regular || 0,
      price_sale: price?.sale || 0,
      tax: price?.tax || 0,
      is_active: is_active || false
    }
  });

  const [initialData, setInitialData] = useState({});
  const [noChangesModal, setNoChangesModal] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);

  useEffect(() => {
    const original = {
      title: title || '',
      description: description || '',
      category: category || '',
      code: code || '',
      sku: sku || '',
      quantity: quantity || '',
      price_regular: price?.regular || 0,
      tax: price?.tax || 0,
      is_active: is_active || false
    };
    methods.reset({
      ...original,
      price_sale: price?.sale || 0
    });
    setInitialData(original);
    setCurrentImages(images);
    setOriginalImages(images);
  }, [title, description, category, code, sku, quantity, price?.regular, price?.sale, price?.tax, is_active]);

  const { control, watch, getValues, setValue } = methods;

  const isActive = watch('is_active');
  const priceRegular = watch('price_regular');
  const tax = watch('tax');

  useEffect(() => {
    const regular = parseFloat(priceRegular);
    const taxValue = parseFloat(tax);

    if (!isNaN(regular) && !isNaN(taxValue)) {
      const salePrice = regular + (regular * taxValue) / 100;
      setValue('price_sale', salePrice.toFixed(2));
    }
  }, [priceRegular, tax, setValue]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      const current = getValues();
      const comparableCurrent = { ...current };
      delete comparableCurrent.price_sale;

      const comparableInitial = { ...initialData };

      const formChanged = Object.keys(comparableCurrent).some((key) => String(comparableCurrent[key]) !== String(comparableInitial[key]));

      const getImageURLs = (arr) =>
        arr
          .map((img) => img?.url)
          .filter(Boolean)
          .sort();

      const imagesChanged = JSON.stringify(getImageURLs(originalImages)) !== JSON.stringify(getImageURLs(currentImages));

      const hasChanges = formChanged || imagesChanged;

      if (hasChanges) {
        methods.handleSubmit((formValues) => onSubmit(formValues, currentImages))();
      } else {
        if (isDebug) console.log('🚫 Nenhuma alteração detectada, não será salvo.');
        setNoChangesModal(true);
      }
    },

    isActive: watch('is_active')
  }));

  return (
    <FormProvider {...methods}>
      <Box
        sx={(theme) => ({
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
          backgroundColor: theme.palette.background.default
        })}
      >
        <Box sx={{ width: '100%', maxWidth: 1000 }}>
          {(id || true) && (
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {id && (
                <Chip
                  label={`ID: ${id}`}
                  size="small"
                  sx={(theme) => ({
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    color: theme.palette.common.white,
                    backgroundColor: theme.palette.grey[600],
                    width: 'fit-content'
                  })}
                />
              )}

              <Controller
                name="is_active"
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        sx={(theme) => ({
                          '& .MuiSwitch-thumb': {
                            color: field.value ? theme.palette.success.main : theme.palette.error.main
                          },
                          '& .MuiSwitch-track': {
                            backgroundColor: field.value ? theme.palette.success.light : theme.palette.error.light
                          }
                        })}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={(theme) => ({
                          color: field.value ? theme.palette.success.main : theme.palette.error.main,
                          fontWeight: 'bold'
                        })}
                      >
                        {field.value ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                  />
                )}
              />
            </Box>
          )}

          <Card
            elevation={0}
            sx={(theme) => ({
              mt: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z1 || '0px 2px 4px rgba(145, 158, 171, 0.2)',
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              p: 3
            })}
          >
            <CardHeader
              title="Details"
              subheader="Basic information of the product..."
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ px: 0 }}
            />
            <Divider />

            <Stack spacing={2} mt={2}>
              <Card
                elevation={0}
                sx={(theme) => ({
                  mt: 3,
                  borderRadius: 2,
                  boxShadow: theme.customShadows?.z1 || '0px 2px 4px rgba(145, 158, 171, 0.2)',
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`
                })}
              >
                <CardHeader title="Images" subheader="Image upload" titleTypographyProps={{ variant: 'h6' }} />
                <Divider />
                <ImageUpload initialImages={images} onChange={setCurrentImages} disabled={!isActive} />
              </Card>

              {['title', 'description'].map((fieldName) => (
                <Controller
                  key={fieldName}
                  name={fieldName}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                      fullWidth
                      disabled={!isActive}
                      variant="outlined"
                      multiline={fieldName === 'description'}
                      minRows={fieldName === 'description' ? 4 : undefined}
                      sx={(theme) => ({
                        '& label.Mui-focused': {
                          color: theme.palette.grey[600]
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            transition: 'border-color 0.3s ease'
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.grey[300]
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.grey[600]
                          }
                        }
                      })}
                    />
                  )}
                />
              ))}
            </Stack>
          </Card>

          <Card
            elevation={0}
            sx={(theme) => ({
              mt: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z1 || '0px 2px 4px rgba(145, 158, 171, 0.2)',
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              p: 3,
              display: 'flex',
              flexDirection: 'column'
            })}
          >
            <CardHeader
              title="Properties"
              subheader="Additional functions and attributes..."
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ px: 0 }}
            />
            <Divider />

            <Stack spacing={2} mt={2}>
              {/* Linha: Code e SKU */}
              <Stack direction="row" spacing={2}>
                {['code', 'sku'].map((fieldName) => (
                  <Controller
                    key={fieldName}
                    name={fieldName}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                        fullWidth
                        disabled={!isActive}
                        variant="outlined"
                        sx={(theme) => ({
                          '& label.Mui-focused': {
                            color: theme.palette.grey[600]
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              transition: 'border-color 0.3s ease'
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.grey[300]
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.palette.grey[600]
                            }
                          }
                        })}
                      />
                    )}
                  />
                ))}
              </Stack>
              {/* Linha: Quantity e Category */}
              <Stack direction="row" spacing={2}>
                {/* Quantity com TextField padrão */}
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Quantity"
                      fullWidth
                      disabled={!isActive}
                      variant="outlined"
                      sx={(theme) => ({
                        '& label.Mui-focused': {
                          color: theme.palette.grey[600]
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            transition: 'border-color 0.3s ease'
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.grey[300]
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.grey[600]
                          }
                        }
                      })}
                    />
                  )}
                />

                {/* Category com seletor dinâmico */}
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field, fieldState }) => (
                    <CategorySelect {...field} error={!!fieldState.error} helperText={fieldState.error?.message} disabled={!isActive} />
                  )}
                />
              </Stack>
            </Stack>
          </Card>

          <Card
            elevation={0}
            sx={(theme) => ({
              mt: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z1 || '0px 2px 4px rgba(145, 158, 171, 0.2)',
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`
            })}
          >
            <CardHeader title="Pricing" subheader="Price related inputs" titleTypographyProps={{ variant: 'h6' }} />
            <Divider />

            <Stack spacing={2} sx={{ p: 3 }}>
              {['price_regular', 'price_sale', 'tax'].map((fieldName) => (
                <Controller
                  key={fieldName}
                  name={fieldName}
                  control={control}
                  render={({ field }) => {
                    const label =
                      fieldName === 'tax'
                        ? fieldName.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ' %'
                        : fieldName.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

                    const adornmentSymbol = fieldName === 'tax' ? '%' : '$';

                    const handleBlur = (event) => {
                      const rawValue = parseFloat(event.target.value);
                      field.onChange(isNaN(rawValue) ? '' : rawValue.toFixed(2));
                    };

                    return (
                      <TextField
                        {...field}
                        onBlur={handleBlur}
                        label={label}
                        placeholder="0.00"
                        fullWidth
                        disabled={fieldName === 'price_sale' || !isActive}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">{adornmentSymbol}</InputAdornment>,
                          inputMode: 'decimal',
                          pattern: '[0-9]*\\.?[0-9]*'
                        }}
                        sx={(theme) => ({
                          '& label.Mui-focused': {
                            color: theme.palette.grey[600]
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              transition: 'border-color 0.3s ease'
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.grey[300]
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.palette.grey[600]
                            }
                          }
                        })}
                      />
                    );
                  }}
                />
              ))}
            </Stack>
          </Card>

          <Card
            elevation={0}
            sx={(theme) => ({
              mt: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z1 || '0px 2px 4px rgba(145, 158, 171, 0.2)',
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`
            })}
          >
            <CardHeader title="Rating" subheader="Average rating" titleTypographyProps={{ variant: 'h6' }} />
            <Divider />
            <Box display="flex" justifyContent="center" alignItems="center" gap={1} sx={{ minHeight: 56, py: 1 }}>
              <Stack alignItems="center" spacing={1}>
                <Typography variant="h2">{rating?.rate?.toFixed(1) ?? '0.0'}/5</Typography>
                <Rating value={rating?.rate ?? 0} precision={0.1} readOnly size="large" />
                <Typography
                  variant="caption"
                  sx={(theme) => ({
                    color: theme.palette.text.secondary
                  })}
                >
                  {' '}
                  ({rating?.count ?? 0} reviews)
                </Typography>
              </Stack>
            </Box>
          </Card>
        </Box>
      </Box>

      <DynamicModal
        open={noChangesModal}
        onClose={() => setNoChangesModal(false)}
        onSubmit={() => setNoChangesModal(false)}
        title="No Changes Detected"
        description="You haven’t changed anything. There’s nothing to save."
        type="warning"
        mode="confirm"
        submitLabel="OK"
      />
    </FormProvider>
  );
});

export default EditCard;
