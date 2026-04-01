import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/utils';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = (msg, dur) => addToast(msg, 'success', dur);
  const error = (msg, dur) => addToast(msg, 'error', dur);
  const info = (msg, dur) => addToast(msg, 'info', dur);
  const warning = (msg, dur) => addToast(msg, 'warning', dur);

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center pointer-events-none w-full max-w-md px-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="text-white" size={18} />,
    error: <AlertCircle className="text-white" size={18} />,
    info: <Info className="text-white" size={18} />,
    warning: <AlertTriangle className="text-white" size={18} />,
  };

  const styles = {
    success: 'bg-[#1A3A5C]',
    error: 'bg-[#D64545]',
    info: 'bg-[#4A8BC2]',
    warning: 'bg-[#F5A623]',
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-white/10 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] animate-in fade-in slide-in-from-bottom-4 zoom-in-95",
        styles[toast.type]
      )}
    >
      <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
        {icons[toast.type]}
      </div>
      <p className="text-sm font-bold text-white tracking-wide pr-2">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-1 p-1 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  );
};
