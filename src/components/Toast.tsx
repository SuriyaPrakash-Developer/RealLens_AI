import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'error', onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2  flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border min-w-[320px] max-w-md
        ${type === 'error' ? 'bg-red-50 border-red-100 text-red-800 dark:bg-red-950/80 dark:border-red-900 dark:text-red-200' : 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-900 dark:text-emerald-200'}`}
    >
      {type === 'error' ? (
        <AlertCircle className="w-6 h-6 shrink-0 text-red-600 dark:text-red-300" />
      ) : (
        <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600 dark:text-emerald-300" />
      )}
      <p className="flex-1 text-sm font-semibold">{message}</p>
      <button 
        onClick={onClose}
        className={`p-1 rounded-lg transition-colors ${type === 'error' ? 'hover:bg-red-100 dark:hover:bg-red-900/60' : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/60'}`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
