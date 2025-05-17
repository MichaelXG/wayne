import PropTypes from 'prop-types';
// material-ui
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

export default function AuthCardWrapper({ children, ...other }) {
  return (
    <MainCard
      sx={{
        maxWidth: { xs: '90%', sm: 400, lg: 475 }, // ✅ Melhor responsividade
        margin: { xs: 2.5, md: 3 },
        display: 'flex', // ✅ Adiciona flexbox
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& > *': {
          flexGrow: 1,
          flexBasis: '50%'
        }
      }}
      content={false}
      {...other}
    >
      <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>{children}</Box>
    </MainCard>
  );
}

AuthCardWrapper.propTypes = { children: PropTypes.node }; // ✅ Melhor validação das props
