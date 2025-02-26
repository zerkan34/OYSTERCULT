import React from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TaskOverviewProps {
  onTaskClick: (task: any) => void;
}

const mockTasks = [
  {
    id: '1',
    title: 'Inspection des tables',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2025-02-20'
  },
  {
    id: '2',
    title: 'Maintenance équipements',
    status: 'completed',
    priority: 'medium',
    dueDate: '2025-02-19'
  },
  {
    id: '3',
    title: 'Contrôle qualité',
    status: 'pending',
    priority: 'high',
    dueDate: '2025-02-21'
  }
];

export function TaskOverview({ onTaskClick }: TaskOverviewProps) {
  return (
    <div>
      <h2 className="text-lg font-medium text-white mb-6">Tâches en cours</h2>

      <div className="space-y-4">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {task.status === 'completed' ? (
                <CheckCircle2 className="text-green-400" size={20} />
              ) : task.priority === 'high' ? (
                <AlertTriangle className="text-red-400" size={20} />
              ) : (
                <Clock className="text-white/60" size={20} />
              )}
              <div>
                <div className="text-white">{task.title}</div>
                <div className="text-sm text-white/60">
                  Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                task.status === 'completed'
                  ? 'bg-green-500/20 text-green-300'
                  : task.status === 'in_progress'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}
            >
              {task.status === 'completed'
                ? 'Terminé'
                : task.status === 'in_progress'
                ? 'En cours'
                : 'En attente'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">8</div>
          <div className="text-sm text-white/60">En attente</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">5</div>
          <div className="text-sm text-white/60">En cours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">12</div>
          <div className="text-sm text-white/60">Terminées</div>
        </div>
      </div>
    </div>
  );
}