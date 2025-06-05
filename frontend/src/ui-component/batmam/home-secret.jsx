import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid, Card, CardContent, Typography, IconButton, Chip, LinearProgress } from '@mui/material';
import { Security, Inventory, Person, Warning, Shield, LocationOn, Visibility, Speed } from '@mui/icons-material';

// Import images
import cloud1 from '../../assets/images/cloud/cloud1.png';
import cloud2 from '../../assets/images/cloud/cloud2.png';
import cloud3 from '../../assets/images/cloud/cloud3.png';
import cloud4 from '../../assets/images/cloud/cloud4.png';
import cloud5 from '../../assets/images/cloud/cloud5.png';
import gothamCity from '../../assets/images/cloud/gothamCity.webp';

// Styled components
const Container = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  overflow: 'auto',
  backgroundColor: theme.palette.grey[600]
}));

const Container1 = styled('div')(({ theme }) => ({
  backgroundImage: `url(${gothamCity})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: '100%',
  height: '60%',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  }
}));

const Cloud = styled('div')({
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  position: 'absolute',
  bottom: 0,
  zIndex: 2,
  '& img': {
    animation: 'cld calc(8s * var(--i)) linear infinite',
    opacity: 0.6,
    maxWidth: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%'
  },
  '@keyframes cld': {
    '0%': {
      transform: 'translateX(-100%)'
    },
    '100%': {
      transform: 'translateX(100%)'
    }
  }
});

const Container2 = styled('div')(({ theme }) => ({
  width: '90%',
  margin: '-60px auto 20px',
  padding: theme.spacing(2.5),
  position: 'relative',
  zIndex: 3
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? theme.palette.grey[900]
    : theme.palette.grey[600],
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  color: theme.palette.common.white,
  transition: 'all 0.3s ease-in-out',
  border: `1px solid ${theme.palette.grey[600]}`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[20],
    background: theme.palette.mode === 'dark'
      ? theme.palette.grey[900]
      : theme.palette.grey[500],
    borderColor: theme.palette.grey[300]
  },
  '& .MuiCardContent-root': {
    borderRadius: '12px',
    padding: '24px'
  }
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  fontSize: '0.75rem',
  background: theme.palette.grey[600],
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey[700]}`,
  borderRadius: '12px',
  '& .MuiChip-label': {
    fontWeight: 500
  },
  zIndex: 2
}));

const StyledProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: '4px',
  backgroundColor: theme.palette.grey[800],
  marginTop: theme.spacing(1),
  '& .MuiLinearProgress-bar': {
    borderRadius: '4px'
  }
}));

const IconWrapper = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[500],
  backgroundColor: theme.palette.grey[300],
  borderRadius: '50%',
  padding: theme.spacing(1),
  width: 40,
  height: 40,
  minWidth: 40,
  minHeight: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: '1.5rem'
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.common.white,
    transform: 'scale(1.1)',
    transition: 'all 0.2s ease-in-out'
  }
}));

const HomeSecret = () => {
  const clouds = [
    { src: cloud1, i: 1 },
    { src: cloud2, i: 2 },
    { src: cloud3, i: 3 },
    { src: cloud4, i: 4 },
    { src: cloud5, i: 5 }
  ];

  const quickStats = [
    {
      title: 'Security Protocol Status',
      value: '12',
      icon: <Security />,
      description: 'Active security protocols',
      status: 'Active',
      progress: 92,
      secondaryIcon: <Shield />,
      location: 'Batcave Main'
    },
    {
      title: 'Advanced Equipment',
      value: '89%',
      icon: <Inventory />,
      description: 'Equipment operational status',
      status: 'Optimal',
      progress: 89,
      secondaryIcon: <Speed />,
      location: 'Arsenal Level 3'
    },
    {
      title: 'High Priority Targets',
      value: '8',
      icon: <Person />,
      description: 'Active threats in Gotham',
      status: 'Alert',
      progress: 67,
      secondaryIcon: <Visibility />,
      location: 'City-wide'
    },
    {
      title: 'City Threat Level',
      value: 'High',
      icon: <Warning />,
      description: 'Current threat assessment',
      status: 'Critical',
      progress: 78,
      secondaryIcon: <LocationOn />,
      location: 'Gotham Central'
    }
  ];

  return (
    <Container>
      <Container1>
        <Cloud>
          {clouds.map((cloud, index) => (
            <img key={index} src={cloud.src} alt={`cloud ${index + 1}`} style={{ '--i': cloud.i }} />
          ))}
        </Cloud>
      </Container1>
      <Container2>
        <Grid container spacing={3}>
          {quickStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StyledCard>
                <CardContent sx={{ position: 'relative', minHeight: '200px' }}>
                  <StatusChip 
                    label={stat.status}
                    color={
                      stat.status === 'Active' ? 'success' :
                      stat.status === 'Optimal' ? 'info' :
                      stat.status === 'Alert' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
                    <Typography variant="h6" sx={{ color: 'common.white', maxWidth: 'calc(100% - 56px)' }}>
                      {stat.title}
                    </Typography>
                    <IconWrapper size="small">{stat.icon}</IconWrapper>
                  </Box>
                  <Typography variant="h4" component="div" gutterBottom sx={{ color: 'common.white' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
                    {stat.description}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <IconWrapper size="small" sx={{ mr: 1 }}>{stat.secondaryIcon}</IconWrapper>
                      <Typography variant="caption" sx={{ color: 'grey.400' }}>
                        {stat.location}
                      </Typography>
                    </Box>
                    <StyledProgress 
                      variant="determinate" 
                      value={stat.progress}
                      color={
                        stat.status === 'Active' ? 'success' :
                        stat.status === 'Optimal' ? 'info' :
                        stat.status === 'Alert' ? 'warning' : 'error'
                      }
                    />
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container2>
    </Container>
  );
};

export default HomeSecret;
