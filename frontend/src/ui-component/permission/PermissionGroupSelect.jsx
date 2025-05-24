import React, { useEffect, useState, forwardRef } from 'react';
import { Autocomplete, TextField, Checkbox, FormControl, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { API_ROUTES } from '../../routes/ApiRoutes';

const PermissionGroupSelect = forwardRef(function PermissionGroupSelect(
  { value = [], onChange, name = 'groups', label = 'Permission Groups', ...props },
  ref
) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_ROUTES.GROUPS);
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch permission groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const selectedGroups = groups.filter((group) => value.includes(group.id));

  const handleChange = (event, newValue) => {
    const selectedIds = newValue.map((g) => g.id);
    onChange(selectedIds);
  };

  return (
    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
      <Autocomplete
        multiple
        id={`${name}-autocomplete`}
        options={groups}
        getOptionLabel={(option) => option.name}
        value={selectedGroups}
        onChange={handleChange}
        disableCloseOnSelect
        loading={loading}
        isOptionEqualToValue={(option, val) => option.id === val.id}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder="Select groups"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
            inputRef={ref}
          />
        )}
        {...props}
      />
    </FormControl>
  );
});

export default PermissionGroupSelect;
