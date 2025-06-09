import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Divider,
  TextField,
  Chip,
  FormControlLabel,
  Switch,
  Grid
} from '@mui/material';
import DynamicModal from '../../ui-component/modal/DynamicModal';
import { isDebug } from '../../App';

const EditCard = forwardRef(({ carrier, onSubmit }, ref) => {
  if (isDebug) console.log('🛠️ EditCard received carrier:', carrier);

  const { id, name = '', slug = '', prefix = '', is_default = false, is_active = false } = carrier || {};

  const methods = useForm({
    defaultValues: {
      name,
      slug,
      prefix,
      is_default,
      is_active
    }
  });

  const [initialData, setInitialData] = useState({});
  const [noChangesModal, setNoChangesModal] = useState(false);
  const { control, watch, getValues, reset } = methods;
  const isActive = watch('is_active');

  useEffect(() => {
    const original = { name, slug, prefix, is_default, is_active };
    reset(original);
    setInitialData(original);
  }, [name, slug, prefix, is_default, is_active, reset]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      const current = getValues();
      const comparableCurrent = { ...current, prefix: current.prefix.toUpperCase() };
      const comparableInitial = { ...initialData, prefix: initialData.prefix.toUpperCase() };

      const hasChanges = Object.keys(comparableCurrent).some((key) => String(comparableCurrent[key]) !== String(comparableInitial[key]));

      if (hasChanges) {
        methods.handleSubmit((formValues) => {
          formValues.prefix = formValues.prefix.toUpperCase();
          onSubmit(formValues);
        })();
      } else {
        isDebug && console.log('🚫 No changes detected, will not be saved.');
        setNoChangesModal(true);
      }
    },
    isActive
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
                  backgroundColor: theme.palette.grey[600]
                })}
              />
            )}

            <Stack direction="row" gap={2}>
              {/* Switch is_default */}
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
                        {field.value ? 'Default' : 'Not Default'}
                      </Typography>
                    }
                  />
                )}
              />

              {/* Switch is_active */}
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
              boxShadow: theme.shadows[3],
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
              </Grid>

              <Grid item xs={4}>
                <Controller
                  name="slug"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Slug"
                      fullWidth
                      disabled={!isActive}
                      variant="outlined"
                      value={(field.value || '').toLowerCase()}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().slice(0, 30);
                        field.onChange(val);
                      }}
                      sx={(theme) => ({
                        '& label.Mui-focused': {
                          color: theme.palette.grey[600]
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: theme.palette.text.primary
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
              </Grid>

              <Grid item xs={2}>
                <Controller
                  name="prefix"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Prefix"
                      fullWidth
                      disabled={!isActive}
                      variant="outlined"
                      value={(field.value || '').toUpperCase()}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().slice(0, 3);
                        field.onChange(val);
                      }}
                      inputProps={{ maxLength: 3 }}
                      sx={(theme) => ({
                        '& label.Mui-focused': {
                          color: theme.palette.grey[600]
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: theme.palette.text.primary
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
              </Grid>
            </Grid>
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
