import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// icons
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';

import { API_ROUTES } from '../../../routes/ApiRoutes';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import useLocalStorage from '../../../hooks/useLocalStorage';

export default function EarningCard({ isLoading }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [earning, setEarning] = useState(0);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const [userData] = useLocalStorage('fake-store-user-data', {});
  const checkingAuth = useAuthGuard();
  const token = userData?.authToken || null;

  useEffect(() => {
    const fetchEarning = async () => {
      try {
        const response = await axios.get(API_ROUTES.TOTAL_EARNING, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('response total_earning : ', response);
        const total = response.data?.total_earning ?? 0;
        setEarning(total);
      } catch (error) {
        console.error('❌ Failed to fetch total earning:', error);
      }
    };

    fetchEarning();
  }, []);

  // Previne renderização antes da validação
  if (checkingAuth) return null;

  return isLoading ? (
    <SkeletonEarningCard />
  ) : (
    <MainCard
      border={false}
      content={false}
      aria-hidden={Boolean(anchorEl)}
      sx={{
        bgcolor: 'secondary.dark',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: theme.palette.secondary[800],
          borderRadius: '50%',
          top: { xs: -85 },
          right: { xs: -95 }
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: theme.palette.secondary[800],
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
                    bgcolor: 'secondary.800',
                    mt: 1
                  }}
                >
                  <CardMedia sx={{ width: 24, height: 24 }} component="img" src={EarningIcon} alt="Earning" />
                </Avatar>
              </Grid>
              <Grid>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    bgcolor: 'secondary.dark',
                    color: 'secondary.200',
                    zIndex: 1
                  }}
                  aria-controls="menu-earning-card"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreHorizIcon fontSize="inherit" />
                </Avatar>
                <Menu
                  id="menu-earning-card"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleClose}>
                    <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Card
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy Data
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive File
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Grid>

          <Grid>
            <Grid container sx={{ alignItems: 'center' }}>
              <Grid>
                <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                  {Number(earning || 0).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </Typography>
              </Grid>
              <Grid>
                <Avatar
                  sx={{
                    cursor: 'pointer',
                    ...theme.typography.smallAvatar,
                    bgcolor: 'secondary.200',
                    color: 'secondary.dark'
                  }}
                >
                  <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                </Avatar>
              </Grid>
            </Grid>
          </Grid>

          <Grid sx={{ mb: 1.25 }}>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 500,
                color: 'secondary.200'
              }}
            >
              Total Earning
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
}

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};
