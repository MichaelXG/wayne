import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import useLocalStorage from '../../../hooks/useLocalStorage';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isTokenValid } from '../../../utils/auth';

// Função para validar o formato do email
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function AuthLogin() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [userData, setUserData] = useLocalStorage('wayne-user-data', {});

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Verifica se há um token válido salvo e se o usuário escolheu "Keep me logged in"
    const checkAutoLogin = async () => {
      if (userData.keeploggedin && userData.authToken) {
        console.log('🔍 Verificando login automático...');

        const validToken = await isTokenValid(userData.authToken);

        if (validToken) {
          console.log('✅ Token válido! Redirecionando para o Dashboard...');
          navigate('/dashboard/default');
        } else {
          console.warn('❌ Token inválido! Redirecionando para login.');
          setUserData({}); // Remove os dados inválidos
        }
      }
    };

    checkAutoLogin();
  }, [userData, navigate, setUserData]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    console.log('🔍 Validating credentials...');

    if (!email.trim() || !password.trim()) {
      setError('Email and password cannot be empty.');
      console.error('❌ Validation Error: Empty fields');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      console.error('❌ Validation Error: Invalid email format');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📤 Sending login request...');
      const response = await axios.post(API_ROUTES.LOGIN, { email, password }, { headers: { 'Content-Type': 'application/json' } });

      if (response.status === 200) {
        const accessToken = response.data.access || response.data.access_token;
        const refreshToken = response.data.refresh || response.data.refresh_token;

        if (!accessToken || !refreshToken) {
          throw new Error('JWT tokens not found in response.');
        }

        setUserData({
          authToken: accessToken,
          refreshToken: refreshToken,
          email: btoa(email),
          id: btoa(response.data.id || ''),
          first_name: btoa(response.data.first_name || ''),
          last_name: btoa(response.data.last_name || ''),
          birth_date: btoa(response.data.birth_date || ''),
          keeploggedin: checked
        });

        setSuccessMessage('Login successful! Redirecting...');
        console.log('✅ Login successful!');

        setTimeout(() => {
          console.log('🔄 Redirecting to dashboard...');
          navigate(`/dashboard/default`);
        }, 3000);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.detail || 'Error during login. Please check your credentials.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel>Email Address</InputLabel>
          <OutlinedInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </FormControl>

        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} />}
              label="Keep me logged in"
            />
          </Grid>
          <Grid>
            <Typography component={Link} to={`/pages/recover`} color="secondary" sx={{ textDecoration: 'none' }}>
              Forgot Password?
            </Typography>
          </Grid>
        </Grid>

        <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }}>
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </Grid>

        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <Button color="secondary" fullWidth size="large" type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </AnimateButton>
        </Box>
      </form>
    </>
  );
}
