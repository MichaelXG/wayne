import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DynamicDataGrid from '../../ui-component/dataGrid/DynamicDataGrid';
import createDataGridSlots from '../../ui-component/dataGrid/slots/createDataGridSlots';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import { isDebug } from '../../App';
import useLocalStorage from '../../hooks/useLocalStorage';
import sxColumns from '../../ui-component/dataGrid/styles/sxColumns';
import CustomToolbarAddress from '../../ui-component/dataGrid/slots/CustomToolbarAddress';
import createAddressColumns from '../../ui-component/dataGrid/columns/addressColumns';
import { useTheme } from '@mui/material/styles';


const ListPage = () => {
  const theme = useTheme();
  const [addresses, setAddresses] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [userData] = useLocalStorage('wayne-user-data', {});

  const token = userData?.authToken || null;
  const hasFilters = filterModel.items.length > 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.ADDRESS, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const addressList = response.data?.results || response.data || [];

        if (!Array.isArray(addressList)) {
          console.error('❌ API response is not a list:', response.data);
          return;
        }

        setAddresses(addressList);
        setFilteredAddresses(addressList);
        setLoading(false);

        if (isDebug) console.log('📦 addresses loaded:', addressList);
      } catch (error) {
        console.error('❌ Error loading addresses:', error);
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const onDeleteSelected = async () => {
    try {
      await Promise.all(
        selectionModel.map((id) =>
          axios.delete(`${API_ROUTES.ADDRESS}${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        )
      );

      const updatedAddresses = addresses.filter((p) => !selectionModel.includes(p.id));
      setAddresses(updatedAddresses);
      setFilteredAddresses(updatedAddresses);
      setSelectionModel([]);
    } catch (error) {
      console.error('❌ Error deleting addresses:', error);
    }
  };

  const onClearFilters = useCallback(() => {
    setFilteredAddresses(addresses);
    setFilterModel({ items: [] });
  }, [addresses]);

  const emptyMessage = useMemo(
    () => ({
      type: 'empty',
      title: 'No address found',
      description: 'Try changing the filters or register a new address.'
    }),
    []
  );

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
      <CustomToolbarAddress
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
      await axios.delete(`${API_ROUTES.ADDRESS}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedAddresses = addresses.filter((p) => p.id !== id);
      setAddresses(updatedAddresses);
      setFilteredAddresses(updatedAddresses);

      if (isDebug) console.log(`🗑️ Address ${id} deleted`);
    } catch (error) {
      console.error(`❌ Failed to delete address ${id}:`, error);
    }
  };

  const columns = createAddressColumns(handleDelete);

  return (
    <DynamicDataGrid
      data={filteredAddresses || []}
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
