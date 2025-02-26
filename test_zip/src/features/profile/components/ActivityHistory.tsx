import React from 'react';
import { Clock, LogIn, Settings, FileText, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'login' | 'settings' | 'document' | 'notification';
  action: string;
  timestamp: string;
  details?: string;
  location?: string;
  device?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'login',
    action: 'Connexion',
    timestamp: '2025-02-19T10:30:00',
    location: 'La Rochelle, France',
    device: 'Chrome - Windows'
  },
  {
    id: '2',
    type: 'settings',
    action: 'Modification du profil',
    timestamp: '2025-02-19T09:15:00',
    details: 'Mise à jour des informations personnelles'
  },
  {
    id: '3',
    type: 'document',
    action: 'Téléchargement rapport',
    timestamp: '2025-02-19T08:45:00',
    details: 'Rapport de production - Janvier 2025'
  },
  {
    id: '4',
    type: 'notification',
    action: 'Paramètres de notification',
    timestamp: '2025-02-19T08:30:00',
    details: 'Activation des notifications mobiles'
  }
];

const typeIcons = {
  login: LogIn,
  settings: Settings,
  document: FileText,
  notification: Bell
};

export function ActivityHistory() {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Historique d'activité</h3>
        </div>

        <div className="divide-y divide-white/10">
          {mockActivities.map((activity) => {
            const Icon = typeIcons[activity.type];

            return (
              <div key={activity.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-burgundy/20 flex items-center justify-center">
                    <Icon size={20} className="text-brand-burgundy" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-white">{activity.action}</h4>
                    </div>
                    
                    {activity.details && (
                      <p className="text-white/70 mt-1">{activity.details}</p>
                    )}
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-white/60">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {format(new Date(activity.timestamp), 'PPp', { locale: fr })}
                      </div>
                      {activity.location && (
                        <>
                          <div>•</div>
                          <div>{activity.location}</div>
                        </>
                      )}
                      {activity.device && (
                        <>
                          <div>•</div>
                          <div>{activity.device}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}