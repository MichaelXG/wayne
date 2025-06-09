import { Button } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const GridToolbarExportCustom = () => {
  const apiRef = useGridApiContext();

  const handleClick = () => {
    apiRef.current?.exportDataAsCsv?.();
  };

  return (
    <Button
      variant="text"
      size="small"
      color="secondary"
      disableElevation
      startIcon={<FileDownloadIcon fontSize="small" />}
      onClick={handleClick}
      aria-label="Export Data"
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
      Export
    </Button>
  );
};

export default GridToolbarExportCustom; 