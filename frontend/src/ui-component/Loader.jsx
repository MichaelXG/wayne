import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

export default function Loader() {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, zIndex: 1301, width: '100%' }}>
      <LinearProgress
        sx={{
          backgroundColor: theme.palette.grey[300],
          '& .MuiLinearProgress-bar': { backgroundColor: theme.palette.grey[600] }
        }}
      />
    </Box>
  );
}
