import React, { useState, useRef, useEffect } from 'react';
import { Package, AlertTriangle, Clock, Calendar, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface OysterTable {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  status: 'optimal' | 'warning' | 'critical';
  oysterType: string;
  caliber: string;
  currentQuantity: number;
  maxCapacity: number;
  lastCheck: string;
  nextCheck: string;
}

const mockTables: OysterTable[] = [
  {
    id: '1',
    name: 'Table A1',
    position: { x: 50, y: 50 },
    size: { width: 200, height: 100 },
    status: 'optimal',
    oysterType: 'Plates',
    caliber: '3',
    currentQuantity: 850,
    maxCapacity: 1000,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26'
  },
  {
    id: '2',
    name: 'Table A2',
    position: { x: 300, y: 50 },
    size: { width: 200, height: 100 },
    status: 'warning',
    oysterType: 'Creuses',
    caliber: '2',
    currentQuantity: 600,
    maxCapacity: 1000,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26'
  },
  {
    id: '3',
    name: 'Table B1',
    position: { x: 50, y: 200 },
    size: { width: 200, height: 100 },
    status: 'critical',
    oysterType: 'Plates',
    caliber: '4',
    currentQuantity: 200,
    maxCapacity: 1200,
    lastCheck: '2025-02-19',
    nextCheck: '2025-02-26'
  }
];

const statusColors = {
  optimal: 'border-green-500/50 bg-green-500/10',
  warning: 'border-yellow-500/50 bg-yellow-500/10',
  critical: 'border-red-500/50 bg-red-500/10'
};

export function OysterTables() {
  const [selectedTable, setSelectedTable] = useState<OysterTable | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(Math.max(z * delta, 0.5), 2));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const getOccupancyPercentage = (table: OysterTable) => {
    return Math.round((table.currentQuantity / table.maxCapacity) * 100);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Tables de production</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            {viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div 
          ref={containerRef}
          className="relative w-full h-[600px] bg-gradient-to-b from-blue-900/20 to-blue-900/40 border border-white/10 rounded-lg overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Effet de l'eau */}
          <div className="absolute inset-0">
            {/* Gradient de profondeur */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-blue-500/20 pool-depth" />
            
            {/* Surface de l'eau avec vagues */}
            <div className="absolute inset-0 water-surface" />
          </div>
          
          <div 
            className="absolute inset-0 transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'center'
            }}
          >
            {mockTables.map((table) => (
              <motion.div
                key={table.id}
                style={{
                  position: 'absolute',
                  left: `${table.position.x}px`,
                  top: `${table.position.y}px`,
                  width: `${table.size.width}px`,
                  height: `${table.size.height}px`,
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'center'
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedTable(table)}
                className={`absolute border-2 rounded-lg cursor-pointer overflow-hidden ${
                  statusColors[table.status]
                }`}
              >
                {/* Structure de la table */}
                <div className="absolute inset-0">
                  {/* Effet de structure */}
                  <div 
                    className="absolute inset-0" 
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10px)',
                      backgroundSize: '100% 10px'
                    }}
                  />
                  
                  {/* Effet de réflexion */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                </div>

                <div className="flex-grow space-y-4">
                  <div className="flex items-center justify-between text-white/70">
                    <span>Occupation:</span>
                    <span className={getOccupancyColor(getOccupancyPercentage(table))}>
                      {getOccupancyPercentage(table)}%
                    </span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-white/70">
                        <span>Quantité:</span>
                        <span className="whitespace-nowrap">
                          {table.currentQuantity}/{table.maxCapacity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-white/70">
                        <span>Dernier contrôle:</span>
                        <span className="whitespace-nowrap">
                          {new Date(table.lastCheck).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-400/30 hover:border-cyan-400/50 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1">
                      Voir détails
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {mockTables.map((table) => (
            <div
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className="relative bg-[rgba(15,23,42,0.3)] backdrop-blur-[10px] rounded-lg border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] transition-all duration-300 flex flex-col min-h-[280px] p-4 group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg ${
                    table.status === 'optimal' ? 'bg-green-500/20' :
                    table.status === 'warning' ? 'bg-yellow-500/20' :
                    'bg-red-500/20'
                  } flex items-center justify-center`}>
                    <Package size={20} className={
                      table.status === 'optimal' ? 'text-green-300' :
                      table.status === 'warning' ? 'text-yellow-300' :
                      'text-red-300'
                    } />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">{table.name}</h3>
                    <p className="text-sm text-white/60 mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                      {table.oysterType} N°{table.caliber}
                    </p>
                    <div className="grid grid-cols-1 gap-4 auto-rows-fr mt-4">
                      <div>
                        <div className="text-sm text-white/60">Occupation</div>
                        <div className="text-white">
                          {getOccupancyPercentage(table)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60">Dernier contrôle</div>
                        <div className="text-white">
                          {new Date(table.lastCheck).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{selectedTable.name}</h3>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 auto-rows-fr mt-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/60">Occupation</div>
                  <div className="text-2xl font-bold text-white">
                    {getOccupancyPercentage(selectedTable)}%
                  </div>
                  <div className="text-sm text-white/60">
                    {selectedTable.currentQuantity}/{selectedTable.maxCapacity}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/60">Dernier contrôle</div>
                  <div className="text-2xl font-bold text-white">
                    {new Date(selectedTable.lastCheck).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/60">Prochain contrôle</div>
                  <div className="text-2xl font-bold text-white">
                    {new Date(selectedTable.nextCheck).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedTable(null)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Fermer
                </button>
                <p className="text-xs text-white/60 italic ml-2">
                  Vous pouvez modifier le contenu des bassins en cliquant directement dessus
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}