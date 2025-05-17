// material-ui
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| CUSTOMIZATION - FONT FAMILY ||============================== //

export default function FontFamilyPage() {
  const { fontFamily, onChangeFontFamily } = useConfig();

  const handleFontChange = (event) => {
    onChangeFontFamily(event.target.value);
  };

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

  const bgColor = 'grey.50';
  const bgActiveColor = 'primary.light';

  return (
    <Stack spacing={2.5} sx={{ p: 2, width: '100%' }}>
      <Typography variant="h5">FONT STYLE</Typography>
      <RadioGroup aria-label="payment-card" name="payment-card" value={fontFamily} onChange={handleFontChange}>
        <Grid container spacing={1.25}>
          {fonts.map((item, index) => (
            <Grid key={index} size={12}>
              <MainCard content={false} sx={{ p: 0.75, bgcolor: fontFamily === item.value ? bgActiveColor : bgColor }}>
                <MainCard
                  content={false}
                  border
                  sx={{
                    p: 1.75,
                    borderWidth: 1,
                    ...(fontFamily === item.value && { borderColor: 'primary.main' })
                  }}
                >
                  <FormControlLabel
                    sx={{ width: 1 }}
                    control={<Radio value={item.value} sx={{ display: 'none' }} />}
                    label={
                      <Typography variant="h5" sx={{ pl: 2, fontFamily: item.value }}>
                        {item.label}
                      </Typography>
                    }
                  />
                </MainCard>
              </MainCard>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </Stack>
  );
}
