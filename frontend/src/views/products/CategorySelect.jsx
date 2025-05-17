import React, { useEffect, useState, forwardRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { API_ROUTES } from '../../routes/ApiRoutes';

const CategorySelect = forwardRef(function CategorySelect(
  { value, onChange, name = 'category', label = 'Category', ...props },
  ref
) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_ROUTES.PRODUCTS);
        const products = Array.isArray(response.data.results)
          ? response.data.results
          : response.data;

        const unique = [...new Set(products.map((p) => p.category))].sort();
        setCategories(unique);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        id={`${name}-select`}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        inputRef={ref} // ✅ aplica o ref corretamente
        {...props}
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export default CategorySelect;
