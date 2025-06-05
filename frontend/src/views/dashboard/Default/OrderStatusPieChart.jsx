import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CircularProgress, 
  useTheme,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';

import { statusColors, statusIcons } from '../../../utils/statusUtils';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { API_ROUTES } from '../../../routes/ApiRoutes';

export default function OrderStatusDonutChart({ timeRange = 'week' }) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [previousData, setPreviousData] = useState({});

  const [userData] = useLocalStorage('wayne-user-data', {});
  const checkingAuth = useAuthGuard();
  const token = userData?.authToken || null;

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        // Buscar dados atuais
        const res = await axios.get(API_ROUTES.ORDERS_BY_STATUS, {
          headers: { Authorization: `Bearer ${token}` },
          params: { period: timeRange }
        });

        const responseData = res.data || {};
        const keys = Object.keys(responseData);
        const values = Object.values(responseData);

        // Tentar buscar dados do período anterior para comparação
        try {
          const prevRes = await axios.get(API_ROUTES.ORDERS_BY_STATUS, {
            headers: { Authorization: `Bearer ${token}` },
            params: { period: timeRange, previous: true }
          });
          setPreviousData(prevRes.data || {});
        } catch (err) {
          console.warn('⚠️ Could not fetch previous period data:', err);
          setPreviousData({});
        }

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
  }, [timeRange, token]);

  const calculateChange = (current, previous) => {
    if (!previous) return null;
    return ((current - previous) / previous) * 100;
  };

  if (checkingAuth || loading) return <CircularProgress />;

  return (
    <Card>
      <CardHeader 
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h3">Orders by Status</Typography>
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
        }
      />
      <Divider />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Typography variant="h4" color="textSecondary">
            Total Orders: {total}
          </Typography>
        </Box>
        
        <Chart
          options={{
            chart: { type: 'donut' },
            labels,
            colors: labels.map((label) => {
              const muiColor = statusColors[label];
              return theme.palette[muiColor]?.main || theme.palette.grey[500];
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
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: 'Total Orders',
                      formatter: () => total
                    }
                  }
                }
              }
            }
          }}
          series={data}
          type="donut"
          height={300}
        />

        <Divider sx={{ my: 2 }} />

        <List>
          {labels.map((label, index) => {
            const current = data[index];
            const previous = previousData[label] || 0;
            const change = calculateChange(current, previous);
            
            return (
              <ListItem key={label} divider>
                <ListItemIcon>
                  {statusIcons[label] || (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: theme.palette[statusColors[label]]?.main
                      }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </Typography>
                  }
                  secondary={`${current} order${current !== 1 ? 's' : ''}`}
                />
                {change !== null && (
                  <Chip
                    size="small"
                    label={`${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}
                    color={change >= 0 ? 'success' : 'error'}
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
