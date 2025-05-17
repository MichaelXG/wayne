import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DynamicDataGrid from '../../ui-component/dataGrid/DynamicDataGrid';
import createDataGridSlots from '../../ui-component/dataGrid/slots/createDataGridSlots';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import { isDebug } from '../../App';
import useLocalStorage from '../../hooks/useLocalStorage';
import sxColumns from '../../ui-component/dataGrid/styles/sxColumns';
import CustomToolbarCarrier from '../../ui-component/dataGrid/slots/CustomToolbarCarrier';
import createCarrierColumns from '../../ui-component/dataGrid/columns/carrierColumns';

const ListPage = () => {
  const [carriers, setCarriers] = useState([]); 
  const [filteredCarriers, setFilteredCarriers] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [userData] = useLocalStorage('wayne-user-data', {});

  const hasFilters = filterModel.items.length > 0;

  const token = userData?.authToken || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.CARRIER);
        const carrierList = response.data?.results || response.data || [];

        if (!Array.isArray(carrierList)) {
          console.error('❌ API response is not a list:', response.data);
          return;
        }

        setCarriers(carrierList);
        setFilteredCarriers(carrierList);
        setLoading(false);

        if (isDebug) console.log('📦 Carriers loaded:', carrierList);
      } catch (error) {
        console.error('❌ Error loading Carriers:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onDeleteSelected = async () => {
    try {
      await Promise.all(
        selectionModel.map((id) =>
          axios.delete(`${API_ROUTES.CARRIER}${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        )
      );

      const updatedCarrier = carriers.filter((p) => !selectionModel.includes(p.id));
      setCarriers(updatedCarrier);
      setFilteredCarriers(updatedCarrier);
      setSelectionModel([]);
    } catch (error) {
      console.error('❌ Error deleting Carriers:', error);
    }
  };

  const onClearFilters = useCallback(() => {
    setFilteredCarriers(carriers);
    setFilterModel({ items: [] });
  }, [carriers]);

  const emptyMessage = useMemo(
    () => ({
      type: 'empty',
      title: 'No carrier found',
      description: 'Try changing the filters or register a new carrier.'
    }),
    []
  );

  const noRowsOverlay = useCallback(
    () => <IllustrationMessage type={emptyMessage.type} customTitle={emptyMessage.title} customDescription={emptyMessage.description} />,
    [emptyMessage]
  );

  const toolbar = useCallback(
    () => (
      <CustomToolbarCarrier
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
      await axios.delete(`${API_ROUTES.CARRIER}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedCarrier = carriers.filter((p) => p.id !== id);
      setCarriers(updatedCarrier);
      setFilteredCarriers(updatedCarrier);

      if (isDebug) console.log(`🗑️ Carrier ${id} deleted`);
    } catch (error) {
      console.error(`❌ Failed to delete carrier ${id}:`, error);
    }
  };

  const columns = createCarrierColumns(handleDelete);

  return (
    <DynamicDataGrid
      data={filteredCarriers || []}
      columns={columns}
      loading={loading}
      selectionModel={selectionModel}
      setSelectionModel={setSelectionModel}
      filterModel={filterModel}
      setFilterModel={setFilterModel}
      slots={slots}
      sx={sxColumns}
    />
  );
};

export default ListPage;
