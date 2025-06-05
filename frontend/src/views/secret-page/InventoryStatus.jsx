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
  LinearProgress
} from '@mui/material';
import {
  Inventory,
  Speed,
  Build,
  LocalShipping,
  Warning,
  CheckCircle
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

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  '& .MuiLinearProgress-bar': {
    borderRadius: 4
  }
}));

const InventoryStatus = () => {
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Inventory Status
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledCard>
            <Typography variant="h4" gutterBottom>
              Equipment Overview
            </Typography>
            <List>
              {inventoryItems.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: index < inventoryItems.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    py: 2
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={`Last Maintenance: ${item.lastMaintenance}`}
                    secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                  />
                  <Box sx={{ minWidth: 120, textAlign: 'right', mr: 2 }}>
                    <Chip
                      label={item.status}
                      color={
                        item.status === 'Optimal'
                          ? 'success'
                          : item.status === 'Good'
                          ? 'info'
                          : 'error'
                      }
                      size="small"
                    />
                  </Box>
                  <Box sx={{ minWidth: 200 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Stock Level
                      </Typography>
                      <Typography variant="body2">{item.stock}%</Typography>
                    </Box>
                    <ProgressBar
                      variant="determinate"
                      value={item.stock}
                      color={
                        item.stock > 70
                          ? 'success'
                          : item.stock > 40
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
      </Grid>
    </Box>
  );
};

export default InventoryStatus; 