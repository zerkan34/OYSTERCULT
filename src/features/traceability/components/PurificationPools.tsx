import React, { useState } from 'react';
import { Waves, ThermometerSun, Timer, Activity, Filter, Shell, Droplets, X, Edit2, Save } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Input } from '@/components/ui/Input';

interface Pool {
  id: string;
  name: string;
  filterType: string;
  filterStatus: 'active' | 'maintenance' | 'error';
  currentOccupancy: number;
  capacity: number;
  waterQuality: number;
  temperature: number;
  lastMaintenance: string;
  nextMaintenance: string;
  batches: {
    id: string;
    number: string;
    quantity: number;
    remainingTime: number;
  }[];
}

const mockPools: Pool[] = [
  {
    id: '1',
    name: 'Bassin A1',
    filterType: 'Bio-filtre',
    filterStatus: 'active',
    currentOccupancy: 800,
    capacity: 1000,
    waterQuality: 98,
    temperature: 12.5,
    lastMaintenance: '2025-02-25',
    nextMaintenance: '2025-03-03',
    batches: [
      {
        id: '1',
        number: 'LOT-2025-001',
        quantity: 500,
        remainingTime: 18
      }
    ]
  },
  {
    id: '2',
    name: 'Bassin A2',
    filterType: 'Bio-filtre',
    filterStatus: 'maintenance',
    currentOccupancy: 600,
    capacity: 1000,
    waterQuality: 92,
    temperature: 12.3,
    lastMaintenance: '2025-02-24',
    nextMaintenance: '2025-03-02',
    batches: [
      {
        id: '2',
        number: 'LOT-2025-002',
        quantity: 300,
        remainingTime: 6
      }
    ]
  },
  {
    id: '3',
    name: 'Bassin B1',
    filterType: 'UV-filtre',
    filterStatus: 'active',
    currentOccupancy: 900,
    capacity: 1000,
    waterQuality: 95,
    temperature: 12.4,
    lastMaintenance: '2025-02-23',
    nextMaintenance: '2025-03-01',
    batches: [
      {
        id: '3',
        number: 'LOT-2025-003',
        quantity: 600,
        remainingTime: 12
      }
    ]
  },
  {
    id: '4',
    name: 'Bassin B2',
    filterType: 'UV-filtre',
    filterStatus: 'error',
    currentOccupancy: 0,
    capacity: 1000,
    waterQuality: 85,
    temperature: 12.6,
    lastMaintenance: '2025-02-22',
    nextMaintenance: '2025-02-28',
    batches: []
  }
];

