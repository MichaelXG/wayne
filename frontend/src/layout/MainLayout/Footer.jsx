import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: 3,
        mt: 'auto'
      }}
    >
      <Typography variant="caption">
        &copy; All rights reserved{' '}
        <Typography
          component={Link}
          href="/"
          target="_blank"
          sx={(theme) => ({
            color: theme.palette.grey[600],
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          })}
        >
          Wayne Industries
        </Typography>
      </Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          component={RouterLink}
          to="https://discord.gg/TVHHuKvc65"
          target="_blank"
          variant="caption"
          sx={(theme) => ({
            color: theme.palette.text.primary,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          })}
        >
          Discord
        </Link>
      </Stack>
    </Stack>
  );
}
