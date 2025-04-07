import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { 
  Droplets,
  ThermometerSun,
  Edit,
  Star,
  Shell,
  Package,
  Scale,
  Skull,
  Tag
} from 'lucide-react';
import { TrempeTableDetail } from './TrempeTableDetail';

interface CellData {
  id: string;
  filled: number;
  waterDate?: string;
  batchNumber?: string;
  oysterSize?: string;
  exondationCount?: number;
  perchCount?: number; // nombre de perches (max 10 pochons par perche)
}

export interface TrempeTable {
  id: string;
  name: string;
  cells: CellData[];
  oysterType: string;
  startDate: string;
  lastUpdate: string;
}

interface TrempeTablesProps {
  onTableSelect: (table: TrempeTable) => void;
  onTableHover?: (table: TrempeTable | null) => void;
  hoveredTable?: TrempeTable | null;
  selectedTable?: TrempeTable | null;
  onTableUpdate: (table: TrempeTable) => void;
}

const initialTrempeTables: TrempeTable[] = [
  {
    id: '1',
    name: 'Trempe 1',
    cells: Array(20).fill(null).map((_, i) => ({ 
      id: `${i}`, 
      filled: i < 6 ? 0 : i === 6 ? 0.30 : 1,
      waterDate: '2024-03-01',
      batchNumber: '2503-042',
      oysterSize: 'N°3',
      exondationCount: 2,
      perchCount: 5
    })),
    oysterType: 'Huîtres N°3',
    startDate: new Date().toLocaleDateString(),
    lastUpdate: 'Nouveau'
  },
  {
    id: '2',
    name: 'Trempe 2',
    cells: Array(10).fill(null).map((_, i) => ({ 
      id: `${i}`, 
      filled: i < 2 ? 0 : 1,
      waterDate: '2024-02-15',
      batchNumber: '2503-078',
      oysterSize: 'N°2',
      exondationCount: 1,
      perchCount: 3
    })),
    oysterType: 'Huîtres Spéciales',
    startDate: new Date().toLocaleDateString(),
    lastUpdate: 'Nouveau'
  }
];

