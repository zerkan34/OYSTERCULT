import React from 'react';
import { History, Tag, MapPin, AlertTriangle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BatchEvent {
  id: string;
  batchNumber: string;
  type: 'movement' | 'treatment' | 'quality_check' | 'alert';
  description: string;
  date: string;
  user: string;
  details?: {
    from?: string;
    to?: string;
    treatment?: string;
    score?: number;
    issue?: string;
  };
}

const mockEvents: BatchEvent[] = [
  {
    id: '1',
    batchNumber: 'LOT-2025-001',
    type: 'movement',
    description: 'Déplacement du lot',
    date: '2025-02-19T10:00:00',
    user: 'Jean Dupont',
    details: {
      from: 'Zone Nord - Table A1',
      to: 'Zone Nord - Table A2'
    }
  },
  {
    id: '2',
    batchNumber: 'LOT-2025-001',
    type: 'treatment',
    description: 'Traitement préventif',
    date: '2025-02-18T14:30:00',
    user: 'Marie Martin',
    details: {
      treatment: 'Nettoyage des poches'
    }
  }
];

const typeIcons = {
  movement: MapPin,
  treatment: FileText,
  quality_check: Tag,
  alert: AlertTriangle
};

const typeColors = {
  movement: 'bg-blue-500/20 text-blue-300',
  treatment: 'bg-purple-500/20 text-purple-300',
  quality_check: 'bg-green-500/20 text-green-300',
  alert: 'bg-red-500/20 text-red-300'
};

interface BatchHistoryProps {
  searchQuery: string;
}

export function BatchHistory({ searchQuery }: BatchHistoryProps) {
  const filteredEvents = mockEvents.filter(event =>
    event.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Historique des événements</h3>
        </div>
        <div className="divide-y divide-white/10">
          {filteredEvents.map((event) => {
            const Icon = typeIcons[event.type];

            return (
              <div key={event.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg ${typeColors[event.type].split(' ')[0]} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={typeColors[event.type].split(' ')[1]} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-white truncate">{event.batchNumber}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${typeColors[event.type]}`}>
                        {event.type === 'movement' ? 'Déplacement' :
                         event.type === 'treatment' ? 'Traitement' :
                         event.type === 'quality_check' ? 'Contrôle qualité' : 'Alerte'}
                      </span>
                    </div>
                    
                    <p className="text-white/70 mt-1">{event.description}</p>
                    
                    {event.details && (
                      <div className="mt-2 space-y-1">
                        {event.details.from && event.details.to && (
                          <div className="text-sm text-white/60">
                            De: {event.details.from} → Vers: {event.details.to}
                          </div>
                        )}
                        {event.details.treatment && (
                          <div className="text-sm text-white/60">
                            Traitement: {event.details.treatment}
                          </div>
                        )}
                        {event.details.score && (
                          <div className="text-sm text-white/60">
                            Score qualité: {event.details.score}%
                          </div>
                        )}
                        {event.details.issue && (
                          <div className="text-sm text-red-400">
                            Problème: {event.details.issue}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center space-x-4 text-sm text-white/60">
                      <div className="flex items-center">
                        <History size={16} className="mr-1" />
                        {format(new Date(event.date), 'PPp', { locale: fr })}
                      </div>
                      <div>•</div>
                      <div>Par: {event.user}</div>
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