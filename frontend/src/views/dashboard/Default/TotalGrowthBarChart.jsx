import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { 
  useTheme,
  Grid,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  ButtonGroup,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';

import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import { statusColors, statusIcons } from '../../../utils/statusUtils';

const viewModes = [
  { value: 'stacked', label: 'Stacked' },
  { value: 'grouped', label: 'Grouped' },
  { value: 'percentage', label: 'Percentage' }
];

export default function TotalGrowthBarChart({ isLoading, timeRange = 'week' }) {
  const [viewMode, setViewMode] = useState('stacked');
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { mode } = useConfig();
  const [statusTotals, setStatusTotals] = useState({});
  const [totalGrowth, setTotalGrowth] = useState(0);

  const [userData] = useLocalStorage('wayne-user-data', {});
  const checkingAuth = useAuthGuard();
  const token = userData?.authToken || null;

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ROUTES.ORDERS_GROWTH_STATUS, {
        headers: { Authorization: `Bearer ${token}` },
        params: { period: timeRange }
      });

      const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setCategories(allMonths);

      const filledSeries = (response.data?.series || []).map((serie) => {
        const dataMap = {};
        (response.data.categories || []).forEach((label, i) => {
          dataMap[label] = serie.data[i];
        });

        const filledData = allMonths.map((month) => dataMap[month] || 0);
        
        // Calculate total for this series
        const total = filledData.reduce((a, b) => a + b, 0);
        setTotals(prev => ({ ...prev, [serie.name]: total }));
        
        return { ...serie, data: filledData };
      });

      setSeries(filledSeries);

      // Calculate status totals
      const totals = {};
      filledSeries.forEach(series => {
        totals[series.name] = series.data.reduce((sum, val) => sum + val, 0);
      });
      setStatusTotals(totals);

      // Calculate total growth
      const calculateGrowth = () => {
        const lastIndex = filledSeries[0].data.length - 1;
        const currentTotal = filledSeries.reduce((sum, series) => sum + series.data[lastIndex], 0);
        const previousTotal = filledSeries.reduce((sum, series) => sum + series.data[lastIndex - 1], 0);
        
        if (previousTotal === 0) return 0;
        return ((currentTotal - previousTotal) / previousTotal) * 100;
      };

      setTotalGrowth(Number(calculateGrowth().toFixed(1)));
    } catch (error) {
      console.error('❌ Failed to fetch ORDERS_GROWTH_STATUS:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthData();
  }, [timeRange]);

  const dynamicColors = series.map((s) => {
    const colorKey = statusColors[s.name] || 'grey';
    const tone = s.name === 'paid' ? 'light' : 'main';
    return theme.palette[colorKey]?.[tone] || theme.palette.grey[300];
  });

  const getChartOptions = () => {
    const baseOptions = {
      chart: {
        id: 'bar-chart',
        stacked: viewMode !== 'grouped',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      colors: dynamicColors,
      xaxis: {
        categories,
        labels: {
          style: { colors: theme.palette.text.primary }
        }
      },
      yaxis: {
        labels: {
          style: { colors: theme.palette.text.primary },
          formatter: (value) => {
            if (viewMode === 'percentage') {
              return `${value.toFixed(0)}%`;
            }
            return value;
          }
        }
      },
      grid: { borderColor: theme.palette.divider },
      tooltip: {
        theme: mode,
        y: {
          formatter: (value, { seriesIndex }) => {
            if (viewMode === 'percentage') {
              return `${value.toFixed(1)}%`;
            }
            const seriesName = series[seriesIndex].name;
            return `${value} orders (${seriesName})`;
          }
        }
      },
      legend: {
        labels: { colors: theme.palette.text.primary }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 4
        }
      }
    };

    if (viewMode === 'percentage') {
      baseOptions.plotOptions.bar.stacked = true;
      baseOptions.plotOptions.bar.stackType = '100%';
    }

    return baseOptions;
  };

  if (checkingAuth) return null;
  if (isLoading || loading) return <SkeletonTotalGrowthBarChart />;

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h3">Growth Overview</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ButtonGroup size="small">
                <Button
                  variant={viewMode === 'stacked' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('stacked')}
                >
                  Stacked
                </Button>
                <Button
                  variant={viewMode === 'grouped' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('grouped')}
                >
                  Grouped
                </Button>
                <Button
                  variant={viewMode === 'percentage' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('percentage')}
                >
                  Percentage
                </Button>
              </ButtonGroup>
              <Chip 
                label={timeRange === 'today' ? 'Today' :
                       timeRange === 'week' ? 'This Week' :
                       timeRange === 'month' ? 'This Month' :
                       'This Year'}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" color="textSecondary">
            Total Growth: {totalGrowth}%
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {Object.entries(statusTotals).map(([status, total]) => (
              <Chip
                key={status}
                label={`${status}: ${total}`}
                color={statusColors[status]}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {series.map((s) => (
                <Chip
                  key={s.name}
                  icon={statusIcons[s.name]}
                  label={`${s.name}: ${totals[s.name] || 0} orders`}
                  sx={{
                    bgcolor: theme.palette[statusColors[s.name]]?.main,
                    color: '#fff'
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Chart
              type="bar"
              height={480}
              options={getChartOptions()}
              series={series}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
  timeRange: PropTypes.string
};