const TableCellsDisplay = ({ table, onCellClick }: { table: TrempeTable; onCellClick?: (index: number) => void }) => {
  const rows = table.cells.length === 20 ? 2 : 1;
  const cols = table.cells.length === 20 ? 10 : 10;
  
  return (
    <div className="space-y-1">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid grid-cols-10 gap-1 w-full bg-cyan-950/50">
          {Array.from({ length: cols }, (_, i) => {
            const cellIndex = row * 10 + i;
            if (cellIndex >= table.cells.length) return null;
            const cell = table.cells[cellIndex];
            return (
              <div
                key={i}
                onClick={() => onCellClick?.(cellIndex)}
                className="w-full h-7 rounded-[4px] border border-white/10 relative overflow-hidden cursor-pointer hover:border-cyan-400/30 transition-colors"
              >
                <div
                  className="absolute top-0 right-0 bottom-0 bg-cyan-500/40"
                  style={{ width: `${cell.filled * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs text-white/80 font-medium">
                  {cellIndex + 1}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const TableCard = ({ 
  table, 
  isHovered, 
  isSelected, 
  onClick, 
  onHover 
}: { 
  table: TrempeTable; 
  isHovered: boolean; 
  isSelected: boolean; 
  onClick: () => void; 
  onHover: (hover: boolean) => void;
}) => {
  const filledCells = table.cells.filter(c => c.filled > 0).length;
  const totalCells = table.cells.length;
  const fillPercentage = Math.round((filledCells / totalCells) * 100);
  const mortalityRate = 12.5;

  return (
    <motion.div
      layout
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`
        relative rounded-xl overflow-hidden transition-all duration-300
        ${isSelected 
          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/50' 
          : isHovered 
            ? 'bg-white/5 border-cyan-400/30' 
            : 'bg-white/5 border-white/10'
        }
        border backdrop-blur-sm p-6 space-y-6
        hover:shadow-[0_8px_16px_rgba(0,0,0,0.4),0_0_20px_rgba(0,210,200,0.3)]
        cursor-pointer
      `}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{table.name}</h3>
          <div className="flex items-center gap-2">
            <Shell size={18} className="text-cyan-400" />
            <span className="text-white/70">Huîtres N°3</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Package size={20} />
              <span className="font-semibold">Pochons</span>
            </div>
            <div className="text-2xl font-bold text-white">76 / 100</div>
            <div className="text-sm text-white/60">10 Kg par pochon • 760 Kg</div>
          </div>

          <div className="bg-black/20 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Scale size={20} />
              <span className="font-semibold">Remplissage</span>
            </div>
            <div className="text-2xl font-bold text-white">{fillPercentage}%</div>
            <div className="text-sm text-white/60">13,3 carrés pleins</div>
          </div>

          <div className="bg-black/20 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Skull size={20} />
              <span className="font-semibold">Mortalité</span>
            </div>
            <div className="text-2xl font-bold text-white">{mortalityRate}%</div>
            <div className="text-sm text-white/60">Taux moyen</div>
          </div>

          <div className="bg-black/20 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Tag size={20} />
              <span className="font-semibold">Lots</span>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span>2503-042</span>
                <span className="text-xs text-white/60">12 pochons</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>2503-078</span>
                <span className="text-xs text-white/60">28 pochons</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>2503-156</span>
                <span className="text-xs text-white/60">36 pochons</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-1">
            <Star size={16} />
            <span>Lot: {table.cells[0].batchNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThermometerSun size={16} />
            <span>Taille: {table.cells[0].oysterSize}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThermometerSun size={16} />
            <span>Exondations: {table.cells[0].exondationCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThermometerSun size={16} />
            <span>Perches: {table.cells[0].perchCount}</span>
          </div>
        </div>
      </div>

      <TableCellsDisplay table={table} />
    </motion.div>
  );
};

export const TrempeTables: React.FC<TrempeTablesProps> = ({
  onTableSelect,
  onTableHover,
  hoveredTable,
  selectedTable,
  onTableUpdate
}) => {
  const [tables, setTables] = useState<TrempeTable[]>(initialTrempeTables);
  const [selectedTableForModal, setSelectedTableForModal] = useState<TrempeTable | null>(null);

  const handleCellClick = (tableId: string, cellIndex: number) => {
    const tableToUpdate = tables.find(t => t.id === tableId);
    if (!tableToUpdate) return;

    const updatedTable = {
      ...tableToUpdate,
      cells: tableToUpdate.cells.map((cell, i) => 
        i === cellIndex ? { ...cell, filled: cell.filled > 0 ? 0 : 1 } : cell
      ),
      lastUpdate: new Date().toLocaleDateString()
    };

    const newTables = tables.map(t => t.id === tableId ? updatedTable : t);
    setTables(newTables);
    onTableUpdate(updatedTable);
  };

  const handleTableUpdate = (updatedTable: TrempeTable) => {
    const newTables = tables.map(t => t.id === updatedTable.id ? updatedTable : t);
    setTables(newTables);
    onTableUpdate(updatedTable);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6">
        {tables.map(table => (
          <TableCard
            key={table.id}
            table={table}
            isHovered={hoveredTable?.id === table.id}
            isSelected={selectedTable?.id === table.id}
            onClick={() => {
              onTableSelect(table);
              setSelectedTableForModal(table);
            }}
            onHover={(hover) => {
              if (hover) {
                onTableHover?.(table);
              } else {
                onTableHover?.(null);
              }
            }}
          />
        ))}
      </div>

      {selectedTableForModal && (
        <TrempeTableDetail
          table={selectedTableForModal}
          onClose={() => setSelectedTableForModal(null)}
          onTableUpdate={handleTableUpdate}
        />
      )}
    </div>
  );
};
