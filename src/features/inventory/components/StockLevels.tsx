import React from 'react';
import '../pages/StockPage.css';
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
      id: item.id,
      product: { name: item.name },
      currentLevel: item.currentStock,
      minLevel: item.minimumStock,
      maxLevel: item.maximumStock,
      unitType: item.unit,
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
    <div className="stock-card p-6">
      <div className="stock-table-container stock-scrollbar">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Niveau actuel</th>
              <th>Niveau minimum</th>
              <th>Niveau maximum</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockLevels.map((level) => (
              <tr key={level.id}>
                <td>{level.product.name}</td>
                <td>
                  <span className={`${
                    level.currentLevel < level.minLevel ? 'text-red-500' :
                    level.currentLevel > level.maxLevel ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {level.currentLevel} {level.unitType}
                  </span>
                </td>
                <td>{level.minLevel} {level.unitType}</td>
                <td>{level.maxLevel} {level.unitType}</td>
                <td>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => console.log('Modifier')}
                      className="stock-btn"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => console.log('Supprimer')}
                      className="stock-btn text-red-500 hover:text-red-400"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}