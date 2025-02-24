import React, { useState } from 'react';
import { Calendar, Clock, Play, Square, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  task?: string;
  notes?: string;
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    date: '2025-02-19',
    startTime: '08:00',
    endTime: '12:00',
    duration: '4h',
    task: 'Production - Ligne A',
    notes: 'Maintenance préventive effectuée'
  },
  {
    id: '2',
    date: '2025-02-19',
    startTime: '13:00',
    endTime: '17:00',
    duration: '4h',
    task: 'Contrôle qualité',
    notes: 'Inspection des lots 123-456'
  }
];

export function TimeTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [entries, setEntries] = useState(mockTimeEntries);

  const startTracking = () => {
    setIsTracking(true);
    // Add new time entry
  };

  const stopTracking = () => {
    setIsTracking(false);
    // Update current time entry
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Suivi du Temps</h2>
        <div className="flex items-center space-x-4">
          {isTracking ? (
            <button
              onClick={stopTracking}
              className="flex items-center px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <Square size={20} className="mr-2" />
              Arrêter
            </button>
          ) : (
            <button
              onClick={startTracking}
              className="flex items-center px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
            >
              <Play size={20} className="mr-2" />
              Démarrer
            </button>
          )}
          <button className="flex items-center px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors">
            <Plus size={20} className="mr-2" />
            Nouvelle entrée
          </button>
        </div>
      </div>

      {isTracking && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Clock size={24} className="text-brand-burgundy" />
              <div>
                <div className="text-sm text-white/60">En cours</div>
                <div className="text-2xl font-bold text-white">04:23:15</div>
              </div>
            </div>
            <input
              type="text"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="Description de la tâche..."
              className="flex-1 mx-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-lg">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Entrées de temps</h3>
        </div>
        <div className="divide-y divide-white/10">
          {entries.map((entry) => (
            <div key={entry.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Calendar size={20} className="text-white/60" />
                  <div>
                    <div className="text-white font-medium">
                      {format(new Date(entry.date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </div>
                    <div className="text-sm text-white/60">
                      {entry.startTime} - {entry.endTime} ({entry.duration})
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white">{entry.task}</div>
                  {entry.notes && (
                    <div className="text-sm text-white/60">{entry.notes}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}