export function PurificationPools() {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedPool, setEditedPool] = useState<Pool | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-300';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'error':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-white/20 text-white';
    }
  };

  const handleEdit = () => {
    setEditedPool(selectedPool);
    setEditMode(true);
  };

  const handleSave = () => {
    if (editedPool) {
      // Dans un environnement réel, nous ferions un appel API ici
      const updatedPools = mockPools.map(pool => 
        pool.id === editedPool.id ? editedPool : pool
      );
      // Mettre à jour le state global (à implémenter avec un vrai backend)
      setSelectedPool(editedPool);
      setEditMode(false);
      setEditedPool(null);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedPool(null);
  };

  const handleInputChange = (field: keyof Pool, value: string | number) => {
    if (editedPool) {
      setEditedPool({
        ...editedPool,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-white">État des bassins de purification</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockPools.map((pool) => (
          <AnimatedCard
            key={pool.id}
            onClick={() => setSelectedPool(pool)}
            className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                  <Waves className="text-brand-blue" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{pool.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(pool.filterStatus)}`}>
                      {pool.filterStatus === 'active' ? 'Actif' : 
                       pool.filterStatus === 'maintenance' ? 'Maintenance' : 'Erreur'}
                    </span>
                    <span className="text-xs text-white/60">
                      <Filter size={12} className="inline mr-1" />
                      {pool.filterType}
                    </span>
                  </div>
                </div>
              </div>
              
              {pool.batches.length > 0 && (
                <div className="text-right">
                  <div className="text-sm text-white/60">Lot en cours</div>
                  <div className="text-white font-medium">{pool.batches[0].number}</div>
                  <div className="flex items-center gap-1 text-xs text-white/60 mt-1">
                    <Timer size={12} />
                    <span>Reste {pool.batches[0].remainingTime}h</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
                  <ThermometerSun size={14} />
                  <span>Température</span>
                </div>
                <div className="text-white font-medium">{pool.temperature}°C</div>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
                  <Activity size={14} />
                  <span>Qualité eau</span>
                </div>
                <div className={`text-white font-medium ${
                  pool.waterQuality >= 95 ? 'text-emerald-400' :
                  pool.waterQuality >= 90 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {pool.waterQuality}%
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
                  <Shell size={14} />
                  <span>Occupation</span>
                </div>
                <div className="text-white font-medium">
                  {Math.round((pool.currentOccupancy / pool.capacity) * 100)}%
                </div>
                <div className="text-xs text-white/60">
                  {pool.currentOccupancy}/{pool.capacity}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60 mb-1">Maintenance</div>
                <div className="text-white font-medium">
                  {new Date(pool.nextMaintenance).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {selectedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                  <Waves className="text-brand-blue" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedPool.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(selectedPool.filterStatus)}`}>
                      {selectedPool.filterStatus === 'active' ? 'Actif' : 
                       selectedPool.filterStatus === 'maintenance' ? 'Maintenance' : 'Erreur'}
                    </span>
                    <span className="text-xs text-white/60">
                      <Filter size={12} className="inline mr-1" />
                      {selectedPool.filterType}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <Edit2 size={20} className="mr-2" />
                  Modifier
                </button>
                <button
                  onClick={() => setSelectedPool(null)}
                  className="p-2 hover:bg-white/5 rounded-lg"
                >
                  <X className="text-white/60" size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                    <ThermometerSun size={16} />
                    <span>Température</span>
                  </div>
                  <div className="text-2xl font-medium text-white">{selectedPool.temperature}°C</div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                    <Activity size={16} />
                    <span>Qualité eau</span>
                  </div>
                  <div className={`text-2xl font-medium ${
                    selectedPool.waterQuality >= 95 ? 'text-emerald-400' :
                    selectedPool.waterQuality >= 90 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {selectedPool.waterQuality}%
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Lots en cours</h3>
                <div className="space-y-3">
                  {selectedPool.batches.length === 0 ? (
                    <div className="text-center py-4 text-white/60">
                      Aucun lot en cours dans ce bassin
                    </div>
                  ) : (
                    selectedPool.batches.map((batch) => (
                      <div key={batch.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{batch.number}</div>
                          <div className="text-sm text-white/60">{batch.quantity} unités</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white">{batch.remainingTime}h</div>
                          <div className="text-sm text-white/60">restantes</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Maintenance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-white/60 mb-1">Dernière maintenance</div>
                    <div className="text-white font-medium">
                      {new Date(selectedPool.lastMaintenance).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Prochaine maintenance</div>
                    <div className="text-white font-medium">
                      {new Date(selectedPool.nextMaintenance).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editMode && editedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Modifier {editedPool.name}</h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="text-white/60" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Nom du bassin</label>
                <Input
                  type="text"
                  value={editedPool.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Type de filtre</label>
                <Input
                  type="text"
                  value={editedPool.filterType}
                  onChange={(e) => handleInputChange('filterType', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Statut du filtre</label>
                <select
                  value={editedPool.filterStatus}
                  onChange={(e) => handleInputChange('filterStatus', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="active">Actif</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="error">Erreur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Capacité</label>
                <Input
                  type="number"
                  value={editedPool.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Température (°C)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={editedPool.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Prochaine maintenance</label>
                <Input
                  type="date"
                  value={editedPool.nextMaintenance}
                  onChange={(e) => handleInputChange('nextMaintenance', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 rounded-lg text-white transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}