import React from 'react';
import { User, Clock } from 'lucide-react';

interface EmployeeActivityProps {
  onEmployeeClick: (employee: any) => void;
}

const mockActivities = [
  {
    id: '1',
    userId: 'user1',
    user: 'Jean Dupont',
    action: 'a terminé l\'inspection',
    time: 'Il y a 5 min'
  },
  {
    id: '2',
    userId: 'user2',
    user: 'Marie Martin',
    action: 'a commencé la maintenance',
    time: 'Il y a 15 min'
  },
  {
    id: '3',
    userId: 'user3',
    user: 'Pierre Dubois',
    action: 'a validé la commande #1234',
    time: 'Il y a 30 min'
  }
];

export function EmployeeActivity({ onEmployeeClick }: EmployeeActivityProps) {
  return (
    <div>
      <h2 className="text-lg font-medium text-white mb-4">Activité récente</h2>

      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div 
            key={activity.id}
            onClick={() => onEmployeeClick({ id: activity.userId, name: activity.user })}
            className="flex items-start space-x-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 bg-brand-burgundy rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {activity.user.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-white">
                <span className="font-medium">{activity.user}</span>{' '}
                {activity.action}
              </div>
              <div className="flex items-center text-sm text-white/60">
                <Clock size={14} className="mr-1" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}