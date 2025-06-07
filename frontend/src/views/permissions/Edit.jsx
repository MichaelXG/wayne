import React, { useMemo, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Card,
  CardHeader,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DefaultLayout from '../../layout/DefaultLayout';
import { BaseDir, isDebug } from '../../App';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import useLocalStorage from '../../hooks/useLocalStorage';
import axios from 'axios';
import { API_ROUTES } from '../../routes/ApiRoutes';
import DynamicModal from '../../ui-component/modal/DynamicModal';
import { usePermissions } from '../../contexts/PermissionsContext';
import { safeBtoa, safeAtob } from '../../utils/base64';

export default function PermissionsEdit() {
  const checkingAuth = useAuthGuard();
  const [userData] = useLocalStorage('wayne-user-data', {});
  const token = userData?.authToken || null;
  const { reloadPermissions } = usePermissions();

  // Regra de acesso:
  // - Se usuário tem grupos 'administrador' E 'secret': mostra todos os grupos/menus (incluindo secret)
  // - Se não tem ambos os grupos: mostra todos os grupos/menus EXCETO os secret
  const hasAdminSecretAccess = useMemo(() => {
    let userGroups = [];
    try {
      if (typeof userData?.groups === 'string') {
        const decodedData = safeAtob(userData.groups);
        try {
          userGroups = JSON.parse(decodedData);
        } catch (parseError) {
          console.error('Erro ao fazer parse dos grupos:', parseError);
          userGroups = [];
        }
      } else if (Array.isArray(userData?.groups)) {
        userGroups = userData.groups;
      }
    } catch (error) {
      console.error('Erro ao decodificar grupos:', error);
      userGroups = [];
    }

    isDebug && console.log('=== Verificação de Acesso ===');
    isDebug && console.log('Dados originais:', userData?.groups);
    isDebug && console.log('Grupos decodificados:', userGroups);

    const groupNames = (Array.isArray(userGroups) ? userGroups : [])
      .map((group) => {
        try {
          // Decodifica o nome do grupo que está em base64
          const name = group?.name ? safeAtob(group.name) : '';
          return name.toLowerCase();
        } catch (error) {
          console.error('Erro ao decodificar nome do grupo:', error);
          return '';
        }
      })
      .filter((name) => name);

    isDebug && console.log('Nomes dos grupos decodificados:', groupNames);

    // Verifica se tem grupo admin (aceita administrator ou administrador) E secret
    const hasAdminGroup = groupNames.some((name) => name === 'administrator' || name === 'administrador');
    const hasSecretGroup = groupNames.includes('secret');

    const hasAccess = hasAdminGroup && hasSecretGroup;
    isDebug && console.log('Tem grupo admin?', hasAdminGroup);
    isDebug && console.log('Tem grupo secret?', hasSecretGroup);
    isDebug && console.log('Tem acesso total (admin+secret)?', hasAccess ? 'SIM' : 'NÃO');
    isDebug && console.log('=============================');
    return hasAccess;
  }, [userData?.groups]);

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({});
  const [initialForm, setInitialForm] = useState({});
  const [noChangesModal, setNoChangesModal] = useState(false);
  const [confirmSaveModal, setConfirmSaveModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [isLoadingGroupData, setIsLoadingGroupData] = useState(false);
  const [accessDeniedModal, setAccessDeniedModal] = useState(false);

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios
      .get(API_ROUTES.PERMISSIONS.GROUPS, headers)
      .then((res) => {
        const allGroups = Array.isArray(res.data) ? res.data : [];
        const filteredGroups = hasAdminSecretAccess
          ? allGroups
          : allGroups.filter((group) => !(group.name || '').toLowerCase().includes('secret'));
        console.log('All Groups:', allGroups);
        console.log('Filtered Groups:', filteredGroups);
        setGroups(filteredGroups);
      })
      .catch((err) => {
        console.error('Failed to load groups', err);
        setGroups([]);
      });
  }, [token, hasAdminSecretAccess]);

  useEffect(() => {
    if (selectedGroupId) {
      setIsLoadingGroupData(true);
      axios
        .get(API_ROUTES.PERMISSIONS.TREE, headers)
        .then((res) => {
          const groupNode = res.data.find((g) => g.id === `group-${selectedGroupId}`);
          if (groupNode) {
            const filteredMenus = hasAdminSecretAccess
              ? groupNode.children || []
              : (groupNode.children || []).filter((menu) => !menu.label.toLowerCase().includes('secret'));

            console.log('All Menus:', groupNode.children);
            console.log('Filtered Menus:', filteredMenus);
            setMenus(filteredMenus);

            const transformed = {};
            filteredMenus.forEach((menu) => {
              const permObj = {};
              menu.children.forEach((perm) => {
                permObj[perm.permissionKey] = perm.checked;
              });
              transformed[menu.label.toLowerCase()] = permObj;
            });
            setForm(transformed);
            setInitialForm(transformed);
          }
        })
        .finally(() => {
          setIsLoadingGroupData(false);
        });
    }
  }, [selectedGroupId, hasAdminSecretAccess, groups]);

  const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const handleToggle = (menu, action) => {
    setForm((prev) => ({
      ...prev,
      [menu]: {
        ...prev[menu],
        [action]: !prev[menu][action]
      }
    }));
  };

  const confirmAndSubmit = () => {
    const payload = {
      groupId: selectedGroupId,
      permissions: Object.entries(form).map(([menu, actions]) => ({
        menu_name: menu,
        permissions: actions
      }))
    };

    axios
      .post(API_ROUTES.PERMISSIONS.SAVE, payload, headers)
      .then(() => {
        alert('Permissions successfully updated.');
        setInitialForm(form);
        reloadPermissions();
      })
      .catch((err) => console.error('Error saving permissions', err))
      .finally(() => {
        setConfirmSaveModal(false);
        setPendingSubmit(false);
      });
  };

  const handleSubmit = () => {
    if (deepEqual(form, initialForm)) {
      setNoChangesModal(true);
    } else {
      setConfirmSaveModal(true);
      setPendingSubmit(true);
    }
  };

  const breadcrumbs = useMemo(
    () => [{ label: 'Dashboard', href: `${BaseDir}/dashboard/default` }, { label: 'Permissions', href: '#' }, { label: 'Edit' }],
    []
  );

  const actionbutton = useMemo(
    () => ({
      type: 'submit',
      label: 'Save',
      icon: <SaveIcon />,
      disabled: !selectedGroupId || deepEqual(form, initialForm) || pendingSubmit,
      permission: { menu: 'permissions', action: 'can_update' },
      onClick: handleSubmit
    }),
    [selectedGroupId, form, initialForm, pendingSubmit]
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
        <FormControl sx={{ mb: 3, width: 300 }}>
          <InputLabel id="group-select-label">Groups</InputLabel>
          <Select
            labelId="group-select-label"
            value={selectedGroupId}
            label="Selected Group"
            onChange={(e) => setSelectedGroupId(e.target.value)}
          >
            {groups.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ mb: 2 }} />

        {isLoadingGroupData ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          menus.map((menu) => (
            <Box key={menu.id} sx={{ mb: 4 }}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <CardHeader title={menu.label} subheader="Manage permissions for this menu" />
                <Divider sx={{ mb: 2 }} />
                <FormGroup row sx={{ mt: 2 }}>
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
              </Card>
            </Box>
          ))
        )}
      </Box>

      <DynamicModal
        open={noChangesModal}
        onClose={() => setNoChangesModal(false)}
        onSubmit={() => setNoChangesModal(false)}
        title="No Changes Detected"
        description="You haven't changed anything. There's nothing to save."
        type="warning"
        mode="confirm"
        submitLabel="OK"
      />

      <DynamicModal
        open={confirmSaveModal}
        onClose={() => {
          setConfirmSaveModal(false);
          setPendingSubmit(false);
        }}
        onSubmit={confirmAndSubmit}
        title="Confirm Changes"
        description="You have made changes to the permissions. Do you want to save them?"
        type="success"
        mode="confirm"
        submitLabel="Save"
      />

      <DynamicModal
        open={accessDeniedModal}
        onClose={() => {
          setAccessDeniedModal(false);
          setSelectedGroupId('');
        }}
        onSubmit={() => {
          setAccessDeniedModal(false);
          setSelectedGroupId('');
        }}
        title="Access Denied"
        description={'You do not have permission to view or edit the group "secret"'}
        type="warning"
        mode="confirm"
        submitLabel="OK"
      />
    </DefaultLayout>
  );
}
