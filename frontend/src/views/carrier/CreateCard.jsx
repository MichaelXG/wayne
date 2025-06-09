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
                      variant="body2"
                      sx={(theme) => ({
                        color: field.value ? theme.palette.primary.main : theme.palette.text.secondary,
                        fontWeight: 'bold'
                      })}
                    >
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
              boxShadow: theme.shadows[1],
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              p: 3
            })}
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
                      // sx={(theme) => ({
                      //   '& label.Mui-focused': {
                      //     color: theme.palette.grey[600]
                      //   },
                      //   '& .MuiOutlinedInput-root': {
                      //     '& fieldset': {
                      //       transition: 'border-color 0.3s ease'
                      //     },
                      //     '&:hover fieldset': {
                      //       borderColor: theme.palette.grey[300]
                      //     },
                      //     '&.Mui-focused fieldset': {
                      //       borderColor: theme.palette.grey[600]
                      //     }
                      //   }
                      // })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <Controller
                  name="slug"
                  control={control}
                  rules={{
                    required: 'Slug is required',
                    maxLength: { value: 40, message: 'Maximum 40 characters allowed' },
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: 'Use only lowercase letters, numbers, and hyphens'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Slug"
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '') // Only lowercase letters, numbers, and hyphens
                          .slice(0, 40); // Max limit
                        field.onChange(value);
                      }}
                      value={field.value || ''}
                      fullWidth
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      // sx={(theme) => ({
                      //   '& label.Mui-focused': {
                      //     color: theme.palette.grey[600]
                      //   },
                      //   '& .MuiOutlinedInput-root': {
                      //     '& fieldset': {
                      //       transition: 'border-color 0.3s ease'
                      //     },
                      //     '&:hover fieldset': {
                      //       borderColor: theme.palette.grey[300]
                      //     },
                      //     '&.Mui-focused fieldset': {
                      //       borderColor: theme.palette.grey[600]
                      //     }
                      //   }
                      // })}
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
                      // sx={(theme) => ({
                      //   '& label.Mui-focused': {
                      //     color: theme.palette.grey[600]
                      //   },
                      //   '& .MuiOutlinedInput-root': {
                      //     '& fieldset': {
                      //       transition: 'border-color 0.3s ease'
                      //     },
                      //     '&:hover fieldset': {
                      //       borderColor: theme.palette.grey[300]
                      //     },
                      //     '&.Mui-focused fieldset': {
                      //       borderColor: theme.palette.grey[600]
                      //     }
                      //   }
                      // })}
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
