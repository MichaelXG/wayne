import { useTheme } from '@mui/material/styles';

// ==============================|| DASHBOARD - TOTAL GROWTH BAR CHART ||============================== //

const theme = useTheme();

const chartData = {
  height: 480,
  type: 'bar',
  options: {
    chart: {
      id: 'bar-chart',
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    xaxis: {
      type: 'category',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    legend: {
      show: true,
      fontFamily: theme.typography.fontFamily, // usa a fonte padrão do tema (ex: Roboto)
      position: 'bottom',
      offsetX: 20,
      labels: {
        useSeriesColors: false
      },
      markers: {
        width: 16,
        height: 16,
        radius: 5
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8
      }
    },
    fill: {
      type: 'solid'
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: true
    }
  }
  // series: [
  //   {
  //     name: 'pending',
  //     data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
  //   },
  //   {
  //     name: 'processing',
  //     data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
  //   },
  //   {
  //     name: 'shipped',
  //     data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
  //   },
  //   {
  //     name: 'Paind',
  //     data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
  //   },
  //   {
  //     name: 'completed',
  //     data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
  //   },
  //   {
  //     name: 'canceled',
  //     data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
  //   }
  // ]
};

export default chartData;
