import MainCard from 'ui-component/cards/MainCard';
import { Box } from '@mui/material';

export default function AboutPage() {
  return (
    <MainCard title="Projeto Final - Indústrias Wayne" sx={{ p: 0 }}>
      <Box
        component="img"
        src="https://raw.githubusercontent.com/MichaelXG/assets/main/images/wayne/projeto-pagina-1.png"
        sx={{
          width: '100%',
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          mb: 2
        }}
      />
      <Box
        component="img"
        src="https://raw.githubusercontent.com/MichaelXG/assets/main/images/wayne/projeto-pagina-2.png"
        sx={{
          width: '100%',
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          mb: 2
        }}
      />
      <Box
        component="img"
        src="https://raw.githubusercontent.com/MichaelXG/assets/main/images/wayne/projeto-pagina-3.png"
        sx={{
          width: '100%',
          maxWidth: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
    </MainCard>
  );
}
