import React from 'react';
import { Tag, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockGrowthData = [
  { month: 'Jan', croissance: 85, objectif: 80 },
  { month: 'Fév', croissance: 82, objectif: 80 },
  { month: 'Mar', croissance: 88, objectif: 80 },
  { month: 'Avr', croissance: 85, objectif: 80 },
  { month: 'Mai', croissance: 90, objectif: 80 },
  { month: 'Juin', croissance: 87, objectif: 80 }
];

const mockQualityDistribution = [
  { name: 'Excellent', value: 45 },
  { name: 'Bon', value: 35 },
  { name: 'Moyen', value: 15 },
  { name: 'Critique', value: 5 }
];

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444'];

export function BatchStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-brand-burgundy/20 flex items-center justify-center">
              <Tag size={20} className="text-brand-burgundy" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Lots actifs</div>
              <div className="text-2xl font-bold text-white">24</div>
              <div className="text-sm text-white/60">156,000 unités</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-300" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Taux de croissance</div>
              <div className="text-2xl font-bold text-white">87%</div>
              <div className="text-sm text-green-300">+5% vs moyenne</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle size={20} className="text-yellow-300" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Lots en alerte</div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-white/60">12.5% du total</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-blue-300" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Score qualité moyen</div>
              <div className="text-2xl font-bold text-white">92%</div>
              <div className="text-sm text-blue-300">Excellent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-6">Taux de croissance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="croissance" name="Croissance" fill="#8B0000" />
                <Bar dataKey="objectif" name="Objectif" fill="#4A2B4D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-6">Distribution qualité</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockQualityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockQualityDistribution.map((entry, index) => (
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
            {mockQualityDistribution.map((quality, index) => (
              <div key={quality.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-white/70">{quality.name}</span>
                </div>
                <span className="text-white">{quality.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}