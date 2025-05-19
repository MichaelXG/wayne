import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, IconButton, Stack, Typography, styled, alpha } from '@mui/material';
import { Icon } from '@iconify/react';

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${alpha(theme.palette.grey[200], 0.4)}`,
  borderRadius: '16px',
  padding: theme.spacing(1, 3),
  backgroundColor: theme.palette.grey[100],
  cursor: 'pointer',
  transition: 'border 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: theme.palette.grey[600],
    backgroundColor: theme.palette.grey[300]
  }
}));

const ImagePreview = styled('img')(({ theme }) => ({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`
}));

export default function ImageUpload({ initialImages = [], value, onChange, disabled = false }) {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const normalized = initialImages.map((img) =>
      typeof img === 'string' ? { url: img } : img
    );
    setImages(normalized);
  }, [initialImages]);

  useEffect(() => {
    // se o componente for controlado por `value`
    if (value) {
      setImages(value);
    }
  }, [value]);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const urls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));

    const updatedImages = [...images, ...urls];
    setImages(updatedImages);
    onChange?.(updatedImages);
  };

  const handleClick = () => inputRef.current?.click();

  const handleRemove = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange?.(updatedImages);
  };

  const handleClearAll = () => {
    setImages([]);
    onChange?.([]);
  };

  const getImageSrc = (img) => {
    if (img.file) return URL.createObjectURL(img.file);
    if (img.url?.startsWith('http')) return img.url;
    return `${API_BASE_URL}${img.url}`;
  };

  return (
    <Box width="100%" sx={{ p: 2 }}>
      <UploadBox
        onClick={!disabled ? handleClick : undefined}
        role="presentation"
        tabIndex={0}
        sx={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto'
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleUpload}
          disabled={disabled}
        />
        <Icon icon="solar:cloud-upload-bold" width={64} height={64} style={{ marginBottom: 16 }} />
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Drop or select file
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Drop files here or click to <strong>browse</strong> through your machine.
        </Typography>
      </UploadBox>

      <Stack direction="row" spacing={2} mt={3} flexWrap="wrap">
        {images.map((img, index) => (
          <Box key={index} position="relative">
            <ImagePreview src={getImageSrc(img)} alt={`preview-${index}`} />
            <IconButton
              size="small"
              disabled={disabled}
              sx={{
                position: 'absolute',
                top: -6,
                right: -6,
                backgroundColor: '#fff',
                boxShadow: (theme) => theme.shadows[1],
                '&:hover': { backgroundColor: 'error.lighter' }
              }}
              onClick={() => handleRemove(index)}
            >
              <Icon icon="solar:close-circle-bold" width={18} height={18} />
            </IconButton>
          </Box>
        ))}
      </Stack>

      {images.length > 0 && (
        <Box mt={3} px={3} py={2} display="flex" justifyContent="flex-end" gap={2} sx={{ padding: (theme) => theme.spacing(1, 3) }}>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={handleClearAll}
            disabled={disabled}
            startIcon={<Icon icon="solar:trash-bin-trash-bold" width={18} height={18} />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 120,
              px: 2,
              py: 1,
              gap: 1,
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'error.lighter',
                borderColor: 'error.main',
                color: 'error.main'
              }
            }}
          >
            Remove all
          </Button>

          <Button
            variant="contained"
            size="small"
            onClick={handleClick}
            disabled={disabled}
            startIcon={<Icon icon="eva:cloud-upload-fill" width={18} height={18} />}
            sx={(theme) => ({
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 120,
              px: 2,
              py: 1,
              gap: 1,
              fontSize: '0.875rem',
              backgroundColor: theme.palette.grey[200],
              color: theme.palette.secondary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.grey[600]
              }
            })}
          >
            Upload
          </Button>
        </Box>
      )}
    </Box>
  );
}
