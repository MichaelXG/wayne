import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { IconShieldCheck, IconShieldX } from '@tabler/icons-react';
import { Tooltip } from '@mui/material';

// ===============================|| SHADOW BOX ||=============================== //

function ShadowBox({ shadow }) {
  return (
    <Card sx={{ mb: 3, boxShadow: shadow }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4.5,
          bgcolor: 'primary.light',
          color: 'grey.800'
        }}
      >
        <Box sx={{ color: 'inherit' }}>boxShadow: {shadow}</Box>
      </Box>
    </Card>
  );
}

// ===============================|| SHADOW BOX ||=============================== //

function CustomShadowBox({ shadow, label, color }) {
  return (
    <Card sx={{ mb: 3, boxShadow: shadow }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 3,
          bgcolor: color,
          color: 'background.default'
        }}
      >
        {!label && <Box sx={{ color: 'inherit' }}>boxShadow: {shadow}</Box>}
        {label && <Box sx={{ color: 'inherit' }}>{label}</Box>}
      </Box>
    </Card>
  );
}

// ============================|| UTILITIES SHADOW ||============================ //

export default function UtilitiesShadow() {
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
    <MainCard title="Basic Shadow" secondary={authIcon}>
      <Grid container spacing={gridSpacing}>
        <Grid size={12}>
          <SubCard title="Basic Shadow">
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="0" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="1" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="2" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="3" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="4" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="5" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="6" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="7" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="8" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="9" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="10" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="11" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="12" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="13" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="14" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="15" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="16" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="17" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="18" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="19" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="20" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="21" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="22" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="23" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShadowBox shadow="24" />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid size={12}>
          <SubCard title="Color Shadow">
            <Grid container spacing={gridSpacing}>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CustomShadowBox color="primary.main" shadow={theme.customShadows.primary} label="primary" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CustomShadowBox color="secondary.main" shadow={theme.customShadows.secondary} label="secondary" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CustomShadowBox color="orange.main" shadow={theme.customShadows.orange} label="orange" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CustomShadowBox color="success.main" shadow={theme.customShadows.success} label="success" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CustomShadowBox color="warning.main" shadow={theme.customShadows.warning} label="warning" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CustomShadowBox color="error.main" shadow={theme.customShadows.error} label="error" />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}

ShadowBox.propTypes = { shadow: PropTypes.string };

CustomShadowBox.propTypes = { shadow: PropTypes.string, label: PropTypes.string, color: PropTypes.string };
