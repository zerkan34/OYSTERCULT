import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function FloatingNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{notification.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== notification.id)
                  );
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}