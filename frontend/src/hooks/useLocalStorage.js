import { useState, useEffect } from 'react';

/**
 * Custom Hook para armazenar e recuperar dados do localStorage com segurança.
 * 
 * @param {string} key - Chave do localStorage.
 * @param {any} defaultValue - Valor inicial caso não haja nada armazenado.
 * @returns {[any, Function, Function]} - Retorna: [valor, setValor, removeValor].
 */
export default function useLocalStorage(key, defaultValue) {
  const isBrowser = typeof window !== 'undefined';

  const [value, setValue] = useState(() => {
    if (!isBrowser) return defaultValue;

    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) return defaultValue;

      return JSON.parse(storedValue);
    } catch (error) {
      console.error(`❌ Error reading from localStorage [${key}]:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (!isBrowser) return;

    const listener = (e) => {
      if (e.storageArea === localStorage && e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null;
          setValue(newValue !== null ? newValue : defaultValue);
        } catch (error) {
          console.error(`❌ Error parsing localStorage event for [${key}]:`, error);
        }
      }
    };

    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [key, defaultValue]);

  // ✅ Função segura para atualizar o localStorage
  const setValueInLocalStorage = (newValue) => {
    if (!isBrowser) return;

    try {
      const result = typeof newValue === 'function' ? newValue(value) : newValue;
      localStorage.setItem(key, JSON.stringify(result));
      setValue(result);
    } catch (error) {
      console.error(`❌ Error setting localStorage [${key}]:`, error);
    }
  };

  // ✅ Função segura para remover o valor
  const removeValue = () => {
    if (!isBrowser) return;

    try {
      localStorage.removeItem(key);
      setValue(defaultValue);
    } catch (error) {
      console.error(`❌ Error removing localStorage [${key}]:`, error);
    }
  };

  return [value, setValueInLocalStorage, removeValue];
}
