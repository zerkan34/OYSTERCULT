import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockNotificationsByType = [
  { name: 'Alertes', value: 15 },
  { name: 'Succès', value: 25 },
  { name: 'Informations', value: 40 },
  { name: 'Avertissements', value: 20 }
];

const mockNotificationsByCategory = [
  { name: 'Système', value: 10 },
  { name: 'Tâches', value: 30 },
  { name: 'Stock', value: 25 },
  { name: 'Qualité', value: 20 },
  { name: 'RH', value: 15 }
];

const mockNotificationsOverTime = [
  { date: 'Lun', count: 12 },
  { date: 'Mar', count: 15 },
  { date: 'Mer', count: 8 },
  { date: 'Jeu', count: 20 },
  { date: 'Ven', count: 14 }
];

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];

export function NotificationStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-brand-burgundy/20 flex items-center justify-center">
              <Bell size={20} className="text-brand-burgundy" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Total notifications</div>
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-sm text-white/60">Cette semaine</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-300" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Non lues</div>
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-sm text-red-300">Nécessite attention</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-300" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Traitées</div>
              <div className="text-2xl font-bold text-white">142</div>
              <div className="text-sm text-green-300">91% de résolution</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Clock size={20} className="text-yellow-300" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Temps moyen</div>
              <div className="text-2xl font-bold text-white">2.5h</div>
              <div className="text-sm text-white/60">De résolution</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-6">Notifications par type</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockNotificationsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockNotificationsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: '0.5rem' }}
                  formatter={(value: number) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-4">
            {mockNotificationsByType.map((type, index) => (
              <div key={type.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-white/70">{type.name}</span>
                </div>
                <span className="text-white">{type.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-6">Volume par jour</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockNotificationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" name="Notifications" fill="#8B0000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}