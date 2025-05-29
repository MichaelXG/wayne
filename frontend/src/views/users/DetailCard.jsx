import { useEffect } from 'react';
import { Box, Grid, Typography, TextField, FormControlLabel, Checkbox, Chip, Stack, Tooltip, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import UserAvatarUpload from '../../ui-component/image/UserAvatarUpload';
import PermissionGroupSelect from '../../ui-component/permission/PermissionGroupSelect';
import { useUserIDContext } from '../../contexts/UserIDContext';
import AuthWrapper1 from '../pages/authentication/AuthWrapper1';
import AuthCardWrapper from '../pages/authentication/AuthCardWrapper';
import { maskCPFGPT } from '../../utils/validator';

export default function DetailCard({ user }) {
  const theme = useTheme();
  const { setUserId } = useUserIDContext();

  useEffect(() => {
    if (user?.id) setUserId(user.id);
  }, [user, setUserId]);

  return (
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

                {/* ✅ Agrupados e alinhados à direita com Tooltips */}
                <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 1, ml: 'auto' }}>
                  <Tooltip
                    title="Super User"
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: (theme) => ({
                          backgroundColor: theme.palette[user?.is_superuser ? 'success' : 'error'].main,
                          color: theme.palette.common.white,
                          fontSize: 12,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          boxShadow: theme.shadows[2]
                        })
                      }
                    }}
                  >
                    <Chip
                      label={user?.is_superuser ? 'Yes' : 'No'}
                      size="small"
                      sx={(theme) => ({
                        fontWeight: theme.typography.fontWeightBold,
                        bgcolor: theme.palette[user?.is_superuser ? 'success' : 'error'].main,
                        color: theme.palette.common.white
                      })}
                    />
                  </Tooltip>

                  <Tooltip
                    title="Staff"
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: (theme) => ({
                          backgroundColor: theme.palette[user?.is_staff ? 'success' : 'error'].main,
                          color: theme.palette.common.white,
                          fontSize: 12,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          boxShadow: theme.shadows[2]
                        })
                      }
                    }}
                  >
                    <Chip
                      label={user?.is_staff ? 'Yes' : 'No'}
                      size="small"
                      sx={(theme) => ({
                        fontWeight: theme.typography.fontWeightBold,
                        bgcolor: theme.palette[user?.is_staff ? 'success' : 'error'].main,
                        color: theme.palette.common.white
                      })}
                    />
                  </Tooltip>

                  <Tooltip
                    title="Active Status"
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: (theme) => ({
                          backgroundColor: theme.palette[user?.is_active ? 'success' : 'error'].main,
                          color: theme.palette.common.white,
                          fontSize: 12,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          boxShadow: theme.shadows[2]
                        })
                      }
                    }}
                  >
                    <Chip
                      label={user?.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={(theme) => ({
                        fontWeight: theme.typography.fontWeightBold,
                        bgcolor: theme.palette[user?.is_active ? 'success' : 'error'].main,
                        color: theme.palette.common.white
                      })}
                    />
                  </Tooltip>
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
                  <TextField fullWidth label="Phone" value={user.phone || ''} disabled sx={{ ...theme.typography.customInput }} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Email" value={user.email || ''} disabled sx={{ ...theme.typography.customInput }} />
                </Grid>

                {/* <Grid item xs={12}>
                  <PermissionGroupSelect value={user.groups || []} disabled />
                </Grid> */}

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Permission Groups
                  </Typography>
                  <Divider />{' '}
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {Array.isArray(user.groups) && user.groups.length > 0 ? (
                      user.groups.map((group) => (
                        <Chip
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
