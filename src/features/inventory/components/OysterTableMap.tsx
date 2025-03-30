import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableDetail } from './TableDetail';
import { Table } from '../types';
import { 
  Droplets, 
  ThermometerSun,
  Plus,
  ShoppingCart,
  Calendar,
  Package,
  Star,
  Shell,
  Eye,
  Flame,
  Layers, 
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Download,
  Clock,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  X,
  Map as MapIcon,
  Compass,
  Minimize as MinimizeIcon,
  Check,
  Edit,
  Gauge,
  CalendarDays,
  CalendarCheck
} from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface OysterTableMapProps {
  onTableSelect: (table: Table) => void;
  onTableHover?: (table: Table | null) => void;
  hoveredTable?: Table | null;
  selectedTable?: Table | null;
  onTableUpdate: (table: Table) => void;
}

interface Table {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  cells: { id: string; filled: boolean | number }[];
  currentSize: string;
  targetSize: string;
  startDate: string;
  lastUpdate: string;
  timeProgress: number;
  sizeProgress: number;
  layers: number;
  density: string;
  alert: boolean;
  value: number;
  history: any[];
  oysterType: string;
  tableNumber: string;
  temperature?: number;
  salinity?: number;
  sampling?: {
    lastCheckDate: string;
    nextCheckDate: string;
    mortalityRate: number;
    currentSize: string;
  };
  currentBatch?: {
    size: string;
    currentSize: string;
    quantity: number;
    startDate: string;
    estimatedHarvestDate: string;
    oysterType: string;
    caliber: string;
  };
}

const initialTables: Table[] = [
  {
    id: '1',
    name: 'Table Nord #128',
    location: 'Bouzigues',
    type: 'Huîtres Triploïdes',
    status: 'en_trempe',
    cells: Array(20).fill(null).map((_, i) => ({ 
      id: `${i}`, 
      filled: i < 3 ? false : i === 3 ? 0.75 : true
    })),
    currentSize: 'N°2',
    targetSize: 'N°3',
    startDate: '15/11/2023',
    lastUpdate: 'En cours',
    timeProgress: 72,
    sizeProgress: 85,
    layers: 2,
    density: 'Normale',
    alert: false,
    value: 85,
    history: [],
    oysterType: 'Huîtres Triploïdes',
    tableNumber: '128'
  },
  {
    id: '2',
    name: 'Table B-07',
    location: 'Bouzigues',
    type: 'Huîtres Triploïdes',
    status: 'warning',
    cells: Array(20).fill(null).map((_, i) => ({ id: `${i}`, filled: true })),
    currentSize: 'N°3',
    targetSize: 'N°3',
    startDate: '10/03/2024',
    lastUpdate: '30/03/2025',
    timeProgress: 75,
    sizeProgress: 60,
    layers: 4,
    density: 'Très élevée',
    alert: true,
    value: 100,
    history: [],
    oysterType: 'Triploïdes',
    tableNumber: 'B-07'
  },
  {
    id: '3',
    name: 'Table C-04',
    location: 'Marseillan',
    type: 'Huîtres Diploïdes',
    status: 'critical',
    cells: Array(20).fill(null).map((_, i) => ({ id: `${i}`, filled: true })),
    currentSize: 'T15',
    targetSize: 'N°3',
    startDate: '11/01/2025',
    lastUpdate: '15/01/2026',
    timeProgress: 30,
    sizeProgress: 25,
    layers: 2,
    density: 'Moyenne',
    alert: false,
    value: 100,
    history: [],
    oysterType: 'Triploïdes',
    tableNumber: 'C-04'
  },
  {
    id: '4',
    name: 'Table D-15',
    location: 'Mèze',
    type: 'Vide',
    status: 'optimal',
    cells: Array(20).fill(null).map((_, i) => ({ id: `${i}`, filled: false })),
    currentSize: 'Vide',
    targetSize: 'Vide',
    startDate: 'Vide',
    lastUpdate: 'Vide',
    timeProgress: 15,
    sizeProgress: 10,
    layers: 2,
    density: 'Faible',
    alert: false,
    value: 0,
    history: [],
    oysterType: 'Triploïdes',
    tableNumber: 'D-15'
  }
];

const CALIBER_SCALE = ['T15', 'T30', 'N°5', 'N°4', 'N°3', 'N°2', 'N°1'];

