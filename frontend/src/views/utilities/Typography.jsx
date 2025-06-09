// material-ui
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import MuiTypography from '@mui/material/Typography';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { Tooltip, useTheme } from '@mui/material';
import { IconShieldCheck, IconShieldX } from '@tabler/icons-react';

// ==============================|| TYPOGRAPHY ||============================== //

export default function Typography() {
  const theme = useTheme();
  const checkingAuth = useAuthGuard();

  const authIcon = !checkingAuth ? (
    <Tooltip
      title="User authenticated"
      placement="top"
      componentsProps={{
        tooltip: {
          sx: (theme) => ({
            backgroundColor: theme.palette.success.main,
            color: theme.palette.common.white,
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            boxShadow: theme.shadows[2]
          })
        }
      }}
    >
      <IconShieldCheck color={theme.palette.success.main} size={20} />{' '}
    </Tooltip>
  ) : (
    <Tooltip
      title="Authentication failed"
      placement="top"
      componentsProps={{
        tooltip: {
          sx: (theme) => ({
            backgroundColor: theme.palette.error.main,
            color: theme.palette.common.white,
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            boxShadow: theme.shadows[2]
          })
        }
      }}
    >
      <IconShieldX color={theme.palette.error.main} size={20} />
    </Tooltip>
  );

  return (
    <MainCard title="Basic Typography" secondary={authIcon}>
      <Grid container spacing={gridSpacing}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SubCard title="Heading">
            <Grid container direction="column" spacing={1}>
              <Grid>
                <MuiTypography variant="h1" gutterBottom>
                  h1. Heading
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="h2" gutterBottom>
                  h2. Heading
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="h3" gutterBottom>
                  h3. Heading
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="h4" gutterBottom>
                  h4. Heading
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="h5" gutterBottom>
                  h5. Heading
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="h6" gutterBottom>
                  h6. Heading
                </MuiTypography>
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SubCard title="Sub title">
            <Grid container direction="column" spacing={1}>
              <Grid>
                <MuiTypography variant="subtitle1" gutterBottom>
                  subtitle1. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="subtitle2" gutterBottom>
                  subtitle2. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur
                </MuiTypography>
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SubCard title="Body">
            <Grid container direction="column" spacing={1}>
              <Grid>
                <MuiTypography variant="body1" gutterBottom>
                  body1. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                  inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
                  quibusdam.
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="body2" gutterBottom>
                  body2. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                  inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
                  quibusdam.
                </MuiTypography>
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SubCard title="Extra">
            <Grid container direction="column" spacing={1}>
              <Grid>
                <MuiTypography variant="button" gutterBottom sx={{ display: 'block' }}>
                  button text
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="caption" gutterBottom sx={{ display: 'block' }}>
                  caption text
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="overline" gutterBottom sx={{ display: 'block' }}>
                  overline text
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography
                  variant="body2"
                  color="primary"
                  component={Link}
                  href="https://berrydashboard.io"
                  target="_blank"
                  underline="hover"
                  gutterBottom
                  sx={{ display: 'block' }}
                >
                  https://berrydashboard.io
                </MuiTypography>
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}
