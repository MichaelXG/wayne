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
      sx={(theme) => ({
        '&:hover': {
          backgroundColor: theme.palette.grey[300],
          color: theme.palette.grey[900] || theme.palette.grey[600]
        }
      })}
    >
      Columns
    </Button>
  );
};

export default GridToolbarColumnsButtonCustom;
