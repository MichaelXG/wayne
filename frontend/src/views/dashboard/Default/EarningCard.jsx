import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography, Card } from '@mui/material';

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

// styles
const DarkCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[600],
  color: theme.palette.grey[300],
  overflow: 'hidden',
  position: 'relative',
  height: '100%',
  '& .MuiBox-root': {
    height: '100%',
    position: 'relative',
    zIndex: 1
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.grey[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180,
    zIndex: 0
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.grey[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130,
    zIndex: 0
  }
}));

export default function EarningCard({ isLoading }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [earning, setEarning] = useState(0);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [userData] = useLocalStorage('wayne-user-data', {});
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
    <DarkCard>
      <Box sx={{ 
        p: 2.25,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent'
      }}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: theme.palette.grey[900],
                    color: theme.palette.common.white,
                    '&:hover': {
                      bgcolor: theme.palette.grey[800]
                    }
                  }}
                >
                  <img src={EarningIcon} alt="Notification" />
                </Avatar>
              </Grid>
              <Grid item>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: theme.palette.grey[900],
                    color: theme.palette.common.white,
                    '&:hover': {
                      bgcolor: theme.palette.grey[800]
                    }
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
                  variant="selectedMenu"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  PaperProps={{
                    sx: {
                      bgcolor: theme.palette.grey[700],
                      '& .MuiMenuItem-root': {
                        color: theme.palette.common.white,
                        '&:hover': {
                          bgcolor: theme.palette.grey[600]
                        }
                      }
                    }
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <GetAppTwoToneIcon sx={{ mr: 1.75, color: theme.palette.grey[300] }} /> Import Card
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <FileCopyTwoToneIcon sx={{ mr: 1.75, color: theme.palette.grey[300] }} /> Copy Data
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <PictureAsPdfTwoToneIcon sx={{ mr: 1.75, color: theme.palette.grey[300] }} /> Export
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ArchiveTwoToneIcon sx={{ mr: 1.75, color: theme.palette.grey[300] }} /> Archive File
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Grid>
          <Grid item >
            <Grid container alignItems="center">
              <Grid item>
                <Typography 
                  sx={{ 
                    fontSize: '2.125rem', 
                    fontWeight: 500,
                    mr: 1,
                    mt: 1.75,
                    mb: 0.75,
                    color: theme.palette.common.white
                  }}
                >
                  {Number(earning || 0).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </Typography>
              </Grid>
              <Grid item>
                <Avatar
                  sx={{
                    cursor: 'pointer',
                    ...theme.typography.smallAvatar,
                    backgroundColor: theme.palette.success.dark,
                    color: theme.palette.success.light
                  }}
                >
                  <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                </Avatar>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2" sx={{ color: theme.palette.success.light }}>42%</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography 
              sx={(theme) => ({
                fontSize: '1rem',
                fontWeight: 500,
                color: theme.palette.grey[200]
              })}
            >
              Total Earning
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </DarkCard>
  );
}

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};
