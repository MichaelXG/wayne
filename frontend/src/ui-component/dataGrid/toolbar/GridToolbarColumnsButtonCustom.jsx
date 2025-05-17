import { Button } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid';
import ViewColumnIcon from '@mui/icons-material/ViewColumn'; // ícone oficial

const GridToolbarColumnsButtonCustom = () => {
  const apiRef = useGridApiContext();

  const handleClick = () => {
    apiRef.current?.showPreferences?.('columns');
  };

  return (
    <Button
      variant="text"
      size="small"
      color="secondary" 
      disableElevation
      startIcon={<ViewColumnIcon fontSize="small" />}
      onClick={handleClick}
      aria-label="Open Columns Panel"
      aria-haspopup="true"
      sx={{
        '&:hover': {
          backgroundColor: 'secondary.light',
          color: 'secondary.darker'
        }
      }}
    >
      Columns
    </Button>
  );
};

export default GridToolbarColumnsButtonCustom;
