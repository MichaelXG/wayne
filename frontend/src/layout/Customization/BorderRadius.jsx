// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { IconBorderRadius } from '@tabler/icons-react';

// project imports
import useConfig from 'hooks/useConfig';

// concat 'px'
function valueText(value) {
  return `${value}px`;
}

export default function BorderRadius() {
  const theme = useTheme();
  const { borderRadius, onChangeBorderRadius } = useConfig();

  return (
    <Stack spacing={3} sx={{ px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconBorderRadius size={20} />
        <Typography variant="h5">Border Radius</Typography>
      </Box>

      <Box sx={{ px: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={12} sx={{ mb: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2
              }}
            >
              {[4, 8, 12, 16, 20, 24].map((radius) => (
                <Box
                  key={radius}
                  onClick={() => onChangeBorderRadius(null, radius)}
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: theme.palette.grey[500],
                    borderRadius: radius,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    opacity: borderRadius === radius ? 1 : 0.5,
                    transform: borderRadius === radius ? 'scale(1.1)' : 'scale(1)',
                    '&:hover': {
                      opacity: 0.8,
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>

          <Grid size={2}>
            <Typography variant="body2" color="text.secondary">
              4px
            </Typography>
          </Grid>
          <Grid size={8}>
            <Slider
              size="small"
              value={borderRadius}
              onChange={onChangeBorderRadius}
              getAriaValueText={valueText}
              valueLabelDisplay="auto"
              min={4}
              max={24}
              marks
              sx={{
                '& .MuiSlider-rail': {
                  height: 4,
                  backgroundColor: theme.palette.grey[200]
                },
                '& .MuiSlider-track': {
                  height: 4,
                  backgroundColor: theme.palette.grey[500]
                },
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  backgroundColor: theme.palette.common.white,
                    border: `2px solid ${theme.palette.grey[500]}`,
                  '&:hover, &.Mui-focusVisible': {
                      boxShadow: `0 0 0 8px ${theme.palette.grey[500]}20`
                  }
                },
                '& .MuiSlider-valueLabel': {
                    backgroundColor: theme.palette.grey[500]
                }
              }}
            />
          </Grid>
          <Grid size={2}>
            <Typography variant="body2" color="text.secondary" align="right">
              24px
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Preview your selection with the boxes above. Click on them to quickly set specific values.
        </Typography>
      </Box>
    </Stack>
  );
}
