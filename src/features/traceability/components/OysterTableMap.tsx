import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Settings, 
  AlertTriangle, 
  Clock, 
  Filter,
  Sparkles,
  Zap,
  History,
  CheckCircle2,
  Calendar,
  ThermometerSun,
  Plus,
  Trash2,
  Edit2,
  Compass,
  MapPin,
  Eye,
  Shell,
  Package
} from 'lucide-react';

interface Table {
  id: string;
  name: string;
  tableNumber: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  status: 'optimal' | 'warning' | 'critical';
  temperature: number;
  salinity: number;
  cells: {
    id: string;
    filled: boolean;
    type?: 'triplo' | 'diplo' | 'naturelle';
  }[];
  currentBatch?: {
    size: string;
    quantity: number;
    estimatedHarvestDate: string;
  };
  lastCheck?: string;
  nextCheck?: string;
  mortalityRate?: number;
}

interface OysterTableMapProps {
  onTableSelect: (table: Table) => void;
}

const mockTables: Table[] = [
  {
    id: '1',
    name: 'Bouzigues',
    tableNumber: 'T-1234',
    position: { x: 50, y: 100 },
    size: { width: 80, height: 200 },
    status: 'optimal',
    temperature: 12.5,
    salinity: 35,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26',
    mortalityRate: 2.5,
    cells: Array(20).fill(null).map((_, i) => ({
      id: `b1-cell-${i}`,
      filled: Math.random() > 0.3,
      type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
    })),
    currentBatch: {
      size: '3',
      quantity: 5000,
      estimatedHarvestDate: '2025-06-15'
    }
  },
  {
    id: '2',
    name: 'Bouzigues',
    tableNumber: 'T-1235',
    position: { x: 150, y: 100 },
    size: { width: 80, height: 200 },
    status: 'optimal',
    temperature: 12.8,
    salinity: 34,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26',
    mortalityRate: 1.8,
    cells: Array(20).fill(null).map((_, i) => ({
      id: `b2-cell-${i}`,
      filled: Math.random() > 0.3,
      type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
    })),
    currentBatch: {
      size: '2',
      quantity: 4000,
      estimatedHarvestDate: '2025-06-20'
    }
  },
  {
    id: '3',
    name: 'Mèze',
    tableNumber: 'T-2234',
    position: { x: 300, y: 250 },
    size: { width: 80, height: 200 },
    status: 'warning',
    temperature: 13.2,
    salinity: 33,
    lastCheck: '2025-02-18',
    nextCheck: '2025-02-25',
    mortalityRate: 4.2,
    cells: Array(20).fill(null).map((_, i) => ({
      id: `m1-cell-${i}`,
      filled: Math.random() > 0.3,
      type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
    })),
    currentBatch: {
      size: '3',
      quantity: 6000,
      estimatedHarvestDate: '2025-07-01'
    }
  },
  {
    id: '4',
    name: 'Mèze',
    tableNumber: 'T-2235',
    position: { x: 400, y: 250 },
    size: { width: 80, height: 200 },
    status: 'warning',
    temperature: 13.0,
    salinity: 33,
    lastCheck: '2025-02-18',
    nextCheck: '2025-02-25',
    mortalityRate: 3.7,
    cells: Array(20).fill(null).map((_, i) => ({
      id: `m2-cell-${i}`,
      filled: Math.random() > 0.3,
      type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
    })),
    currentBatch: {
      size: '4',
      quantity: 3500,
      estimatedHarvestDate: '2025-07-05'
    }
  },
  {
    id: '5',
    name: 'Marseillan',
    tableNumber: 'T-3234',
    position: { x: 550, y: 400 },
    size: { width: 80, height: 200 },
    status: 'optimal',
    temperature: 12.3,
    salinity: 35,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26',
    mortalityRate: 1.5,
    cells: Array(20).fill(null).map((_, i) => ({
      id: `ma1-cell-${i}`,
      filled: Math.random() > 0.3,
      type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
    })),
    currentBatch: {
      size: '3',
      quantity: 5500,
      estimatedHarvestDate: '2025-06-25'
    }
  },
  {
    id: '6',
    name: 'Marseillan',
    tableNumber: 'T-3235',
    position: { x: 650, y: 400 },
    size: { width: 80, height: 200 },
    status: 'optimal',
    temperature: 12.4,
    salinity: 35,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26',
    mortalityRate: 1.9,
    cells: Array(20).fill(null).map((_, i) => ({
      id: `ma2-cell-${i}`,
      filled: Math.random() > 0.3,
      type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
    })),
    currentBatch: {
      size: '2',
      quantity: 4800,
      estimatedHarvestDate: '2025-06-30'
    }
  }
];

