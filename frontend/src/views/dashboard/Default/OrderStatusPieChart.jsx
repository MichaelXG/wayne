import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { Card, CardHeader, CardContent, CircularProgress, useTheme } from '@mui/material';

import { statusColors } from '../../../utils/statusUtils';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { API_ROUTES } from '../../../routes/ApiRoutes';

export default function OrderStatusDonutChart() {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [userData] = useLocalStorage('wayne-user-data', {});
  const checkingAuth = useAuthGuard();
  const token = userData?.authToken || null;

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const res = await axios.get(API_ROUTES.ORDERS_BY_STATUS, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const responseData = res.data || {};
        const keys = Object.keys(responseData);
        const values = Object.values(responseData);

        setLabels(keys);
        setData(values);
        setTotal(values.reduce((a, b) => a + b, 0));
      } catch (err) {
        console.error('❌ Failed to fetch order status chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  if (checkingAuth || loading) return <CircularProgress />;

  return (
    <Card>
      <CardHeader title="Orders by Status" />
      <CardContent>
        <Chart
          options={{
            chart: { type: 'donut' },
            labels,
            colors: labels.map((label) => {
              const muiColor = statusColors[label];
              switch (muiColor) {
                case 'primary':
                  return theme.palette.primary.main;
                case 'success':
                  return theme.palette.success.main;
                case 'warning':
                  return theme.palette.warning.main;
                case 'error':
                  return theme.palette.error.main;
                case 'info':
                  return theme.palette.info.main;
                default:
                  return '#9e9e9e';
              }
            }),
            legend: { position: 'bottom' },
            tooltip: {
              y: {
                formatter: (value, { seriesIndex }) => {
                  const label = labels[seriesIndex];
                  const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                  return `${percent}% - ${value} order${value === 1 ? '' : 's'} (${label})`;
                }
              }
            }
          }}
          series={data}
          type="donut"
          height={300}
        />
      </CardContent>
    </Card>
  );
}
