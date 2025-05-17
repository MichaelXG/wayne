import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

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

  const updateOrder = (updatedItems) => {
    const enrichedItems = updatedItems.map((item) => ({
      ...item,
      image: item.image || '' // garante que todos os itens tenham uma imagem
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

    if (isDebug) console.log('📝 Ordem atualizada:', updatedOrder);
  };

  const onDeleteSelected = useCallback(() => {
    const updatedItems = orders.filter((item) => !selectionModel.includes(item.id));
    setSelectionModel([]);
    updateOrder(updatedItems);
  }, [orders, selectionModel]);

  const onDeleteItem = useCallback((id) => {
    const updatedItems = orders.filter((item) => item.id !== id);
    updateOrder(updatedItems);
  }, [orders]);
  
  const onEditQuantity = useCallback((item) => {
    setEditItem(item);
  }, []);

  const handleSaveEdit = (updatedItem) => {
    if (!editItem) return;

    if (!updatedItem) {
      const remaining = orders.filter((i) => i.id !== editItem.id);
      updateOrder(remaining);
    } else {
      const updatedItems = orders.map((i) =>
        i.id === updatedItem.id ? { ...i, quantity: updatedItem.quantity } : i
      );
      updateOrder(updatedItems);
    }

    setEditItem(null);
  };

  const columns = createStoredOrderColumns(
    onDeleteSelected,
    onDeleteItem,
    onEditQuantity,
    false
  );

  useEffect(() => {
    const loadOrderFromStorage = () => {
      const order = getOrderFromLocalStorage();
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

  const noRowsOverlay = useCallback(() => <IllustrationMessage {...emptyMessage} />, [emptyMessage]);

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
        sx={sxColumns}
        getRowId={(row) => row.id}
        summaryFooter={true}
      />

      <StoredOrderEditModal
        open={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default StoredOrderPage;
