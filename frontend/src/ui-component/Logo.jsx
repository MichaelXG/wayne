import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';
import logo from '../assets/images/Logo.png';
import logoDark from '../assets/images/logo-dark.png';

export default function Logo() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        width: 194,
        height: 36.28,
        overflow: 'hidden',
        lineHeight: 0
      }}
    >
      <img
        src={isDark ? logoDark : logo}
        alt="F-Store"
        width="92"
        height="32"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          WebkitFontSmoothing: 'antialiased',
          textSizeAdjust: '100%',
          fontFamily: 'Roboto, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: '1.334em',
          color: 'rgb(54, 65, 82)',
          WebkitTapHighlightColor: 'transparent',
          WebkitBoxFlex: 1,
          flexGrow: 1
        }}
      />
    </Box>
  );
}
