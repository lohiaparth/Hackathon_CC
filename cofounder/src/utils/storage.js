// utils/storage.js
export const getStorageValue = (key, defaultValue) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(key);
      return saved || defaultValue;
    }
    return defaultValue;
  };
  
  export const setStorageValue = (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  };
  
  // Custom hook for localStorage
  import { useState, useEffect } from 'react';
  
  export const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(defaultValue);
  
    useEffect(() => {
      setValue(getStorageValue(key, defaultValue));
    }, [key, defaultValue]);
  
    const setStoredValue = (newValue) => {
      setValue(newValue);
      setStorageValue(key, newValue);
    };
  
    return [value, setStoredValue];
  };