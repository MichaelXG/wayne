import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

// project imports
import UpgradePlanCard from './UpgradePlanCard';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';

// assets
import User1 from 'assets/images/users/user-round.svg';
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';
import Greeting from '../../../../ui-component/Greeting';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import DynamicModal from '../../../../ui-component/modal/DynamicModal';
import { API_ROUTES } from '../../../../routes/ApiRoutes';
import { safeAtob } from '../../../../utils/base64';
import { isDebug } from '../../../../App';

export default function ProfileSection() {
  const [isLogout, setIsLogout] = useState(false);
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [selectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useLocalStorage('wayne-user-data', {});
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const token = userData?.authToken || null;
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Aqui o console log para ver userData completo
  isDebug && console.log('UserData:', userData);

  isDebug && console.log('UserData.group:', userData?.group ? safeAtob(userData.group) : null);

  useEffect(() => {
    if (safeAtob(userData.id)) {
      getAvatar();
    }
  }, [safeAtob(userData.id)]);

  const handleLogout = () => {
    if (userData.keeploggedin) {
      setLogoutModalOpen(true);
    } else {
      setUserData({});
      navigate('/pages/login');
    }
  };

  const confirmLogout = () => {
    setIsLogout(true);
    setLogoutModalOpen(false);
    setUserData({});
    navigate('/pages/login');
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const getAvatar = async () => {
    try {
      const response = await axios.get(`${API_ROUTES.AVATARS}me/?id=${safeAtob(userData.id)}`);
      // Check if the response is successful (status code 200)
      if (response.status === 200) {
        const data = response.data;
        setUserData((prevData) => ({ ...prevData, avatar: data.image }));
      } else {
        console.error('Error fetching avatar:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user avatar:', error);
    }
  };

  return (
    <>
      <Chip
        sx={(theme) => ({
          ml: 2,
          height: 48,
          alignItems: 'center',
          borderRadius: '27px',
          backgroundColor: theme.palette.grey[300],
          '& .MuiChip-label': { lineHeight: 0 },
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: theme.palette.grey[600],
            color: theme.palette.common.white
          }
        })}
        icon={
          <Avatar
            src={userData.avatar || User1}
            alt="user-images"
            sx={(theme) => ({
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            })}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" />}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color={theme.palette.grey[600]}
        aria-label="user-account"
      />

      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [0, 14] } }]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                          <Greeting />
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            {userData.first_name && userData.last_name
                              ? `${safeAtob(userData.first_name)} ${safeAtob(userData.last_name)}`
                              : 'Guest'}
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">
                          Group: {userData?.group && safeAtob(userData.group) ? `${safeAtob(userData.group)}` : 'No Group'}
                        </Typography>
                      </Stack>
                      <OutlinedInput
                        sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                        id="input-search-profile"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Search profile options"
                        startAdornment={
                          <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="16px" />
                          </InputAdornment>
                        }
                        aria-describedby="search-helper-text"
                        inputProps={{ 'aria-label': 'weight' }}
                      />
                      <Divider />
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        py: 0,
                        height: '100%',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': { width: 5 }
                      }}
                    >
                      <Divider />
                      <Card
                        sx={(theme) => ({
                          bgcolor: theme.palette.grey[300],
                          my: 2
                        })}
                      >
                        <CardContent>
                          <Grid container spacing={3} direction="column">
                            <Grid>
                              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid>
                                  <Typography variant="subtitle1">Start DND Mode</Typography>
                                </Grid>
                                <Grid>
                                  <Switch
                                    checked={sdm}
                                    onChange={(e) => setSdm(e.target.checked)}
                                    name="sdm"
                                    size="small"
                                    sx={(theme) => ({
                                      '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: theme.palette.grey[600],
                                        '& + .MuiSwitch-track': {
                                          backgroundColor: theme.palette.grey[600]
                                        }
                                      }
                                    })}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid>
                              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid>
                                  <Typography variant="subtitle1">Allow Notifications</Typography>
                                </Grid>
                                <Grid>
                                  <Switch
                                    checked={notification}
                                    onChange={(e) => setNotification(e.target.checked)}
                                    name="sdm"
                                    size="small"
                                    sx={(theme) => ({
                                      '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: theme.palette.grey[600],
                                        '& + .MuiSwitch-track': {
                                          backgroundColor: theme.palette.grey[600]
                                        }
                                      }
                                    })}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          borderRadius: `${borderRadius}px`,
                          '& .MuiListItemButton-root': { mt: 0.5 }
                        }}
                      >
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 0}>
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 1}>
                          <ListItemIcon>
                            <IconUser stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Grid container spacing={1} sx={{ justifyContent: 'space-between' }}>
                                <Grid>
                                  <Typography variant="body2">Social Profile</Typography>
                                </Grid>
                                <Grid>
                                  <Chip
                                    label="02"
                                    variant="filled"
                                    size="small"
                                    sx={(theme) => ({
                                      backgroundColor: theme.palette.grey[900],
                                      color: theme.palette.common.white,
                                      '& .MuiChip-label': {
                                        marginTop: theme.spacing(0.25)
                                      }
                                    })}
                                  />
                                </Grid>
                              </Grid>
                            }
                          />
                        </ListItemButton>
                        <ListItemButton onClick={handleLogout} sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>

      <DynamicModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Are you sure you want to log out?"
        description="You will need to log in again to access the application."
        type="info"
        mode="confirm"
        submitLabel={isLogout ? 'Logging out...' : 'Logout'}
        loading={isLogout}
      />
    </>
  );
}
