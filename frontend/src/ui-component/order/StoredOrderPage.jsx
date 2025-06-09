import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';

import DynamicDataGrid from '../dataGrid/DynamicDataGrid';
import createDataGridSlots from '../dataGrid/slots/createDataGridSlots';
import CustomToolbarOrder from '../dataGrid/slots/CustomToolbarOrder';
import IllustrationMessage from '../message/IllustrationMessage';
import { isDebug } from '../../App';
import createStoredOrderColumns from '../dataGrid/columns/StoredOrderColumns';
import { getOrderFromLocalStorage } from '../../hooks/useLocalOrder';
import StoredOrderEditModal from './StoredOrderEditModal';
import sxColumns from '../dataGrid/styles/sxColumns';

const StoredOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);

  const orderRef = useRef(null);
  const hasFilters = filterModel.items.length > 0;
  const theme = useTheme();

  const updateOrder = (updatedItems) => {
    const enrichedItems = updatedItems.map((item) => ({
      ...item,
      image: item.image || ''
    }));

    const updatedOrder = {
      ...orderRef.current,
      items: enrichedItems,
      total: enrichedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    };

    orderRef.current = updatedOrder;
    setOrders(enrichedItems);
    setFilteredOrders(enrichedItems);

    if (enrichedItems.length === 0) {
      localStorage.removeItem('order');
    } else {
      localStorage.setItem('order', JSON.stringify(updatedOrder));
    }

    isDebug && console.log('📝 Ordem atualizada:', updatedOrder);
  };

  const onDeleteSelected = useCallback(() => {
    isDebug && console.log('🗑️ IDs dos itens selecionados para exclusão:', selectionModel);
    const updatedItems = orders.filter((item) => !selectionModel.includes(item.id));
    setSelectionModel([]);
    updateOrder(updatedItems);
  }, [orders, selectionModel]);

  const onDeleteItem = useCallback(
    (id) => {
      isDebug && console.log('🗑️ ID do item excluído:', id);
      const updatedItems = orders.filter((item) => item.id !== id);
      updateOrder(updatedItems);
    },
    [orders]
  );

  const onEditQuantity = useCallback((item) => {
    isDebug && console.log('✏️ Iniciando edição do item:', item);
    setEditItem(item);
  }, []);

  const handleSaveEdit = (updatedItem) => {
    if (!editItem) return;

    isDebug && console.log('✏️ Item antes da edição:', editItem);
    isDebug && console.log('✏️ Item após a edição:', updatedItem);

    if (!updatedItem) {
      const remaining = orders.filter((i) => i.id !== editItem.id);
      updateOrder(remaining);
    } else {
      const updatedItems = orders.map((i) => (i.id === updatedItem.id ? { ...i, quantity: updatedItem.quantity } : i));
      updateOrder(updatedItems);
    }

    setEditItem(null);
  };

  const columns = createStoredOrderColumns(onDeleteSelected, onDeleteItem, onEditQuantity, false);

  useEffect(() => {
    const loadOrderFromStorage = () => {
      const order = getOrderFromLocalStorage();
      isDebug && console.log('📦 Pedido carregado do localStorage:', order);
      if (order && Array.isArray(order.items)) {
        orderRef.current = order;
        const items = order.items.map((item) => ({
          ...item,
          image: item.image || ''
        }));
        setOrders(items);
        setFilteredOrders(items);
      } else {
        setOrders([]);
        setFilteredOrders([]);
      }
      setLoading(false);
    };

    loadOrderFromStorage();
  }, []);

  const onClearFilters = useCallback(() => {
    isDebug && console.log('🔍 Limpando filtros');
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

  const NoRowsOverlay = React.useMemo(() => {
    const NoRowsComponent = (props) => <IllustrationMessage {...emptyMessage} {...props} />;
    NoRowsComponent.displayName = 'NoRowsOverlay';
    return NoRowsComponent;
  }, [emptyMessage]);

  const Toolbar = React.useMemo(() => {
    const ToolbarComponent = (props) => (
      <CustomToolbarOrder
        {...props}
        selectionModel={selectionModel}
        onDeleteSelected={onDeleteSelected}
        hasFilters={hasFilters}
        filterModel={filterModel}
        onClearFilters={onClearFilters}
      />
    );
    ToolbarComponent.displayName = 'Toolbar';
    return ToolbarComponent;
  }, [selectionModel, onDeleteSelected, hasFilters, filterModel, onClearFilters]);

  const slots = {
    toolbar: Toolbar,
    noRowsOverlay: NoRowsOverlay
  };

  return (
    <>
      <DynamicDataGrid
        data={filteredOrders}
        columns={columns}
        loading={loading}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        slots={slots}
        sx={sxColumns(theme)}
        getRowId={(row) => row.id}
        summaryFooter={true}
      />

      <StoredOrderEditModal open={!!editItem} item={editItem} onClose={() => setEditItem(null)} onSave={handleSaveEdit} />
    </>
  );
};

export default StoredOrderPage;