const getCaliberColor = (currentCaliber: string) => {
  const currentIndex = CALIBER_SCALE.indexOf(currentCaliber);
  
  if (currentIndex === -1) return 'bg-gray-500';
  
  if (currentIndex <= CALIBER_SCALE.indexOf('N°3')) {
    return 'bg-gradient-to-r from-blue-500 to-[#22c55e]';
  } else if (currentIndex <= CALIBER_SCALE.indexOf('N°2')) {
    return 'bg-gradient-to-r from-[#22c55e] to-orange-300';
  } else if (currentCaliber === 'N°1') {
    return 'bg-red-500';  }
  
  return 'bg-gradient-to-r from-blue-500 to-cyan-400';
};

const getCaliberColorA12 = (currentCaliber: string) => {
  if (currentCaliber === 'N°2') {
    return 'bg-gradient-to-r from-blue-500 via-[#22c55e] to-orange-500';
  }
  
  return 'bg-gradient-to-r from-blue-500 to-cyan-400';
};

const getCaliberColorC04 = (currentCaliber: string) => {
  return 'bg-blue-500';
};

const getCaliberColorD15 = (currentCaliber: string) => {
  return 'bg-gray-500/20';
};

const CaliberGauge = ({ currentSize, targetSize, tableName }: { currentSize: string; targetSize: string; tableName: string }) => {
  if (currentSize === 'Vide' || targetSize === 'Vide') {
    if (tableName === 'Table D-15') {
      return (
        <div className="space-y-2">
          <div className="relative h-4 bg-white/5 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex">
              {CALIBER_SCALE.map((caliber) => (
                <div
                  key={caliber}
                  className="flex-1 border-r border-white/10 last:border-r-0"
                />
              ))}
            </div>
            <div
              className="h-full bg-gray-500/20 transition-all duration-300"
              style={{ width: '100%' }}
            />
          </div>
          <div className="flex justify-between px-1 text-sm font-medium">
            {CALIBER_SCALE.map((caliber) => (
              <span
                key={caliber}
                className="text-white/30"
              >
                {caliber}
              </span>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  const currentIndex = CALIBER_SCALE.indexOf(currentSize);
  const progress = ((currentIndex + 1) / CALIBER_SCALE.length) * 100;

  return (
    <div className="space-y-2">
      <div className="relative h-4 bg-white/5 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex">
          {CALIBER_SCALE.map((caliber) => (
            <div
              key={caliber}
              className="flex-1 border-r border-white/10 last:border-r-0"
            />
          ))}
        </div>
        <div
          className={`h-full ${
            tableName === 'Table A-12' 
              ? getCaliberColorA12(currentSize) 
              : tableName === 'Table C-04'
                ? getCaliberColorC04(currentSize)
                : getCaliberColor(currentSize)
          } transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between px-1 text-sm font-medium">
        {CALIBER_SCALE.map((caliber) => (
          <span
            key={caliber}
            className={caliber === 'N°3' ? 'text-cyan-400 border border-cyan-400/50 px-1 rounded' : 'text-white/60'}
          >
            {caliber}
          </span>
        ))}
      </div>
    </div>
  );
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.5,
    ease: [0.19, 1.0, 0.22, 1.0] // Expo ease out
  }
};

const TableCellsDisplay = ({ table, onCellClick }: { table: Table; onCellClick?: (index: number) => void }) => {
  return (
    <div className="space-y-1">
      {[0, 1].map((row) => (
        <div key={row} className="grid grid-cols-10 gap-1 w-full bg-cyan-950/50">
          {Array.from({ length: 10 }, (_, i) => {
            const cellIndex = row * 10 + i;
            const cell = table.cells[cellIndex];
            return (
              <div
                key={i}
                onClick={() => onCellClick?.(cellIndex)}
                className={`w-full h-7 rounded-[4px] border border-white/10 relative overflow-hidden cursor-pointer hover:border-cyan-400/30 transition-colors`}
              >
                <div
                  className="absolute top-0 right-0 bottom-0 bg-cyan-500/40"
                  style={{ 
                    width: typeof cell?.filled === 'number' 
                      ? `${cell.filled * 100}%` 
                      : cell?.filled 
                        ? '100%' 
                        : '0%' 
                  }}
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

const TableHeader = ({ table, onEdit }: { table: Table; onEdit: (table: Table, newName: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(table.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(table, editedName);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/20">
          <Layers size={20} className="text-cyan-400" aria-hidden="true" />
        </div>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white"
            />
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{table.name}</h3>
            <span className="text-white/60">-</span>
            <span className="text-lg font-medium text-cyan-400">{table.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const TableCard = ({ table, isHovered, isSelected, onClick, onHover }: any) => {
  return (
    <motion.div
      {...fadeInUp}
      className={`relative p-4 rounded-lg ${
        isSelected
          ? 'bg-white/10 shadow-lg'
          : isHovered
          ? 'bg-white/5'
          : 'bg-white/[0.02]'
      } border border-white/10 hover:border-cyan-400/30 transition-colors cursor-pointer`}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{table.name}</h3>
            <p className="text-sm text-white/60">{table.type}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Calibre actuel</span>
            <span className="text-white">{table.currentSize}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Calibre cible</span>
            <span className="text-white">{table.targetSize}</span>
          </div>
          <CaliberGauge currentSize={table.currentSize} targetSize={table.targetSize} tableName={table.name} />
        </div>

        <TableCellsDisplay table={table} />
      </div>
    </motion.div>
  );
};

export function OysterTableMap({ onTableSelect, onTableHover, hoveredTable, selectedTable, onTableUpdate }: OysterTableMapProps) {
  const [tables, setTables] = useState(initialTables);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  const handleCellClick = (tableId: string, cell: { id: string; filled: boolean | number }) => {
    const table = tables.find(t => t.id === tableId);
    if (!table || !onTableUpdate) return;

    const cellIndex = table.cells.findIndex(c => c.id === cell.id);
    if (cellIndex === -1) return;

    const updatedCell = {
      ...cell,
      filled: !cell.filled
    };

    const newCells = [...table.cells];
    newCells[cellIndex] = updatedCell;

    const updatedTable = {
      ...table,
      cells: newCells,
      value: (newCells.filter(cell => cell.filled).length / newCells.length) * 100
    };

    setTables(tables.map(t => t.id === tableId ? updatedTable : t));
    onTableUpdate(updatedTable);
  };

  const handleFillColumn = (tableId: string, side: 'left' | 'right') => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const newCells = [...table.cells];
    const start = side === 'left' ? 0 : 10;
    const end = side === 'left' ? 10 : 20;

    for (let i = start; i < end; i++) {
      newCells[i] = { ...newCells[i], filled: true };
    }

    const updatedTable = {
      ...table,
      cells: newCells,
      value: (newCells.filter(cell => cell.filled).length / newCells.length) * 100
    };

    setTables(tables.map(t => t.id === tableId ? updatedTable : t));
    onTableUpdate(updatedTable);
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {tables.map((table) => (
        <motion.div
          key={table.id}
          className={`bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors ${
            hoveredTable?.id === table.id ? 'border-cyan-500/50' : ''
          }`}
          {...fadeInUp}
          onClick={() => onTableSelect(table)}
          onMouseEnter={() => onTableHover?.(table)}
          onMouseLeave={() => onTableHover?.(null)}
        >
          <TableHeader table={table} onEdit={(t, newName) => {
            const updatedTable = { ...t, name: newName };
            setTables(tables.map(tbl => tbl.id === t.id ? updatedTable : tbl));
            onTableUpdate(updatedTable);
          }} />
          
          <div className="space-y-6">
            {/* Ligne d'informations */}
            <div className="flex justify-between items-start">
              {/* Dates */}
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-white/60 font-medium">Mise à l'eau</span>
                  <span className="text-white font-semibold bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/20">{table.startDate}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-white/60 font-medium">Récolte</span>
                  <span className="text-white font-semibold bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/20">
                    {table.name === 'Table A-12' && table.lastUpdate === 'En cours' ? (
                      <span className="animate-pulse text-cyan-400">En cours</span>
                    ) : (
                      table.lastUpdate
                    )}
                  </span>
                </div>
              </div>

              {/* Type et État */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <ThermometerSun size={18} className="text-cyan-400" />
                  <span className="text-white/60">Type:</span>
                  <span className="text-gray-300">{table.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge size={18} className="text-cyan-400" />
                  <span className="text-white/60">État:</span>
                  <span className="text-gray-300">{table.value}%</span>
                </div>
              </div>
            </div>

            {/* Grille principale */}
            <div className="grid grid-cols-2 gap-6">
              {/* État et carrés */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">État</h3>
                <TableCellsDisplay table={table} onCellClick={(index) => handleCellClick(table.id, table.cells[index])} />
              </div>

              {/* Calibre et jauge */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Calibre</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Shell size={18} className="text-cyan-400" />
                      <span className="text-white/60">Actuel:</span>
                      <span className="text-white font-semibold bg-cyan-500/10 px-3 py-1 rounded-md">{table.currentSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-cyan-400" />
                      <span className="text-white/60">Cible:</span>
                      <span className="text-white font-semibold px-3 py-1 rounded-md border border-cyan-500/20">{table.targetSize}</span>
                    </div>
                  </div>
                </div>
                <CaliberGauge currentSize={table.currentSize} targetSize={table.targetSize} tableName={table.name} />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}