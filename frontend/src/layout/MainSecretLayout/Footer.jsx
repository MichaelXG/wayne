import { Typography, Container, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  marginTop: 'auto',
  borderTop: `1px solid ${theme.palette.divider}`
}));

const Footer = () => {
  return (
    <FooterWrapper>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Wayne Enterprises - Confidential
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer; 