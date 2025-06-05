import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alpha } from '@mui/material/styles';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

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
      sx={(theme) => ({
        bgcolor: 'transparent',
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        maxHeight: '200px',
        '& .MuiBox-root': {
          height: '100%',
          position: 'relative',
          zIndex: 5
        },
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
          borderRadius: '50%',
          top: -30,
          right: -180
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
          borderRadius: '50%',
          top: -160,
          right: -130
        }
      })}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Grid item>
            <Avatar
              variant="rounded"
              sx={(theme) => ({
                ...theme.typography.commonAvatar,
                ...theme.typography.largeAvatar,
                bgcolor: theme.palette.warning.light,
                color: theme.palette.warning.dark
              })}
            >
              <LocalMallOutlinedIcon fontSize="inherit" />
            </Avatar>
          </Grid>
          <Grid item>
            <ButtonGroup size="small" sx={{ backgroundColor: alpha(theme.palette.warning.light, 0.1), p: 0.5, borderRadius: 1 }}>
              <Button
                disableElevation
                variant={timeValue ? 'contained' : 'text'}
                size="small"
                sx={(theme) => ({
                  minWidth: '30px',
                  padding: '2px 8px',
                  color: timeValue ? theme.palette.warning.dark : theme.palette.grey[800],
                  backgroundColor: timeValue ? theme.palette.warning.light : 'transparent',
                  '&:hover': {
                    backgroundColor: timeValue ? alpha(theme.palette.warning.light, 0.9) : alpha(theme.palette.warning.light, 0.1)
                  }
                })}
                onClick={(e) => handleChangeTime(e, true)}
              >
                M
              </Button>
              <Button
                disableElevation
                variant={!timeValue ? 'contained' : 'text'}
                size="small"
                sx={(theme) => ({
                  minWidth: '30px',
                  padding: '2px 8px',
                  color: !timeValue ? theme.palette.warning.dark : theme.palette.grey[800],
                  backgroundColor: !timeValue ? theme.palette.warning.light : 'transparent',
                  '&:hover': {
                    backgroundColor: !timeValue ? alpha(theme.palette.warning.light, 0.9) : alpha(theme.palette.warning.light, 0.1)
                  }
                })}
                onClick={(e) => handleChangeTime(e, false)}
              >
                Y
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ flexGrow: 1 }}>
          <Grid item xs={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: theme.palette.grey[800],
                  lineHeight: 1.2,
                  mb: 0.5
                }}
              >
                {Number(orderTotal || 0).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={(theme) => ({
                    ...theme.typography.smallAvatar,
                    width: 24,
                    height: 24,
                    cursor: 'pointer',
                    bgcolor: theme.palette.warning.light,
                    color: theme.palette.warning.dark
                  })}
                >
                  <ArrowDownwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                </Avatar>
                <Grid item>
                  <Typography
                    sx={(theme) => ({
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: theme.palette.grey[500]
                    })}
                  >
                    Total Order
                  </Typography>
                </Grid>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                height: '100%',
                minHeight: 80,
                maxHeight: 100,
                '& .apexcharts-canvas': {
                  '& .apexcharts-text': {
                    fill: theme.palette.grey[800]
                  },
                  '& .apexcharts-series path': {
                    stroke: theme.palette.warning.main
                  }
                }
              }}
            >
              {timeValue ? <Chart {...ChartDataMonth} /> : <Chart {...ChartDataYear} />}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
}

TotalOrderLineChartCard.propTypes = { isLoading: PropTypes.bool };
