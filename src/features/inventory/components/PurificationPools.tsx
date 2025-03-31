import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
  X,
  Shell,
  Brush,
  ArrowUpRight,
  AlertCircle,
  ClipboardCheck,
  Check
} from 'lucide-react';
import { PoolMaintenanceModal } from './PoolMaintenanceModal';
import { BatchExitModal } from './BatchExitModal';
import { BatchEntryModal } from './BatchEntryModal';

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
  uvLampHours: number;
  lastUVChange: string;
  batches: {
    id: string;
    number: string;
    quantity: number;
    entryTime: string;
    remainingTime: number;
    type: 'plates' | 'creuses' | 'speciales';
  }[];
}

interface PoolDetailProps {
  pool: Pool;
  onClose: () => void;
}

const mockPools: Pool[] = [
  {
    id: '1',
    name: 'Bassin A1',
    capacity: 3000,
    currentOccupancy: 0,
    filterType: 'UV + Ozone',
    filterStatus: 'active',
    waterQuality: 98,
    lastMaintenance: '2025-02-15',
    temperature: 12.5,
    uvLampHours: 7500,
    lastUVChange: '2024-08-15',
    batches: [
      {
        id: 'b1',
        number: 'LOT-2025-001',
        quantity: 500,
        entryTime: '2025-02-18T08:00:00',
        remainingTime: 12,
        type: 'creuses'
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
    uvLampHours: 8200,
    lastUVChange: '2024-07-01',
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

const mockBatches = [
  {
    id: '1',
    number: 'LOT-2025-001',
    quantity: 250,
    entryTime: '2025-03-30T10:00:00',
    type: 'Plates'
  },
  {
    id: '2',
    number: 'LOT-2025-002',
    quantity: 300,
    entryTime: '2025-03-30T14:30:00',
    type: 'Creuses N°2'
  }
];

function PoolDetail({ pool, onClose }: PoolDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'config'>('info');
  const modalRef = useClickOutside(onClose);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'maintenance' | 'exit' | 'newBatch'>('maintenance');
  const [maintenanceType, setMaintenanceType] = useState<'cleaning' | 'uv_lamp'>('cleaning');
  const [selectedBatch, setSelectedBatch] = useState<typeof pool.batches[0] | null>(null);
  const [newLotNumber, setNewLotNumber] = useState('');
  const [newLotQuantity, setNewLotQuantity] = useState('');
  const lastBatchNumber = "LOT-2025-003"; // À remplacer par la vraie logique
  const [cleaningNotes, setCleaningNotes] = useState('');
  const [isBasinEmptyConfirmed, setIsBasinEmptyConfirmed] = useState(false);
  const [isSystemsOffConfirmed, setIsSystemsOffConfirmed] = useState(false);
  const [batches, setBatches] = useState(mockBatches);

  const handleMaintenanceConfirm = (type: 'cleaning' | 'uv_lamp', notes?: string) => {
    if (type === 'cleaning' && (!isBasinEmptyConfirmed || !isSystemsOffConfirmed)) {
      return;
    }

    // Logique de confirmation de maintenance
    console.log(`Maintenance ${type} confirmée`, { notes });
    
    // Réinitialiser les états
    setShowModal(false);
    setCleaningNotes('');
    setIsBasinEmptyConfirmed(false);
    setIsSystemsOffConfirmed(false);
  };

  const handleBatchExit = (data: { quantity: number; destination: string; notes?: string }) => {
    console.log('Sortie du lot:', { batch: selectedBatch, ...data });
    setShowModal(false);
    setSelectedBatch(null);
  };

  const handleNewBatchConfirm = (data: { number: string; quantity: number; type: 'plates' | 'creuses' | 'speciales' }) => {
    console.log('Nouveau lot ajouté:', data);
    
    // Ajouter le nouveau lot à la liste des lots
    const newBatch = {
      id: `batch-${Date.now()}`,
      number: data.number,
      quantity: data.quantity,
      type: data.type,
      entryTime: new Date().toISOString(),
      remainingTime: 72 // 72 heures par défaut
    };
    
    setBatches([...batches, newBatch]);
    setShowModal(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-start justify-center z-50 p-8 pt-[15vh]"
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[rgba(15,23,42,0.45)] backdrop-blur-[16px] p-8 rounded-xl w-[1200px] h-[calc(100vh-4rem)] border border-white/10 modal-style flex flex-col"
          onClick={(e) => e.stopPropagation()}
          ref={modalRef}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{pool.name}</h2>
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
                    ? 'bg-brand-primary text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Informations
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'history'
                    ? 'bg-brand-primary text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Historique
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'config'
                    ? 'bg-brand-primary text-white'
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
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/80 mb-2">
                        <Shell size={20} className="mr-2 text-brand-primary" />
                        Occupation
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          0%
                        </div>
                        <div className="text-sm text-white/60">
                          0 Kg/3000 Kg
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/80 mb-2">
                        <Droplets size={20} className="mr-2 text-brand-primary" />
                        Filtration
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          pool.waterQuality >= 95 ? 'text-green-400' :
                          pool.waterQuality >= 90 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {pool.waterQuality}%
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/80 mb-2">
                        <ThermometerSun size={20} className="mr-2 text-brand-primary" />
                        Température
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          12.5°C
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white">Lots en cours</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowModal(true);
                            setModalType('newBatch');
                            setNewLotNumber('');
                            setNewLotQuantity('');
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all duration-300"
                        >
                          <Plus size={16} />
                          Nouveau lot
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {batches.map((batch) => (
                        <div
                          key={batch.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-white">{batch.number}</div>
                            <div className="text-sm text-white/60">
                              {batch.quantity}kg - {batch.type}
                            </div>
                            <div className="text-sm text-white/60">
                              Entrée le {format(new Date(batch.entryTime), 'dd/MM/yyyy HH:mm', { locale: fr })}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedBatch(batch);
                              setShowModal(true);
                              setModalType('exit');
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300"
                            title="Sortir le lot"
                          >
                            <ArrowUpRight size={16} aria-hidden="true" />
                            <span>Sortir</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="relative h-24 bg-white/5 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex">
                          <div className="h-full relative" style={{ width: '16.7%' }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0d9488]/75 to-[#0d9488]/90 transition-all duration-500"></div>
                            <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 z-20">
                              <div className="flex flex-col items-center">
                                <div className="bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-brand-burgundy/30 mb-1 shadow-lg">
                                  <span className="text-white text-xs font-semibold">N°3</span>
                                </div>
                                <div className="text-xs text-white font-medium">500kg</div>
                              </div>
                            </div>
                          </div>
                          <div className="h-full relative" style={{ width: '10%' }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/75 to-blue-600/90 transition-all duration-500" style={{ boxShadow: 'rgba(37, 99, 235, 0.2) 0px 0px 20px' }}></div>
                            <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 z-20">
                              <div className="flex flex-col items-center">
                                <div className="bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-blue-500/30 mb-1 shadow-lg">
                                  <span className="text-white text-xs font-semibold">N°2</span>
                                </div>
                                <div className="text-xs text-white font-medium">300kg</div>
                              </div>
                            </div>
                          </div>
                          <div className="h-full relative flex-1">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a]/75 to-[#1e3a8a]/90 transition-all duration-500"></div>
                          </div>
                        </div>
                        <div className="absolute left-[26.7%] inset-y-0 flex items-center pointer-events-none z-20">
                          <div className="h-16 w-[2px] bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center text-white/80 mb-2">
                      <Zap size={20} className="mr-2 text-brand-primary" />
                      Lampe UV
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-lg font-medium ${
                          pool.uvLampHours >= 8000 ? 'text-red-400' :
                          pool.uvLampHours >= 7000 ? 'text-yellow-400' :
                          'text-white'
                        }`}>
                          7500 heures d'utilisation
                        </div>
                        <div className="text-sm text-white/60">
                          Dernier changement: {format(new Date(pool.lastUVChange), 'PP', { locale: fr })}
                        </div>
                        {pool.uvLampHours >= 7000 && (
                          <div className="flex items-center mt-2">
                            <AlertTriangle size={20} className="mr-2 text-yellow-400" />
                            <span className="text-yellow-400">
                              Changement recommandé
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setModalType('maintenance');
                          setMaintenanceType('uv_lamp');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all duration-300"
                      >
                        <Zap size={20} />
                        Changer la lampe
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center text-white/80 mb-2">
                      <Brush size={20} className="mr-2 text-brand-primary" />
                      Nettoyage du bassin
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium text-white">
                          Dernier nettoyage
                        </div>
                        <div className="text-sm text-white/60">
                          {format(new Date(pool.lastMaintenance), 'PP', { locale: fr })}
                        </div>
                        <div className="text-sm text-white/60 mt-2">
                          <AlertCircle size={16} className="inline-block mr-1 text-cyan-400" />
                          Le bassin doit être vidé avant le nettoyage
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setModalType('maintenance');
                          setMaintenanceType('cleaning');
                          setCleaningNotes('');
                          setIsBasinEmptyConfirmed(false);
                          setIsSystemsOffConfirmed(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all duration-300"
                        disabled={pool.currentOccupancy > 0}
                        aria-disabled={pool.currentOccupancy > 0}
                        title={pool.currentOccupancy > 0 ? "Le bassin doit être vide pour le nettoyage" : "Nettoyer le bassin"}
                      >
                        <Brush size={20} aria-hidden="true" />
                        Nettoyer
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
                          <span>Dernier nettoyage: {format(new Date(pool.lastMaintenance), 'PP', { locale: fr })}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center text-white">
                          <Filter size={16} className="mr-2" />
                          <span>Changement filtre: {format(new Date(pool.lastMaintenance), 'PP', { locale: fr })}</span>
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
                        <select
                          className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
                        >
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
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Fermer
              </button>
              {activeTab === 'config' && (
                <button
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  Enregistrer
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {showModal && modalType === 'maintenance' && (
        <PoolMaintenanceModal
          isOpen={showModal && modalType === 'maintenance'}
          onClose={() => setShowModal(false)}
          onConfirm={handleMaintenanceConfirm}
          maintenanceType={maintenanceType}
          lastMaintenance={pool.lastMaintenance}
          uvLampHours={pool.uvLampHours}
        />
      )}

      {showModal && modalType === 'exit' && selectedBatch && (
        <BatchExitModal
          isOpen={showModal && modalType === 'exit'}
          onClose={() => setShowModal(false)}
          onConfirm={handleBatchExit}
          batch={selectedBatch}
        />
      )}

      {showModal && modalType === 'newBatch' && (
        <BatchEntryModal
          isOpen={showModal && modalType === 'newBatch'}
          onClose={() => setShowModal(false)}
          onConfirm={handleNewBatchConfirm}
          pool={pool}
        />
      )}
    </>
  );
}

export function PurificationPools() {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [hoveredPool, setHoveredPool] = useState<string | null>(null);
  const [pools, setPools] = useState(mockPools);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'maintenance' | 'exit' | 'newBatch'>('maintenance');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [newBatchData, setNewBatchData] = useState<any>(null);
  const lastBatchNumber = "LOT-2025-003"; // À remplacer par la vraie logique
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleNewBatchConfirm = (data: { number: string; quantity: number; type: 'plates' | 'creuses' | 'speciales' }) => {
    console.log('Nouveau lot ajouté:', data);
    
    // Ajouter le nouveau lot à la liste des lots
    const newBatch = {
      id: `batch-${Date.now()}`,
      number: data.number,
      quantity: data.quantity,
      type: data.type,
      entryTime: new Date().toISOString(),
      remainingTime: 72 // 72 heures par défaut
    };
    
    setNewBatchData(newBatch);
    setShowModal(true);
    setModalType('newBatch');
  };

  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
    setNewBatchData(null);
  };

  const handleOpenAddBatchModal = (e: React.MouseEvent, pool: Pool) => {
    e.stopPropagation();
    setSelectedPool(pool);
    setNewBatchData({
      number: `LOT-${format(new Date(), 'yyyy')}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
      quantity: 0,
      type: 'plates',
      entryTime: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')
    });
    setShowModal(true);
    setModalType('newBatch');
  };

  const handleAddBatch = () => {
    if (selectedPool && newBatchData.quantity > 0) {
      console.log(`Ajout d'un lot au bassin ${selectedPool.name}:`, newBatchData);
      
      setShowModal(false);
      setSelectedPool(null);
    }
  };

  const handleMaintenanceConfirm = (type: 'cleaning' | 'uv_lamp', notes?: string) => {
    console.log(`Maintenance ${type} confirmée pour le bassin ${selectedPool?.name}`, { notes });
    setShowModal(false);
  };

  const handleBatchExit = (data: { quantity: number; destination: string; notes?: string }) => {
    console.log('Sortie du lot:', { batch: selectedBatch, ...data });
    setShowModal(false);
    setSelectedBatch(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {pools.map((pool) => (
          <div
            key={pool.id}
            onClick={() => setSelectedPool(pool)}
            className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] p-6 rounded-lg cursor-pointer hover:from-[rgba(15,23,42,0.4)] hover:to-[rgba(20,100,100,0.4)] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-white">{pool.name}</h3>
                <div className="flex items-center mt-1 text-sm text-white/60">
                  <Filter size={16} className="mr-1" />
                  {pool.filterType}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-xs ${
                  pool.filterStatus === 'active' ? 'bg-green-500/20 text-green-300' :
                  pool.filterStatus === 'maintenance' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {pool.filterStatus === 'active' ? 'Actif' :
                   pool.filterStatus === 'maintenance' ? 'Maintenance' : 'Erreur'}
                </div>
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
                <div key={batch.id} className="bg-white/5 rounded-lg p-4 mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-white">{batch.number}</div>
                      <div className="text-sm text-white/60">
                        {batch.quantity} huîtres
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBatch(batch);
                        setShowModal(true);
                        setModalType('exit');
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    >
                      <ArrowUpRight size={16} />
                      Sortir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="relative h-24 bg-white/5 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="h-full relative" style={{ width: '16.7%' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d9488]/75 to-[#0d9488]/90 transition-all duration-500"></div>
                    <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 z-20">
                      <div className="flex flex-col items-center">
                        <div className="bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-brand-burgundy/30 mb-1 shadow-lg">
                          <span className="text-white text-xs font-semibold">N°3</span>
                        </div>
                        <div className="text-xs text-white font-medium">500kg</div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full relative" style={{ width: '10%' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/75 to-blue-600/90 transition-all duration-500" style={{ boxShadow: 'rgba(37, 99, 235, 0.2) 0px 0px 20px' }}></div>
                    <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 z-20">
                      <div className="flex flex-col items-center">
                        <div className="bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-blue-500/30 mb-1 shadow-lg">
                          <span className="text-white text-xs font-semibold">N°2</span>
                        </div>
                        <div className="text-xs text-white font-medium">300kg</div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full relative flex-1">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a]/75 to-[#1e3a8a]/90 transition-all duration-500"></div>
                  </div>
                </div>
                <div className="absolute left-[26.7%] inset-y-0 flex items-center pointer-events-none z-20">
                  <div className="h-16 w-[2px] bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)] rounded-full"></div>
                </div>
              </div>
            </div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredPool === pool.id ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPool && (
          <PoolDetail 
            pool={selectedPool} 
            onClose={() => setSelectedPool(null)} 
          />
        )}
      </AnimatePresence>

      {showModal && modalType === 'newBatch' && (
        <BatchEntryModal
          isOpen={showModal && modalType === 'newBatch'}
          onClose={() => setShowModal(false)}
          onConfirm={handleNewBatchConfirm}
          pool={selectedPool}
        />
      )}

      {showModal && modalType === 'maintenance' && (
        <PoolMaintenanceModal
          isOpen={showModal && modalType === 'maintenance'}
          onClose={() => setShowModal(false)}
          onConfirm={handleMaintenanceConfirm}
          maintenanceType={'cleaning'}
          lastMaintenance={selectedPool?.lastMaintenance}
          uvLampHours={selectedPool?.uvLampHours}
        />
      )}

      {showModal && modalType === 'exit' && selectedBatch && (
        <BatchExitModal
          isOpen={showModal && modalType === 'exit'}
          onClose={() => setShowModal(false)}
          onConfirm={handleBatchExit}
          batch={selectedBatch}
        />
      )}

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={handleConfirmationClose}>
          <div className="bg-[rgba(15,23,42,0.45)] backdrop-blur-[16px] p-6 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Lot ajouté avec succès</h2>
              <button onClick={handleConfirmationClose} className="text-white/60 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white">Les stocks ont été mis à jour avec succès.</p>
                    <p className="text-sm text-white/60 mt-1">
                      Lot {newBatchData.number} ajouté avec {newBatchData.quantity} huîtres
                    </p>
                    <p className="text-sm text-white/60 mt-1">
                      Cette opération a été enregistrée dans l'historique de traçabilité
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmationClose}
                className="w-full px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}