import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DynamicDataGrid from '../../ui-component/dataGrid/DynamicDataGrid';
import createDataGridSlots from '../../ui-component/dataGrid/slots/createDataGridSlots';
import CustomToolbarOrder from '../../ui-component/dataGrid/slots/CustomToolbarOrder';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import { isDebug } from '../../App';
import useLocalStorage from '../../hooks/useLocalStorage';
import sxColumns from '../../ui-component/dataGrid/styles/sxColumns';
import createOrderColumns from '../../ui-component/dataGrid/columns/orderColumns';
import ExpandItem from './ExpandItem';

const ListPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [userData] = useLocalStorage('wayne-user-data', {});
  const [expandedRow, setExpandedRow] = useState(null);

  const token = userData?.authToken || null;
  const hasFilters = filterModel.items.length > 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.ORDERS, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const orderList = response.data?.results || response.data || [];
        setOrders(orderList);
        setFilteredOrders(orderList);
        setLoading(false);
      } catch (error) {
        console.error('❌ Erro ao carregar ordens:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onDeleteSelected = async () => {
    try {
      await Promise.all(
        selectionModel.map((id) =>
          axios.delete(`${API_ROUTES.ORDERS}${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      const updatedOrders = orders.filter((o) => !selectionModel.includes(o.id));
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      setSelectionModel([]);
    } catch (error) {
      console.error('❌ Erro ao deletar ordens:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_ROUTES.ORDERS}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedOrders = orders.filter((o) => o.id !== id);
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error('❌ Erro ao deletar ordem:', error);
    }
  };

  const handleExpandRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const onClearFilters = useCallback(() => {
    setFilteredOrders(orders);
    setFilterModel({ items: [] });
  }, [orders]);

  const emptyMessage = useMemo(
    () => ({
      type: 'empty',
      title: 'No order found',
      description: 'Try changing the filters or register a new order.'
    }),
    []
  );

  const noRowsOverlay = useCallback(
    () => <IllustrationMessage type={emptyMessage.type} customTitle={emptyMessage.title} customDescription={emptyMessage.description} />,
    [emptyMessage]
  );

  const toolbar = useCallback(
    () => (
      <CustomToolbarOrder
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
  const columns = createOrderColumns(handleExpandRow, handleDeleteItem, expandedRow);

  return (
    <DynamicDataGrid
      data={filteredOrders}
      columns={columns}
      loading={loading}
      selectionModel={selectionModel}
      setSelectionModel={setSelectionModel}
      filterModel={filterModel}
      setFilterModel={setFilterModel}
      slots={slots}
      sx={sxColumns}
      getRowId={(row) => row.id}
      getDetailPanelContent={({ row }) => (
        <Box
          sx={(theme) => ({
            mt: -1,
            p: 2,
            pl: 7,
            borderLeft: `2px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.default,
            borderRadius: 1,
            overflow: 'hidden'
          })}
        >
          <ExpandItem items={row.items || []} />
        </Box>
      )}
      getDetailPanelHeight={() => 'auto'}
      detailPanelExpandedRowIds={expandedRow ? [expandedRow] : []}
    />
  );
};

export default ListPage;
