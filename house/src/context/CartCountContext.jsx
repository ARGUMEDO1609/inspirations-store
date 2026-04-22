import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import useActionCable from '../api/useActionCable';
import { useAuth } from './useAuth';

export const CartCountContext = createContext(null);

export const useCartCount = () => {
  const context = useContext(CartCountContext);
  if (!context) {
    throw new Error('useCartCount debe usarse dentro de CartCountProvider');
  }
  return context;
};

export const CartCountProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCartCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0);
      setLoading(false);
      return 0;
    }
    try {
      const response = await api.get('/cart_items');
      const items = response.data.data?.items || [];
      const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(total);
      return total;
    } catch {
      setCartCount(0);
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      setLoading(false);
      return;
    }

    refreshCartCount();
  }, [refreshCartCount, user]);

  const cartHandlers = useMemo(
    () => ({
      CART_UPDATED: () => {
        refreshCartCount();
      }
    }),
    [refreshCartCount]
  );

  useActionCable({ channel: 'CartChannel' }, cartHandlers, Boolean(user));

  const value = useMemo(
    () => ({
      cartCount,
      loading,
      refreshCartCount,
      setCartCount
    }),
    [cartCount, loading, refreshCartCount]
  );

  return <CartCountContext.Provider value={value}>{children}</CartCountContext.Provider>;
};
