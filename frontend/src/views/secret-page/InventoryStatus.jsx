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
import { Inventory, Speed, Build, LocalShipping, Warning, CheckCircle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import AddIcon from '@mui/icons-material/Add';
import { BaseDir } from '../../App';
import DefaultCardLayout from '../orders/card/DefaultCardLayout';
import DefaultLayout from '../../layout/DefaultLayout';

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[300],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4
  }
}));

const InventoryStatus = () => {
  const theme = useTheme();
  const checkingAuth = useAuthGuard();

  const inventoryItems = [
    {
      name: 'Combat Suits',
      icon: <Build />,
      status: 'Optimal',
      stock: 85,
      lastMaintenance: '2 days ago'
    },
    {
      name: 'Vehicles',
      icon: <LocalShipping />,
      status: 'Good',
      stock: 92,
      lastMaintenance: '1 day ago'
    },
    {
      name: 'Gadgets',
      icon: <Speed />,
      status: 'Optimal',
      stock: 78,
      lastMaintenance: '3 days ago'
    },
    {
      name: 'Weapons',
      icon: <Warning />,
      status: 'Critical',
      stock: 45,
      lastMaintenance: 'Today'
    }
  ];

  const breadcrumbs = useMemo(
    () => [
      { label: 'Secret', href: `${BaseDir}/secret-page` },
      { label: 'Inventory', href: `${BaseDir}/secret-page` },
      { label: 'Status' }
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
      mainCardTitle="Inventory"
      subCardTitle="Status"
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
          spacing={1}
          alignItems="stretch"
          sx={{
            height: '100%',
            minHeight: 'calc(100vh - 200px)'
          }}
        >
          <Grid item xs={12} md={12} sx={{ height: '100%' }}>
            <DefaultCardLayout subCardTitle=" Equipment Overview" actionbutton={actionbutton}>
              <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                {inventoryItems.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      borderBottom: index < inventoryItems.length - 1 ? `1px solid ${theme.palette.grey[300]}` : 'none',
                      py: 2
                    }}
                  >
                    <ListItemIcon sx={{ color: theme.palette.grey[500] }}>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={`Last Maintenance: ${item.lastMaintenance}`}
                      secondaryTypographyProps={{ sx: { color: theme.palette.grey[500] } }}
                    />
                    <Box sx={{ minWidth: 120, textAlign: 'right', mr: 2 }}>
                      <Chip
                        label={item.status}
                        color={item.status === 'Optimal' ? 'success' : item.status === 'Good' ? 'info' : 'error'}
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.grey[500],
                          color: theme.palette.grey[900],
                          '&.MuiChip-colorSuccess': {
                            backgroundColor: theme.palette.success.main,
                            color: theme.palette.common.white
                          },
                          '&.MuiChip-colorError': {
                            backgroundColor: theme.palette.error.main,
                            color: theme.palette.common.white
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
                        <Typography variant="body2" sx={{ flexGrow: 1, color: theme.palette.grey[500] }}>
                          Stock Level
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
                          {item.stock}%
                        </Typography>
                      </Box>
                      <ProgressBar
                        variant="determinate"
                        value={item.stock}
                        color={item.stock > 70 ? 'success' : item.stock > 40 ? 'warning' : 'error'}
                      />
                    </Box>
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

export default InventoryStatus;
