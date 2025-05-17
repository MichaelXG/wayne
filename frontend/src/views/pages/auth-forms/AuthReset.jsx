import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { validatePassword, checkToken } from '../../../utils/validator';

export default function AuthReset() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { uidb64, token, timestamp } = useParams();

  console.log('🔍 Params:', { uidb64, token, timestamp });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!uidb64 || !token || !timestamp) {
      console.error('❌ Missing required parameters');
      setError('Missing reset parameters (uid, token or timestamp).');
      return;
    }

    const isTokenValid = checkToken(token, timestamp);
    console.log(`🔐 Token validation result: ${isTokenValid}`);

    if (!isTokenValid) {
      console.warn('⚠️ Token is expired. Will redirect...');
      setError('The token has expired. Redirecting to recover page...');
      const timeout = Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION) || 3000;
      const timer = setTimeout(() => {
        navigate('/pages/recover');
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [uidb64, token, timestamp, navigate]);

  const handleClickShowPassword = () => setPasswordVisible((prev) => !prev);
  const handleClickShowConfirmPassword = () => setConfirmPasswordVisible((prev) => !prev);

  const handlePasswordValidation = (password) => {
    const errorMessage = validatePassword(password);
    if (errorMessage) {
      setError(errorMessage);
      return false;
    }
    return true;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password.trim() || !confirmPassword.trim()) {
      setError('Password fields cannot be empty.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!handlePasswordValidation(password)) return;

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const url = `${API_ROUTES.RESET_PASSWORD}${uidb64}/${token}/${timestamp}`;
      console.log('📡 Sending POST request to:', url);
      const response = await axios.post(url, { password });

      if (response.status === 200) {
        setMessage('Password reset successfully! Redirecting to login...');
        const timeout = Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION) || 3000;
        setTimeout(() => navigate('/pages/login'), timeout);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('❌ Request error:', err);
      const msg = err.response?.data?.detail || err.response?.data?.error || 'An unexpected error occurred. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset}>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel>New Password</InputLabel>
        <OutlinedInput
          type={passwordVisible ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          endAdornment={
            <InputAdornment position="end">
              <Button onClick={handleClickShowPassword} tabIndex={-1}>
                {passwordVisible ? <Visibility /> : <VisibilityOff />}
              </Button>
            </InputAdornment>
          }
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput, mt: 2 }}>
        <InputLabel>Confirm Password</InputLabel>
        <OutlinedInput
          type={confirmPasswordVisible ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          endAdornment={
            <InputAdornment position="end">
              <Button onClick={handleClickShowConfirmPassword} tabIndex={-1}>
                {confirmPasswordVisible ? <Visibility /> : <VisibilityOff />}
              </Button>
            </InputAdornment>
          }
        />
      </FormControl>

      <Grid container sx={{ alignItems: 'center', justifyContent: 'center', mt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button color="secondary" fullWidth size="large" type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Saving Password...' : 'Save'}
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
