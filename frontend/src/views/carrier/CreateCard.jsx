import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Box, Card, Grid, Stack, Typography, Divider, TextField, CardHeader, FormControlLabel, Switch } from '@mui/material';

const CreateCard = forwardRef(({ onSubmit }, ref) => {
  const methods = useForm({
    defaultValues: {
      name: '',
      slug: '',
      prefix: '',
      is_default: false,
      is_active: true
    }
  });

  const { control, watch, reset } = methods;

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      methods.handleSubmit((formData) => onSubmit(formData))();
    },
    resetForm: () => {
      reset();
    }
  }));

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
          backgroundColor: 'background.default'
        }}
      >
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
              name="is_default"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-thumb': {
                          color: field.value ? 'primary.main' : 'grey.500'
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: field.value ? 'primary.light' : 'grey.300'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: field.value ? 'primary.main' : 'text.secondary', fontWeight: 'bold' }}>
                      {field.value ? 'Default' : 'Not Default'}
                    </Typography>
                  }
                />
              )}
            />

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
                      sx={{
                        '& .MuiSwitch-thumb': {
                          color: field.value ? 'success.main' : 'error.main'
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: field.value ? 'success.light' : 'error.light'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: field.value ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                      {field.value ? 'Active' : 'Inactive'}
                    </Typography>
                  }
                />
              )}
            />
          </Box>

          <Card
            elevation={0}
            sx={{ mt: 3, borderRadius: 2, boxShadow: 'rgba(145, 158, 171, 0.2)', bgcolor: '#FFFFFF', border: '1px solid #DFE3E8', p: 3 }}
          >
            <CardHeader
              title="Details"
              subheader="Basic information of the carrier..."
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ px: 0 }}
            />
            <Divider />

            <Grid container spacing={2} mt={2}>
              <Grid item xs={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      onChange={(e) => field.onChange(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& label.Mui-focused': { color: 'secondary.main' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { transition: 'border-color 0.3s ease' },
                          '&:hover fieldset': { borderColor: 'secondary.light' },
                          '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <Controller
                  name="slug"
                  control={control}
                  rules={{
                    required: 'Slug é obrigatório',
                    maxLength: { value: 40, message: 'Máximo 40 caracteres' },
                    pattern: { value: /^[a-z0-9-]+$/, message: 'Use apenas letras minúsculas, números e hífens' }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Slug"
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '') // Apenas minúsculas, números e hífens
                          .slice(0, 40); // Limite máximo
                        field.onChange(value);
                      }}
                      value={field.value || ''}
                      fullWidth
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{
                        '& label.Mui-focused': { color: 'secondary.main' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { transition: 'border-color 0.3s ease' },
                          '&:hover fieldset': { borderColor: 'secondary.light' },
                          '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={2}>
                <Controller
                  name="prefix"
                  control={control}
                  rules={{
                    required: 'Prefix is required',
                    maxLength: { value: 3, message: 'Max 3 characters' },
                    pattern: { value: /^[A-Z]+$/, message: 'Only uppercase letters' }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Prefix"
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                        if (value.length <= 3) field.onChange(value);
                      }}
                      value={field.value || ''}
                      fullWidth
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{
                        '& label.Mui-focused': { color: 'secondary.main' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { transition: 'border-color 0.3s ease' },
                          '&:hover fieldset': { borderColor: 'secondary.light' },
                          '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Box>
    </FormProvider>
  );
});

export default CreateCard;
