import React from 'react';
import styled from '@emotion/styled';
import { Box, Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Security, Inventory, Person, Warning } from '@mui/icons-material';

// Import images
import cloud1 from '../../assets/images/cloud/cloud1.png';
import cloud2 from '../../assets/images/cloud/cloud2.png';
import cloud3 from '../../assets/images/cloud/cloud3.png';
import cloud4 from '../../assets/images/cloud/cloud4.png';
import cloud5 from '../../assets/images/cloud/cloud5.png';
import forestBG from '../../assets/images/cloud/gothamCity.webp';

// Styled components
const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
`;

const Container1 = styled.div`
  background-image: url(${forestBG});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 60%;
  position: relative;

  h2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    color: white;
    font-size: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

const Cloud = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;

  img {
    animation: cld calc(8s * var(--i)) linear infinite;
    opacity: 0.6;
    max-width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  @keyframes cld {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const Container2 = styled.div`
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  h4 {
    text-align: center;
    color: #1a237e;
    font-size: 24px;
    padding-top: 20px;
    margin-bottom: 30px;
  }
`;

const StyledCard = styled(Card)`
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`;

// Global styles
const GlobalStyle = styled.div`
  * {
    margin: 0;
    padding: 0;
    font-family: 'Lato', sans-serif;
  }
`;

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
      title: 'Security Alerts',
      value: '12',
      icon: <Security color="primary" />,
      description: 'Active security protocols in place'
    },
    {
      title: 'Inventory Status',
      value: '89%',
      icon: <Inventory color="success" />,
      description: 'Current equipment availability'
    },
    {
      title: 'Wanted List',
      value: '8',
      icon: <Person color="error" />,
      description: 'High-priority targets in Gotham'
    },
    {
      title: 'Threat Level',
      value: 'High',
      icon: <Warning color="warning" />,
      description: 'Current city threat assessment'
    }
  ];

  return (
    <GlobalStyle>
      <Container>
        <Container1>
          <Cloud>
            {clouds.map((cloud, index) => (
              <img key={index} src={cloud.src} alt={`cloud ${index + 1}`} style={{ '--i': cloud.i }} />
            ))}
          </Cloud>
        </Container1>
        <Container2>
          <h4>Command Center Overview</h4>
          <Grid container spacing={3}>
            {quickStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StyledCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="h6" color="textSecondary">
                        {stat.title}
                      </Typography>
                      <IconButton size="small">{stat.icon}</IconButton>
                    </Box>
                    <Typography variant="h4" component="div" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.description}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container2>
      </Container>
    </GlobalStyle>
  );
};

export default HomeSecret;
