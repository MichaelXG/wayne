import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuthGuard } from '../../../hooks/useAuthGuard';

export default function TotalOrderLineChartCard({ isLoading }) {
  const theme = useTheme();
  const [timeValue, setTimeValue] = useState(false); // false = year, true = month
  const [orderTotal, setOrderTotal] = useState(0);

  const [userData] = useLocalStorage('wayne-user-data', {});

  const checkingAuth = useAuthGuard();
  const token = userData?.authToken || null;

  const fetchOrderTotal = async (period) => {
    try {
      const response = await axios.get(`${API_ROUTES.TOTAL_ORDERS}?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const total = response.data?.total_order_amount ?? 0;
      setOrderTotal(total);
    } catch (error) {
      console.error(`❌ Failed to fetch total orders (${period}):`, error);
    }
  };

  useEffect(() => {
    fetchOrderTotal(timeValue ? 'month' : 'year');
  }, [timeValue]);

  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  // Previne renderização antes da validação
  if (checkingAuth) return null;

  return isLoading ? (
    <SkeletonTotalOrderCard />
  ) : (
    <MainCard
      border={false}
      content={false}
      sx={{
        bgcolor: 'primary.dark',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        '&>div': {
          position: 'relative',
          zIndex: 5
        },
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: theme.palette.primary[800],
          borderRadius: '50%',
          top: { xs: -85 },
          right: { xs: -95 }
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: theme.palette.primary[800],
          borderRadius: '50%',
          top: { xs: -125 },
          right: { xs: -15 },
          opacity: 0.5
        }
      }}
    >
      <Box sx={{ p: 2.25 }}>
        <Grid container direction="column">
          <Grid>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    bgcolor: 'primary.800',
                    color: '#fff',
                    mt: 1
                  }}
                >
                  <LocalMallOutlinedIcon fontSize="inherit" />
                </Avatar>
              </Grid>
              <Grid>
                <Button
                  disableElevation
                  variant={timeValue ? 'contained' : 'text'}
                  size="small"
                  sx={{ color: 'inherit' }}
                  onClick={(e) => handleChangeTime(e, true)}
                >
                  Month
                </Button>
                <Button
                  disableElevation
                  variant={!timeValue ? 'contained' : 'text'}
                  size="small"
                  sx={{ color: 'inherit' }}
                  onClick={(e) => handleChangeTime(e, false)}
                >
                  Year
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid sx={{ mb: 0.75 }}>
            <Grid container sx={{ alignItems: 'center' }}>
              <Grid size={6}>
                <Grid container sx={{ alignItems: 'center' }}>
                  <Grid>
                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                      {Number(orderTotal || 0).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      })}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Avatar
                      sx={{
                        ...theme.typography.smallAvatar,
                        cursor: 'pointer',
                        bgcolor: 'primary.200',
                        color: 'primary.dark'
                      }}
                    >
                      <ArrowDownwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                    </Avatar>
                  </Grid>
                  <Grid size={12}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'primary.200' }}>Total Order</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={6}>{timeValue ? <Chart {...ChartDataMonth} /> : <Chart {...ChartDataYear} />}</Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
}

TotalOrderLineChartCard.propTypes = { isLoading: PropTypes.bool };
