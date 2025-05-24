import React, { useEffect, useState, forwardRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { API_ROUTES } from '../../routes/ApiRoutes';

const PermissionGroupSelect = forwardRef(function PermissionGroupSelect(
  { value, onChange, name = 'group', label = 'Permission Group', ...props },
  ref
) {
  const [groups, setGroups] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(API_ROUTES.GROUPS);
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch permission groups:', error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        id={`${name}-select`}
        name={name}
        value={value}
        onChange={onChange}
        required
        inputRef={ref}
        sx={{
          ...theme.typography.customInput,
          height: 60, 
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            height: '100%' 
          }
        }}
        {...props}
      >
        {Array.isArray(groups) && groups.length > 0 ? (
          groups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No groups available</MenuItem>
        )}
      </Select>
    </FormControl>
  );
});

export default PermissionGroupSelect;
