import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Bell, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStore } from '@/lib/store';

interface TaskNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskNotifications({ isOpen, onClose }: TaskNotificationsProps) {
  const { notifications, markAsRead } = useStore();
  const taskNotifications = notifications.filter(n => n.category === 'task');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications des tâches"
      size="md"
    >
      <div className="space-y-4">
        {taskNotifications.map((notification) => (
          <div 
            key={notification.id}
            onClick={() => markAsRead(notification.id)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
              notification.type === 'warning'
                ? 'bg-yellow-500/10 hover:bg-yellow-500/20'
                : notification.type === 'success'
                ? 'bg-green-500/10 hover:bg-green-500/20'
                : 'bg-blue-500/10 hover:bg-blue-500/20'
            }`}
          >
            {notification.type === 'warning' ? (
              <AlertTriangle className="text-yellow-400" size={20} />
            ) : notification.type === 'success' ? (
              <CheckCircle2 className="text-green-400" size={20} />
            ) : (
              <Bell className="text-blue-400" size={20} />
            )}
            <div className="flex-1">
              <div className={`font-medium ${
                notification.type === 'warning'
                  ? 'text-yellow-400'
                  : notification.type === 'success'
                  ? 'text-green-400'
                  : 'text-blue-400'
              }`}>
                {notification.title}
              </div>
              <div className="text-sm text-white/60 mt-1">
                {notification.message}
              </div>
              <div className="flex items-center mt-2 text-xs text-white/40">
                <Clock size={12} className="mr-1" />
                {format(new Date(notification.timestamp), 'PPp', { locale: fr })}
              </div>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 bg-brand-burgundy rounded-full flex-shrink-0" />
            )}
          </div>
        ))}

        {taskNotifications.length === 0 && (
          <div className="text-center text-white/60 py-8">
            Aucune notification
          </div>
        )}
      </div>
    </Modal>
  );
}