import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import axios from 'axios';

// material-ui
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

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import { isDebug } from '../../../App';
import DynamicModal from '../../../ui-component/modal/DynamicModal';
import UserAvatarUpload from '../../../ui-component/image/UserAvatarUpload';
import PermissionGroupSelect from '../../../ui-component/permission/PermissionGroupSelect';

export default function AuthRegister() {
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
    group: ''
  });

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
      cpf: formData.cpf.replace(/\D/g, ''),
      phone: formData.phone.replace(/\D/g, '')
    };

    isDebug && console.log('📤 Submitting form data:', payload);

    try {
      const response = await axios.post(API_ROUTES.USERS, payload);

      if ([200, 201].includes(response.status)) {
        const token = response.data?.access;

        if (avatarImage && token) {
          const avatarFormData = new FormData();
          avatarFormData.append('image', avatarImage);

          await axios.post(API_ROUTES.AVATARS, avatarFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });

          isDebug && console.log('✅ Avatar enviado com sucesso!');
        }
        setSuccessModalOpen(true);
      }
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.username?.[0] ||
        error.response?.data?.email?.[0] ||
        error.response?.data?.cpf?.[0] ||
        '❌ Failed to register user.';

      setErrorMessage(message);
      setErrorModalOpen(true);

      isDebug && console.error('❌ Registration error:', error.response?.data || error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2} sx={{ justifyContent: 'center' }}>
          <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Sign up with Email address</Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <UserAvatarUpload initialImage="" onChange={handleImageChange} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              margin="normal"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              required
              sx={{ ...theme.typography.customInput }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              margin="normal"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              required
              sx={{ ...theme.typography.customInput }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InputMask mask="999.999.999-99" value={formData.cpf} onChange={handleChange}>
              {(inputProps) => (
                <TextField {...inputProps} fullWidth label="CPF" margin="normal" name="cpf" sx={{ ...theme.typography.customInput }} />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Birth Date"
              margin="normal"
              name="birth_date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.birth_date}
              onChange={handleChange}
              required
              sx={{ ...theme.typography.customInput }}
            />
          </Grid>
        </Grid>

        <InputMask mask="(99) 99999-9999" value={formData.phone} onChange={handleChange}>
          {(inputProps) => (
            <TextField {...inputProps} fullWidth label="Phone" margin="normal" name="phone" sx={{ ...theme.typography.customInput }} />
          )}
        </InputMask>

        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel>Email Address</InputLabel>
          <OutlinedInput
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email Address"
            required
          />
        </FormControl>

        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" size="large">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <PermissionGroupSelect value={formData.group} onChange={handleChange} />

        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} name="checked" color="primary" />}
          label={
            <Typography variant="subtitle2" component="span">
              <Link to="#">Terms & Conditions</Link>
            </Typography>
          }
        />

        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
              Sign Up
            </Button>
          </AnimateButton>
        </Box>
      </form>

      <DynamicModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        type="success"
        mode="confirm"
        title="Account Created!"
        description="You will be redirected to login shortly."
        submitLabel="Go to Login"
        cancelLabel="Stay"
        onSubmit={() => {
          setSuccessModalOpen(false);
          navigate('/pages/login');
        }}
      />

      <DynamicModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        type="error"
        mode="confirm"
        title="Registration Failed"
        description={errorMessage}
        submitLabel="Close"
        cancelLabel="Dismiss"
        onSubmit={() => setErrorModalOpen(false)}
      />
    </>
  );
}
