import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating
} from '@mui/material';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const WantedCard = ({ name, alias, avatar, reward, threat, captured, description }) => {
  const formatReward = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card 
      sx={{ 
        width: '100%',
        maxWidth: 345,
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'relative',
            width: '200px',
            height: '200px',
            margin: '20px auto',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          <CardMedia
            component="img"
            image={avatar}
            alt={alias}
            sx={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: captured ? 'grayscale(100%)' : 'none'
            }}
          />
        </Box>
        {captured && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              bgcolor: 'error.main',
              color: 'white',
              py: 1,
              px: 6,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              zIndex: 1,
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            Captured
          </Box>
        )}
        <Chip
          label={`Threat Level: ${threat}`}
          icon={<LocalPoliceIcon />}
          sx={{
            position: 'absolute',
            top: -20,
            right: 0,
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white',
            '& .MuiChip-icon': {
              color: 'white'
            }
          }}
        />
      </Box>

      <CardContent sx={{ color: 'white' }}>
        <Typography variant="h5" component="div" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
          {alias}
        </Typography>
        
        <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, textAlign: 'center' }}>
          {name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
          <AttachMoneyIcon sx={{ color: '#4caf50', mr: 1 }} />
          <Typography variant="h6" sx={{ color: '#4caf50' }}>
            {formatReward(reward)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Rating
            value={threat}
            readOnly
            max={5}
            sx={{
              '& .MuiRating-icon': {
                color: 'warning.main'
              }
            }}
          />
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            textAlign: 'center'
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WantedCard;
