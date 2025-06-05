import { Button } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid';
import FilterListIcon from '@mui/icons-material/FilterList';

const GridToolbarFilterButtonCustom = () => {
  const apiRef = useGridApiContext();

  const handleClick = () => {
    apiRef.current?.showFilterPanel?.();
  };

  return (
    <Button
      variant="text"
      size="small"
      color="secondary"
      disableElevation
      startIcon={<FilterListIcon fontSize="small" />}
      onClick={handleClick}
      aria-label="Show Filter Panel"
      aria-haspopup="true"
      sx={(theme) => ({
        backgroundColor: (theme) => theme.palette.grey[300],
        color: (theme) => theme.palette.grey[600],
        minWidth: 100,
        '&:hover': {
          backgroundColor: theme.palette.grey[600],
          color: (theme) => theme.palette.common.white
        }
      })}
    >
      Filter
    </Button>
  );
};

export default GridToolbarFilterButtonCustom;
