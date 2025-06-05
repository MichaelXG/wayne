import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { alpha } from '@mui/material/styles';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import OrderStatusPieChart from './OrderStatusPieChart';
import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MainCard from '../../../ui-component/cards/MainCard';
import { Tooltip } from '@mui/material';
import { IconShieldCheck, IconShieldX } from '@tabler/icons-react';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import SubCard from '../../../ui-component/cards/SubCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  const checkingAuth = useAuthGuard();

  const authIcon = checkingAuth ? (
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  return (
    <MainCard
      title="Dashboard Overview"
      secondary={
        <Box display="flex" alignItems="center" gap={1}>
          {authIcon}
        </Box>
      }
    >
      <Grid item xs={12} sx={{ width: '100%', margin: 0, mb: 3 }}>
        <SubCard
          sx={{
            boxShadow: (theme) => `
              0 2px 4px ${alpha(theme.palette.grey[500], 0.1)},
              0 4px 8px ${alpha(theme.palette.grey[400], 0.15)},
              0 8px 16px ${alpha(theme.palette.grey[300], 0.18)}
            `,
            transition: 'all 0.3s ease-in-out',
            border: (theme) => `2px solid ${alpha(theme.palette.grey[400], 0.7)}`,
            borderRadius: '12px',
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
            '&:hover': {
              boxShadow: (theme) => `
                0 4px 8px ${alpha(theme.palette.grey[500], 0.15)},
                0 8px 16px ${alpha(theme.palette.grey[400], 0.2)},
                0 16px 32px ${alpha(theme.palette.grey[300], 0.25)}
              `,
              transform: 'translateY(-2px)'
            }
          }}
          title={
            <Box sx={{ width: '100%' }}>
              <Box display="flex" alignItems="center" justifyContent="flex-end" flexWrap="wrap" gap={2}>
                <Grid
                  item
                  xs={12}
                  sx={{ width: '100%', margin: 0, display: 'flex', justifyContent: 'flex-end' }}
                  container
                  spacing={gridSpacing}
                >
                  <FormControl
                    size="small"
                    align="right"
                    sx={{
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.grey[300], 0.04),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.grey[600], 0.08)
                        }
                      }
                    }}
                  >
                    <InputLabel id="time-range-label">Time Range</InputLabel>
                    <Select
                      labelId="time-range-label"
                      value={timeRange}
                      onChange={handleTimeRangeChange}
                      label="Time Range"
                      startAdornment={
                        <CalendarTodayOutlinedIcon
                          sx={{
                            mr: 1,
                            color: theme.palette.grey[600]
                          }}
                        />
                      }
                    >
                      <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="week">This Week</MenuItem>
                      <MenuItem value="month">This Month</MenuItem>
                      <MenuItem value="year">This Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Box>
            </Box>
          }
        >
          <Grid container spacing={3}>
            <Grid size={12}>
              <Grid container spacing={3}>
                <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
                  <Box
                    sx={{
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <EarningCard isLoading={isLoading} timeRange={timeRange} />
                  </Box>
                </Grid>
                <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
                  <Box
                    sx={{
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <TotalOrderLineChartCard isLoading={isLoading} timeRange={timeRange} />
                  </Box>
                </Grid>
                <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                      <Box
                        sx={{
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[4]
                          }
                        }}
                      >
                        <TotalIncomeDarkCard isLoading={isLoading} timeRange={timeRange} />
                      </Box>
                    </Grid>
                    <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                      <Box
                        sx={{
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[4]
                          }
                        }}
                      >
                        <TotalIncomeLightCard
                          isLoading={isLoading}
                          timeRange={timeRange}
                          total={203}
                          label="Total Income"
                          icon={<StorefrontTwoToneIcon fontSize="inherit" />}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 2,
                      boxShadow: theme.shadows[1],
                      p: 2,
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <TotalGrowthBarChart isLoading={isLoading} timeRange={timeRange} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Grid container spacing={3}>
                    <Grid size={12}>
                      <Box
                        sx={{
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 2,
                          boxShadow: theme.shadows[1],
                          p: 2,
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[4]
                          }
                        }}
                      >
                        <PopularCard isLoading={isLoading} timeRange={timeRange} />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </MainCard>
  );
}
