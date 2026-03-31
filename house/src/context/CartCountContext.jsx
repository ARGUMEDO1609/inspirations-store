import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const CartCountContext = createContext(null);

export const CartCountProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      const response = await api.get('/cart_items');
      const items = response.data.data?.items || [];
      const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(total);
      return total;
    } catch {
      return cartCount;
    }
  }, []);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  const value = useMemo(
    () => ({
      cartCount,
      refreshCartCount,
      setCartCount
    }),
    [cartCount, refreshCartCount]
  );

  return <CartCountContext.Provider value={value}>{children}</CartCountContext.Provider>;
};

export const useCartCount = () => {
  const context = useContext(CartCountContext);
  if (!context) {
    throw new Error('useCartCount debe usarse dentro de CartCountProvider');
  }

  return context;
};
