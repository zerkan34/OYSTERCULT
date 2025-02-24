import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, AlertTriangle } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
}

const mockStockItems: StockItem[] = [
  {
    id: '1',
    name: 'Huîtres Plates',
    currentStock: 850,
    minimumStock: 200,
    maximumStock: 1000,
    unit: 'douzaines'
  },
  {
    id: '2',
    name: 'Huîtres Creuses',
    currentStock: 150,
    minimumStock: 300,
    maximumStock: 1500,
    unit: 'douzaines'
  },
  {
    id: '3',
    name: 'Bourriches',
    currentStock: 400,
    minimumStock: 100,
    maximumStock: 500,
    unit: 'unités'
  }
];

const COLORS = ['#8B0000', '#4A2B4D', '#6B3B5D'];

export function StockLevels() {
  const getStockLevel = (item: StockItem) => {
    const percentage = (item.currentStock / item.maximumStock) * 100;
    return {
      name: item.name,
      value: percentage,
      color: percentage < 30 ? '#ef4444' : percentage < 70 ? '#eab308' : '#22c55e'
    };
  };

  const stockLevels = mockStockItems.map(getStockLevel);

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-6">Niveaux de Stock</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stockLevels}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {stockLevels.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: '0.5rem' }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 space-y-4">
        {mockStockItems.map((item) => {
          const percentage = (item.currentStock / item.maximumStock) * 100;
          const isLow = item.currentStock < item.minimumStock;

          return (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${
                  isLow ? 'bg-red-500/20' : 'bg-white/5'
                } flex items-center justify-center`}>
                  {isLow ? (
                    <AlertTriangle size={20} className="text-red-300" />
                  ) : (
                    <Package size={20} className="text-white/60" />
                  )}
                </div>
                <div>
                  <div className="text-white font-medium">{item.name}</div>
                  <div className="text-sm text-white/60">
                    {item.currentStock} / {item.maximumStock} {item.unit}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                percentage < 30
                  ? 'bg-red-500/20 text-red-300'
                  : percentage < 70
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}