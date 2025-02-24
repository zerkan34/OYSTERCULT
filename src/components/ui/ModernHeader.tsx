import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Phone, Mail } from 'lucide-react';
import { EmergencyCall } from '@/features/network/components/EmergencyCall';
import { OysterLogo } from './OysterLogo';
import { ThemeToggle } from './ThemeToggle';
import { NotificationsPanel } from '@/components/notifications/NotificationsPanel';
import { useStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

export function ModernHeader() {
  const [showEmergencyCall, setShowEmergencyCall] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useStore();
  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate('/network');
    // Activer automatiquement l'onglet messages
    const messagesTab = document.querySelector('[data-tab="messages"]');
    if (messagesTab) {
      (messagesTab as HTMLElement).click();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border-b border-[rgb(var(--color-border)_/_var(--color-border-opacity))] z-50">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="flex-1" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <OysterLogo size={40} withText />
          </div>

          <div className="flex-1 flex items-center justify-end space-x-3">
            <motion.button
              onClick={() => setShowEmergencyCall(true)}
              className="relative p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={20} className="text-[rgb(var(--color-brand-surface))]" />
            </motion.button>
            <motion.button
              onClick={handleMessageClick}
              className="relative p-2 hover:bg-[rgb(var(--color-background-hover)_/_var(--color-background-hover-opacity))] rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={24} className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-brand-burgundy rounded-full flex items-center justify-center px-1 text-xs font-medium text-white shadow-lg">
                  {unreadCount}
                </span>
              )}
            </motion.button>
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-[rgb(var(--color-background-hover)_/_var(--color-background-hover-opacity))] rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={24} className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center px-1 text-xs font-medium text-white shadow-lg">
                  {unreadCount}
                </span>
              )}
            </motion.button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <EmergencyCall 
        isOpen={showEmergencyCall} 
        onClose={() => setShowEmergencyCall(false)} 
      />

      <AnimatePresence>
        {showNotifications && (
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>
    </>
  );
}