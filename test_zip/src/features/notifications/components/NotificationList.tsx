import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Bell, 
  Package, 
  Users, 
  FileText,
  MoreVertical,
  Trash2,
  MailOpen,
  Star,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  important: boolean;
  category: 'system' | 'task' | 'inventory' | 'quality' | 'hr';
  link?: string;
  metadata?: {
    taskId?: string;
    batchId?: string;
    employeeId?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Alerte stock critique',
    message: 'Le stock d\'huîtres plates N°3 est en dessous du seuil minimum',
    timestamp: '2025-02-19T10:30:00',
    read: false,
    important: true,
    category: 'inventory',
    link: '/inventory'
  },
  {
    id: '2',
    type: 'success',
    title: 'Tâche terminée',
    message: 'Marie Martin a terminé l\'inspection des tables',
    timestamp: '2025-02-19T09:15:00',
    read: false,
    important: false,
    category: 'task',
    link: '/tasks'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Contrôle qualité requis',
    message: 'Le lot LOT-2025-001 nécessite un contrôle qualité',
    timestamp: '2025-02-19T08:45:00',
    read: true,
    important: true,
    category: 'quality',
    link: '/quality'
  },
  {
    id: '4',
    type: 'info',
    title: 'Nouveau congé',
    message: 'Jean Dupont a déposé une demande de congés',
    timestamp: '2025-02-19T08:30:00',
    read: true,
    important: false,
    category: 'hr',
    link: '/hr'
  }
];

const typeIcons = {
  alert: AlertTriangle,
  success: CheckCircle2,
  info: Bell,
  warning: Clock
};

const categoryIcons = {
  system: Bell,
  task: Calendar,
  inventory: Package,
  quality: FileText,
  hr: Users
};

const typeColors = {
  alert: 'bg-red-500/20 text-red-300',
  success: 'bg-green-500/20 text-green-300',
  info: 'bg-blue-500/20 text-blue-300',
  warning: 'bg-yellow-500/20 text-yellow-300'
};

interface NotificationListProps {
  searchQuery: string;
  filter: 'all' | 'unread' | 'important';
}

export function NotificationList({ searchQuery, filter }: NotificationListProps) {
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      (filter === 'important' && notification.important);

    return matchesSearch && matchesFilter;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const toggleImportant = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, important: !n.important } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-4">
      {filteredNotifications.map((notification) => {
        const TypeIcon = typeIcons[notification.type];
        const CategoryIcon = categoryIcons[notification.category];

        return (
          <div
            key={notification.id}
            className={`bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors ${
              !notification.read ? 'bg-white/10' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg ${typeColors[notification.type].split(' ')[0]} flex items-center justify-center`}>
                    <TypeIcon size={20} className={typeColors[notification.type].split(' ')[1]} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-white">{notification.title}</h3>
                      {notification.important && (
                        <span className="px-2 py-1 bg-brand-burgundy/20 text-brand-burgundy rounded-full text-xs">
                          Important
                        </span>
                      )}
                      {!notification.read && (
                        <span className="w-2 h-2 bg-brand-burgundy rounded-full" />
                      )}
                    </div>
                    
                    <p className="text-white/70 mt-1">{notification.message}</p>
                    
                    <div className="mt-4 flex items-center space-x-4 text-sm text-white/60">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {format(new Date(notification.timestamp), 'PPp', { locale: fr })}
                      </div>
                      <div>•</div>
                      <div className="flex items-center">
                        <CategoryIcon size={16} className="mr-1" />
                        {notification.category}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setSelectedNotification(selectedNotification === notification.id ? null : notification.id)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <MoreVertical size={20} className="text-white/60" />
                  </button>
                  
                  {selectedNotification === notification.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg py-1 z-10">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center"
                        >
                          <MailOpen size={16} className="mr-2" />
                          Marquer comme lu
                        </button>
                      )}
                      <button
                        onClick={() => toggleImportant(notification.id)}
                        className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center"
                      >
                        <Star size={16} className="mr-2" />
                        {notification.important ? 'Retirer important' : 'Marquer important'}
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5 flex items-center"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}