import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import chartData from './chart-data/total-growth-bar-chart';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import { statusColors } from '../../../utils/statusUtils';

const status = [
  { value: 'today', label: 'Today' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

export default function TotalGrowthBarChart({ isLoading }) {
  const [value, setValue] = useState('year');
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const theme = useTheme();
  const { mode } = useConfig();

  const [userData] = useLocalStorage('fake-store-user-data', {});
  const checkingAuth = useAuthGuard();
  const token = userData?.authToken || null;

  const fetchGrowthData = async () => {
    try {
      const response = await axios.get(`${API_ROUTES.ORDERS_GROWTH_STATUS}?period=${value}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setCategories(allMonths);

      const filledSeries = (response.data?.series || []).map((serie) => {
        const dataMap = {};
        (response.data.categories || []).forEach((label, i) => {
          dataMap[label] = serie.data[i];
        });

        const filledData = allMonths.map((month) => dataMap[month] || 0);
        return { ...serie, data: filledData };
      });

      setSeries(filledSeries);
    } catch (error) {
      console.error('❌ Failed to fetch ORDERS_GROWTH_STATUS:', error);
    }
  };

  useEffect(() => {
    fetchGrowthData();
  }, [value]);

  const dynamicColors = series.map((s) => {
    const colorKey = statusColors[s.name] || 'grey';
    const tone = s.name === 'paid' ? 'light' : 'main';
    return theme.palette[colorKey]?.[tone] || '#ccc';
  });

  useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: dynamicColors,
      xaxis: {
        categories,
        labels: {
          style: { colors: theme.palette.text.primary }
        }
      },
      yaxis: {
        labels: {
          style: { colors: theme.palette.text.primary }
        }
      },
      grid: { borderColor: theme.palette.divider },
      tooltip: { theme: mode },
      legend: { labels: { colors: theme.palette.grey[500] } }
    };

    if (!isLoading && categories.length) {
      ApexCharts.exec('bar-chart', 'updateOptions', newChartData);
    }
  }, [categories, mode, theme, isLoading, dynamicColors]);

  if (checkingAuth) return null;

  return isLoading ? (
    <SkeletonTotalGrowthBarChart />
  ) : (
    <MainCard>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle2">Total Growth</Typography>
            </Grid>
            <Grid item>
              <TextField
                select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                size="small"
              >
                {status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            ...theme.applyStyles('light', {
              '& .apexcharts-series:nth-of-type(4) path:hover': {
                filter: `brightness(0.95)`,
                transition: 'all 0.3s ease'
              }
            }),
            '& .apexcharts-menu': {
              bgcolor: 'background.paper'
            },
            '.apexcharts-theme-light .apexcharts-menu-item:hover': {
              bgcolor: 'dark.main'
            },
            '& .apexcharts-theme-light .apexcharts-menu-icon:hover svg, .apexcharts-reset-icon:hover svg': {
              fill: theme.palette.grey[400]
            }
          }}
        >
          <Chart
            id="bar-chart"
            type="bar"
            height={480}
            options={{
              ...chartData.options,
              xaxis: { categories },
              chart: { id: 'bar-chart', stacked: true },
              colors: dynamicColors,
              legend: { labels: { colors: theme.palette.grey[500] } }
            }}
            series={series}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
}

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};
