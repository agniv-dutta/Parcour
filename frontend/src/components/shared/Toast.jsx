import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const iconMap = {
    success: <CheckCircle2 className="text-success" size={18} />,
    warning: <AlertTriangle className="text-warning" size={18} />,
    error: <XCircle className="text-danger" size={18} />,
  };

  const borderMap = {
    success: 'border-success/30',
    warning: 'border-warning/30',
    error: 'border-danger/30',
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            className={`
              pointer-events-auto min-w-[300px] bg-[#0F1923] border ${borderMap[toast.type]} 
              rounded-xl p-4 shadow-2xl flex items-center justify-between gap-4
            `}
          >
            <div className="flex items-center gap-3">
              {iconMap[toast.type]}
              <p className="text-xs font-bold uppercase tracking-widest text-warm/90">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-warm-muted hover:text-warm transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
