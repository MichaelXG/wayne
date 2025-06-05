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

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

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
    <Box sx={{ 
      minHeight: '100vh',
      p: { xs: 2, sm: 3 },
      backgroundColor: '#eef2f6'
    }}>
      {/* Header with Filters */}
      <Box 
        sx={{ 
          mb: 4,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1]
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            color: theme.palette.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 600
          }}
        >
          Dashboard Overview
        </Typography>
        <FormControl 
          size="small" 
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
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
                  color: theme.palette.primary.main
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
      </Box>

      <Grid container spacing={3}>
        <Grid size={12}>
          <Grid container spacing={3}>
            <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
              <Box sx={{ 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}>
                <EarningCard isLoading={isLoading} timeRange={timeRange} />
              </Box>
            </Grid>
            <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
              <Box sx={{ 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}>
                <TotalOrderLineChartCard isLoading={isLoading} timeRange={timeRange} />
              </Box>
            </Grid>
            <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
              <Grid container spacing={3}>
                <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                  <Box sx={{ 
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}>
                    <TotalIncomeDarkCard isLoading={isLoading} timeRange={timeRange} />
                  </Box>
                </Grid>
                <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                  <Box sx={{ 
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}>
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
              <Box sx={{ 
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
              }}>
                <TotalGrowthBarChart isLoading={isLoading} timeRange={timeRange} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Grid container spacing={3}>
                
                <Grid size={12}>
                  <Box sx={{ 
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: theme.shadows[1],
                    p: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}>
                    <PopularCard isLoading={isLoading} timeRange={timeRange} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
