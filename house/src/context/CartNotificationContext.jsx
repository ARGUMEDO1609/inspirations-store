import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartNotificationContext = createContext(null);

export const useCartNotification = () => {
  const context = useContext(CartNotificationContext);
  if (!context) {
    throw new Error('useCartNotification debe usarse dentro de CartNotificationProvider');
  }
  return context;
};

export const CartNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const notifyCart = useCallback(
    (message, variant = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setNotifications((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => removeNotification(id), 4500);
    },
    [removeNotification]
  );

  const value = useMemo(
    () => ({ notifications, notifyCart, removeNotification }),
    [notifications, notifyCart, removeNotification]
  );

  return (
    <CartNotificationContext.Provider value={value}>
      {children}
    </CartNotificationContext.Provider>
  );
};
