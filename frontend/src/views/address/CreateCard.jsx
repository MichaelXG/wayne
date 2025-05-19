import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Divider,
  TextField,
  Grid,
  CardHeader,
  FormControlLabel,
  Switch
} from '@mui/material';

const fetchAddress = async (cep, setValue) => {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (!data.erro) {
      setValue('street', data.logradouro || '');
      setValue('neighborhood', data.bairro || '');
      setValue('city', data.localidade || '');
      setValue('state', data.uf || '');
      setValue('country', 'Brazil');
    }
  } catch (error) {
    console.error('❌ Error fetching address:', error);
  }
};

const CreateCard = forwardRef(({ initialData = {}, onSubmit }, ref) => {
  const { id, ...rest } = initialData;

  const methods = useForm({
    defaultValues: {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Brazil',
      complement: '',
      reference: '',
      is_active: true,
      is_default: false,
      ...rest
    }
  });

  const { control, setValue, watch, handleSubmit, reset } = methods;
  const postalCodeValue = watch('postal_code');

  useEffect(() => {
    const raw = postalCodeValue?.replace(/\D/g, '');
    if (raw?.length === 8) {
      fetchAddress(raw, setValue);
    }
  }, [postalCodeValue, setValue]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit((formData) => {
        if (onSubmit) onSubmit(formData);
      })();
    },
    resetForm: () => {
      reset();
    }
  }));

  return (
    <FormProvider {...methods}>
      <Box
        sx={(theme) => ({
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          px: 4,
          py: 6,
          backgroundColor: theme.palette.background.default
        })}
      >
        <Box sx={{ width: '100%', maxWidth: 1000 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {id && (
              <Chip
                label={`ID: ${id}`}
                size="small"
                sx={(theme) => ({
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: theme.palette.common.white,
                  backgroundColor: theme.palette.primary.main
                })}
              />
            )}

            <Stack direction="row" gap={2}>
              <Controller
                name="is_default"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        sx={(theme) => ({
                          '& .MuiSwitch-thumb': {
                            color: field.value ? theme.palette.primary.main : theme.palette.grey[300]
                          },
                          '& .MuiSwitch-track': {
                            backgroundColor: field.value ? theme.palette.primary.light : theme.palette.grey[300]
                          }
                        })}
                      />
                    }
                    label={
                      <Typography
                        fontWeight="bold"
                        sx={(theme) => ({
                          color: field.value ? theme.palette.primary.main : theme.palette.text.secondary
                        })}
                      >
                        {' '}
                        {field.value ? 'Default' : 'Not Default'}
                      </Typography>
                    }
                  />
                )}
              />
              <Controller
                name="is_active"
                control={control}
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
                        fontWeight="bold"
                        sx={(theme) => ({
                          color: field.value ? theme.palette.success.main : theme.palette.error.main
                        })}
                      >
                        {' '}
                        {field.value ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                  />
                )}
              />
            </Stack>
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
            <CardHeader title="Details" subheader="Basic address information" titleTypographyProps={{ variant: 'h6' }} sx={{ px: 0 }} />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="postal_code"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Postal Code"
                          fullWidth
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 8) value = value.slice(0, 8);
                            field.onChange(value.replace(/^(\d{5})(\d{0,3})/, '$1-$2'));
                          }}
                          inputProps={{ maxLength: 9, inputMode: 'numeric' }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={10}>
                    <Controller name="street" control={control} render={({ field }) => <TextField {...field} label="Street" fullWidth />} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller name="number" control={control} render={({ field }) => <TextField {...field} label="Number" fullWidth />} />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      name="complement"
                      control={control}
                      render={({ field }) => <TextField {...field} label="Complement" fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="neighborhood"
                      control={control}
                      render={({ field }) => <TextField {...field} label="Neighborhood" fullWidth />}
                    />
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <Controller name="city" control={control} render={({ field }) => <TextField {...field} label="City" fullWidth />} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller name="state" control={control} render={({ field }) => <TextField {...field} label="State" fullWidth />} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => <TextField {...field} label="Country" fullWidth />}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="reference"
                      control={control}
                      render={({ field }) => <TextField {...field} label="Reference" fullWidth />}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </FormProvider>
  );
});

export default CreateCard;
