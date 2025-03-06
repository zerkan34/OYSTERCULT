import React, { useState, useEffect } from 'react';
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
  Package,
  X
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
    fillOrder?: number;
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

const fakeData = {
  tables: [
    {
      id: 'table1',
      position: {
        x: 50,
        y: 100,
      },
      name: 'B-1',
      size: '310x80',
      status: 'ok',
      cells: (() => {
        // Créer un tableau de cellules temporaires
        const tempCells = Array(20).fill(null).map((_, i) => {
          const columnIndex = i % 2;
          const rowIndex = Math.floor(i / 2);
          // Remplir seulement les 6 premières cellules de chaque colonne (60%)
          const isFilled = rowIndex < 6;
          
          return {
            id: `b1-cell-${i}`,
            columnIndex,
            rowIndex,
            filled: isFilled,
            type: columnIndex === 0 ? 'triplo' : 'diplo'
          };
        });
  
        // Trier les cellules par colonne, puis réorganiser l'ordre de remplissage
        const leftCells = tempCells.filter(cell => cell.columnIndex === 0).sort((a, b) => a.rowIndex - b.rowIndex);
        const rightCells = tempCells.filter(cell => cell.columnIndex === 1).sort((a, b) => a.rowIndex - b.rowIndex);
        
        // Réassigner les numéros de remplissage pour éviter les espaces vides
        let leftCounter = 1;
        let rightCounter = 1;
        
        leftCells.forEach(cell => {
          if (cell.filled) {
            cell.fillOrder = leftCounter++;
          }
        });
        
        rightCells.forEach(cell => {
          if (cell.filled) {
            cell.fillOrder = rightCounter++;
          }
        });
        
        // Recombiner les cellules dans l'ordre original
        const finalCells = Array(20).fill(null);
        for (let i = 0; i < 20; i++) {
          const columnIndex = i % 2;
          const rowIndex = Math.floor(i / 2);
          
          if (columnIndex === 0) {
            finalCells[i] = {
              id: leftCells[rowIndex].id,
              filled: leftCells[rowIndex].filled,
              fillOrder: leftCells[rowIndex].fillOrder,
              type: leftCells[rowIndex].type
            };
          } else {
            finalCells[i] = {
              id: rightCells[rowIndex].id,
              filled: rightCells[rowIndex].filled,
              fillOrder: rightCells[rowIndex].fillOrder,
              type: rightCells[rowIndex].type
            };
          }
        }
        
        return finalCells;
      })(),
      currentBatch: {
        size: '3',
        quantity: 300,
        mortalityRate: 2.5,
        type: 'triplo',
      },
    },
    {
      id: 'table2',
      position: {
        x: 270,
        y: 100,
      },
      name: 'B-2',
      size: '310x80',
      status: 'warning',
      cells: (() => {
        // Créer un tableau de cellules temporaires
        const tempCells = Array(20).fill(null).map((_, i) => {
          const columnIndex = i % 2;
          const rowIndex = Math.floor(i / 2);
          // Remplir seulement les 6 premières cellules de chaque colonne (60%)
          const isFilled = rowIndex < 6;
          
          return {
            id: `b2-cell-${i}`,
            columnIndex,
            rowIndex,
            filled: isFilled,
            type: columnIndex === 0 ? 'triplo' : 'diplo'
          };
        });
  
        // Trier les cellules par colonne, puis réorganiser l'ordre de remplissage
        const leftCells = tempCells.filter(cell => cell.columnIndex === 0).sort((a, b) => a.rowIndex - b.rowIndex);
        const rightCells = tempCells.filter(cell => cell.columnIndex === 1).sort((a, b) => a.rowIndex - b.rowIndex);
        
        // Réassigner les numéros de remplissage pour éviter les espaces vides
        let leftCounter = 1;
        let rightCounter = 1;
        
        leftCells.forEach(cell => {
          if (cell.filled) {
            cell.fillOrder = leftCounter++;
          }
        });
        
        rightCells.forEach(cell => {
          if (cell.filled) {
            cell.fillOrder = rightCounter++;
          }
        });
        
        // Recombiner les cellules dans l'ordre original
        const finalCells = Array(20).fill(null);
        for (let i = 0; i < 20; i++) {
          const columnIndex = i % 2;
          const rowIndex = Math.floor(i / 2);
          
          if (columnIndex === 0) {
            finalCells[i] = {
              id: leftCells[rowIndex].id,
              filled: leftCells[rowIndex].filled,
              fillOrder: leftCells[rowIndex].fillOrder,
              type: leftCells[rowIndex].type
            };
          } else {
            finalCells[i] = {
              id: rightCells[rowIndex].id,
              filled: rightCells[rowIndex].filled,
              fillOrder: rightCells[rowIndex].fillOrder,
              type: rightCells[rowIndex].type
            };
          }
        }
        
        return finalCells;
      })(),
      currentBatch: {
        size: '2',
        quantity: 300,
        mortalityRate: 1.8,
        type: 'diplo',
      },
    },
    // Autres tables...
  ],
};

