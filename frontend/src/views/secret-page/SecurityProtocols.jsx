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
  Switch,
  Chip,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Security,
  Shield,
  Lock,
  Visibility,
  VerifiedUser,
  Warning,
  Camera,
  Radar
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

const SecurityProtocols = () => {
  const theme = useTheme();

  const securitySystems = [
    {
      name: 'Perimeter Defense',
      icon: <Shield />,
      status: 'Active',
      level: 92,
      lastCheck: '2 minutes ago'
    },
    {
      name: 'Surveillance System',
      icon: <Camera />,
      status: 'Active',
      level: 88,
      lastCheck: '1 minute ago'
    },
    {
      name: 'Biometric Access',
      icon: <Lock />,
      status: 'Active',
      level: 100,
      lastCheck: 'Just now'
    },
    {
      name: 'Threat Detection',
      icon: <Radar />,
      status: 'Active',
      level: 95,
      lastCheck: '5 minutes ago'
    }
  ];

  const alerts = [
    {
      severity: 'high',
      message: 'Unauthorized access attempt - East Wing',
      time: '10 minutes ago'
    },
    {
      severity: 'medium',
      message: 'Motion detected in restricted area',
      time: '15 minutes ago'
    },
    {
      severity: 'low',
      message: 'System maintenance required',
      time: '1 hour ago'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: theme.palette.common.white }}>
        Security Protocols Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Security Systems Status */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Security Systems Status
            </Typography>
            <List>
              {securitySystems.map((system, index) => (
                <ListItem
                  key={index}
                  sx={{
                    mb: 2,
                    backgroundColor: theme.palette.grey[300],
                    borderRadius: 2
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.grey[900] }}>
                    {system.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={system.name}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <ProgressBar
                          variant="determinate"
                          value={system.level}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: theme.palette.grey[900] }}>
                          Last check: {system.lastCheck}
                        </Typography>
                      </Box>
                    }
                  />
                  <Chip
                    label={system.status}
                    color="success"
                    size="small"
                    sx={{
                      ml: 2,
                      backgroundColor: theme.palette.grey[300],
                      color: theme.palette.grey[900],
                      '&.MuiChip-colorSuccess': {
                        backgroundColor: theme.palette.success.main,
                        color: theme.palette.common.white
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </StyledCard>
        </Grid>

        {/* Security Alerts */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                Active Alerts
              </Typography>
              <IconButton size="small" sx={{ color: theme.palette.common.white }}>
                <Warning />
              </IconButton>
            </Box>
            <List>
              {alerts.map((alert, index) => (
                <ListItem
                  key={index}
                  sx={{
                    mb: 2,
                    backgroundColor: theme.palette.grey[300],
                    borderRadius: 2
                  }}
                >
                  <ListItemText
                    primary={alert.message}
                    secondary={
                      <Typography variant="caption" sx={{ color: theme.palette.grey[900] }}>
                        {alert.time}
                      </Typography>
                    }
                  />
                  <Chip
                    label={alert.severity}
                    color={
                      alert.severity === 'high'
                        ? 'error'
                        : alert.severity === 'medium'
                        ? 'warning'
                        : 'info'
                    }
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
                </ListItem>
              ))}
            </List>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecurityProtocols; 