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
  Chip,
  Fade,
  Skeleton
} from '@mui/material';
import { alpha } from '@mui/material/styles';

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
        setLoading(true);
        const res = await axios.get(API_ROUTES.ORDERS_BY_STATUS, {
          headers: { Authorization: `Bearer ${token}` },
          params: { period: timeRange }
        });

        const responseData = res.data || {};
        const keys = Object.keys(responseData);
        const values = Object.values(responseData);
        const totalOrders = values.reduce((sum, val) => sum + val, 0);

        setLabels(keys);
        setData(values);
        setTotal(totalOrders);
        setPreviousData(responseData);
      } catch (error) {
        console.error('Failed to fetch order status data:', error);
        setLabels([]);
        setData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, [timeRange, token]);

  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    if (current === 0) return -100;
    return ((current - previous) / previous) * 100;
  };

  if (checkingAuth) return null;

  return (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CardHeader 
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }}
            >
              Orders by Status
            </Typography>
            <Chip 
              label={timeRange === 'today' ? 'Today' :
                     timeRange === 'week' ? 'This Week' :
                     timeRange === 'month' ? 'This Month' :
                     'This Year'}
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                borderRadius: '16px',
                fontWeight: 500,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiChip-label': {
                  px: 2
                }
              }}
            />
          </Box>
        }
      />
      <Divider />
      <CardContent>
        <Box sx={{ position: 'relative', minHeight: '300px' }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
              <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
              <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
              <Skeleton variant="rectangular" height={100} />
            </Box>
          ) : (
            <Fade in={!loading} timeout={500}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Typography 
                    variant="h4" 
                    color="textSecondary"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.secondary
                    }}
                  >
                    Total Orders: {total}
                  </Typography>
                </Box>
                
                <Chart
                  options={{
                    chart: { 
                      type: 'donut',
                      animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800,
                        animateGradually: {
                          enabled: true,
                          delay: 150
                        },
                        dynamicAnimation: {
                          enabled: true,
                          speed: 350
                        }
                      }
                    },
                    labels,
                    colors: labels.map((label) => {
                      const muiColor = statusColors[label];
                      return theme.palette[muiColor]?.main || theme.palette.grey[500];
                    }),
                    legend: { 
                      position: 'bottom',
                      fontSize: '14px',
                      markers: {
                        width: 12,
                        height: 12,
                        radius: 6
                      }
                    },
                    tooltip: {
                      y: {
                        formatter: (value, { seriesIndex }) => {
                          const label = labels[seriesIndex];
                          const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                          return `${percent}% - ${value} order${value === 1 ? '' : 's'} (${label})`;
                        }
                      },
                      theme: theme.palette.mode
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          labels: {
                            show: true,
                            total: {
                              show: true,
                              label: 'Total Orders',
                              formatter: () => total,
                              fontSize: '16px',
                              fontWeight: 600,
                              color: theme.palette.text.primary
                            }
                          }
                        }
                      }
                    },
                    stroke: {
                      width: 2,
                      colors: [theme.palette.background.paper]
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: (val) => `${Math.round(val)}%`,
                      style: {
                        fontSize: '12px',
                        fontWeight: 500,
                        colors: [theme.palette.background.paper]
                      },
                      dropShadow: {
                        enabled: true,
                        blur: 3,
                        opacity: 0.2
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
                      <ListItem 
                        key={label} 
                        divider
                        sx={{
                          py: 1.5,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.04)
                          }
                        }}
                      >
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
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
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
                            sx={{ 
                              ml: 1,
                              fontWeight: 500,
                              minWidth: 65,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        )}
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </Fade>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
