import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage({ status, title, description, image }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <img src={image} alt={title} style={{ width: 150, marginBottom: 20 }} />
      <Typography variant="h3" color="error">
        {status} - {title}
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        {description}
      </Typography>
      <Button variant="contained" sx={{ mt: 4 }} onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </Box>
  );
}
