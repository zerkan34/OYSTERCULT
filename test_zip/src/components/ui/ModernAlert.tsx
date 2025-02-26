import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface ModernAlertProps {
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  onClose?: () => void;
}

const variants = {
  success: {
    icon: <CheckCircle2 size={24} className="text-green-400" />,
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  warning: {
    icon: <AlertTriangle size={24} className="text-yellow-400" />,
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20'
  },
  error: {
    icon: <AlertTriangle size={24} className="text-red-400" />,
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  },
  info: {
    icon: <Info size={24} className="text-blue-400" />,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  }
};

export function ModernAlert({ 
  title, 
  message, 
  type = 'info', 
  onClose 
}: ModernAlertProps) {
  return (
    <AnimatePresence>
      <motion.div
        className={`${variants[type].bg} ${variants[type].border} border rounded-2xl p-4`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {variants[type].icon}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-[rgb(var(--color-text))] font-medium">{title}</h3>
            <div className="mt-1 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] text-sm">
              {message}
            </div>
          </div>
          {onClose && (
            <div className="ml-4 flex-shrink-0">
              <motion.button
                onClick={onClose}
                className="p-1 hover:bg-[rgb(var(--color-background-hover)_/_var(--color-background-hover-opacity))] rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} className="text-[rgb(var(--color-text-tertiary)_/_var(--color-text-opacity-tertiary))]" />
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}