import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const WantedCard = ({ name, alias, avatar, reward, threat, description }) => {
  const formattedReward = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(reward.replace(/,/g, ''));

  return (
    <Card sx={{
      width: 320,
      background: '#f4e4bc',
      color: '#462f2f',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Western', serif",
      boxShadow: '8px 8px 16px rgba(0,0,0,0.2)',
      border: '2px solid #462f2f',
      p: 2,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("/textures/paper-texture.png")',
        opacity: 0.1,
        zIndex: 1,
        pointerEvents: 'none'
      }
    }}>
      {/* Stars at top */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 1,
        mb: 1
      }}>
        {[...Array(3)].map((_, i) => (
          <StarIcon key={i} sx={{ color: '#8B4513', fontSize: 24 }} />
        ))}
      </Box>

      {/* Decorative line */}
      <Box sx={{ 
        borderBottom: '2px solid #462f2f',
        width: '100%',
        mb: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '10%',
          right: '10%',
          top: -8,
          borderBottom: '2px solid #462f2f'
        }
      }} />

      <Typography variant="h3" sx={{ 
        textAlign: 'center',
        fontWeight: 900,
        letterSpacing: '0.1em',
        color: '#462f2f',
        fontFamily: "'Western', serif",
        fontSize: '2.5rem',
        mb: 1,
        textTransform: 'uppercase'
      }}>
        WANTED
      </Typography>

      <Typography variant="h6" sx={{
        textAlign: 'center',
        fontWeight: 700,
        color: '#8B4513',
        fontFamily: "'Western', serif",
        fontSize: '1rem',
        mb: 2,
        textTransform: 'uppercase'
      }}>
        DEAD OR ALIVE
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Avatar
          src={avatar}
          alt={name}
          sx={{
            width: 160,
            height: 160,
            border: '4px solid #462f2f',
            filter: 'sepia(20%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        />
      </Box>

      <Typography variant="h5" sx={{ 
        textAlign: 'center',
        fontWeight: 700,
        mb: 0.5,
        color: '#462f2f',
        fontFamily: "'Western', serif",
        textTransform: 'uppercase'
      }}>
        {name}
      </Typography>

      <Typography variant="subtitle1" sx={{ 
        textAlign: 'center',
        fontWeight: 500,
        mb: 2,
        color: '#8B4513',
        fontFamily: "'Western', serif",
        fontSize: '0.9rem'
      }}>
        Known as: {alias}
      </Typography>

      <Typography variant="h4" sx={{ 
        textAlign: 'center',
        fontWeight: 900,
        color: '#462f2f',
        fontFamily: "'Western', serif",
        mb: 1
      }}>
        {formattedReward}
      </Typography>

      <Typography variant="subtitle2" sx={{ 
        textAlign: 'center',
        fontWeight: 700,
        color: '#8B4513',
        fontFamily: "'Western', serif",
        fontSize: '1rem',
        mb: 2,
        textTransform: 'uppercase'
      }}>
        CASH REWARD
      </Typography>

      <Typography variant="body2" sx={{ 
        textAlign: 'center',
        color: '#462f2f',
        fontFamily: "'Western', serif",
        fontSize: '0.8rem',
        fontStyle: 'italic',
        px: 2
      }}>
        {description}
      </Typography>

      {/* Bottom stars */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 1,
        mt: 2
      }}>
        {[...Array(3)].map((_, i) => (
          <StarIcon key={i} sx={{ color: '#8B4513', fontSize: 24 }} />
        ))}
      </Box>
    </Card>
  );
};

export default WantedCard;
