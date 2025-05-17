import { useState, useEffect } from 'react';

/**
 * Custom Hook para armazenar e recuperar dados do localStorage com segurança
 * @param {string} key - Chave do localStorage
 * @param {any} defaultValue - Valor inicial caso não haja nada armazenado
 * @returns {[any, Function, Function]} - Retorna o valor armazenado, uma função para atualizar e outra para remover
 */
export default function useLocalStorage(key, defaultValue) {
  // 🔹 Verifica se estamos no ambiente do navegador (evita erro em SSR)
  const isBrowser = typeof window !== 'undefined';

  const [value, setValue] = useState(() => {
    if (!isBrowser) return defaultValue;

    try {
      const storedValue = localStorage.getItem(key);
      return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error("❌ Error reading from localStorage:", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (!isBrowser) return;

    const listener = (e) => {
      if (e.storageArea === localStorage && e.key === key) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
        } catch (error) {
          console.error("❌ Error parsing localStorage value:", error);
        }
      }
    };

    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [key]);

  // 🔹 Função para atualizar o localStorage
  const setValueInLocalStorage = (newValue) => {
    try {
      setValue((currentValue) => {
        const result = typeof newValue === 'function' ? newValue(currentValue) : newValue;
        localStorage.setItem(key, JSON.stringify(result));
        return result;
      });
    } catch (error) {
      console.error("❌ Error setting localStorage:", error);
    }
  };

  // 🔹 Função para remover o item do localStorage
  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setValue(defaultValue);
    } catch (error) {
      console.error("❌ Error removing localStorage key:", error);
    }
  };

  return [value, setValueInLocalStorage, removeValue];
}
