import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const mockData = [
  { name: 'Stock optimal', value: 65 },
  { name: 'Stock faible', value: 25 },
  { name: 'Rupture', value: 10 }
];

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

export function StockStatus() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <h2 className="text-lg font-medium text-white mb-6">État des stocks</h2>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {mockData.map((entry, index) => (
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-white/60">Stock optimal</span>
          </div>
          <span className="text-white">65%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-white/60">Stock faible</span>
          </div>
          <span className="text-white">25%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-white/60">Rupture</span>
          </div>
          <span className="text-white">10%</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-red-500/10 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="text-red-400" size={20} />
          <span className="text-red-400">3 produits en rupture</span>
        </div>
      </div>
    </div>
  );
}