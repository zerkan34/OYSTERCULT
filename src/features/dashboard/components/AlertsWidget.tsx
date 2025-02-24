import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AlertsWidgetProps {
  onAlertClick: (alert: any) => void;
}

const mockAlerts = [
  {
    id: '1',
    type: 'warning',
    message: 'Stock faible : Huîtres plates N°3',
    time: '10:30',
    link: '/inventory'
  },
  {
    id: '2',
    type: 'success',
    message: 'Livraison terminée : Commande #1234',
    time: '09:15',
    link: '/tasks'
  },
  {
    id: '3',
    type: 'info',
    message: 'Maintenance prévue demain',
    time: '08:45',
    link: '/tasks'
  }
];

export function AlertsWidget({ onAlertClick }: AlertsWidgetProps) {
  return (
    <div>
      <h2 className="text-lg font-medium text-white mb-4">Alertes</h2>

      <div className="space-y-4">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onAlertClick(alert)}
            className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors ${
              alert.type === 'warning'
                ? 'bg-yellow-500/10'
                : alert.type === 'success'
                ? 'bg-green-500/10'
                : 'bg-blue-500/10'
            }`}
          >
            {alert.type === 'warning' ? (
              <AlertTriangle className="text-yellow-400" size={20} />
            ) : alert.type === 'success' ? (
              <CheckCircle2 className="text-green-400" size={20} />
            ) : (
              <AlertCircle className="text-blue-400" size={20} />
            )}
            <div className="flex-1">
              <div
                className={
                  alert.type === 'warning'
                    ? 'text-yellow-400'
                    : alert.type === 'success'
                    ? 'text-green-400'
                    : 'text-blue-400'
                }
              >
                {alert.message}
              </div>
              <div className="text-sm text-white/60">{alert.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}