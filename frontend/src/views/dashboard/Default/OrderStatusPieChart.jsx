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
  Skeleton,
  styled
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import { statusColors, statusIcons } from '../../../utils/statusUtils';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { API_ROUTES } from '../../../routes/ApiRoutes';

// styles
const DarkCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.grey[300],
  overflow: 'hidden',
  position: 'relative',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 4px 20px 0 ${alpha(theme.palette.common.black, 0.2)}`
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${alpha(theme.palette.primary.main, 0.2)} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${alpha(theme.palette.primary.main, 0.15)} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

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
    <DarkCard 
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
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[300]} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
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
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.light,
                borderColor: alpha(theme.palette.primary.main, 0.25),
                backdropFilter: 'blur(4px)',
                '& .MuiChip-label': {
                  px: 2
                }
              }}
            />
          </Box>
        }
        sx={{
          p: 2.5,
          '& .MuiCardHeader-content': {
            width: '100%'
          }
        }}
      />
      <Divider sx={{ borderColor: theme.palette.grey[500] }} />
      <CardContent>
        <Box sx={{ position: 'relative', minHeight: '300px' }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
              <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', bgcolor: theme.palette.grey[500] }} />
              <Skeleton variant="text" width="60%" sx={{ mx: 'auto', bgcolor: theme.palette.grey[500] }} />
              <Skeleton variant="rectangular" height={100} sx={{ bgcolor: theme.palette.grey[500] }} />
            </Box>
          ) : (
            <Fade in={!loading} timeout={500}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Typography 
                    variant="h4" 
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.common.white
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
                      },
                      background: 'transparent',
                      dropShadow: {
                        enabled: true,
                        color: theme.palette.common.black,
                        top: 3,
                        left: 3,
                        blur: 6,
                        opacity: 0.2
                      }
                    },
                    labels,
                    colors: labels.map((label) => {
                      const muiColor = statusColors[label];
                      return alpha(theme.palette[muiColor]?.main || theme.palette.grey[500], 0.85);
                    }),
                    legend: { 
                      position: 'bottom',
                      fontSize: '14px',
                      fontWeight: 500,
                      labels: {
                        colors: theme.palette.grey[300]
                      },
                      markers: {
                        width: 12,
                        height: 12,
                        radius: 6,
                        offsetY: 0
                      },
                      itemMargin: {
                        horizontal: 10,
                        vertical: 5
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
                      theme: 'dark'
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
                              fontSize: '20px',
                              fontWeight: 700,
                              color: theme.palette.common.white
                            },
                            value: {
                              fontSize: '16px',
                              fontWeight: 500,
                              color: theme.palette.grey[300]
                            }
                          },
                          size: '85%'
                        }
                      }
                    },
                    stroke: {
                      width: 3,
                      colors: [theme.palette.grey[800]]
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: (val) => `${Math.round(val)}%`,
                      style: {
                        fontSize: '13px',
                        fontWeight: 600,
                        colors: [theme.palette.grey[800]]
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

                <Divider sx={{ my: 2, borderColor: theme.palette.grey[500] }} />

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
                          py: 1.75,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.common.white, 0.08),
                            transform: 'translateX(4px)'
                          },
                          borderColor: alpha(theme.palette.grey[500], 0.2)
                        }}
                      >
                        <ListItemIcon sx={{ color: theme.palette.common.white }}>
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
                            <Typography variant="body1" sx={{ 
                              fontWeight: 600, 
                              color: theme.palette.common.white,
                              letterSpacing: '0.02em'
                            }}>
                              {label.charAt(0).toUpperCase() + label.slice(1)}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" sx={{ 
                              color: theme.palette.grey[400],
                              mt: 0.5,
                              fontSize: '0.875rem'
                            }}>
                              {`${current} order${current !== 1 ? 's' : ''}`}
                            </Typography>
                          }
                        />
                        {change !== null && (
                          <Chip
                            size="small"
                            label={`${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}
                            color={change >= 0 ? 'success' : 'error'}
                            sx={{ 
                              ml: 1,
                              fontWeight: 600,
                              minWidth: 65,
                              background: change >= 0 ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.error.main, 0.15),
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
    </DarkCard>
  );
}
