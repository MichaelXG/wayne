import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import {
  Security,
  LocationCity,
  Warning,
  RadioButtonChecked,
  Notifications,
  Campaign,
  LocalPolice,
  VerifiedUser
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

const StatusIndicator = styled('div')(({ status }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor:
    status === 'critical' ? '#f44336' :
    status === 'warning' ? '#ff9800' :
    status === 'stable' ? '#4caf50' :
    '#2196f3',
  boxShadow: '0 0 8px rgba(0,0,0,0.3)'
}));

const DistrictProgress = styled(LinearProgress)(({ theme, value }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4
  }
}));

const CitySecurityStatus = () => {
  const districts = [
    {
      name: 'Downtown Gotham',
      status: 'warning',
      threatLevel: 75,
      activeUnits: 12,
      incidents: 3,
      description: 'Increased criminal activity detected'
    },
    {
      name: 'Arkham District',
      status: 'critical',
      threatLevel: 90,
      activeUnits: 20,
      incidents: 5,
      description: 'Multiple high-risk inmates at large'
    },
    {
      name: 'Diamond District',
      status: 'stable',
      threatLevel: 45,
      activeUnits: 8,
      incidents: 1,
      description: 'Standard patrol operations'
    },
    {
      name: 'Gotham Harbor',
      status: 'alert',
      threatLevel: 60,
      activeUnits: 10,
      incidents: 2,
      description: 'Suspicious shipments detected'
    }
  ];

  const emergencyAlerts = [
    {
      id: 1,
      type: 'High Priority',
      message: 'Chemical threat detected at Ace Chemicals',
      time: '10 minutes ago',
      severity: 'critical'
    },
    {
      id: 2,
      type: 'Security Breach',
      message: 'Unauthorized access at Wayne Tower',
      time: '15 minutes ago',
      severity: 'warning'
    },
    {
      id: 3,
      type: 'Police Activity',
      message: 'GCPD requesting backup in East End',
      time: '20 minutes ago',
      severity: 'alert'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'stable':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
        City Security Status
      </Typography>

      <Grid container spacing={3}>
        {/* District Status */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                District Security Overview
              </Typography>
              <IconButton size="small" sx={{ color: '#fff' }}>
                <LocationCity />
              </IconButton>
            </Box>

            <List>
              {districts.map((district, index) => (
                <React.Fragment key={district.name}>
                  <ListItem
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      mb: 2
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StatusIndicator status={district.status} />
                          <Typography variant="subtitle1">
                            {district.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${district.activeUnits} Units`}
                          size="small"
                          icon={<LocalPolice sx={{ fontSize: '16px !important' }} />}
                          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
                          Threat Level: {district.threatLevel}%
                        </Typography>
                        <DistrictProgress
                          variant="determinate"
                          value={district.threatLevel}
                          color={getStatusColor(district.status)}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          {district.description}
                        </Typography>
                        <Chip
                          label={`${district.incidents} Incidents`}
                          size="small"
                          color={getStatusColor(district.status)}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                  {index < districts.length - 1 && (
                    <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </StyledCard>
        </Grid>

        {/* Emergency Alerts */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                Emergency Alerts
              </Typography>
              <IconButton size="small" sx={{ color: '#fff' }}>
                <Campaign />
              </IconButton>
            </Box>

            <List>
              {emergencyAlerts.map((alert, index) => (
                <ListItem
                  key={alert.id}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    mb: 2,
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                    <Chip
                      label={alert.type}
                      size="small"
                      color={getStatusColor(alert.severity)}
                      icon={<Warning sx={{ fontSize: '16px !important' }} />}
                    />
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {alert.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {alert.message}
                  </Typography>
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