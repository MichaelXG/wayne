import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, IconButton, Typography, Button, styled, alpha, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  gap: theme.spacing(2),
  position: 'relative' // ✅ necessário para posicionar o botão
}));

const AvatarUploadBox = styled(Box)(({ theme }) => ({
  width: 128,
  height: 128,
  borderRadius: '50%',
  border: `2px dashed ${alpha(theme.palette.secondary.main, 0.4)}`,
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.grey[200]
  }
}));

const AvatarImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: -10,
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey[300]}`,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark
  }
}));

const UserAvatarUpload = forwardRef(({ initialImage = null, onChange, readOnly = false }, ref) => {
  const [image, setImage] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialImage) setImage(initialImage);
  }, [initialImage]);

  useImperativeHandle(ref, () => ({
    clearImage: () => {
      setImage(null);
      onChange?.(null);
    }
  }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setImage(result); // ✅ continua exibindo o preview (base64)
      };
      reader.readAsDataURL(file);

      onChange?.(file); // ✅ envia o File original para upload
    }
  };

  const handleRemove = () => {
    setImage(null);
    onChange?.(null);
  };

  return (
    <AvatarContainer>
      <input type="file" accept="image/*" ref={inputRef} hidden onChange={handleFileChange} />
      <AvatarUploadBox
        onClick={() => !readOnly && inputRef.current?.click()}
        sx={{
          ...(readOnly && {
            pointerEvents: 'none',
            // opacity: 0.6,
            cursor: 'default'
          })
        }}
      >
        {image ? (
          <>
            <AvatarImage src={image} alt="User Avatar" />
            {!readOnly && (
              <RemoveButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                aria-label="Remove image"
              >
                <Icon icon="solar:close-circle-bold" width={20} height={20} />
              </RemoveButton>
            )}
          </>
        ) : (
          <Box className="flex flex-col items-center justify-center gap-2">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="currentColor"
                className="text-gray-400"
              >
                <g fillRule="evenodd" clipRule="evenodd">
                  <path d="M12 10.25a.75.75 0 0 1 .75.75v1.25H14a.75.75 0 0 1 0 1.5h-1.25V15a.75.75 0 0 1-1.5 0v-1.25H10a.75.75 0 0 1 0-1.5h1.25V11a.75.75 0 0 1 .75-.75" />
                  <path d="M9.778 21h4.444c3.121 0 4.682 0 5.803-.735a4.4 4.4 0 0 0 1.226-1.204c.749-1.1.749-2.633.749-5.697s0-4.597-.749-5.697a4.4 4.4 0 0 0-1.226-1.204c-.72-.473-1.622-.642-3.003-.702c-.659 0-1.226-.49-1.355-1.125A2.064 2.064 0 0 0 13.634 3h-3.268c-.988 0-1.839.685-2.033 1.636c-.129.635-.696 1.125-1.355 1.125c-1.38.06-2.282.23-3.003.702A4.4 4.4 0 0 0 2.75 7.667C2 8.767 2 10.299 2 13.364s0 4.596.749 5.697c.324.476.74.885 1.226 1.204C5.096 21 6.657 21 9.778 21M16 13a4 4 0 1 1-8 0a4 4 0 0 1 8 0m2-3.75a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5z" />
                </g>
              </svg>
            </div>
            <Typography variant="caption" className="text-gray-500 text-center">
              Upload photo
            </Typography>
          </Box>
        )}
      </AvatarUploadBox>

      {image && !readOnly && (
        <Tooltip
          title="Clear image"
          placement="top"
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: (theme) => theme.palette.error.light,
                color: '#fff',
                fontSize: 12,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                boxShadow: 2
              }
            }
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'transparent',
              color: (theme) => theme.palette.error.main,
              border: 'none',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.error.light,
                color: (theme) => theme.palette.error.dark
              }
            }}
          >
            <Icon icon="solar:trash-bin-trash-bold" width={20} height={20} />
          </IconButton>
        </Tooltip>
      )}

      {!readOnly && (
        <Typography variant="caption" className="text-gray-400 mt-2 leading-relaxed text-center">
          Allowed *.jpeg, *.jpg, *.png, *.gif
          <br />
          Max size of 3 MB
        </Typography>
      )}
    </AvatarContainer>
  );
});

export default UserAvatarUpload;
