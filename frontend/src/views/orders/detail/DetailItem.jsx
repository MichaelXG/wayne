import React, { useCallback, useMemo, useState } from 'react';
import { BaseDir, customSvgEditIcon, isDebug } from '../../../App';
import DynamicDataGrid from '../../../ui-component/dataGrid/DynamicDataGrid';
import CustomToolbarOrder from '../../../ui-component/dataGrid/slots/CustomToolbarOrder';
import IllustrationMessage from '../../../ui-component/message/IllustrationMessage';
import { useOrderIDContext } from '../../../contexts/OrderIDContext';
import useFetchData from '../../../hooks/useFetchData';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import createDataGridSlots from '../../../ui-component/dataGrid/slots/createDataGridSlots';
import sxColumns from '../../../ui-component/dataGrid/styles/sxColumns';
import createOrderItemColumns from '../../../ui-component/dataGrid/columns/OrderItemColumns';
import DefaultCardLayout from '../card/DefaultCardLayout';
import useOrderLockStatus from '../../../hooks/useOrderLockStatus';
import { useTheme } from '@mui/material/styles';

export default function DetailItem() {
  const theme = useTheme();
  isDebug && console.log('DetailItem renderizado');

  const checkingAuth = useAuthGuard();
  const { orderId } = useOrderIDContext();
  const { data: order, loading } = useFetchData(`${API_ROUTES.ORDERS}${orderId}/`);

  const [selectionModel, setSelectionModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const hasFilters = useMemo(() => filterModel?.items?.length > 0, [filterModel]);

  const orders = useMemo(() => order?.items || [], [order]);

  const { canEdit } = useOrderLockStatus(orderId);

  const actionbutton = useMemo(
    () => ({
      label: 'Edit',
      href: `/orders/edit/${orderId}`,
      icon: customSvgEditIcon,
      disabled: !canEdit,
      permission: { menu: 'orders', action: 'can_update' }
    }),
    [canEdit, orderId]
  );

  const onDeleteSelected = useCallback(() => {
    const updatedItems = orders.filter((item) => !selectionModel.includes(item.id));
    setSelectionModel([]);
    if (isDebug) console.log('🔴 Deleted Selected Items:', updatedItems);
  }, [orders, selectionModel]);

  const onDeleteItem = useCallback(
    (id) => {
      const updatedItems = orders.filter((item) => item.id !== id);
      if (isDebug) console.log('🔴 Deleted Item:', id);
    },
    [orders]
  );

  const onEditQuantity = useCallback((item) => {
    if (isDebug) console.log('✏️ Edit Item:', item);
  }, []);

  const columns = useMemo(
    () => createOrderItemColumns(onDeleteSelected, onDeleteItem, onEditQuantity, false, !canEdit),
    [onDeleteSelected, onDeleteItem, onEditQuantity, canEdit]
  );

  const onClearFilters = useCallback(() => {
    setFilterModel({ items: [] });
  }, []);

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
        locked={!canEdit}
      />
    ),
    [selectionModel, onDeleteSelected, hasFilters, filterModel, onClearFilters, canEdit]
  );

  const slots = useMemo(
    () =>
      createDataGridSlots({
        toolbar,
        noRowsOverlay
      }),
    [toolbar, noRowsOverlay]
  );

  if (checkingAuth) return null;

  return (
    <DefaultCardLayout subCardTitle="Details" actionbutton={actionbutton}>
      <DynamicDataGrid
        data={orders}
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
    </DefaultCardLayout>
  );
}