export function OysterTableMap({ onTableSelect }: OysterTableMapProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [hoveredTable, setHoveredTable] = useState<Table | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const cellVariants = {
    initial: { opacity: 0.6, scale: 0.95 },
    animate: (custom: number) => ({
      opacity: [0.6, 1, 0.6],
      scale: [0.95, 1, 0.95],
      transition: {
        duration: 3,
        repeat: Infinity,
        delay: custom * 0.1,
        ease: "easeInOut"
      }
    })
  };

  const filledCellVariants = {
    initial: { opacity: 0.8, scale: 0.95 },
    animate: (custom: number) => ({
      opacity: [0.8, 1, 0.8],
      scale: [0.95, 1.05, 0.95],
      transition: {
        duration: 4,
        repeat: Infinity,
        delay: custom * 0.2,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9 glass-effect rounded-xl">
          <div className="relative h-[800px] bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 rounded-lg overflow-hidden border border-white/10">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-burgundy/5 to-brand-burgundy/10" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
            </div>

            <div className="absolute top-0 left-0 right-0 flex justify-between p-6">
              <div className="glass-effect rounded-lg px-4 py-2 flex items-center space-x-2">
                <MapPin size={16} className="text-brand-burgundy" />
                <span className="text-white font-medium">Bouzigues</span>
              </div>
              <div className="glass-effect rounded-lg px-4 py-2 flex items-center space-x-2">
                <MapPin size={16} className="text-brand-burgundy" />
                <span className="text-white font-medium">Mèze</span>
              </div>
              <div className="glass-effect rounded-lg px-4 py-2 flex items-center space-x-2">
                <MapPin size={16} className="text-brand-burgundy" />
                <span className="text-white font-medium">Marseillan</span>
              </div>
            </div>

            {/* Boussole repositionnée en bas à droite */}
            <div className="absolute bottom-6 right-6 w-24 h-24">
              <div className="absolute inset-0 bg-brand-burgundy/20 rounded-full blur-xl" />
              <div className="relative w-full h-full bg-black/40 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center">
                <Compass size={48} className="text-brand-burgundy animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white font-bold text-xs">N</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 glass-effect rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Types d'huîtres</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm bg-brand-burgundy shadow-neon" />
                  <span className="text-white/60 text-sm">Triploïdes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm bg-brand-primary shadow-neon" />
                  <span className="text-white/60 text-sm">Diploïdes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm bg-brand-tertiary shadow-neon" />
                  <span className="text-white/60 text-sm">Naturelles</span>
                </div>
              </div>
            </div>

            <div className="relative h-full">
              {mockTables.map((table) => (
                <motion.div
                  key={table.id}
                  className="absolute"
                  style={{
                    left: `${table.position.x}px`,
                    top: `${table.position.y}px`,
                    width: `${table.size.width}px`,
                    height: `${table.size.height}px`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => setHoveredTable(table)}
                  onMouseLeave={() => {
                    setHoveredTable(null);
                    setMousePosition({ x: 0, y: 0 });
                  }}
                  onMouseMove={(e: React.MouseEvent) => {
                    setMousePosition({ x: e.clientX, y: e.clientY });
                  }}
                  onClick={() => {
                    setSelectedTable(table);
                    onTableSelect?.(table);
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 glass-effect px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">{table.tableNumber}</span>
                  </div>

                  <div 
                    className={`relative h-full rounded-lg overflow-hidden transition-all duration-300
                      ${selectedTable?.id === table.id ? 'ring-4 ring-brand-burgundy shadow-neon' : 'ring-1 ring-white/20'}`}
                  >
                    <div className={`absolute inset-0 backdrop-blur-sm ${
                      table.status === 'optimal' ? 'bg-green-500/10' :
                      table.status === 'warning' ? 'bg-yellow-500/10' :
                      'bg-blue-500/10'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    </div>

                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-10 gap-2 p-4">
                      {table.cells.map((cell, index) => (
                        <motion.div
                          key={cell.id}
                          className={`rounded-md transition-all duration-300 ${
                            cell.filled
                              ? `${
                                  cell.type === 'triplo' ? 'bg-brand-burgundy shadow-neon' :
                                  cell.type === 'diplo' ? 'bg-brand-primary shadow-neon' :
                                  'bg-brand-tertiary shadow-neon'
                                }`
                              : 'bg-white/5'
                          }`}
                          variants={cell.filled ? filledCellVariants : cellVariants}
                          initial="initial"
                          animate="animate"
                          custom={index}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <AnimatePresence mode="wait">
            {(hoveredTable || selectedTable) ? (
              <motion.div
                key="table-info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-effect rounded-xl p-6 space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {(hoveredTable || selectedTable)?.name}
                  </h3>
                  <div className="text-lg text-gradient-primary">
                    Table {(hoveredTable || selectedTable)?.tableNumber}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex items-center text-white/80 mb-2">
                      <ThermometerSun size={20} className="mr-2 text-brand-burgundy" />
                      Température
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(hoveredTable || selectedTable)?.temperature}°C
                    </div>
                  </div>

                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex items-center text-white/80 mb-2">
                      <Droplets size={20} className="mr-2 text-brand-primary" />
                      Salinité
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(hoveredTable || selectedTable)?.salinity}g/L
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-lg p-4">
                  <div className="flex items-center text-white/80 mb-4">
                    <Clock size={20} className="mr-2 text-brand-tertiary" />
                    Échantillonnage
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Dernier échantillonnage</span>
                      <span className="text-white">
                        {new Date((hoveredTable || selectedTable)?.lastCheck || '').toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Prochain échantillonnage</span>
                      <span className="text-white">
                        {new Date((hoveredTable || selectedTable)?.nextCheck || '').toLocaleDateString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Taux de mortalité estimé</span>
                        <span className={`text-lg font-medium ${
                          ((hoveredTable || selectedTable)?.mortalityRate || 0) > 3
                            ? 'text-blue-400'
                            : ((hoveredTable || selectedTable)?.mortalityRate || 0) > 2
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}>
                          {(hoveredTable || selectedTable)?.mortalityRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {(hoveredTable || selectedTable)?.currentBatch && (
                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex items-center text-white/80 mb-4">
                      <Shell size={20} className="mr-2 text-brand-burgundy" />
                      Lot en cours
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Calibre</span>
                        <span className="text-white font-medium">
                          N°{(hoveredTable || selectedTable)?.currentBatch?.size}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Quantité</span>
                        <span className="text-white font-medium">
                          {(hoveredTable || selectedTable)?.currentBatch?.quantity} unités
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Récolte prévue</span>
                        <span className="text-white font-medium">
                          {new Date((hoveredTable || selectedTable)?.currentBatch?.estimatedHarvestDate || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="no-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-effect rounded-xl p-6 text-center"
              >
                <Eye size={48} className="mx-auto text-white/20 mb-4" />
                <p className="text-white/60">
                  Survolez une table pour voir ses informations détaillées
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {hoveredTable && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="fixed glass-effect rounded-lg p-3 z-50 min-w-[200px]"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y + 10
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} className="text-brand-primary" />
              <span className="text-sm text-white font-medium">Table {hoveredTable.tableNumber}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">État</span>
                <span className={`text-xs font-medium ${
                  hoveredTable.status === 'optimal' 
                    ? 'text-green-400' 
                    : hoveredTable.status === 'warning'
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }`}>
                  {hoveredTable.status === 'optimal' ? 'Optimal' : hoveredTable.status === 'warning' ? 'Avertissement' : 'Critique'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">Lots</span>
                <span className="text-xs text-white">{hoveredTable.cells.filter(cell => cell.filled).length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}