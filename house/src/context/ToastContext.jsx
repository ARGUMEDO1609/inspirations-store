import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 max-w-md w-full">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={`
              flex items-start gap-4 p-5 rounded-[24px] border backdrop-blur-2xl shadow-2xl animate-in slide-in-from-right-full duration-500
              ${t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
              ${t.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : ''}
              ${t.type === 'info' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
            `}
          >
            <div className="mt-1">
              {t.type === 'success' && <CheckCircle size={20} />}
              {t.type === 'error' && <AlertCircle size={20} />}
              {t.type === 'info' && <Info size={20} />}
            </div>
            
            <div className="flex-1">
              <h4 className="font-black text-xs uppercase tracking-widest mb-1 text-white">
                {t.title || (t.type === 'success' ? 'Éxito' : t.type === 'error' ? 'Error' : 'Notificación')}
              </h4>
              <p className="text-sm font-medium opacity-80 leading-relaxed">
                {t.message}
              </p>
            </div>

            <button 
              onClick={() => removeToast(t.id)}
              className="p-1 hover:bg-white/10 rounded-full transition"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
