import React, { useEffect, useState, forwardRef } from 'react';
import { Autocomplete, TextField, Checkbox, CircularProgress } from '@mui/material';
import axiosInstance from '../../services/axios';
import { API_ROUTES } from '../../routes/ApiRoutes';

const PermissionGroupSelect = forwardRef(function PermissionGroupSelect(
  { value = [], onChange, name = 'groups', label = 'Permission Groups', error, helperText, ...props },
  ref
) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_ROUTES.GROUPS);
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

  const selectedGroups = groups.filter((group) =>
    value.some((v) => (typeof v === 'object' ? v.id === group.id : v === group.id))
  );

  const handleChange = (event, newValue) => {
    const selectedIds = newValue.map((g) => g.id);
    onChange(selectedIds);
  };

  return (
    <Autocomplete
      multiple
      fullWidth
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
          label={label} // ✅ Garante que o label sempre seja renderizado corretamente
          inputRef={ref}
          placeholder="Select groups"
          error={error}
          helperText={helperText}
          InputLabelProps={{ shrink: true }} // ✅ Garante que o label não fique sobreposto
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      {...props}
    />
  );
});

export default PermissionGroupSelect;
