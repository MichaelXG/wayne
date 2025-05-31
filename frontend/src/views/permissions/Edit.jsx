import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, Divider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DefaultLayout from '../../layout/DefaultLayout';
import { BaseDir, isDebug } from '../../App';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import useLocalStorage from '../../hooks/useLocalStorage';
import axios from 'axios';
import { API_ROUTES } from '../../routes/ApiRoutes';

export default function PermissionsEdit() {
  isDebug && console.log('PermissionsEdit renderizado');

  const checkingAuth = useAuthGuard();
  const [userData] = useLocalStorage('wayne-user-data', {});
  const token = userData?.authToken || null;

  const permissionsEditRef = useRef();
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({});

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    axios.get(`${API_ROUTES.GROUPS}`, headers).then((res) => {
      setGroups(res.data);
    });
  }, [token]);

  useEffect(() => {
    if (selectedGroupId) {
      axios.get(`${API_ROUTES.PREMISSIONS_TREE}`, headers).then((res) => {
        const groupNode = res.data.find((g) => g.id === `group-${selectedGroupId}`);
        if (groupNode) {
          const newMenus = groupNode.children || [];
          setMenus(newMenus);

          const transformed = {};
          newMenus.forEach((menu) => {
            const permObj = {};
            menu.children.forEach((perm) => {
              permObj[perm.permissionKey] = perm.checked;
            });
            transformed[menu.label.toLowerCase()] = permObj;
          });
          setForm(transformed);
        }
      });
    }
  }, [selectedGroupId]);

  const handleToggle = (menu, action) => {
    setForm((prev) => ({
      ...prev,
      [menu]: {
        ...prev[menu],
        [action]: !prev[menu][action]
      }
    }));
  };

  const handleSubmit = () => {
    const payload = {
      groupId: selectedGroupId,
      permissions: Object.entries(form).map(([menu, actions]) => ({
        menu_name: menu,
        ...actions
      }))
    };

    axios
      .post(`${API_ROUTES.SAVE_PERMISSIONS}`, payload, headers)
      .then(() => alert('Permissões atualizadas com sucesso'))
      .catch((err) => console.error('Erro ao salvar permissões', err));
  };

  const breadcrumbs = useMemo(
    () => [{ label: 'Dashboard', href: `${BaseDir}/dashboard/default` }, { label: 'Permissions', href: '#' }, { label: 'Edit' }],
    []
  );

  const isActive = true;
  const actionbutton = useMemo(
    () => ({
      type: 'submit',
      label: 'Save',
      icon: <SaveIcon />,
      disabled: !isActive,
      onClick: handleSubmit
    }),
    [form, selectedGroupId]
  );

  if (checkingAuth) return null;

  return (
    <DefaultLayout
      mainCardTitle="Permissions"
      subCardTitle="Edit"
      backButton={{ type: 'link', link: `/permissions` }}
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <Box p={2}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="group-select-label">Grupo</InputLabel>
          <Select labelId="group-select-label" value={selectedGroupId} label="Grupo" onChange={(e) => setSelectedGroupId(e.target.value)}>
            {groups.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Divider sx={{ mb: 2 }} />

        {menus.length > 0 &&
          menus.map((menu) => (
            <Box key={menu.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {menu.label}
              </Typography>
              <FormGroup row>
                {menu.children.map((perm) => (
                  <FormControlLabel
                    key={perm.id}
                    control={
                      <Checkbox
                        checked={form[menu.label.toLowerCase()]?.[perm.permissionKey] || false}
                        onChange={() => handleToggle(menu.label.toLowerCase(), perm.permissionKey)}
                      />
                    }
                    label={perm.label}
                  />
                ))}
              </FormGroup>
            </Box>
          ))}
      </Box>
    </DefaultLayout>
  );
}
