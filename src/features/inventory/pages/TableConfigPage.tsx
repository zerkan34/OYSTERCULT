import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Settings, AlertCircle, Droplets, Award } from 'lucide-react';

interface TableStats {
  totalPochons: number;
  usedPochons: number;
  totalOysters: number;
  usedOysters: number;
}

export function TableConfigPage() {
  const { tableConfigs, addTableConfig, updateTableConfig, toggleTableExposure } = useStore();
  const [newTable, setNewTable] = useState({
    perchCount: 5,
    damagedPerches: [],
    pochonsPerPerch: 10,
    oystersPerCorde: 20,
    isExposed: false,
    exposureCount: 0,
  });

  const calculateTableStats = (config: typeof newTable): TableStats => {
    const availablePerches = config.perchCount - config.damagedPerches.length;
    const totalPochons = availablePerches * config.pochonsPerPerch;
    const totalOysters = totalPochons * config.oystersPerCorde;
    
    // Pour l'exemple, on simule une utilisation de 70% de la capacité
    return {
      totalPochons,
      usedPochons: Math.floor(totalPochons * 0.7),
      totalOysters,
      usedOysters: Math.floor(totalOysters * 0.7),
    };
  };

  const getQualityLabel = (exposureCount: number): string => {
    if (exposureCount >= 10) return "OC Premium";
    if (exposureCount >= 5) return "OC Gold";
    if (exposureCount >= 3) return "OC Silver";
    return "Standard";
  };

  const handleAddTable = () => {
    addTableConfig(newTable);
    setNewTable({
      perchCount: 5,
      damagedPerches: [],
      pochonsPerPerch: 10,
      oystersPerCorde: 20,
      isExposed: false,
      exposureCount: 0,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
            <Settings className="text-brand-blue" size={20} />
          </div>
          <h1 className="text-2xl font-medium text-white">Configuration Tables</h1>
        </div>
      </div>

      {/* Formulaire d'ajout de table */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-lg font-medium text-white mb-4">Ajouter une nouvelle table</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">
              Nombre de perches
            </label>
            <input
              type="number"
              value={newTable.perchCount}
              onChange={(e) => setNewTable(prev => ({ ...prev, perchCount: parseInt(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            />
            <p className="text-xs text-white/40 mt-1">1 carré = 5 perches</p>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">
              Pochons par perche
            </label>
            <input
              type="number"
              value={newTable.pochonsPerPerch}
              onChange={(e) => setNewTable(prev => ({ ...prev, pochonsPerPerch: parseInt(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">
              Huîtres par corde
            </label>
            <input
              type="number"
              value={newTable.oystersPerCorde}
              onChange={(e) => setNewTable(prev => ({ ...prev, oystersPerCorde: parseInt(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddTable}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-medium py-2 px-4 rounded-lg"
            >
              Ajouter la table
            </button>
          </div>
        </div>
      </div>

      {/* Liste des tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tableConfigs.map((table) => {
          const stats = calculateTableStats(table);
          const quality = getQualityLabel(table.exposureCount);
          
          return (
            <div key={table.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-white">Table {table.id.slice(0, 4)}</h3>
                  {quality !== "Standard" && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-brand-blue/20 rounded-lg">
                      <Award size={14} className="text-brand-blue" />
                      <span className="text-xs font-medium text-brand-blue">{quality}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggleTableExposure(table.id)}
                  className={`px-3 py-1 rounded-lg flex items-center gap-2 ${
                    table.isExposed 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30'
                  }`}
                >
                  <Droplets size={16} />
                  {table.isExposed ? 'Exondée' : 'Exonder'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-white/60 mb-1">Pochons</div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-blue"
                      style={{ width: `${(stats.usedPochons / stats.totalPochons) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/40 mt-1">
                    <span>{stats.usedPochons} utilisées</span>
                    <span>{stats.totalPochons} total</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">Huîtres</div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-blue"
                      style={{ width: `${(stats.usedOysters / stats.totalOysters) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/40 mt-1">
                    <span>{stats.usedOysters} utilisées</span>
                    <span>{stats.totalOysters} total</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Perches</span>
                    <span className="text-white">{table.perchCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Pochons/perche</span>
                    <span className="text-white">{table.pochonsPerPerch}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Huîtres/corde</span>
                    <span className="text-white">{table.oystersPerCorde}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Exondations</span>
                    <span className="text-white">{table.exposureCount}</span>
                  </div>
                </div>
              </div>

              {table.isExposed && (
                <div className="mt-4 flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10 px-3 py-2 rounded-lg">
                  <AlertCircle size={14} />
                  <span>Table exondée depuis {new Date(table.lastExposureDate!).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
