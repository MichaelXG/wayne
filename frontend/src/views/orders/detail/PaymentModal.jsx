import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Box
} from '@mui/material';
import InputMask from 'react-input-mask';
import DefaultMinimalLayout from '../../../layout/DefaultMinimalLayout';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import CheckIcon from '@mui/icons-material/Check';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DynamicModal from '../../../ui-component/modal/DynamicModal';
import { useTheme } from '@mui/material/styles';

const STATUS_OPTIONS = ['active', 'inactive', 'expired'];

export default function PaymentModal({ open, onClose, card, setCard, onSave }) {
  const theme = useTheme();
  const [expiryError, setExpiryError] = useState(false);
  const checkingAuth = useAuthGuard();
  const [originalCard, setOriginalCard] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      setOriginalCard((prev) => prev || card);
    } else {
      setOriginalCard(null);
    }
  }, [open]);

  const hasChanges = useMemo(() => {
    if (!originalCard) return false;
    return (
      originalCard.number !== card.number ||
      originalCard.name !== card.name ||
      originalCard.expiry !== card.expiry ||
      originalCard.cvc !== card.cvc ||
      originalCard.status !== card.status ||
      originalCard.is_primary !== card.is_primary
    );
  }, [card, originalCard]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let fieldValue = type === 'checkbox' ? checked : value;

    if (name === 'name') {
      fieldValue = fieldValue.toUpperCase();
    }

    if (name === 'expiry') {
      const [mm, yy] = fieldValue.split('/').map((v) => parseInt(v, 10));
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      const isValid = !isNaN(mm) && !isNaN(yy) && mm >= 1 && mm <= 12 && (yy > currentYear || (yy === currentYear && mm >= currentMonth));
      setExpiryError(!isValid);
    }

    setCard((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const handleInputFocus = (e) => {
    setCard((prev) => ({ ...prev, focus: e.target.name }));
  };

  const handleSave = () => {
    if (expiryError) return;
    if (!hasChanges) {
      setShowWarning(true);
      return;
    }
    setShowConfirm(true);
  };

  const actionbutton = {
    label: 'Save',
    icon: <CheckIcon />,
    onClick: handleSave,
    disabled: !hasChanges || expiryError
  };

  const actionClose = useMemo(
    () => ({
      label: 'Cancel',
      icon: <CloseRoundedIcon />,
      onClick: onClose
    }),
    [onClose]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <DefaultMinimalLayout
          mainCardTitle="Payment"
          subCardTitle={card.number ? 'Edit Wallet' : 'Add Wallet'}
          actionbutton={actionbutton}
          actionClose={actionClose}
          checkingAuth={!checkingAuth}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControl
                  sx={(theme) => ({
                    flex: 1,
                    mr: 2,
                    '& label.Mui-focused': { color: theme.palette.grey[600] },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.grey[600]
                    }
                  })}
                >
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select labelId="status-label" name="status" value={card.status || 'active'} onChange={handleInputChange} label="Status">
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={<Switch name="is_primary" checked={!!card.is_primary} onChange={handleInputChange} color="secondary" />}
                  label="Primary Card"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <InputMask mask="9999 9999 9999 9999" value={card.number || ''} onChange={handleInputChange} onFocus={handleInputFocus}>
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    label="Card Number"
                    name="number"
                    fullWidth
                    required
                    sx={(theme) => ({
                      '& label.Mui-focused': { color: theme.palette.grey[600] },
                      '& .MuiInput-underline:after': { borderBottomColor: theme.palette.grey[600] },
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.grey[600]
                        }
                      }
                    })}
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Name on Card"
                name="name"
                value={card.name || ''}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                fullWidth
                required
                sx={(theme) => ({
                  '& label.Mui-focused': { color: theme.palette.grey[600] },
                  '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                    borderColor: theme.palette.grey[600]
                  }
                })}
              />
            </Grid>

            <Grid item xs={6}>
              <InputMask mask="99/99" value={card.expiry || ''} onChange={handleInputChange} onFocus={handleInputFocus}>
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    label="Expiry"
                    name="expiry"
                    fullWidth
                    required
                    error={expiryError}
                    helperText={expiryError ? 'Invalid expiry (month/year).' : ''}
                    sx={(theme) => ({
                      '& label.Mui-focused': { color: theme.palette.grey[600] },
                      '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                        borderColor: theme.palette.grey[600]
                      }
                    })}
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={6}>
              <InputMask mask="999" value={card.cvc || ''} onChange={handleInputChange} onFocus={handleInputFocus}>
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    label="CVC"
                    name="cvc"
                    fullWidth
                    required
                    sx={(theme) => ({
                      '& label.Mui-focused': { color: theme.palette.grey[600] },
                      '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                        borderColor: theme.palette.grey[600]
                      }
                    })}
                  />
                )}
              </InputMask>
            </Grid>
          </Grid>
        </DefaultMinimalLayout>
      </DialogContent>

      <DynamicModal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        type="warning"
        mode="alert"
        title="No changes detected"
        description="You must modify some value to enable saving."
      />

      <DynamicModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          onSave(card);
        }}
        title="Save Changes"
        type="success"
        description="Do you want to save the changes made to this card?"
        mode="confirm"
        submitLabel="Save"
      />
    </Dialog>
  );
}
