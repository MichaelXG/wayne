import React, { useRef, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, TextField, Box, Grid, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DefaultMinimalLayout from '../../layout/DefaultMinimalLayout';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function OtpModal({ open, onClose, onConfirm, code = '', setCode }) {
  const inputs = [useRef(), useRef(), useRef()];
  const checkingAuth = useAuthGuard();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputs[0].current?.focus();
      }, 100);
    }
  }, [open]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = code.split('');
    newCode[index] = value;
    const updatedCode = newCode.join('').slice(0, 3);
    setCode(updatedCode);

    if (value && index < 2) {
      inputs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  const actionbutton = {
    label: 'Validation',
    icon: <CheckIcon />,
    onClick: () => {
      onConfirm();
      setCode('');
    }
  };

  const actionClose = useMemo(
    () => ({
      label: 'Cancel',
      icon: <CloseRoundedIcon />,
      onClick: () => {
        onClose();
        setCode('');
      }
    }),
    [onClose]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <DefaultMinimalLayout
          mainCardTitle="Payment"
          subCardTitle="Enter Security Code"
          actionbutton={actionbutton}
          actionClose={actionClose}
          checkingAuth={!checkingAuth}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" gap={2} mt={1}>
                {[0, 1, 2].map((i) => (
                  <TextField
                    key={i}
                    inputRef={inputs[i]}
                    value={code[i] || ''}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        width: '3rem',
                        textAlign: 'center',
                        fontSize: '1.5rem'
                      }
                    }}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'secondary.light'
                        },
                        '&:hover fieldset': {
                          borderColor: 'secondary.main'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'secondary.main'
                        }
                      },
                      '& .MuiInputBase-input': {
                        color: 'secondary.main'
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>
            <Box width="100%" mt={2} display="flex" justifyContent="center">
              <Typography variant="caption" className="text-gray-400 leading-relaxed" sx={{ textAlign: 'center' }}>
                * CSC code
                <br />
                Max size of 3 digits
              </Typography>
            </Box>
          </Grid>
        </DefaultMinimalLayout>
      </DialogContent>
    </Dialog>
  );
}
