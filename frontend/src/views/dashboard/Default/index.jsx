import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
    <>
      {/* Cabeçalho com Filtros */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h2">Dashboard</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            size="small"
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={gridSpacing}>
        <Grid size={12}>
          <Grid container spacing={gridSpacing}>
            <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
              <EarningCard isLoading={isLoading} timeRange={timeRange} />
            </Grid>
            <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
              <TotalOrderLineChartCard isLoading={isLoading} timeRange={timeRange} />
            </Grid>
            <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
              <Grid container spacing={gridSpacing}>
                <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                  <TotalIncomeDarkCard isLoading={isLoading} timeRange={timeRange} />
                </Grid>
                <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                  <TotalIncomeLightCard
                    isLoading={isLoading}
                    timeRange={timeRange}
                    total={203}
                    label="Total Income"
                    icon={<StorefrontTwoToneIcon fontSize="inherit" />}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={gridSpacing}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TotalGrowthBarChart isLoading={isLoading} timeRange={timeRange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Grid container spacing={gridSpacing}>
                <Grid size={12}>
                  <OrderStatusPieChart timeRange={timeRange} />
                </Grid>
                <Grid size={12}>
                  <PopularCard isLoading={isLoading} timeRange={timeRange} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
