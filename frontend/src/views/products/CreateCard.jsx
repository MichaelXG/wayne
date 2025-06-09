import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Box,
  Card,
  Stack,
  Typography,
  Divider,
  TextField,
  CardHeader,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch
} from '@mui/material';
import ImageUpload from '../../ui-component/image/ImageUploader';
import CategorySelect from './CategorySelect';

const CreateCard = forwardRef(({ onSubmit }, ref) => {
  const methods = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      quantity: 0,
      price_regular: 0,
      price_sale: 0,
      tax: 0,
      images: [],
      is_active: true
    }
  });

  const [currentImages, setCurrentImages] = useState([]);
  const { control, watch, setValue, reset } = methods;

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
      methods.handleSubmit((formData) => onSubmit(formData, currentImages))();
    },
    resetForm: () => {
      reset();
      setCurrentImages([]);
    }
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
        {' '}
        <Box sx={{ width: '100%', maxWidth: 1000 }}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'end'
            }}
          >
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
                  border: `1px solid ${theme.palette.divider}`,
                  p: 3
                })}
              >
                <CardHeader title="Images" subheader="Image upload" titleTypographyProps={{ variant: 'h6' }} />
                <Divider />
                <ImageUpload
                  initialImages={[]}
                  value={currentImages} // ✅ controla visualmente as imagens
                  onChange={setCurrentImages}
                />
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
              <Stack direction="row" spacing={2}>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Quantity"
                      fullWidth
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
                <Controller name="category" control={control} render={({ field }) => <CategorySelect {...field} />} />
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
        </Box>
      </Box>
    </FormProvider>
  );
});

export default CreateCard;
