import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Grid, Chip, Stack, TextField, Tooltip, FormControlLabel, Switch, useTheme } from '@mui/material';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import InputMask from 'react-input-mask';
import UserAvatarUpload from '../../ui-component/image/UserAvatarUpload';
import AuthCardWrapper from '../pages/authentication/AuthCardWrapper';
import DynamicModal from '../../ui-component/modal/DynamicModal';
import PermissionGroupSelect from '../../ui-component/permission/PermissionGroupSelect';

const EditCard = forwardRef(({ user, onSubmit }, ref) => {
  const theme = useTheme();
  const { id, first_name, last_name, email, cpf, phone, birth_date, groups = [], is_active, is_superuser, is_staff } = user || {};

  const methods = useForm({
    defaultValues: {
      id: id || null,
      first_name: first_name || '',
      last_name: last_name || '',
      email: email || '',
      cpf: cpf || '',
      phone: phone || '',
      birth_date: birth_date || '',
      groups: groups.map((g) => (typeof g === 'object' ? g.id : g)) || [],
      is_superuser: is_superuser || false,
      is_staff: is_staff || false,
      is_active: is_active || false
    }
  });

  const { control, getValues, reset } = methods;
  const [noChangesModal, setNoChangesModal] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (user) {
      const clean = {
        id: user.id || null,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        cpf: user.cpf || '',
        phone: user.phone || '',
        birth_date: user.birth_date || '',
        groups: user.groups || [],
        is_active: user.is_active || false,
        is_superuser: user.is_superuser || false,
        is_staff: user.is_staff || false
      };
      reset(clean);
      setInitialData(clean);
    }
  }, [user, reset]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      const current = getValues();
      const changed = Object.keys(initialData).some((key) => {
        if (key === 'groups') {
          const currentIds = (current.groups || []).map((g) => (typeof g === 'object' ? g.id : g)).sort();
          const originalIds = (initialData.groups || []).map((g) => (typeof g === 'object' ? g.id : g)).sort();
          return JSON.stringify(currentIds) !== JSON.stringify(originalIds);
        }
        return String(initialData[key]) !== String(current[key]);
      });

      if (changed) {
        onSubmit(current, avatarImage);
      } else {
        setNoChangesModal(true);
      }
    }
  }));

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1000 }}>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
            <Grid sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <Stack spacing={1} width="100%">
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                  {id && (
                    <Box sx={{ mb: 1 }}>
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
                    </Box>
                  )}
                  <Box display="flex" gap={3} flexWrap="wrap" sx={{ mb: 1, ml: 'auto' }}>
                    {[
                      { label: 'Super User', key: 'is_superuser' },
                      { label: 'Staff', key: 'is_staff' },
                      { label: 'Active', key: 'is_active' }
                    ].map(({ label, key }) => (
                      <Controller
                        key={key}
                        name={key}
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
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
                            label={label}
                          />
                        )}
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>

              <AuthCardWrapper
                sx={{
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  p: 2
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <UserAvatarUpload initialImage={user?.avatar_data?.image || ''} onChange={setAvatarImage} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="first_name"
                      control={control}
                      rules={{ required: 'First name is required' }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="First Name"
                          fullWidth
                          required
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="last_name"
                      control={control}
                      rules={{ required: 'Last name is required' }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="Last Name"
                          fullWidth
                          required
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="cpf"
                      control={control}
                      rules={{ required: 'CPF is required' }}
                      render={({ field, fieldState }) => (
                        <InputMask mask="999.999.999-99" value={field.value} onChange={field.onChange}>
                          {(inputProps) => (
                            <TextField
                              {...inputProps}
                              inputRef={field.ref}
                              label="CPF"
                              fullWidth
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        </InputMask>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="birth_date"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Birth Date" fullWidth type="date" InputLabelProps={{ shrink: true }} />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange}>
                          {(inputProps) => <TextField {...inputProps} inputRef={field.ref} label="Phone" fullWidth />}
                        </InputMask>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email format'
                        }
                      }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="Email"
                          fullWidth
                          required
                          type="email"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="groups"
                      control={control}
                      rules={{ required: 'At least one group is required' }}
                      render={({ field, fieldState }) => <PermissionGroupSelect value={field.value} onChange={field.onChange} />}
                    />
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
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
