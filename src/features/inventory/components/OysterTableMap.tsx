import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableDetail } from './TableDetail';
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
  Filter,
  PanelLeft,
  Info,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Download,
  Clock,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize as MaximizeIcon,
  X,
  Map as MapIcon,
  Compass,
  MinimizeIcon
} from 'lucide-react';

export interface Table {
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
    fillOrder?: number;
    fillDate?: string;
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
  onTableHover?: (table: Table | null) => void;
  hoveredTable?: Table | null;
  selectedTable?: Table | null;
}

const initialTables: Table[] = [
  {
    id: '1',
    name: 'Bouzigues',
    tableNumber: 'T-1234',
    position: { x: 50, y: 150 },
    size: { width: 150, height: 400 },
    status: 'optimal',
    temperature: 12.5,
    salinity: 35,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26',
    mortalityRate: 2.5,
    cells: Array(20).fill(null).map((_, i) => {
      const isFilled = Math.random() > 0.3;
      // Calculer l'ordre séquentiel: colonne gauche (indices pairs) de 1 à 10, puis colonne droite (indices impairs) de 11 à 20
      const columnIndex = i % 2; // 0 pour colonne gauche, 1 pour colonne droite
      const rowIndex = Math.floor(i / 2); // 0 à 9 pour les rangées
      const sequentialOrder = columnIndex === 0 ? rowIndex + 1 : rowIndex + 11;
      
      return {
        id: `b1-cell-${i}`,
        filled: isFilled,
        fillOrder: isFilled ? sequentialOrder : undefined,
        type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
      };
    }),
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
    position: { x: 250, y: 150 },
    size: { width: 150, height: 400 },
    status: 'optimal',
    temperature: 12.8,
    salinity: 34,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26',
    mortalityRate: 1.8,
    cells: Array(20).fill(null).map((_, i) => {
      const isFilled = Math.random() > 0.3;
      // Calculer l'ordre séquentiel: colonne gauche (indices pairs) de 1 à 10, puis colonne droite (indices impairs) de 11 à 20
      const columnIndex = i % 2; // 0 pour colonne gauche, 1 pour colonne droite
      const rowIndex = Math.floor(i / 2); // 0 à 9 pour les rangées
      const sequentialOrder = columnIndex === 0 ? rowIndex + 1 : rowIndex + 11;
      
      return {
        id: `b2-cell-${i}`,
        filled: isFilled,
        fillOrder: isFilled ? sequentialOrder : undefined,
        type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
      };
    }),
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
    position: { x: 500, y: 250 },
    size: { width: 150, height: 400 },
    status: 'warning',
    temperature: 13.2,
    salinity: 33,
    lastCheck: '2025-02-18',
    nextCheck: '2025-02-25',
    mortalityRate: 4.2,
    cells: Array(20).fill(null).map((_, i) => {
      const isFilled = Math.random() > 0.3;
      // Calculer l'ordre séquentiel: colonne gauche (indices pairs) de 1 à 10, puis colonne droite (indices impairs) de 11 à 20
      const columnIndex = i % 2; // 0 pour colonne gauche, 1 pour colonne droite
      const rowIndex = Math.floor(i / 2); // 0 à 9 pour les rangées
      const sequentialOrder = columnIndex === 0 ? rowIndex + 1 : rowIndex + 11;
      
      return {
        id: `m1-cell-${i}`,
        filled: isFilled,
        fillOrder: isFilled ? sequentialOrder : undefined,
        type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
      };
    }),
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
    position: { x: 700, y: 250 },
    size: { width: 150, height: 400 },
    status: 'warning',
    temperature: 13.0,
    salinity: 33,
    lastCheck: '2025-02-18',
    nextCheck: '2025-02-25',
    mortalityRate: 3.7,
    cells: Array(20).fill(null).map((_, i) => {
      const isFilled = Math.random() > 0.3;
      // Calculer l'ordre séquentiel: colonne gauche (indices pairs) de 1 à 10, puis colonne droite (indices impairs) de 11 à 20
      const columnIndex = i % 2; // 0 pour colonne gauche, 1 pour colonne droite
      const rowIndex = Math.floor(i / 2); // 0 à 9 pour les rangées
      const sequentialOrder = columnIndex === 0 ? rowIndex + 1 : rowIndex + 11;
      
      return {
        id: `m2-cell-${i}`,
        filled: isFilled,
        fillOrder: isFilled ? sequentialOrder : undefined,
        type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
      };
    }),
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
    position: { x: 900, y: 400 },
    size: { width: 150, height: 400 },
    status: 'optimal',
    temperature: 12.3,
    salinity: 35,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26',
    mortalityRate: 1.5,
    cells: Array(20).fill(null).map((_, i) => {
      const isFilled = Math.random() > 0.3;
      // Calculer l'ordre séquentiel: colonne gauche (indices pairs) de 1 à 10, puis colonne droite (indices impairs) de 11 à 20
      const columnIndex = i % 2; // 0 pour colonne gauche, 1 pour colonne droite
      const rowIndex = Math.floor(i / 2); // 0 à 9 pour les rangées
      const sequentialOrder = columnIndex === 0 ? rowIndex + 1 : rowIndex + 11;
      
      return {
        id: `ma1-cell-${i}`,
        filled: isFilled,
        fillOrder: isFilled ? sequentialOrder : undefined,
        type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
      };
    }),
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
    position: { x: 1100, y: 400 },
    size: { width: 150, height: 400 },
    status: 'optimal',
    temperature: 12.4,
    salinity: 35,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26',
    mortalityRate: 1.9,
    cells: Array(20).fill(null).map((_, i) => {
      const isFilled = Math.random() > 0.3;
      // Calculer l'ordre séquentiel: colonne gauche (indices pairs) de 1 à 10, puis colonne droite (indices impairs) de 11 à 20
      const columnIndex = i % 2; // 0 pour colonne gauche, 1 pour colonne droite
      const rowIndex = Math.floor(i / 2); // 0 à 9 pour les rangées
      const sequentialOrder = columnIndex === 0 ? rowIndex + 1 : rowIndex + 11;
      
      return {
        id: `ma2-cell-${i}`,
        filled: isFilled,
        fillOrder: isFilled ? sequentialOrder : undefined,
        type: ['triplo', 'diplo', 'naturelle'][Math.floor(Math.random() * 3)] as 'triplo' | 'diplo' | 'naturelle'
      };
    }),
    currentBatch: {
      size: '2',
      quantity: 4800,
      estimatedHarvestDate: '2025-06-30'
    }
  }
];

