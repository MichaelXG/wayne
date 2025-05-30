import { useEffect } from 'react';
import { Box, Grid, Typography, TextField, Chip, Stack, Switch, Divider, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import UserAvatarUpload from '../../ui-component/image/UserAvatarUpload';
import { useUserIDContext } from '../../contexts/UserIDContext';
import AuthCardWrapper from '../pages/authentication/AuthCardWrapper';
import { maskCPFGPT } from '../../utils/validator';

export default function DetailCard({ user }) {
  const theme = useTheme();
  const { setUserId } = useUserIDContext();

  useEffect(() => {
    if (user?.id) setUserId(user.id);
  }, [user, setUserId]);

  const renderStatusSwitch = (label, value) => (
    <FormControlLabel
      control={
        <Switch
          checked={Boolean(value)}
          disabled
          sx={{
            '& .MuiSwitch-thumb': {
              color: value ? theme.palette.success.main : theme.palette.error.main
            },
            '& .MuiSwitch-track': {
              backgroundColor: value ? theme.palette.success.light : theme.palette.error.light
            }
          }}
        />
      }
      label={label}
    />
  );

  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default
      })}
    >
      <Box sx={{ width: '100%', maxWidth: 1000 }}>
        <Grid container sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
          <Grid sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
            <Stack spacing={1} width="100%">
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                {/* ✅ Alinhado à esquerda */}
                {user?.id && (
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={`ID: ${user.id}`}
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

                {/* ✅ Substituição dos Tooltips por Switches */}
                <Box display="flex" gap={3} flexWrap="wrap" sx={{ mb: 1, ml: 'auto' }}>
                  {[
                    { label: 'Super User', key: 'is_superuser' },
                    { label: 'Staff', key: 'is_staff' },
                    { label: 'Active', key: 'is_active' }
                  ].map(({ label, key }) => renderStatusSwitch(label, user?.[key]))}
                </Box>
              </Box>
            </Stack>

            <AuthCardWrapper
              sx={{
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                p: 2 // padding interno para respiro visual
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <UserAvatarUpload initialImage={user.avatar_data?.image || ''} readOnly />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="First Name" value={user.first_name || ''} disabled sx={{ ...theme.typography.customInput }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Last Name" value={user.last_name || ''} disabled sx={{ ...theme.typography.customInput }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="CPF" value={maskCPFGPT(user.cpf) || ''} disabled sx={{ ...theme.typography.customInput }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Birth Date"
                    value={user.birth_date || ''}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ ...theme.typography.customInput }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    mask="(99) 99999-9999"
                    fullWidth
                    label="Phone"
                    value={user.phone || ''}
                    disabled
                    sx={{ ...theme.typography.customInput }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Email" value={user.email || ''} disabled sx={{ ...theme.typography.customInput }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Permission Groups
                  </Typography>
                  <Divider />{' '}
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {Array.isArray(user.groups) && user.groups.length > 0 ? (
                      user.groups.map((group, index) => (
                        <Chip
                          key={index}
                          label={group.name || group}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: theme.palette.grey[600],
                            color: theme.palette.common.white
                          }}
                        />
                      ))
                    ) : (
                      <Chip label="No groups" size="small" disabled />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </AuthCardWrapper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
