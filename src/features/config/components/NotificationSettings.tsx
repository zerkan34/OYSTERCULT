import React, { useState } from 'react';
import { Bell, Settings, AlertTriangle, Check, Info, Smartphone, Mail, Monitor, Bookmark, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Types de notifications
interface NotificationType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

// Canaux de notification
interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export function NotificationSettings() {
  // État pour les types de notifications
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: 'stocks',
      name: 'Stocks',
      description: 'Alertes concernant les niveaux de stock (bas, périmés)',
      icon: <AlertTriangle size={20} className="text-amber-500" />,
      enabled: true
    },
    {
      id: 'quality',
      name: 'Qualité',
      description: 'Notifications concernant la qualité des produits et l\'eau',
      icon: <Check size={20} className="text-emerald-500" />,
      enabled: true
    },
    {
      id: 'system',
      name: 'Système',
      description: 'Mises à jour système et changements de configuration',
      icon: <Settings size={20} className="text-blue-500" />,
      enabled: true
    },
    {
      id: 'deadlines',
      name: 'Échéances',
      description: 'Rappels des tâches et échéances à venir',
      icon: <Clock size={20} className="text-indigo-500" />,
      enabled: true
    },
    {
      id: 'info',
      name: 'Informations',
      description: 'Informations générales sur l\'entreprise et l\'activité',
      icon: <Info size={20} className="text-cyan-500" />,
      enabled: false
    }
  ]);
  
  // État pour les canaux de notification
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([
    {
      id: 'app',
      name: 'Application',
      description: 'Notifications dans l\'application',
      icon: <Monitor size={20} className="text-purple-500" />,
      enabled: true
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Notifications par email',
      icon: <Mail size={20} className="text-blue-500" />,
      enabled: true
    },
    {
      id: 'mobile',
      name: 'Mobile',
      description: 'Notifications push sur mobile',
      icon: <Smartphone size={20} className="text-emerald-500" />,
      enabled: false
    }
  ]);
  
  // Fréquences de notification
  const [frequency, setFrequency] = useState<'immediate' | 'hourly' | 'daily' | 'weekly'>('immediate');
  
  // Fonction pour changer l'état d'un type de notification
  const toggleNotificationType = (id: string) => {
    setNotificationTypes(prev => 
      prev.map(type => 
        type.id === id ? { ...type, enabled: !type.enabled } : type
      )
    );
  };
  
  // Fonction pour changer l'état d'un canal de notification
  const toggleNotificationChannel = (id: string) => {
    setNotificationChannels(prev => 
      prev.map(channel => 
        channel.id === id ? { ...channel, enabled: !channel.enabled } : channel
      )
    );
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect p-6 rounded-lg"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Bell size={20} className="text-brand-tertiary" />
          <h2 className="text-xl font-bold text-white">Paramètres des notifications</h2>
        </div>
        
        {/* Section des types de notifications */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Types de notifications</h3>
          <div className="space-y-4">
            {notificationTypes.map(type => (
              <div 
                key={type.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    {type.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{type.name}</h4>
                    <p className="text-sm text-white/70">{type.description}</p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={type.enabled}
                    onChange={() => toggleNotificationType(type.id)}
                    aria-label={`Activer les notifications ${type.name}`}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-tertiary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Section des canaux de notification */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Canaux de notification</h3>
          <div className="space-y-4">
            {notificationChannels.map(channel => (
              <div 
                key={channel.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    {channel.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{channel.name}</h4>
                    <p className="text-sm text-white/70">{channel.description}</p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={channel.enabled}
                    onChange={() => toggleNotificationChannel(channel.id)}
                    aria-label={`Activer les notifications par ${channel.name}`}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-tertiary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Section de la fréquence des notifications */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Fréquence des notifications</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { id: 'immediate', label: 'Immédiat' },
              { id: 'hourly', label: 'Toutes les heures' },
              { id: 'daily', label: 'Quotidien' },
              { id: 'weekly', label: 'Hebdomadaire' }
            ].map(option => (
              <button
                key={option.id}
                className={`p-3 text-center rounded-lg transition-all ${
                  frequency === option.id 
                    ? 'bg-brand-tertiary text-white' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setFrequency(option.id as any)}
                aria-pressed={frequency === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Section des boutons d'action */}
      <div className="flex justify-end space-x-4">
        <button 
          className="px-6 py-2 border border-white/10 rounded-lg text-white/70 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Réinitialiser les paramètres de notification"
        >
          Réinitialiser
        </button>
        <button 
          className="px-6 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          aria-label="Enregistrer les paramètres de notification"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
