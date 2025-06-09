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
  Chip,
  LinearProgress,
  useTheme
} from '@mui/material';
import { LocationOn, Warning, Security, CameraAlt, Radar, NetworkCheck } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { BaseDir } from '../../App';
import AddIcon from '@mui/icons-material/Add';
import DefaultLayout from '../../layout/DefaultLayout';
import DefaultCardLayout from '../orders/card/DefaultCardLayout';


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
  const checkingAuth = useAuthGuard();

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

  const breadcrumbs = useMemo(
    () => [{ label: 'Secret', href: `${BaseDir}/secret-page` }, { label: 'Security', href: `${BaseDir}/secret-page` }, { label: 'Status' }],
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
      subCardTitle="City Security Status"
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
          {/* Coluna 1 - Itens do pedido */}
          <Grid item xs={12} md={8} sx={{ height: '100%' }}>
            <DefaultCardLayout subCardTitle=" District Status" actionbutton={actionbutton}>
              {/* <StyledCard> */}
                <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                  {districts.map((district, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderBottom: index < districts.length - 1 ? `1px solid ${theme.palette.grey[600]}` : 'none',
                        py: 2
                      }}
                    >
                      <ListItemIcon sx={{ color: theme.palette.grey[600] }}>{district.icon}</ListItemIcon>
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
                            backgroundColor: theme.palette.grey[600],
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
                          <Typography variant="body2" sx={{ flexGrow: 1, color: theme.palette.grey[400] }}>
                            Security Level
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.palette.grey[600] }}>
                            {district.securityLevel}%
                          </Typography>
                        </Box>
                        <ProgressBar
                          variant="determinate"
                          value={district.securityLevel}
                          color={district.securityLevel > 70 ? 'success' : district.securityLevel > 40 ? 'warning' : 'error'}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              {/* </StyledCard> */}
            </DefaultCardLayout>
          </Grid>

          {/* Coluna 2 */}
          <Grid item xs={12} md={4} sx={{ height: '100%' }}>
            <DefaultCardLayout subCardTitle=" Security Systems" actionbutton={actionbutton}>
              {/* <StyledCard> */}
                <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                  {systems.map((system, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderBottom: index < systems.length - 1 ? `1px solid ${theme.palette.grey[600]}` : 'none',
                        py: 2
                      }}
                    >
                      <ListItemIcon sx={{ color: theme.palette.grey[600] }}>{system.icon}</ListItemIcon>
                      <ListItemText
                        primary={system.name}
                        secondary={system.status}
                        secondaryTypographyProps={{ sx: { color: theme.palette.grey[400] } }}
                      />
                      <Box sx={{ minWidth: 100 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: theme.palette.grey[600] }}>
                            {system.coverage}%
                          </Typography>
                        </Box>
                        <ProgressBar variant="determinate" value={system.coverage} color="success" />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              {/* </StyledCard> */}
            </DefaultCardLayout>
          </Grid>
        </Grid>
      </Box>
    </DefaultLayout>
  );
};

export default CitySecurityStatus;
