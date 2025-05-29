import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DynamicDataGrid from '../../ui-component/dataGrid/DynamicDataGrid';
import createDataGridSlots from '../../ui-component/dataGrid/slots/createDataGridSlots';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import { isDebug } from '../../App';
import useLocalStorage from '../../hooks/useLocalStorage';
import sxColumns from '../../ui-component/dataGrid/styles/sxColumns';
import createUserColumns from '../../ui-component/dataGrid/columns/userColumns';
import { useTheme } from '@mui/material/styles';
import CustomToolbarUser from '../../ui-component/dataGrid/slots/CustomToolbarUser';

const ListPage = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]); // armazena o array real
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [userData] = useLocalStorage('wayne-user-data', {});

  const hasFilters = filterModel.items.length > 0;

  const token = userData?.authToken || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = useMemo(() => `${API_ROUTES.USERS}`, []);
        const usersList = response.data?.results || response.data || [];

        if (!Array.isArray(usersList)) {
          console.error('❌ API response is not a list:', response.data);
          return;
        }

        setUsers(usersList);
        setFilteredUsers(usersList);
        setLoading(false);

        if (isDebug) console.log('📦 Usuários carregados:', usersList);
      } catch (error) {
        console.error('❌ Erro ao carregar usuarios:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onDeleteSelected = async () => {
    try {
      await Promise.all(
        selectionModel.map((id) =>
          axios.delete(`${API_ROUTES.USERS}${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        )
      );

      const updatedUsers = users.filter((p) => !selectionModel.includes(p.id));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setSelectionModel([]);
    } catch (error) {
      console.error('❌ Erro ao deletar usuários:', error);
    }
  };

  const onClearFilters = useCallback(() => {
    setFilteredUsers(users);
    setFilterModel({ items: [] });
  }, [users]);

  const emptyMessage = useMemo(
    () => ({
      type: 'empty',
      title: 'No users found',
      description: 'Try changing the filters or register a new user.'
    }),
    []
  );

  const noRowsOverlay = useCallback(
    () => <IllustrationMessage type={emptyMessage.type} customTitle={emptyMessage.title} customDescription={emptyMessage.description} />,
    [emptyMessage]
  );

  const toolbar = useCallback(
    () => (
      <CustomToolbarUser
        selectionModel={selectionModel}
        onDeleteSelected={onDeleteSelected}
        hasFilters={hasFilters}
        filterModel={filterModel}
        onClearFilters={onClearFilters}
      />
    ),
    [selectionModel, onDeleteSelected, hasFilters, filterModel, onClearFilters]
  );

  const slots = useMemo(() => createDataGridSlots({ toolbar, noRowsOverlay }), [toolbar, noRowsOverlay]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_ROUTES.USERS}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedUsers = users.filter((p) => p.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      if (isDebug) console.log(`🗑️ Produto ${id} deletado`);
    } catch (error) {
      console.error(`❌ Erro ao deletar produto ${id}:`, error);
    }
  };

  const columns = createUserColumns(handleDelete);

  return (
    <DynamicDataGrid
      data={filteredUsers || []}
      columns={columns}
      loading={loading}
      selectionModel={selectionModel}
      setSelectionModel={setSelectionModel}
      filterModel={filterModel}
      setFilterModel={setFilterModel}
      slots={slots}
      sx={sxColumns(theme)}
    />
  );
};

export default ListPage;
