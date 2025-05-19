import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import logo from '../assets/images/Logo.png';
import logoDark from '../assets/images/logo-dark.png';

export default function Logo({ containerWidth = 200, containerHeight = 100 }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: containerWidth,
        height: containerHeight,
        overflow: 'hidden',
        lineHeight: 0
      }}
    >
      <img
        src={isDark ? logoDark : logo}
        alt="Wayne"
        style={{
          display: 'block',
          width: '100%', // ocupa toda a largura do container
          height: '100%', // ocupa toda a altura do container
          objectFit: 'contain', // mantém proporção e "encaixa" a imagem
          WebkitFontSmoothing: 'antialiased',
          textSizeAdjust: '100%',
          fontFamily: theme.typography.fontFamily,
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: '1.334em',
          color: 'rgb(54, 65, 82)',
          WebkitTapHighlightColor: 'transparent',
          flexShrink: 0
        }}
      />
    </Box>
  );
}
