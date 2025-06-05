import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

import Header from './Header';
import Footer from './Footer';

const MainWrapper = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '100%'
});

const ContentWrapper = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'background.default',
  padding: '20px 0'
});

const MainSecretLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location]);

  return (
    <MainWrapper>
      <Header />
      <ContentWrapper>
        <Container maxWidth="xl">
          <Box sx={{ minHeight: 'calc(100vh - 180px)' }}>
            {children}
          </Box>
        </Container>
      </ContentWrapper>
      <Footer />
    </MainWrapper>
  );
};

export default MainSecretLayout; 