import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import {
  Person,
  LocationOn,
  Warning,
  AccessTime,
  ArrowForward
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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  width: 56,
  height: 56
}));

const WantedList = () => {
  const targets = [
    {
      name: 'The Riddler',
      alias: 'Edward Nigma',
      lastSeen: 'East End District',
      threatLevel: 'High',
      status: 'Active',
      timeActive: '48 hours'
    },
    {
      name: 'Penguin',
      alias: 'Oswald Chesterfield Cobblepot',
      lastSeen: 'Iceberg Lounge',
      threatLevel: 'Medium',
      status: 'Active',
      timeActive: '24 hours'
    },
    {
      name: 'Two-Face',
      alias: 'Harvey Dent',
      lastSeen: 'Old Courthouse',
      threatLevel: 'High',
      status: 'Active',
      timeActive: '12 hours'
    },
    {
      name: 'Poison Ivy',
      alias: 'Pamela Isley',
      lastSeen: 'Robinson Park',
      threatLevel: 'Medium',
      status: 'Active',
      timeActive: '36 hours'
    }
  ];

  const getThreatLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        High Priority Targets
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledCard>
            <List>
              {targets.map((target, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: index < targets.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    py: 2
                  }}
                >
                  <ListItemAvatar>
                    <StyledAvatar>
                      <Person />
                    </StyledAvatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6">{target.name}</Typography>
                        <Chip
                          label={target.threatLevel}
                          color={getThreatLevelColor(target.threatLevel)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Alias: {target.alias}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOn fontSize="small" />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {target.lastSeen}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime fontSize="small" />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Active for {target.timeActive}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                  <IconButton sx={{ color: 'inherit' }}>
                    <ArrowForward />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WantedList; 