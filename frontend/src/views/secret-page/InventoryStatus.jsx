import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Inventory,
  Build,
  DirectionsCar,
  Security,
  Science,
  Memory,
  Speed,
  Update
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  borderColor: 'rgba(255, 255, 255, 0.1)'
}));

const StyledCircularProgress = styled(CircularProgress)(({ value }) => ({
  color: value >= 70 ? '#4caf50' : value >= 40 ? '#ff9800' : '#f44336'
}));

const InventoryStatus = () => {
  const equipment = [
    {
      id: 'BAT-001',
      name: 'Batmobile Mark IV',
      category: 'Vehicle',
      status: 'Operational',
      location: 'Batcave Level 2',
      condition: 95,
      lastMaintenance: '2 days ago',
      icon: <DirectionsCar />
    },
    {
      id: 'BAT-002',
      name: 'Grappling Hook System',
      category: 'Gear',
      status: 'In Use',
      location: 'Field',
      condition: 88,
      lastMaintenance: '1 week ago',
      icon: <Build />
    },
    {
      id: 'BAT-003',
      name: 'Batcomputer System',
      category: 'Technology',
      status: 'Operational',
      location: 'Batcave Main',
      condition: 100,
      lastMaintenance: '1 day ago',
      icon: <Memory />
    },
    {
      id: 'BAT-004',
      name: 'Advanced Body Armor',
      category: 'Protection',
      status: 'Maintenance',
      location: 'Arsenal',
      condition: 65,
      lastMaintenance: '3 hours ago',
      icon: <Security />
    },
    {
      id: 'BAT-005',
      name: 'Chemical Analysis Kit',
      category: 'Science',
      status: 'Operational',
      location: 'Lab',
      condition: 92,
      lastMaintenance: '5 days ago',
      icon: <Science />
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational':
        return 'success';
      case 'In Use':
        return 'info';
      case 'Maintenance':
        return 'warning';
      default:
        return 'error';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
        Equipment Inventory
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                Critical Equipment Status
              </Typography>
              <IconButton size="small" sx={{ color: '#fff' }}>
                <Speed />
              </IconButton>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Equipment</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Location</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Condition</StyledTableCell>
                    <StyledTableCell>Last Maintenance</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipment.map((item) => (
                    <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {item.icon}
                          {item.name}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{item.category}</StyledTableCell>
                      <StyledTableCell>{item.location}</StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={item.status}
                          color={getStatusColor(item.status)}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                          <StyledCircularProgress
                            variant="determinate"
                            value={item.condition}
                            size={40}
                          />
                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: 'absolute',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="caption" sx={{ color: '#fff' }}>
                              {item.condition}%
                            </Typography>
                          </Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Update fontSize="small" />
                          {item.lastMaintenance}
                        </Box>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryStatus; 