import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import { isDebug } from '../../../App';

export default function AuthRecover() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRecover = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    isDebug && console.log('🔍 Sending password recovery request to:', API_ROUTES.RECOVER_PASSWORD);
    isDebug && console.log('📨 Payload:', { email, resetLink: `/pages/reset` });

    try {
      const response = await axios.post(
        API_ROUTES.RECOVER_PASSWORD,
        { email, resetLink: `/pages/reset` },
        { headers: { 'Content-Type': 'application/json' } }
      );

      isDebug && console.log('✅ Server response:', response.data);

      if (response.status === 200) {
        setSuccessMessage('Password recovery email sent successfully!');

        const timeoutDuration = !isNaN(Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION))
          ? Number(import.meta.env.VITE_PUBLIC_TIMEOUT_DURATION)
          : 3000;

        setTimeout(() => {
          navigate(`/pages/login`);
        }, timeoutDuration);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Password recovery error:', error);

      if (axios.isAxiosError(error)) {
        console.error('🛠 Server response:', error.response?.data);
        setError(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            'Error occurred while trying to recover the password. Please check your email.'
        );
      } else {
        setError('⚠️ An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleRecover}>
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
          <OutlinedInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </FormControl>

        <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }}>
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </Grid>

        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <Button color="secondary" fullWidth size="large" type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Recovery Email'}
            </Button>
          </AnimateButton>
        </Box>
      </form>
    </>
  );
}
