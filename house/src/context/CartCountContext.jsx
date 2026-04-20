import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

export const CartCountContext = createContext(null);

export const useCartCount = () => {
  const context = useContext(CartCountContext);
  if (!context) {
    throw new Error('useCartCount debe usarse dentro de CartCountProvider');
  }
  return context;
};

export const CartCountProvider = ({ children }) => {
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
    let mounted = true;
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/cart_items')
      .then(res => {
        if (!mounted) return;
        const items = res.data.data?.items || [];
        const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(total);
      })
      .catch(() => {
        if (!mounted) return;
        setCartCount(0);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

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