export function OysterTableMap({ onTableSelect }: OysterTableMapProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [hoveredTable, setHoveredTable] = useState<Table | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Gestionnaire pour fermer le modal
  const handleCloseModal = () => {
    setSelectedTable(null);
  };

  // Gestionnaire pour la touche Echap
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Gestionnaire pour le survol
  const handleTableHover = (table: Table | null, e?: React.MouseEvent) => {
    setHoveredTable(table);
    if (e) {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  };

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
          <div 
            className="relative h-[800px] bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 rounded-lg overflow-hidden border border-white/10"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseModal();
              }
            }}
          >
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
              {fakeData.tables.map((table) => (
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
                  onMouseEnter={(e) => handleTableHover(table, e)}
                  onMouseLeave={() => handleTableHover(null)}
                  onMouseMove={(e: React.MouseEvent) => {
                    if (hoveredTable) {
                      setMousePosition({ x: e.clientX, y: e.clientY });
                    }
                  }}
                  onClick={() => {
                    setSelectedTable(table);
                    onTableSelect?.(table);
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 glass-effect px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">{table.name}</span>
                  </div>

                  <div 
                    className={`relative h-full rounded-lg overflow-hidden transition-all duration-300
                      ${selectedTable?.id === table.id ? 'ring-4 ring-brand-burgundy shadow-neon' : 'ring-1 ring-white/20'}`}
                  >
                    <div className={`absolute inset-0 backdrop-blur-sm ${
                      table.status === 'ok' ? 'bg-green-500/10' :
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
                className="glass-effect rounded-xl p-6 space-y-6 relative"
              >
                {/* Bouton fermer */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {(hoveredTable || selectedTable)?.name}
                  </h3>
                  <div className="text-lg text-gradient-primary">
                    Table {(hoveredTable || selectedTable)?.name}
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
        {hoveredTable && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="fixed glass-effect rounded-lg p-3 z-50 min-w-[200px]"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y + 10,
              pointerEvents: 'none'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} className="text-brand-primary" />
              <span className="text-sm text-white font-medium">Table {hoveredTable.name}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">État</span>
                <span className={`text-xs font-medium ${
                  hoveredTable.status === 'ok' 
                    ? 'text-green-400' 
                    : hoveredTable.status === 'warning'
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }`}>
                  {hoveredTable.status === 'ok' ? 'Optimal' : hoveredTable.status === 'warning' ? 'Avertissement' : 'Critique'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">Lots</span>
                <span className="text-xs text-white">{hoveredTable.cells.filter(cell => cell.filled).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">Température</span>
                <span className="text-xs text-white">{hoveredTable.temperature}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">Salinité</span>
                <span className="text-xs text-white">{hoveredTable.salinity}g/L</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}