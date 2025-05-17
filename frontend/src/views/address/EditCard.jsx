import React, {
  forwardRef,
  useImperativeHandle, 
  useEffect,
  useState
} from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Box, Card, CardContent, CardHeader, FormControlLabel, Grid, Stack, Switch, TextField, Divider, Typography } from '@mui/material';

import { Chip } from '@mui/material';
import DynamicModal from '../../ui-component/modal/DynamicModal';

const EditCard = forwardRef(({ address, onSubmit }, ref) => {
  const {
    id,
    street = '',
    number = '',
    neighborhood = '',
    city = '',
    state = '',
    postal_code = '',
    country = 'Brazil',
    complement = '',
    reference = '',
    is_active = false,
    is_default = false
  } = address || {};

  const methods = useForm({
    defaultValues: {
      street,
      number,
      neighborhood,
      city,
      state,
      postal_code,
      country,
      complement,
      reference,
      is_active,
      is_default
    }
  });

  const [initialData, setInitialData] = useState({});
  const [noChangesModal, setNoChangesModal] = useState(false);
  const { control, watch, getValues, reset, setValue } = methods;

  const isActive = watch('is_active');
  const postalCodeValue = watch('postal_code');

  // Optionally fetch ViaCEP (you can enable this if needed)
  useEffect(() => {
    const raw = postalCodeValue?.replace(/\D/g, '');
    if (raw?.length === 8) {
      fetch(`https://viacep.com.br/ws/${raw}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setValue('street', data.logradouro || '');
            setValue('neighborhood', data.bairro || '');
            setValue('city', data.localidade || '');
            setValue('state', data.uf || '');
            setValue('country', 'Brazil');
          }
        });
    }
  }, [postalCodeValue, setValue]);

  useEffect(() => {
    const original = {
      street,
      number,
      neighborhood,
      city,
      state,
      postal_code,
      country,
      complement,
      reference,
      is_active,
      is_default
    };
    reset(original);
    setInitialData(original);
  }, [address]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      const current = getValues();
      const hasChanges = Object.keys(current).some((key) => String(current[key] ?? '') !== String(initialData[key] ?? ''));

      if (hasChanges) {
        methods.handleSubmit((formValues) => onSubmit(formValues))();
      } else {
        isDebug && console.log('🚫 No changes detected');
        setNoChangesModal(true);
      }
    }
  }));

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', px: 4, py: 6, backgroundColor: 'background.default' }}>
        <Box sx={{ width: '100%', maxWidth: 1000 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {id && (
              <Chip
                label={`ID: ${id}`}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#FFFFFF',
                  backgroundColor: '#8E33FF'
                }}
              />
            )}
            <Stack direction="row" gap={2}>
              <Controller
                name="is_default"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
                    label={<Typography fontWeight="bold">{field.value ? 'Default' : 'Not Default'}</Typography>}
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
                        sx={{
                          '& .MuiSwitch-thumb': { color: field.value ? 'success.main' : 'error.main' },
                          '& .MuiSwitch-track': { backgroundColor: field.value ? 'success.light' : 'error.light' }
                        }}
                      />
                    }
                    label={
                      <Typography fontWeight="bold" color={field.value ? 'success.main' : 'error.main'}>
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
            sx={{ mt: 3, borderRadius: 2, boxShadow: 'rgba(145, 158, 171, 0.2)', bgcolor: '#FFFFFF', border: '1px solid #DFE3E8', p: 3 }}
          >
            {' '}
            <CardHeader title="Details" subheader="Update the address info" titleTypographyProps={{ variant: 'h6' }} sx={{ px: 0 }} />
            <Divider />
            <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flexGrow: 1 }}>
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
                            disabled={!isActive}
                          />
                        )}
                      />
                    </Grid>
                    {/* Street + Number */}
                    <Grid item xs={12} sm={10}>
                      <Controller
                        name="street"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Street" fullWidth disabled={!isActive} />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Controller
                        name="number"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Number" fullWidth disabled={!isActive} />}
                      />
                    </Grid>

                    {/* Complement + Neighborhood */}
                    <Grid item xs={6}>
                      <Controller
                        name="complement"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Complement" fullWidth disabled={!isActive} />}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Controller
                        name="neighborhood"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Neighborhood" fullWidth disabled={!isActive} />}
                      />
                    </Grid>
                    {/* City + State + Country */}
                    <Grid item xs={12} sm={8}>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => <TextField {...field} label="City" fullWidth disabled={!isActive} />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => <TextField {...field} label="State" fullWidth disabled={!isActive} />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Country" fullWidth disabled={!isActive} />}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="reference"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Reference" fullWidth disabled={!isActive} />}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            </CardContent>
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
EditCard.displayName = 'EditCard';
