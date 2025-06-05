import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SignalWifiOff } from '@mui/icons-material';

const OfflineContainer = styled(Box)(({ fullscreen }) => ({
  position: 'relative',
  width: '100%',
  height: fullscreen ? '100%' : '240px', // Altura padrão para miniaturas
  backgroundColor: '#000',
  border: '2px solid rgba(255, 255, 255, 0.1)',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const NoiseOverlay = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  opacity: 0.2,
  zIndex: 1,
  animation: 'pulse 2s infinite',
  backgroundImage: "url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')",
  backgroundRepeat: 'repeat',
  backgroundSize: 'cover',
  '@keyframes pulse': {
    '0%': {
      opacity: 0.2
    },
    '50%': {
      opacity: 0.3
    },
    '100%': {
      opacity: 0.2
    }
  }
});

const OfflineIcon = styled(SignalWifiOff)(({ theme, fullscreen }) => ({
  color: '#fff',
  fontSize: fullscreen ? '4rem' : '2.5rem',
  zIndex: 2,
  animation: 'blink 1s step-start infinite',
  '@keyframes blink': {
    '50%': {
      opacity: 0
    }
  }
}));

const CCTVOfflineEffect = ({ fullscreen = false }) => {
  return (
    <OfflineContainer fullscreen={fullscreen}>
      <NoiseOverlay />
      <OfflineIcon fullscreen={fullscreen} />
    </OfflineContainer>
  );
};

export default CCTVOfflineEffect;

// Tailwind CSS Custom Animation (adicione no tailwind.config.js)
/*
  extend: {
    animation: {
      blink: 'blink 1s step-start infinite',
    },
    keyframes: {
      blink: {
        '50%': { opacity: '0' },
      },
    },
  }
*/