export function OysterTableMap({ onTableSelect, onTableHover, hoveredTable, selectedTable }: OysterTableMapProps) {
  const [showLegend, setShowLegend] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [tables, setTables] = useState<Table[]>(initialTables);

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

  const handleZoomIn = () => {
    setZoomLevel(prev => {
      const newZoom = Math.min(prev + 0.2, 3.0);
      console.log("Zoom in:", newZoom);
      return newZoom;
    });
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.2, 0.5);
      console.log("Zoom out:", newZoom);
      return newZoom;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setViewPosition({ x: 0, y: 0 });
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
                <MapIcon size={16} className="text-brand-burgundy" />
                <span className="text-white font-medium">Bouzigues</span>
              </div>
              <div className="glass-effect rounded-lg px-4 py-2 flex items-center space-x-2">
                <MapIcon size={16} className="text-brand-burgundy" />
                <span className="text-white font-medium">Mèze</span>
              </div>
              <div className="glass-effect rounded-lg px-4 py-2 flex items-center space-x-2">
                <MapIcon size={16} className="text-brand-burgundy" />
                <span className="text-white font-medium">Marseillan</span>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 flex items-center space-x-4">
              <div className="glass-effect p-2 rounded-lg z-30">
                <button 
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-white/10 rounded-md text-white mr-1"
                >
                  <ZoomIn size={18} />
                </button>
                <button 
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-white/10 rounded-md text-white mr-1"
                >
                  <ZoomOut size={18} />
                </button>
                <button 
                  onClick={handleResetZoom}
                  className="p-1.5 hover:bg-white/10 rounded-md text-white"
                >
                  <MaximizeIcon size={18} />
                </button>
              </div>
              
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-brand-burgundy/20 rounded-full blur-xl" />
                <div className="relative w-full h-full bg-black/40 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center">
                  <Compass size={48} className="text-brand-burgundy animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-xs">N</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-full overflow-hidden">
              <div 
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={{ 
                  transform: `scale(${zoomLevel}) translate(${viewPosition.x}px, ${viewPosition.y}px)`,
                  transformOrigin: 'center center',
                  cursor: 'grab'
                }}
                onMouseDown={(e) => {
                  const el = e.currentTarget;
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startPosX = viewPosition.x;
                  const startPosY = viewPosition.y;
                  
                  const onMouseMove = (moveEvent: MouseEvent) => {
                    const dx = (moveEvent.clientX - startX) / zoomLevel;
                    const dy = (moveEvent.clientY - startY) / zoomLevel;
                    setViewPosition({
                      x: startPosX + dx,
                      y: startPosY + dy
                    });
                    el.style.cursor = 'grabbing';
                  };
                  
                  const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    el.style.cursor = 'grab';
                  };
                  
                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
                }}
              >
                {tables.map((table) => (
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
                    onHoverStart={() => onTableHover?.(table)}
                    onHoverEnd={() => onTableHover?.(null)}
                    onClick={() => onTableSelect(table)}
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
                        'bg-red-500/10'
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
                          >
                            {cell.filled && cell.fillOrder && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs text-white font-bold">{cell.fillOrder}</span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
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
                <div className="mt-4 pt-2 border-t border-white/10">
                  <span className="text-white/60 text-sm">Les numéros indiquent l'ordre de remplissage</span>
                </div>
              </div>
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
                className="glass-effect p-6 rounded-xl h-full"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      Table {(selectedTable || hoveredTable)?.tableNumber}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      (selectedTable || hoveredTable)?.status === 'optimal' ? 'bg-green-500/20 text-green-400' :
                      (selectedTable || hoveredTable)?.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {(selectedTable || hoveredTable)?.status === 'optimal' ? 'Optimal' :
                       (selectedTable || hoveredTable)?.status === 'warning' ? 'Attention' : 'Critique'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-white/60 text-sm mb-1">Température</div>
                      <div className="text-white font-medium flex items-center">
                        <ThermometerSun className="w-4 h-4 mr-1 text-brand-burgundy" />
                        {(selectedTable || hoveredTable)?.temperature}°C
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-white/60 text-sm mb-1">Salinité</div>
                      <div className="text-white font-medium flex items-center">
                        <Droplets className="w-4 h-4 mr-1 text-brand-primary" />
                        {(selectedTable || hoveredTable)?.salinity} g/L
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">Occupation</h4>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-burgundy"
                        style={{ 
                          width: `${((selectedTable || hoveredTable)?.cells.filter(cell => cell.filled).length || 0) * 5}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-white/60">
                        {(selectedTable || hoveredTable)?.cells.filter(cell => cell.filled).length} / 20 emplacements
                      </span>
                      <span className="text-xs text-white/60">
                        {((selectedTable || hoveredTable)?.cells.filter(cell => cell.filled).length || 0) * 5}%
                      </span>
                    </div>
                  </div>
                </div>

                {(selectedTable || hoveredTable)?.currentBatch && (
                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex items-center text-white/80 mb-4">
                      <Shell size={20} className="mr-2 text-brand-burgundy" />
                      Lot en cours
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Calibre</span>
                        <span className="text-white font-medium">
                          N°{(selectedTable || hoveredTable)?.currentBatch?.size}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Quantité</span>
                        <span className="text-white font-medium">
                          {(selectedTable || hoveredTable)?.currentBatch?.quantity} unités
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Récolte estimée</span>
                        <span className="text-white font-medium">
                          {new Date((selectedTable || hoveredTable)?.currentBatch?.estimatedHarvestDate || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="no-table-selected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-effect p-6 rounded-xl flex flex-col items-center justify-center h-full text-center"
              >
                <div className="bg-white/5 rounded-full p-4 mb-4">
                  <MapIcon className="w-10 h-10 text-brand-burgundy" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sélectionnez une table</h3>
                <p className="text-white/60">
                  Cliquez sur une table pour voir ses détails et gérer son contenu
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}