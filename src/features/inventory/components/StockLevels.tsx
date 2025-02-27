import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, AlertTriangle, Anchor, LifeBuoy } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
  type?: 'perche' | 'corde' | 'autre';
  squares?: number;
  squaresFilled?: number;
}

const mockStockItems: StockItem[] = [
  {
    id: '1',
    name: 'Huîtres Plates',
    currentStock: 850,
    minimumStock: 200,
    maximumStock: 1000,
    unit: 'douzaines',
    type: 'perche',
    squares: 4,
    squaresFilled: 3
  },
  {
    id: '2',
    name: 'Huîtres Creuses',
    currentStock: 150,
    minimumStock: 300,
    maximumStock: 1500,
    unit: 'douzaines',
    type: 'corde',
    squares: 6,
    squaresFilled: 2
  },
  {
    id: '3',
    name: 'Bourriches',
    currentStock: 400,
    minimumStock: 100,
    maximumStock: 500,
    unit: 'unités',
    type: 'autre'
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

  const getSquareColor = (filledPercentage: number) => {
    if (filledPercentage >= 100) return 'bg-green-500/70 border-green-400';
    if (filledPercentage >= 75) return 'bg-green-500/40 border-green-400/60';
    if (filledPercentage >= 50) return 'bg-yellow-500/40 border-yellow-400/60';
    if (filledPercentage >= 25) return 'bg-orange-500/40 border-orange-400/60';
    return 'bg-red-500/30 border-red-400/50';
  };

  const stockLevels = mockStockItems.map(getStockLevel);

  const renderSquares = (item: StockItem) => {
    if (!item.squares || !item.type) return null;
    
    const squaresArray = Array.from({ length: item.squares }, (_, i) => i + 1);
    const filledSquares = item.squaresFilled || 0;
    const percentage = (item.currentStock / item.maximumStock) * 100;
    
    return (
      <div className="flex space-x-1 mt-2">
        {squaresArray.map((square) => {
          // Calculate filling level for each square
          const isCompletelyFilled = square <= filledSquares;
          const isPartiallyFilled = square === Math.ceil(filledSquares) && !isCompletelyFilled;
          
          // For the partially filled square, calculate exact fill percentage
          const partialFillPercentage = isPartiallyFilled 
            ? (filledSquares % 1) * 100
            : isCompletelyFilled ? 100 : 0;
          
          return (
            <div 
              key={square} 
              className={`w-6 h-6 border rounded relative ${
                isCompletelyFilled 
                  ? getSquareColor(100)
                  : isPartiallyFilled
                  ? getSquareColor(partialFillPercentage)
                  : 'bg-white/5 border-white/20'
              }`}
            >
              {isPartiallyFilled && (
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-500/60 to-yellow-500/30"
                  style={{ height: `${partialFillPercentage}%` }}
                ></div>
              )}
              <div className="absolute inset-0 flex items-center justify-center text-xs text-white/70">
                {square}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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

      <div className="mt-6 space-y-6">
        {mockStockItems.map((item) => {
          const percentage = (item.currentStock / item.maximumStock) * 100;
          const isLow = item.currentStock < item.minimumStock;

          return (
            <div key={item.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${
                    isLow ? 'bg-red-500/20' : 'bg-white/5'
                  } flex items-center justify-center`}>
                    {isLow ? (
                      <AlertTriangle size={20} className="text-red-300" />
                    ) : item.type === 'perche' ? (
                      <Anchor size={20} className="text-white/60" />
                    ) : item.type === 'corde' ? (
                      <LifeBuoy size={20} className="text-white/60" />
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
              
              {/* Visualisation des carrés */}
              {renderSquares(item)}
              
              {/* Jauge de remplissage */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full rounded-full ${
                    percentage < 30
                      ? 'bg-red-500'
                      : percentage < 70
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}