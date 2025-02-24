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
  X,
  Shell
} from 'lucide-react';

interface Pool {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  filterType: string;
  filterStatus: 'active' | 'maintenance' | 'error';
  waterQuality: number;
  lastMaintenance: string;
  temperature: number;
  batches: {
    id: string;
    number: string;
    quantity: number;
    entryTime: string;
    remainingTime: number;
    type: 'plates' | 'creuses' | 'speciales';
  }[];
}

const mockPools: Pool[] = [
  {
    id: '1',
    name: 'Bassin A1',
    capacity: 1000,
    currentOccupancy: 800,
    filterType: 'UV + Ozone',
    filterStatus: 'active',
    waterQuality: 98,
    lastMaintenance: '2025-02-15',
    temperature: 12.5,
    batches: [
      {
        id: 'b1',
        number: 'LOT-2025-001',
        quantity: 500,
        entryTime: '2025-02-18T08:00:00',
        remainingTime: 12,
        type: 'plates'
      },
      {
        id: 'b2',
        number: 'LOT-2025-002',
        quantity: 300,
        entryTime: '2025-02-19T10:00:00',
        remainingTime: 24,
        type: 'creuses'
      }
    ]
  },
  {
    id: '2',
    name: 'Bassin A2',
    capacity: 1000,
    currentOccupancy: 600,
    filterType: 'UV',
    filterStatus: 'maintenance',
    waterQuality: 92,
    lastMaintenance: '2025-02-10',
    temperature: 13.0,
    batches: [
      {
        id: 'b3',
        number: 'LOT-2025-003',
        quantity: 600,
        entryTime: '2025-02-17T14:00:00',
        remainingTime: 4,
        type: 'speciales'
      }
    ]
  }
];

interface PoolDetailProps {
  pool: Pool;
  onClose: () => void;
}

function PoolDetail({ pool, onClose }: PoolDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'config'>('info');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{pool.name}</h2>
            <p className="text-white/60">Système de filtration : {pool.filterType}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'info'
                ? 'bg-brand-burgundy text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-brand-burgundy text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Historique
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'config'
                ? 'bg-brand-burgundy text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Configuration
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Métriques principales */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center text-white/80 mb-2">
                    <ThermometerSun size={20} className="mr-2 text-brand-burgundy" />
                    Température
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {pool.temperature}°C
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center text-white/80 mb-2">
                    <Droplets size={20} className="mr-2 text-brand-burgundy" />
                    Qualité eau
                  </div>
                  <div className={`text-2xl font-bold ${
                    pool.waterQuality >= 95 ? 'text-green-400' :
                    pool.waterQuality >= 90 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {pool.waterQuality}%
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center text-white/80 mb-2">
                    <Shell size={20} className="mr-2 text-brand-burgundy" />
                    Occupation
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round((pool.currentOccupancy / pool.capacity) * 100)}%
                  </div>
                  <div className="text-sm text-white/60">
                    {pool.currentOccupancy}/{pool.capacity}
                  </div>
                </div>
              </div>

              {/* Liste des lots */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Lots en purification</h3>
                <div className="space-y-3">
                  {pool.batches.map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{batch.number}</div>
                        <div className="text-sm text-white/60">
                          {batch.quantity} unités - {batch.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">{batch.remainingTime}h</div>
                        <div className="text-sm text-white/60">restantes</div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="w-full mt-3 px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
                  >
                    <Plus size={20} className="inline-block mr-2" />
                    Ajouter un lot
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Historique des opérations</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center text-white">
                      <Clock size={16} className="mr-2" />
                      <span>Dernier nettoyage: {pool.lastMaintenance}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center text-white">
                      <Filter size={16} className="mr-2" />
                      <span>Changement filtre: 2025-02-01</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Configuration du bassin</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Type de filtration
                    </label>
                    <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option value="uv">UV</option>
                      <option value="uv_ozone">UV + Ozone</option>
                      <option value="mechanical">Mécanique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Durée de purification par défaut
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="Heures"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Seuils d'alerte
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Qualité eau minimum
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          placeholder="%"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Température maximum
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          placeholder="°C"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Fermer
          </button>
          {activeTab === 'config' && (
            <button
              className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
            >
              Enregistrer
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PurificationPools() {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [hoveredPool, setHoveredPool] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {mockPools.map((pool) => (
          <motion.div
            key={pool.id}
            className={`bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-200 cursor-pointer relative overflow-hidden ${
              hoveredPool === pool.id ? 'ring-2 ring-brand-burgundy shadow-neon' : ''
            }`}
            onClick={() => setSelectedPool(pool)}
            onHoverStart={() => setHoveredPool(pool.id)}
            onHoverEnd={() => setHoveredPool(null)}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-white">{pool.name}</h3>
                <div className="flex items-center mt-1 text-sm text-white/60">
                  <Filter size={16} className="mr-1" />
                  {pool.filterType}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs ${
                pool.filterStatus === 'active' ? 'bg-green-500/20 text-green-300' :
                pool.filterStatus === 'maintenance' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {pool.filterStatus === 'active' ? 'Actif' :
                 pool.filterStatus === 'maintenance' ? 'Maintenance' : 'Erreur'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60">Occupation</div>
                <div className="text-xl font-bold text-white">
                  {Math.round((pool.currentOccupancy / pool.capacity) * 100)}%
                </div>
                <div className="text-sm text-white/60">
                  {pool.currentOccupancy}/{pool.capacity}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60">Qualité eau</div>
                <div className={`text-xl font-bold ${
                  pool.waterQuality >= 95 ? 'text-green-400' :
                  pool.waterQuality >= 90 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {pool.waterQuality}%
                </div>
                <div className="text-sm text-white/60">{pool.temperature}°C</div>
              </div>
            </div>

            <div className="space-y-3">
              {pool.batches.map((batch) => (
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
              ))}
            </div>

            {/* Effet de surbrillance au survol */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/5 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredPool === pool.id ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Modal de détail du bassin */}
      <AnimatePresence>
        {selectedPool && (
          <PoolDetail 
            pool={selectedPool} 
            onClose={() => setSelectedPool(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}