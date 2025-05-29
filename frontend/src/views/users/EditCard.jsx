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
  Box
} from '@mui/material';
import PermissionGroupSelect from '../../ui-component/permission/PermissionGroupSelect';
import AnimateButton from '../../ui-component/extended/AnimateButton';
import DynamicModal from '../../ui-component/modal/DynamicModal';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { API_ROUTES } from '../../routes/ApiRoutes';
import UserAvatarUpload from '../../ui-component/image/UserAvatarUpload';

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

  const handleImageChange = (file) => {
    isDebug && console.log('📥 Imagem recebida:', file);
    setAvatarImage(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

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
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
        setSuccessModalOpen(true);
      }
    } catch (error) {
      const message = error.response?.data?.detail || '❌ Failed to update user.';

      setErrorMessage(message);
      setErrorModalOpen(true);
      isDebug && console.error('❌ Update error:', error.response?.data || error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <UserAvatarUpload initialImage={user?.avatar_data?.image || ''} onChange={handleImageChange} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
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
            <TextField fullWidth label="Birth Date" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
          </Grid>

          <Grid item xs={12}>
            <InputMask mask="(99) 99999-9999" value={formData.phone} onChange={handleChange}>
              {(inputProps) => <TextField {...inputProps} fullWidth label="Phone" name="phone" />}
            </InputMask>
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
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
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
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

      <DynamicModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        type="success"
        mode="confirm"
        title="User Updated!"
        description="Your changes have been saved."
        submitLabel="OK"
        onSubmit={() => navigate('/wayne/users')}
      />

      <DynamicModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        type="error"
        mode="confirm"
        title="Update Failed"
        description={errorMessage}
        submitLabel="Close"
        onSubmit={() => setErrorModalOpen(false)}
      />
    </>
  );
}
