import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import axios from 'axios';

import { useTheme } from '@mui/material/styles';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Box,
  Chip,
  Tooltip,
  Stack,
  Divider
} from '@mui/material';
import PermissionGroupSelect from '../../ui-component/permission/PermissionGroupSelect';
import AnimateButton from '../../ui-component/extended/AnimateButton';
import DynamicModal from '../../ui-component/modal/DynamicModal';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { API_ROUTES } from '../../routes/ApiRoutes';
import UserAvatarUpload from '../../ui-component/image/UserAvatarUpload';
import AuthWrapper1 from '../pages/authentication/AuthWrapper1';
import AuthCardWrapper from '../pages/authentication/AuthCardWrapper';
import { maskCPFGPT } from '../../utils/validator';

export default function EditCard({ user }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    birth_date: '',
    groups: []
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        password: '',
        cpf: user.cpf || '',
        phone: user.phone || '',
        birth_date: user.birth_date || '',
        groups: user.groups || []
      });
    }
  }, [user]);

  const handleImageChange = (file) => setAvatarImage(file);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      groups: formData.groups.map((g) => (typeof g === 'object' ? g.id : g)),
      cpf: formData.cpf.replace(/\D/g, ''),
      phone: formData.phone.replace(/\D/g, '')
    };

    try {
      const response = await axios.put(`${API_ROUTES.USERS}${user.id}/`, payload);

      if ([200, 201].includes(response.status)) {
        if (avatarImage) {
          const avatarFormData = new FormData();
          avatarFormData.append('image', avatarImage);

          await axios.post(API_ROUTES.AVATARS, avatarFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        setSuccessModalOpen(true);
      }
    } catch (error) {
      const message = error.response?.data?.detail || '❌ Failed to update user.';
      setErrorMessage(message);
      setErrorModalOpen(true);
    }
  };

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
        <AuthWrapper1>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
            <Grid sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <Stack spacing={1} width="100%">
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                  {user?.id && (
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={`ID: ${user.id}`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          color: theme.palette.common.white,
                          backgroundColor: theme.palette.grey[600]
                        }}
                      />
                    </Box>
                  )}

                  <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 1, ml: 'auto' }}>
                    <Tooltip title="Super User">
                      <Chip
                        label={user?.is_superuser ? 'Yes' : 'No'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: theme.palette[user?.is_superuser ? 'success' : 'error'].main,
                          color: theme.palette.common.white
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Staff">
                      <Chip
                        label={user?.is_staff ? 'Yes' : 'No'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: theme.palette[user?.is_staff ? 'success' : 'error'].main,
                          color: theme.palette.common.white
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Active Status">
                      <Chip
                        label={user?.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: theme.palette[user?.is_active ? 'success' : 'error'].main,
                          color: theme.palette.common.white
                        }}
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
                  p: 2
                }}
              >
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <UserAvatarUpload initialImage={user?.avatar_data?.image || ''} onChange={handleImageChange} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputMask mask="999.999.999-99" value={formData.cpf} onChange={handleChange}>
                        {(inputProps) => <TextField {...inputProps} fullWidth label="CPF" name="cpf" />}
                      </InputMask>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Birth Date"
                        name="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <InputMask mask="(99) 99999-9999" value={formData.phone} onChange={handleChange}>
                        {(inputProps) => <TextField {...inputProps} fullWidth label="Phone" name="phone" />}
                      </InputMask>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <PermissionGroupSelect value={formData.groups} onChange={(groups) => setFormData((prev) => ({ ...prev, groups }))} />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
                        label="Accept Terms"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <AnimateButton>
                        <Button fullWidth type="submit" variant="contained" color="primary">
                          Save Changes
                        </Button>
                      </AnimateButton>
                    </Grid>
                  </Grid>
                </form>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </AuthWrapper1>
      </Box>
    </Box>
  );
}
