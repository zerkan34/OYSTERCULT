import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useStore } from '@/lib/store';

interface NotificationToast {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

const NOTIFICATION_LIFETIME = 5000; // 5 secondes par défaut

export function FloatingNotifications() {
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const store = useStore();

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="flex items-start space-x-4 bg-white/10 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-white/20 max-w-sm"
          >
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              )}
              {notification.type === 'warning' && (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              )}
              {notification.type === 'info' && (
                <Info className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-white/70">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}