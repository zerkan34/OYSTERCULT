import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', ventes: 4500, objectif: 5000 },
  { month: 'Fév', ventes: 5200, objectif: 5000 },
  { month: 'Mar', ventes: 4800, objectif: 5000 },
  { month: 'Avr', ventes: 5100, objectif: 5000 },
  { month: 'Mai', ventes: 5800, objectif: 5000 },
  { month: 'Juin', ventes: 5300, objectif: 5000 }
];

export function SalesChart() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-white">Évolution des ventes</h2>
        <select className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
          <option value="6">6 derniers mois</option>
          <option value="12">12 derniers mois</option>
          <option value="24">24 derniers mois</option>
        </select>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" stroke="#ffffff60" />
            <YAxis stroke="#ffffff60" />
            <Tooltip
              contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="ventes" name="Ventes" fill="#8B0000" />
            <Bar dataKey="objectif" name="Objectif" fill="#4A2B4D" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/60">Ventes totales</div>
          <div className="text-xl font-bold text-white mt-1">30,700€</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/60">Moyenne mensuelle</div>
          <div className="text-xl font-bold text-white mt-1">5,116€</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/60">Croissance</div>
          <div className="text-xl font-bold text-green-300 mt-1">+8.3%</div>
        </div>
      </div>
    </div>
  );
}