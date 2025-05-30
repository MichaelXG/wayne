import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Button
} from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '../../routes/ApiRoutes';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function SimplePermissionsEditor() {
  const [userData] = useLocalStorage('wayne-user-data', {});
  const token = userData?.authToken || null;

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({}); // { menu_name: { can_create: true, ... } }

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

          // Transforma para estrutura do formulário
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

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Editor de Permissões por Grupo
      </Typography>

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

      <Button variant="contained" onClick={handleSubmit} disabled={!selectedGroupId}>
        Salvar Permissões
      </Button>
    </Box>
  );
}
