import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  LocationOn,
  Warning,
  Security,
  CameraAlt,
  Radar,
  NetworkCheck
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

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[300],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4
  }
}));

const CitySecurityStatus = () => {
  const theme = useTheme();

  const districts = [
    {
      name: 'Downtown',
      status: 'High Alert',
      securityLevel: 85,
      activeUnits: 12,
      incidents: 3,
      icon: <LocationOn />
    },
    {
      name: 'East End',
      status: 'Moderate',
      securityLevel: 65,
      activeUnits: 8,
      incidents: 1,
      icon: <LocationOn />
    },
    {
      name: 'Industrial District',
      status: 'Critical',
      securityLevel: 45,
      activeUnits: 15,
      incidents: 5,
      icon: <LocationOn />
    },
    {
      name: 'Diamond District',
      status: 'Secure',
      securityLevel: 92,
      activeUnits: 10,
      incidents: 0,
      icon: <LocationOn />
    }
  ];

  const systems = [
    {
      name: 'CCTV Network',
      status: 'Online',
      coverage: 95,
      icon: <CameraAlt />
    },
    {
      name: 'Police Radio',
      status: 'Online',
      coverage: 88,
      icon: <NetworkCheck />
    },
    {
      name: 'Motion Sensors',
      status: 'Online',
      coverage: 78,
      icon: <Radar />
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'high alert':
        return 'warning';
      case 'critical':
        return 'error';
      case 'secure':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        City Security Status
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledCard>
            <Typography variant="h4" gutterBottom>
              District Status
            </Typography>
            <List>
              {districts.map((district, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: index < districts.length - 1 ? `1px solid ${theme.palette.grey[300]}` : 'none',
                    py: 2
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.grey[300] }}>
                    {district.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={district.name}
                    secondary={`Active Units: ${district.activeUnits} | Incidents: ${district.incidents}`}
                    secondaryTypographyProps={{ sx: { color: theme.palette.grey[300] } }}
                  />
                  <Box sx={{ minWidth: 120, textAlign: 'right', mr: 2 }}>
                    <Chip
                      label={district.status}
                      color={getStatusColor(district.status)}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.grey[300],
                        color: theme.palette.grey[900],
                        '&.MuiChip-colorSuccess': {
                          backgroundColor: theme.palette.success.main,
                          color: theme.palette.common.white
                        },
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
                  <Box sx={{ minWidth: 200 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ flexGrow: 1, color: theme.palette.grey[300] }}>
                        Security Level
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.grey[300] }}>
                        {district.securityLevel}%
                      </Typography>
                    </Box>
                    <ProgressBar
                      variant="determinate"
                      value={district.securityLevel}
                      color={
                        district.securityLevel > 70
                          ? 'success'
                          : district.securityLevel > 40
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledCard>
            <Typography variant="h4" gutterBottom>
              Security Systems
            </Typography>
            <List>
              {systems.map((system, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: index < systems.length - 1 ? `1px solid ${theme.palette.grey[300]}` : 'none',
                    py: 2
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.grey[300] }}>
                    {system.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={system.name}
                    secondary={system.status}
                    secondaryTypographyProps={{ sx: { color: theme.palette.grey[300] } }}
                  />
                  <Box sx={{ minWidth: 100 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: theme.palette.grey[300] }}>
                        {system.coverage}%
                      </Typography>
                    </Box>
                    <ProgressBar
                      variant="determinate"
                      value={system.coverage}
                      color="success"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CitySecurityStatus; 