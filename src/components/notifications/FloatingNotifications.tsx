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

  useEffect(() => {
    // Exemple de notifications pour la démo
    const demoNotifications = [
      {
        id: crypto.randomUUID(),
        type: 'success' as const,
        title: 'Tâche terminée',
        message: 'La maintenance du bassin A2 a été effectuée avec succès',
        duration: 5000
      },
      {
        id: crypto.randomUUID(),
        type: 'warning' as const,
        title: 'Stock faible',
        message: 'Le stock d\'huîtres plates N°3 est en dessous du seuil minimum',
        duration: 7000
      }
    ];

    let timeout = 1000;
    demoNotifications.forEach((notif) => {
      setTimeout(() => {
        setNotifications(prev => [...prev, notif]);
        setTimeout(() => removeNotification(notif.id), notif.duration || NOTIFICATION_LIFETIME);
      }, timeout);
      timeout += 2000;
    });
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              x: 100,
              transition: { duration: 0.2 } 
            }}
            layout
            className={`
              glass-effect shadow-glass hover:shadow-glass-hover
              flex items-start p-4 rounded-lg transition-all duration-200 relative group
              ${notification.type === 'success' ? 'hover:bg-green-500/5 border-green-500/20' :
                notification.type === 'warning' ? 'hover:bg-yellow-500/5 border-yellow-500/20' :
                'hover:bg-blue-500/5 border-blue-500/20'}
            `}
          >
            <motion.button
              className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/10"
              onClick={() => removeNotification(notification.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={14} className="text-white/60" />
            </motion.button>

            <motion.div 
              className="flex-shrink-0 mr-3"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : notification.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              ) : (
                <Info className="w-5 h-5 text-blue-400" />
              )}
            </motion.div>
            <div className="flex-1 mr-2">
              <motion.h3 
                className={`font-medium ${
                  notification.type === 'success' ? 'text-green-400' :
                  notification.type === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {notification.title}
              </motion.h3>
              <motion.p 
                className="text-sm text-white/80 mt-1"
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {notification.message}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}