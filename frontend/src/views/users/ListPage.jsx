import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

import { API_ROUTES } from '../../routes/ApiRoutes';
import useLocalStorage from '../../hooks/useLocalStorage';
import { isDebug } from '../../App';
import { useI18n } from '../../contexts/I18nContext';

import DynamicDataGrid from '../../ui-component/dataGrid/DynamicDataGrid';
import createUserColumns from '../../ui-component/dataGrid/columns/userColumns';
import createDataGridSlots from '../../ui-component/dataGrid/slots/createDataGridSlots';
import CustomToolbarUser from '../../ui-component/dataGrid/slots/CustomToolbarUser';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import sxColumns from '../../ui-component/dataGrid/styles/sxColumns';

const ListPage = () => {
  const theme = useTheme();
  const { locale } = useI18n();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const [userData] = useLocalStorage('wayne-user-data', {});
  const token = userData?.authToken || null;

  const hasFilters = filterModel.items.length > 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.USERS, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const usersList = response.data?.results || response.data || [];

        if (!Array.isArray(usersList)) {
          console.error('❌ API response is not a list:', response.data);
          return;
        }

        setUsers(usersList);
        setFilteredUsers(usersList);

        if (isDebug) console.log('📦 Loaded users:', usersList);
      } catch (error) {
        console.error('❌ Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_ROUTES.USERS}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUsers = users.filter((u) => u.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      if (isDebug) console.log(`🗑️ User ${id} deleted`);
    } catch (error) {
      console.error(`❌ Failed to delete user ${id}:`, error);
    }
  };

  const onDeleteSelected = async () => {
    try {
      await Promise.all(
        selectionModel.map((id) =>
          axios.delete(`${API_ROUTES.USERS}${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );

      const updatedUsers = users.filter((u) => !selectionModel.includes(u.id));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setSelectionModel([]);
    } catch (error) {
      console.error('❌ Failed to delete selected users:', error);
    }
  };

  const onClearFilters = useCallback(() => {
    setFilteredUsers(users);
    setFilterModel({ items: [] });
  }, [users]);

  const emptyMessage = useMemo(() => ({
    type: 'empty',
    title: 'No users found',
    description: 'Try adjusting the filters or registering a new user.'
  }), []);

  const noRowsOverlay = useCallback(
    () => (
      <IllustrationMessage
        type={emptyMessage.type}
        customTitle={emptyMessage.title}
        customDescription={emptyMessage.description}
      />
    ),
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
  const columns = useMemo(() => createUserColumns(handleDelete, theme, locale), [handleDelete, theme, locale]);

  return (
    <DynamicDataGrid
      data={filteredUsers}
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
