import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip
} from '@mui/material';
import {
  CameraAlt,
  Close,
  Warning,
  LocationOn,
  AccessTime
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import CCTVOfflineEffect from '../../ui-component/movie/CCTVOfflineEffect';

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const RecordingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  '& .dot': {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: theme.palette.error.main,
    animation: `${pulse} 2s ease-in-out infinite`
  },
  '& .text': {
    color: theme.palette.error.main,
    fontSize: '0.75rem',
    fontWeight: 'bold'
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.grey[600],
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  color: theme.palette.common.white,
  height: '100%'
}));

const CameraCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[600],
  borderRadius: '8px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  height: '240px',
  '&:hover': {
    transform: 'scale(1.02)',
    '& .camera-overlay': {
      opacity: 1
    }
  }
}));

const CameraImage = styled(Box)({
  width: '100%',
  height: '240px',
  objectFit: 'cover'
});

const CameraOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  opacity: 0.7,
  transition: 'opacity 0.3s ease-in-out',
  '&.camera-overlay': {}
}));

const CameraNumber = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  color: theme.palette.common.white,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  fontWeight: 'bold'
}));

const FullScreenDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.grey[600],
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    color: theme.palette.common.white,
    margin: '16px',
    maxWidth: '95vw',
    maxHeight: '95vh',
    width: '1600px',
    height: '90vh',
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }
}));

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  flex: 1,
  minHeight: 0,
  backgroundColor: theme.palette.grey[600],
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: theme.spacing(2)
}));

const VideoPlayer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  '& video': {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }
});

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.grey[300],
  backdropFilter: 'blur(5px)',
  borderBottom: `1px solid ${theme.palette.grey[500]}`
}));

const DialogFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.grey[300],
  backdropFilter: 'blur(5px)',
  borderTop: `1px solid ${theme.palette.grey[600]}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 1,
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.grey[900],
  '&.MuiChip-colorSuccess': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white
  },
  '&.MuiChip-colorError': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white
  },
  '&.MuiChip-colorWarning': {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.grey[900]
  }
}));

const BASE_VIDEO_URL = 'https://raw.githubusercontent.com/MichaelXG/assets/main/videos';

const CityMonitoring = () => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [videoError, setVideoError] = useState({
    5: false,
    8: false,
    11: false
  });

  const getVideoThumbnail = (cameraId) => {
    if (videoError[cameraId]) {
      return null;
    }
    return `${BASE_VIDEO_URL}/thumbnails/camera-${cameraId}.jpg`;
  };

  const cameras = [
    {
      id: 1,
      name: 'Gotham Streets',
      location: 'Downtown',
      status: 'Live',
      videoSrc: `${BASE_VIDEO_URL}/gotham-streets.mp4`,
      lastUpdate: '2 min ago',
      activity: 'Normal'
    },
    {
      id: 2,
      name: 'Gotham Harbor',
      location: 'Docks',
      status: 'Live',
      videoSrc: `${BASE_VIDEO_URL}/gotham-harbor.mp4`,
      lastUpdate: '1 min ago',
      activity: 'Suspicious'
    },
    {
      id: 3,
      name: 'Robinson Park',
      location: 'Central',
      status: 'Live',
      videoSrc: `${BASE_VIDEO_URL}/gotham-park.mp4`,
      lastUpdate: 'Just now',
      activity: 'Normal'
    },
    {
      id: 4,
      name: 'Gotham Square',
      location: 'City Center',
      status: 'Live',
      videoSrc: `${BASE_VIDEO_URL}/gotham-square.mp4`,
      lastUpdate: '5 min ago',
      activity: 'High Alert'
    },
    {
      id: 5,
      name: 'Wayne Tower',
      location: 'Financial District',
      status: 'Offline',
      videoSrc: `${BASE_VIDEO_URL}/wayne-tower.mp4`,
      lastUpdate: '1 hour ago',
      activity: 'Signal Lost'
    },
    {
      id: 6,
      name: 'Arkham East Wing',
      location: 'Arkham Island',
      status: 'Live',
      videoSrc: `${BASE_VIDEO_URL}/arkham-asylum.mp4`,
      lastUpdate: '3 min ago',
      activity: 'Warning'
    },
    {
      id: 7,
      name: 'Iceberg Lounge',
      location: 'Diamond District',
      status: 'Live',
      videoSrc: `${BASE_VIDEO_URL}/ice-lounge-ext.mp4`,
      lastUpdate: '1 min ago',
      activity: 'Suspicious'
    },
    {
      id: 8,
      name: 'Gotham University',
      location: 'Education District',
      status: 'Offline',
      videoSrc: `${BASE_VIDEO_URL}/gotham-university.mp4`,
      lastUpdate: '2 hours ago',
      activity: 'Signal Lost'
    },
    {
      id: 9,
      name: 'Arkham West Wing',
      location: 'Arkham Island',
      status: 'Live',
      videoSrc: `${BASE_VIDEO_URL}/city-police-vigilance.mp4`,
      lastUpdate: '4 min ago',
      activity: 'Warning'
    },
    {
      id: 10,
      name: 'Ace Chemical',
      location: 'Industrial District',
      status: 'Live',
      videoSrc: `${BASE_VIDEO_URL}/ace-chemical.mp4`,
      lastUpdate: '3 min ago',
      activity: 'High Alert'
    },
    {
      id: 11,
      name: 'Blackgate Prison',
      location: 'Blackgate Isle',
      status: 'Offline',
      videoSrc: `${BASE_VIDEO_URL}/blackgate.mp4`,
      lastUpdate: '3 hours ago',
      activity: 'Signal Lost'
    },
    {
      id: 12,
      name: 'Arkham Security Gate',
      location: 'Arkham Island',
      status: 'Live',
      videoSrc: `${BASE_VIDEO_URL}/bank-gothan-city.mp4`,
      lastUpdate: '1 min ago',
      activity: 'Warning'
    }
  ];

  const getActivityColor = (activity) => {
    switch (activity.toLowerCase()) {
      case 'high alert':
        return 'error';
      case 'warning':
      case 'suspicious':
        return 'warning';
      case 'normal':
        return 'success';
      case 'signal lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleOpenCamera = (camera) => {
    setSelectedCamera(camera);
    // Reset error state when opening a new camera
    setVideoError(prev => ({ ...prev, [camera.id]: false }));
  };

  const handleCloseCamera = () => {
    setSelectedCamera(null);
  };

  const handleVideoError = (cameraId) => {
    setVideoError(prev => ({ ...prev, [cameraId]: true }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        City Monitoring System
      </Typography>

      <Grid container spacing={3}>
        {cameras.map((camera) => (
          <Grid item xs={12} sm={6} md={4} key={camera.id}>
            <CameraCard onClick={() => handleOpenCamera(camera)}>
              {videoError[camera.id] ? (
                <CCTVOfflineEffect />
              ) : (
                <CameraImage
                  component="video"
                  src={camera.videoSrc}
                  alt={camera.name}
                  onError={() => handleVideoError(camera.id)}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              <StatusChip
                label={camera.activity}
                color={getActivityColor(camera.activity)}
                size="small"
              />
              <CameraOverlay className="camera-overlay">
                <Box>
                  <CameraNumber>Camera #{camera.id}</CameraNumber>
                  <Typography variant="h6">{camera.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2">{camera.location}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime fontSize="small" />
                  <Typography variant="body2">{camera.lastUpdate}</Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  {!videoError[camera.id] && (
                    <RecordingIndicator>
                      <span className="dot" />
                      <span className="text">REC</span>
                    </RecordingIndicator>
                  )}
                </Box>
              </CameraOverlay>
            </CameraCard>
          </Grid>
        ))}
      </Grid>

      <FullScreenDialog
        open={Boolean(selectedCamera)}
        onClose={handleCloseCamera}
        maxWidth={false}
      >
        {selectedCamera && (
          <>
            <DialogHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                  {selectedCamera.name} - {selectedCamera.location}
                </Typography>
                <IconButton onClick={handleCloseCamera} sx={{ color: 'inherit' }}>
                  <Close />
                </IconButton>
              </Box>
            </DialogHeader>
            <DialogContent>
              <VideoContainer>
                {videoError[selectedCamera.id] ? (
                  <VideoPlayer>
                    <CCTVOfflineEffect fullscreen />
                  </VideoPlayer>
                ) : (
                  <VideoPlayer>
                    <video
                      src={selectedCamera.videoSrc}
                      autoPlay
                      controls
                      onError={() => handleVideoError(selectedCamera.id)}
                    />
                  </VideoPlayer>
                )}
              </VideoContainer>
            </DialogContent>
            <DialogFooter>
              <Chip
                icon={<CameraAlt />}
                label={videoError[selectedCamera.id] ? 'Offline' : selectedCamera.status}
                color={videoError[selectedCamera.id] ? 'error' : 'success'}
                variant="outlined"
              />
              <Chip
                icon={<Warning />}
                label={selectedCamera.activity}
                color={getActivityColor(selectedCamera.activity)}
                variant="outlined"
              />
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime fontSize="small" />
                Last Update: {selectedCamera.lastUpdate}
              </Typography>
            </DialogFooter>
          </>
        )}
      </FullScreenDialog>
    </Box>
  );
};

export default CityMonitoring; 