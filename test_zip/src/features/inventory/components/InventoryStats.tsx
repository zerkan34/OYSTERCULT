import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

const mockMovementData = [
  { name: 'Lun', entrées: 150, sorties: 120 },
  { name: 'Mar', entrées: 200, sorties: 180 },
  { name: 'Mer', entrées: 180, sorties: 160 },
  { name: 'Jeu', entrées: 220, sorties: 200 },
  { name: 'Ven', entrées: 250, sorties: 220 }
];

export function InventoryStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-brand-burgundy/20 flex items-center justify-center">
              <Package size={20} className="text-brand-burgundy" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Articles en stock</div>
              <div className="text-2xl font-bold text-white">1,234</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-300" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Taux de rotation</div>
              <div className="text-2xl font-bold text-white">4.5</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle size={20} className="text-yellow-300" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Ruptures de stock</div>
              <div className="text-2xl font-bold text-white">3</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <DollarSign size={20} className="text-blue-300" />
            </div>
            <div>
              <div className="text-white/60 text-sm">Valeur du stock</div>
              <div className="text-2xl font-bold text-white">45,678€</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-6">Mouvements de Stock</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockMovementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="entrées" name="Entrées" fill="#8B0000" />
              <Bar dataKey="sorties" name="Sorties" fill="#4A2B4D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}