import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import chartData from './chart-data/bajaj-area-chart';

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

export default function BajajAreaChartCard() {
  const theme = useTheme();

  const orangeDark = theme.palette.orange.dark;

  React.useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: { theme: 'light' }
    };
    ApexCharts.exec('support-chart', 'updateOptions', newSupportChart);
  }, [orangeDark]);

  return (
    <Card
      sx={(theme) => ({
        bgcolor: theme.palette.grey[300]
      })}
    >
      <Grid
        container
        sx={(theme) => ({
          p: 2,
          pb: 0,
          color: theme.palette.common.white
        })}
      >
        <Grid item xs={12}>
          <Grid
            container
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Grid item>
              <Typography
                variant="subtitle1"
                sx={(theme) => ({
                  color: theme.palette.grey[900]
                })}
              >
                Bajaj Finery
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                sx={(theme) => ({
                  color: theme.palette.grey[800]
                })}
              >
                $1839.00
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={(theme) => ({
              color: theme.palette.grey[800]
            })}
          >
            10% Profit
          </Typography>
        </Grid>
      </Grid>
      <Chart {...chartData} />
    </Card>
  );
}
