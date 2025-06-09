import React, { useMemo } from 'react';
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
import { Security, Shield, Lock, Visibility, VerifiedUser, Warning, Camera, Radar } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import DefaultCardLayout from '../orders/card/DefaultCardLayout';
import DefaultLayout from '../../layout/DefaultLayout';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { BaseDir } from '../../App';
import AddIcon from '@mui/icons-material/Add';


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
  const checkingAuth = useAuthGuard();

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
  const breadcrumbs = useMemo(
    () => [
      { label: 'Secret', href: `${BaseDir}/secret-page` },
      { label: 'Security', href: `${BaseDir}/secret-page` },
      { label: 'Protocols' }
    ],
    []
  );

  const actionbutton = useMemo(
    () => ({
      label: '',
      href: `#`,
      icon: <AddIcon />,
      disable: true
    }),
    []
  );

  // Previne renderização antes da validação
  if (checkingAuth) return null;

  return (
    <DefaultLayout
      mainCardTitle="Security"
      subCardTitle=" Security Systems Status"
      breadcrumbs={breadcrumbs}
      backButton={{ type: 'link', link: `/secret-page` }}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <Box
        sx={(theme) => ({
          px: 2,
          py: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          maxWidth: '1500px',
          width: '100%',
          margin: '0 auto',
          fontFamily: theme.typography.fontFamily,
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: '1.334em',
          color: theme.palette.text.primary,
          WebkitFontSmoothing: 'antialiased',
          WebkitTextSizeAdjust: '100%',
          WebkitTapHighlightColor: 'transparent',
          backgroundColor: theme.palette.background.default
        })}
      >
        <Grid
          container
          spacing={2}
          alignItems="stretch"
          sx={{
            height: '100%',
            minHeight: 'calc(100vh - 200px)'
          }}
        >
          {/* Coluna 1 - Protocolos */}
          <Grid item xs={12} md={8} sx={{ height: '100%' }}>
            <DefaultCardLayout subCardTitle=" Protocols Systems" actionbutton={actionbutton}>
              <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                {securitySystems.map((system, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      borderBottom: index < securitySystems.length - 1 ? `1px solid ${theme.palette.grey[600]}` : 'none',
                      py: 2
                    }}
                  >
                    <ListItemIcon sx={{ color: theme.palette.grey[600] }}>{system.icon}</ListItemIcon>
                    <ListItemText
                      primary={system.name}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <ProgressBar variant="determinate" value={system.level} sx={{ mb: 1 }} />
                          <Typography variant="caption" sx={{ color: theme.palette.grey[600] }}>
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
                        backgroundColor: theme.palette.grey[600],
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
            </DefaultCardLayout>
          </Grid>

          {/* Coluna 2 - Alertas */}
          <Grid item xs={12} md={4} sx={{ height: '100%' }}>
            <DefaultCardLayout subCardTitle="Active Alerts" actionbutton={actionbutton}>
              <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'right', mb: 3 }}>
                  <IconButton size="small" sx={{ color: theme.palette.error.main }}>
                    <Warning />
                  </IconButton>
                </Box>
                {alerts.map((alert, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      borderBottom: index < alerts.length - 1 ? `1px solid ${theme.palette.grey[600]}` : 'none',
                      py: 2
                    }}
                  >
                    <ListItemText
                      primary={alert.message}
                      secondary={
                        <Typography variant="caption" sx={{ color: theme.palette.grey[400] }}>
                          {alert.time}
                        </Typography>
                      }
                    />
                    <Chip
                      label={alert.severity}
                      color={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'info'}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.grey[600],
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
            </DefaultCardLayout>
          </Grid>
        </Grid>
      </Box>
    </DefaultLayout>
  );
};

export default SecurityProtocols;
