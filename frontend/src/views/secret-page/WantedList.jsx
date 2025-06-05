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
  IconButton,
  useTheme
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
  background: theme.palette.grey[600],
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  color: theme.palette.common.white,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2)
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.grey[900],
  width: 56,
  height: 56
}));

const WantedList = () => {
  const theme = useTheme();

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
                    borderBottom: index < targets.length - 1 ? `1px solid ${theme.palette.grey[300]}` : 'none',
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
                          sx={{
                            backgroundColor: theme.palette.grey[300],
                            color: theme.palette.grey[900],
                            '&.MuiChip-colorError': {
                              backgroundColor: theme.palette.error.main,
                              color: theme.palette.common.white
                            },
                            '&.MuiChip-colorWarning': {
                              backgroundColor: theme.palette.warning.main,
                              color: theme.palette.grey[900]
                            },
                            '&.MuiChip-colorInfo': {
                              backgroundColor: theme.palette.info.main,
                              color: theme.palette.common.white
                            }
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: theme.palette.grey[300] }}>
                          Alias: {target.alias}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOn fontSize="small" sx={{ color: theme.palette.grey[300] }} />
                            <Typography variant="body2" sx={{ color: theme.palette.grey[300] }}>
                              {target.lastSeen}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime fontSize="small" sx={{ color: theme.palette.grey[300] }} />
                            <Typography variant="body2" sx={{ color: theme.palette.grey[300] }}>
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