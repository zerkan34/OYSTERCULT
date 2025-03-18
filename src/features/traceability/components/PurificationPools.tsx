import React, { useState } from 'react';
import { 
  Waves, 
  ThermometerSun, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Input } from '@/components/ui/Input';

interface Pool {
  id: string;
  name: string;
  filterType: string;
  filterStatus: 'active' | 'inactive' | 'maintenance';
  temperature: number;
  salinity: number;
  lastMaintenance: string;
  nextMaintenance: string;
  currentBatch?: {
    id: string;
    name: string;
    quantity: string;
    startDate: string;
    endDate: string;
  };
}

export function PurificationPools() {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPool, setEditedPool] = useState<Pool | null>(null);

  const [pools, setPools] = useState<Pool[]>([
    {
      id: '1',
      name: 'Bassin A1',
      filterType: 'UV + Mécanique',
      filterStatus: 'active',
      temperature: 12.5,
      salinity: 35.2,
      lastMaintenance: '2025-03-01',
      nextMaintenance: '2025-03-15',
      currentBatch: {
        id: 'B1',
        name: 'Huîtres Fines de Claire',
        quantity: '200kg',
        startDate: '2025-03-10',
        endDate: '2025-03-13'
      }
    },
    {
      id: '2',
      name: 'Bassin A2',
      filterType: 'UV + Mécanique',
      filterStatus: 'active',
      temperature: 12.8,
      salinity: 34.9,
      lastMaintenance: '2025-03-05',
      nextMaintenance: '2025-03-19',
      currentBatch: {
        id: 'B2',
        name: 'Huîtres Spéciales',
        quantity: '150kg',
        startDate: '2025-03-11',
        endDate: '2025-03-14'
      }
    },
    {
      id: '3',
      name: 'Bassin B1',
      filterType: 'UV + Mécanique',
      filterStatus: 'maintenance',
      temperature: 0,
      salinity: 0,
      lastMaintenance: '2025-03-12',
      nextMaintenance: '2025-03-13',
    }
  ]);

  const handleEdit = (pool: Pool) => {
    setEditedPool({ ...pool });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editedPool) {
      const updatedPools = pools.map(pool => 
        pool.id === editedPool.id ? editedPool : pool
      );
      setPools(updatedPools);
      setIsEditModalOpen(false);
      setEditedPool(null);
    }
  };

  const getStatusIcon = (status: Pool['filterStatus']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: Pool['filterStatus']) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'maintenance':
        return 'En maintenance';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => (
          <AnimatedCard
            key={pool.id}
            onClick={() => setSelectedPool(pool)}
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{pool.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(pool.filterStatus)}
                  <span className="text-sm text-white/60">
                    {getStatusText(pool.filterStatus)}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(pool);
                }}
                className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white/80 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-2 rounded-md border border-white/10">
                  <div className="text-xs text-teal-400 mb-1">Température</div>
                  <div className="font-medium text-white">
                    {pool.temperature}°C
                  </div>
                </div>
                <div className="bg-white/5 p-2 rounded-md border border-white/10">
                  <div className="text-xs text-teal-400 mb-1">Salinité</div>
                  <div className="font-medium text-white">
                    {pool.salinity}g/L
                  </div>
                </div>
              </div>

              {pool.currentBatch && (
                <div className="bg-white/5 p-2 rounded-md border border-white/10">
                  <div className="text-xs text-white/60 mb-1">Lot en cours</div>
                  <div className="font-medium text-white">{pool.currentBatch.name}</div>
                  <div className="text-sm text-white/60 mt-1">
                    {pool.currentBatch.quantity} • {new Date(pool.currentBatch.endDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              )}
            </div>
          </AnimatedCard>
        ))}
      </div>

      {isEditModalOpen && editedPool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-lg p-6 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Modifier le bassin</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Nom du bassin
                </label>
                <Input
                  value={editedPool.name}
                  onChange={(e) => setEditedPool({ ...editedPool, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Type de filtration
                </label>
                <Input
                  value={editedPool.filterType}
                  onChange={(e) => setEditedPool({ ...editedPool, filterType: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Statut
                </label>
                <select
                  value={editedPool.filterStatus}
                  onChange={(e) => setEditedPool({ ...editedPool, filterStatus: e.target.value as Pool['filterStatus'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="maintenance">En maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Température (°C)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={editedPool.temperature}
                  onChange={(e) => setEditedPool({ ...editedPool, temperature: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Salinité (g/L)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={editedPool.salinity}
                  onChange={(e) => setEditedPool({ ...editedPool, salinity: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Dernière maintenance
                </label>
                <Input
                  type="date"
                  value={editedPool.lastMaintenance}
                  onChange={(e) => setEditedPool({ ...editedPool, lastMaintenance: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Prochaine maintenance
                </label>
                <Input
                  type="date"
                  value={editedPool.nextMaintenance}
                  onChange={(e) => setEditedPool({ ...editedPool, nextMaintenance: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-md"
              >
                <Save className="w-4 h-4 inline-block mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}