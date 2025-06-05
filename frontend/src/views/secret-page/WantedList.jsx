import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  IconButton,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Person,
  LocationOn,
  Warning,
  Timer,
  LocalPolice,
  Psychology,
  Dangerous,
  Search
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(0, 30, 60, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  color: '#fff',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2)
}));

const CriminalCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  color: '#fff',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255, 255, 255, 0.08)'
  }
}));

const DangerLevel = styled(LinearProgress)(({ theme, value }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: 
      value >= 80 ? '#f44336' :
      value >= 60 ? '#ff9800' :
      value >= 40 ? '#ffeb3b' :
      '#4caf50'
  }
}));

const WantedList = () => {
  const criminals = [
    {
      id: 1,
      name: 'The Joker',
      alias: 'Unknown',
      dangerLevel: 95,
      lastSeen: 'Amusement Mile',
      status: 'At Large',
      crimes: ['Mass Murder', 'Terrorism', 'Criminal Insanity'],
      description: 'Extremely dangerous, psychopathic criminal mastermind',
      avatar: '🃏'
    },
    {
      id: 2,
      name: 'Edward Nigma',
      alias: 'The Riddler',
      dangerLevel: 75,
      lastSeen: 'Cyberspace',
      status: 'Active',
      crimes: ['Cybercrime', 'Murder', 'Psychological Warfare'],
      description: 'Genius-level intellect, obsessed with riddles and puzzles',
      avatar: '❓'
    },
    {
      id: 3,
      name: 'Oswald Chesterfield Cobblepot',
      alias: 'The Penguin',
      dangerLevel: 70,
      lastSeen: 'Iceberg Lounge',
      status: 'Under Surveillance',
      crimes: ['Organized Crime', 'Arms Dealing', 'Racketeering'],
      description: 'Criminal kingpin with vast underground network',
      avatar: '🐧'
    },
    {
      id: 4,
      name: 'Selina Kyle',
      alias: 'Catwoman',
      dangerLevel: 60,
      lastSeen: 'Diamond District',
      status: 'Active',
      crimes: ['Grand Theft', 'Burglary', 'Escape Artist'],
      description: 'Expert thief and martial artist',
      avatar: '🐱'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'At Large':
        return 'error';
      case 'Active':
        return 'warning';
      case 'Under Surveillance':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
        Gotham's Most Wanted
      </Typography>

      <Grid container spacing={3}>
        {criminals.map((criminal) => (
          <Grid item xs={12} md={6} key={criminal.id}>
            <CriminalCard>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    fontSize: '2rem',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {criminal.avatar}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{criminal.name}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {criminal.alias}
                      </Typography>
                    </Box>
                    <Chip
                      label={criminal.status}
                      color={getStatusColor(criminal.status)}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Dangerous />
                  <Typography variant="body2">Danger Level</Typography>
                </Box>
                <DangerLevel variant="determinate" value={criminal.dangerLevel} />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" />
                  <Typography variant="body2">{criminal.lastSeen}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {criminal.description}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {criminal.crimes.map((crime, index) => (
                  <Chip
                    key={index}
                    label={crime}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff'
                    }}
                  />
                ))}
              </Box>
            </CriminalCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WantedList; 