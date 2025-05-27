import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DynamicDataGrid from '../../ui-component/dataGrid/DynamicDataGrid';
import createDataGridSlots from '../../ui-component/dataGrid/slots/createDataGridSlots';
import CustomToolbarProduct from '../../ui-component/dataGrid/slots/CustomToolbarProduct';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import { isDebug } from '../../App';
import useLocalStorage from '../../hooks/useLocalStorage';
import sxColumns from '../../ui-component/dataGrid/styles/sxColumns';
import createProductColumns from '../../ui-component/dataGrid/columns/productColumns';
import { useTheme } from '@mui/material/styles';

const ListPage = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]); // armazena o array real
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [userData] = useLocalStorage('wayne-user-data', {});

  const hasFilters = filterModel.items.length > 0;

  const token = userData?.authToken || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ROUTES.PRODUCTS);
        const productList = response.data?.results || response.data || [];

        if (!Array.isArray(productList)) {
          console.error('❌ API response is not a list:', response.data);
          return;
        }

        setProducts(productList);
        setFilteredProducts(productList);
        setLoading(false);

        if (isDebug) console.log('📦 Produtos carregados:', productList);
      } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onDeleteSelected = async () => {
    try {
      await Promise.all(
        selectionModel.map((id) =>
          axios.delete(`${API_ROUTES.PRODUCTS}${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        )
      );

      const updatedProducts = products.filter((p) => !selectionModel.includes(p.id));
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setSelectionModel([]);
    } catch (error) {
      console.error('❌ Erro ao deletar produtos:', error);
    }
  };

  const onClearFilters = useCallback(() => {
    setFilteredProducts(products);
    setFilterModel({ items: [] });
  }, [products]);

  const emptyMessage = useMemo(
    () => ({
      type: 'empty',
      title: 'No products found',
      description: 'Try changing the filters or register a new product.'
    }),
    []
  );

  const noRowsOverlay = useCallback(
    () => <IllustrationMessage type={emptyMessage.type} customTitle={emptyMessage.title} customDescription={emptyMessage.description} />,
    [emptyMessage]
  );

  const toolbar = useCallback(
    () => (
      <CustomToolbarProduct
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
      await axios.delete(`${API_ROUTES.PRODUCTS}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      if (isDebug) console.log(`🗑️ Produto ${id} deletado`);
    } catch (error) {
      console.error(`❌ Erro ao deletar produto ${id}:`, error);
    }
  };

  const columns = createProductColumns(handleDelete);

  return (
    <DynamicDataGrid
      data={filteredProducts || []}
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
