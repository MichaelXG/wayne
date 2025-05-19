// material-ui
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';

// project imports
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| CUSTOMIZATION - FONT FAMILY ||============================== //

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

  const fonts = [
    {
      id: 'inter',
      value: `'Inter', sans-serif`,
      label: 'Inter'
    },
    {
      id: 'poppins',
      value: `'Poppins', sans-serif`,
      label: 'Poppins'
    },
    {
      id: 'roboto',
      value: `'Roboto', sans-serif`,
      label: 'Roboto'
    },
    {
      id: 'montserrat',
      value: `'Montserrat', sans-serif`,
      label: 'Montserrat'
    },
    {
      id: 'lato',
      value: `'Lato', sans-serif`,
      label: 'Lato'
    },
    {
      id: 'open-sans',
      value: `'Open Sans', sans-serif`,
      label: 'Open Sans'
    },
    {
      id: 'raleway',
      value: `'Raleway', sans-serif`,
      label: 'Raleway'
    },
    {
      id: 'ubuntu',
      value: `'Ubuntu', sans-serif`,
      label: 'Ubuntu'
    },
    {
      id: 'nunito',
      value: `'Nunito', sans-serif`,
      label: 'Nunito'
    },
    {
      id: 'merriweather',
      value: `'Merriweather', serif`,
      label: 'Merriweather'
    },
    {
      id: 'playfair',
      value: `'Playfair Display', serif`,
      label: 'Playfair Display'
    }
  ];

  return (
    <Stack spacing={2.5} sx={{ p: 2, width: '100%' }}>
      <Typography variant="h5">FONT STYLE</Typography>
      <RadioGroup name="font-family" value={fontFamily} onChange={handleFontChange}>
        <Grid container spacing={1.25}>
          {fonts.map((item) => {
            const isSelected = fontFamily === item.value;

            return (
              <Grid key={item.id} item xs={12}>
                <Box
                  sx={{
                    bgcolor: isSelected ? theme.palette.grey[300] : theme.palette.grey[50],
                    borderRadius: 1
                  }}
                >
                  <MainCard
                    content={false}
                    border
                    sx={{
                      p: 1.75,
                      borderWidth: 1,
                      borderColor: isSelected ? theme.palette.grey[600] : theme.palette.divider
                    }}
                  >
                    <FormControlLabel
                      sx={{ width: '100%' }}
                      control={<Radio value={item.value} sx={{ display: 'none' }} />}
                      label={
                        <Typography variant="h5" sx={{ pl: 2, fontFamily: item.value }}>
                          {item.label}
                        </Typography>
                      }
                    />
                  </MainCard>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </RadioGroup>
    </Stack>
  );
}
