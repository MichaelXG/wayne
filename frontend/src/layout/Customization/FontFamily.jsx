// material-ui
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { IconTypography, IconCheck } from '@tabler/icons-react';

// project imports
import useConfig from 'hooks/useConfig';

// ==============================|| CUSTOMIZATION - FONT FAMILY ||============================== //

const fonts = [
  {
    id: 'inter',
    value: `'Inter', sans-serif`,
    label: 'Inter',
    preview: 'The quick brown fox jumps over the lazy dog'
  },
  {
    id: 'poppins',
    value: `'Poppins', sans-serif`,
    label: 'Poppins',
    preview: 'The quick brown fox jumps over the lazy dog'
  },
  {
    id: 'roboto',
    value: `'Roboto', sans-serif`,
    label: 'Roboto',
    preview: 'The quick brown fox jumps over the lazy dog'
  },
  {
    id: 'montserrat',
    value: `'Montserrat', sans-serif`,
    label: 'Montserrat',
    preview: 'The quick brown fox jumps over the lazy dog'
  },
  {
    id: 'open-sans',
    value: `'Open Sans', sans-serif`,
    label: 'Open Sans',
    preview: 'The quick brown fox jumps over the lazy dog'
  }
];

export default function FontFamilyPage() {
  const theme = useTheme();
  const { fontFamily, onChangeFontFamily } = useConfig();

  const handleFontChange = (event) => {
    onChangeFontFamily(event.target.value);
  };

  // Aplica a fonte globalmente ao <body>
  useEffect(() => {
    document.body.style.fontFamily = fontFamily;
  }, [fontFamily]);

  return (
    <Stack spacing={3} sx={{ px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconTypography size={20} />
        <Typography variant="h5">Font Family</Typography>
      </Box>

      <RadioGroup name="font-family" value={fontFamily} onChange={handleFontChange}>
        <Grid container spacing={2}>
          {fonts.map((item) => {
            const isSelected = fontFamily === item.value;

            return (
              <Grid key={item.id} item xs={12}>
                <Box
                  sx={{
                    position: 'relative',
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? `${theme.palette.grey[500]}10` : 'transparent',
                    border: `1px solid ${isSelected ? theme.palette.grey[900] : theme.palette.divider}`,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: theme.palette.grey[500],
                      backgroundColor: `${theme.palette.grey[500]}08`
                    }
                  }}
                >
                  <FormControlLabel
                    value={item.value}
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <Stack spacing={1} sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6" sx={{ fontFamily: item.value }}>
                            {item.label}
                          </Typography>
                          {isSelected && (
                            <Chip
                              icon={<IconCheck size={16} />}
                              label="Selected"
                              size="small"
                              sx={{
                                height: 24,
                                backgroundColor: theme.palette.grey[900],
                                color: theme.palette.common.white
                              }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          color={theme.palette.grey[900]}
                          sx={{
                            fontFamily: item.value,
                            fontSize: '0.875rem',
                            opacity: 0.7
                          }}
                        >
                          {item.preview}
                        </Typography>
                      </Stack>
                    }
                    sx={{
                      m: 0,
                      width: '100%',
                      '& .MuiFormControlLabel-label': {
                        width: '100%'
                      }
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </RadioGroup>

      <Typography variant="caption" color="text.secondary">
        Select a font family to change the typography of your interface.
      </Typography>
    </Stack>
  );
}
