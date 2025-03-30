import React, { useState, useEffect, useMemo } from 'react';
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
  const { notifications, markAsRead, markAllAsRead, addNotification } = useStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  const unreadCount = useMemo(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);

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

  const handleToggleImportant = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // On met à jour l'importance de la notification
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      // Ici on devrait normalement avoir une fonction dans le store pour modifier l'importance
      // Mais comme elle n'existe pas, on crée une simulation pour la démonstration
      // Dans un cas réel, cela devrait être ajouté au store
      addNotification({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        important: !notification.important,
        category: notification.category,
        metadata: notification.metadata
      });
      // On marque l'ancienne comme lue pour simuler le remplacement
      markAsRead(id);
    }
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // On simule la suppression en marquant simplement comme lue
    // Dans un cas réel, on aurait une fonction deleteNotification dans le store
    markAsRead(id);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" 
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        className="notifications-panel fixed inset-y-0 right-0 w-full max-w-md backdrop-blur-md shadow-2xl z-[51] margin-top-65"
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
                    <Search size={20} className="absolute left-3 transform -translate-y-1/2 text-white/40" style={{top: '26%'}} aria-label="Search icon" />
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
                    className={`p-4 transition-colors relative cursor-pointer hover:bg-white/10 ${
                      notification.read 
                        ? 'bg-transparent' 
                        : 'bg-white/5 shadow-[0_0_15px_rgba(0,210,255,0.2),0_0_8px_rgba(0,0,0,0.2)_inset] border border-cyan-400/40 hover:border-cyan-400/60 rounded-xl'
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Notification: ${notification.title}. ${notification.read ? "Lu" : "Non lu"}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleMarkAsRead(notification.id);
                      }
                    }}
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

                      {/* Bouton d'action directement dans la notification */}
                      <div className="flex space-x-1">
                        {!notification.read ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="p-2 bg-brand-burgundy/20 text-white/80 hover:text-white transition-colors rounded-full hover:bg-brand-burgundy/40"
                            aria-label="Marquer comme lu"
                            title="Marquer comme lu"
                          >
                            <MailOpen size={16} />
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-transparent text-white/40 hover:text-white/60 transition-colors rounded-full hover:bg-white/5"
                            aria-label="Déjà lu"
                            title="Déjà lu"
                          >
                            <MailOpen size={16} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded-full ${notification.important 
                            ? 'bg-brand-burgundy/20 text-brand-burgundy hover:bg-brand-burgundy/40' 
                            : 'bg-transparent text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                          onClick={(e) => handleToggleImportant(notification.id, e)}
                          aria-label={notification.important ? "Retirer des importants" : "Marquer comme important"}
                          title={notification.important ? "Retirer des importants" : "Marquer comme important"}
                        >
                          <Star size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeleteNotification(notification.id, e)}
                          className="p-2 bg-transparent text-white/40 hover:text-red-400 transition-colors rounded-full hover:bg-white/5"
                          aria-label="Supprimer"
                          title="Supprimer"
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
    </>
  );
}