import React from 'react';
import { Tag, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockTasksByStatus = [
  { name: 'En attente', value: 8 },
  { name: 'En cours', value: 12 },
  { name: 'Terminé', value: 5 }
];

const mockTasksByPriority = [
  { name: 'Haute', value: 6 },
  { name: 'Moyenne', value: 15 },
  { name: 'Basse', value: 4 }
];

const mockTasksOverTime = [
  { name: 'Lun', completed: 2, created: 5 },
  { name: 'Mar', completed: 4, created: 3 },
  { name: 'Mer', completed: 3, created: 6 },
  { name: 'Jeu', completed: 5, created: 4 },
  { name: 'Ven', completed: 2, created: 3 }
];

const COLORS = ['#8B0000', '#4A2B4D', '#6B3B5D'];

export function TaskStats() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-effect p-4">
          <h3 className="text-lg font-medium text-white mb-2">Tâches par statut</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockTasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockTasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-effect p-4">
          <h3 className="text-lg font-medium text-white mb-2">Tâches par priorité</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockTasksByPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockTasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-effect p-4">
          <h3 className="text-lg font-medium text-white mb-2">Évolution des tâches</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTasksOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="created" name="Créées" fill="#8B0000" />
                <Bar dataKey="completed" name="Terminées" fill="#4A2B4D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-effect p-6">
        <h3 className="text-lg font-medium text-white mb-4">Statistiques globales</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold text-white">25</div>
            <div className="text-sm text-white/60 mt-1">Tâches totales</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">12</div>
            <div className="text-sm text-white/60 mt-1">En cours</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">85%</div>
            <div className="text-sm text-white/60 mt-1">Taux de complétion</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">2.5j</div>
            <div className="text-sm text-white/60 mt-1">Temps moyen</div>
          </div>
        </div>
      </div>
    </div>
  );
}