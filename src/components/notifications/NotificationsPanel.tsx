import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  MoreVertical,
  Trash2,
  MailOpen,
  Star,
  Calendar,
  Clock,
  Search
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationsPanelProps {
  onClose: () => void;
}

const filterOptions = [
  { label: 'Toutes', value: 'all' },
  { label: 'Non lues', value: 'unread' },
  { label: 'Importantes', value: 'important' }
];

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.querySelector('.notifications-panel');
      const notificationBell = document.querySelector('[data-notification-bell="true"]');
      
      // Si le clic est sur la cloche, on ne fait rien car toggleNotifications s'en chargera
      if (notificationBell && notificationBell.contains(event.target as Node)) {
        return;
      }
      
      // Si le clic est en dehors du panel, fermer le panel
      if (panel && !panel.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  return (
    <motion.div
      className="notifications-panel fixed inset-y-0 right-0 w-full max-w-md backdrop-blur-md shadow-2xl z-[9999] margin-top-65"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ 
        background: "linear-gradient(135deg, rgba(5, 20, 43, 0.92) 0%, rgba(10, 120, 115, 0.88) 100%)",
        WebkitBackdropFilter: "blur(20px)",
        backdropFilter: "blur(20px)",
        boxShadow: "rgba(0, 0, 0, 0.45) -10px 0px 30px -5px, rgba(0, 0, 0, 0.3) -5px 5px 20px -5px, rgba(255, 255, 255, 0.15) 0px -1px 5px 0px inset, rgba(0, 210, 200, 0.25) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset"
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <motion.div 
          className="p-6 border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Info size={24} className="text-brand-burgundy" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-burgundy rounded-full flex items-center justify-center text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">Notifications</h2>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <Search size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative mt-4">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher dans les notifications..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-brand-burgundy/50 focus:ring-1 focus:ring-brand-burgundy/50 transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-2">
              {filterOptions.map((filter) => (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedFilter === filter.value
                      ? 'bg-brand-burgundy text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="text-sm text-brand-burgundy hover:text-brand-burgundy/80 transition-colors"
            >
              Tout marquer comme lu
            </motion.button>
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {notifications
              .filter(notification => {
                if (selectedFilter === 'unread') return !notification.read;
                if (selectedFilter === 'important') return notification.important;
                return true;
              })
              .filter(notification =>
                searchQuery
                  ? notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
                  : true
              )
              .map((notification, index) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 transition-colors relative group ${
                    notification.read ? 'bg-transparent' : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        notification.type === 'alert' ? 'bg-red-500/20' :
                        notification.type === 'success' ? 'bg-green-500/20' :
                        notification.type === 'warning' ? 'bg-yellow-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {notification.type === 'alert' ? (
                          <AlertTriangle className="text-red-400" size={20} />
                        ) : notification.type === 'success' ? (
                          <CheckCircle2 className="text-green-400" size={20} />
                        ) : notification.type === 'warning' ? (
                          <AlertTriangle className="text-yellow-400" size={20} />
                        ) : (
                          <Info className="text-blue-400" size={20} />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-medium ${
                              notification.type === 'alert' ? 'text-red-400' :
                              notification.type === 'success' ? 'text-green-400' :
                              notification.type === 'warning' ? 'text-yellow-400' :
                              'text-blue-400'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-white/70 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-brand-burgundy rounded-full" />
                          )}
                        </div>

                        <div className="flex items-center space-x-4 mt-2 text-sm text-white/40">
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {format(new Date(notification.timestamp), 'PPp', { locale: fr })}
                          </div>
                          {notification.important && (
                            <>
                              <div>•</div>
                              <div className="text-brand-burgundy">Important</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions on hover */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                          <MailOpen size={16} />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                      >
                        <Star size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-white/5"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}