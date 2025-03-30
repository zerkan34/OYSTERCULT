import React from 'react';
import { motion } from 'framer-motion';
import { ModernCardBase } from '@/components/ui/ModernCardBase';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter, ArrowRight, Loader2, CheckCircle2, CircleDot, X, Clock, Calendar, User, MessageSquare, Tag } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useStore } from '@/lib/store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogPortal } from "@/components/ui/dialog";

interface Batch {
  id: string;
  name: string;
  status: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  date: Date;
  trempeSquareId?: number;
}

interface TrempeConfig {
  squares: number;
  rows: number;
  columns: number;
}

interface TrempeSquare {
  id: number;
  status: 'disponible' | 'en_trempe' | 'pret';
  batches: Batch[];
  number: number;
  remainingRopes: number;
  totalRopes: number;
  tableName: string;
  description: string;
  startDate: string;
  harvestDate: string;
  mortalityRate: number;
  currentSize: 'T15' | 'N°5' | 'N°4' | 'N°3' | 'N°2' | 'N°1';
  targetSize: 'T15' | 'N°5' | 'N°4' | 'N°3' | 'N°2' | 'N°1';
  occupancy: {
    current: number;
    total: number;
  };
}

// Configuration de base
const config: TrempeConfig = {
  squares: 2,
  rows: 1,
  columns: 2
};

// Données de test
const mockSquares: TrempeSquare[] = [
  { 
    id: 1, 
    status: 'en_trempe', 
    batches: [], 
    number: 1, 
    remainingRopes: 85, 
    totalRopes: 100, 
    tableName: 'Table Nord #128',
    description: 'Huîtres Fines de Claire',
    startDate: '2024-10-15',
    harvestDate: '2025-01-15',
    mortalityRate: 12,
    currentSize: 'N°4',
    targetSize: 'N°2',
    occupancy: {
      current: 9,
      total: 10
    }
  },
  { 
    id: 2, 
    status: 'pret', 
    batches: [], 
    number: 2, 
    remainingRopes: 0, 
    totalRopes: 100, 
    tableName: 'Table Nord #129',
    description: 'Huîtres Fines de Claire',
    startDate: '2024-09-15',
    harvestDate: '2025-01-01',
    mortalityRate: 8,
    currentSize: 'N°3',
    targetSize: 'N°2',
    occupancy: {
      current: 10,
      total: 10
    }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    transform: 'translateY(20px)'
  },
  visible: { 
    opacity: 1,
    transform: 'translateY(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.25, 0, 1]
    }
  }
};

const statusVariants = {
  initial: { scale: 1 },
  highlight: { 
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      times: [0, 0.5, 1],
      ease: [0.25, 0.25, 0, 1]
    }
  }
};

const cardVariants = {
  initial: { 
    transform: 'scale(1)',
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  highlight: { 
    transform: ['scale(1)', 'scale(1.02)', 'scale(1)'],
    borderColor: ['rgba(255, 255, 255, 0.1)', 'rgba(34, 197, 94, 0.3)', 'rgba(255, 255, 255, 0.1)'],
    transition: {
      duration: 0.8,
      times: [0, 0.5, 1],
      ease: [0.25, 0.25, 0, 1]
    }
  }
};

const getProgressVariants = (trempe: TrempeSquare) => ({
  initial: { 
    scaleX: 0,
    filter: 'brightness(1)'
  },
  animate: { 
    scaleX: trempe.remainingRopes / trempe.totalRopes,
    filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
    transition: {
      duration: 0.6,
      filter: {
        times: [0, 0.5, 1],
        duration: 0.8
      },
      ease: [0.25, 0.25, 0, 1]
    }
  }
});

const modalVariants = {
  hidden: { 
    opacity: 0,
    transform: 'scale(0.95) translateY(10px)'
  },
  visible: { 
    opacity: 1,
    transform: 'scale(1) translateY(0)',
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
      transform: {
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    }
  },
  exit: { 
    opacity: 0,
    transform: 'scale(0.95) translateY(10px)',
    transition: { 
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
      transform: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  }
};

const modalItemVariants = {
  hidden: { 
    opacity: 0,
    transform: 'translateY(10px)'
  },
  visible: { 
    opacity: 1,
    transform: 'translateY(0)',
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.25, 0, 1],
      transform: {
        type: "spring",
        damping: 15,
        stiffness: 200
      }
    }
  }
};

export const TrempeView: React.FC = () => {
  const [hoveredSquare, setHoveredSquare] = React.useState<TrempeSquare | null>(null);
  const [selectedSquare, setSelectedSquare] = React.useState<TrempeSquare | null>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [modalHovered, setModalHovered] = React.useState(false);
  const [showFixedModal, setShowFixedModal] = React.useState(true);
  const [editMode, setEditMode] = React.useState(false);
  const [editedSquare, setEditedSquare] = React.useState<TrempeSquare | null>(null);
  const [trempeSquares, setTrempeSquares] = React.useState<TrempeSquare[]>(mockSquares);
  const [showAddRopeModal, setShowAddRopeModal] = React.useState(false);
  const [showNewTableModal, setShowNewTableModal] = React.useState(false);
  const [newTableData, setNewTableData] = React.useState({
    tableName: '',
    description: 'Huîtres Fines de Claire',
    startDate: new Date().toISOString().split('T')[0],
    harvestDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currentSize: 'T15' as const,
    targetSize: 'N°2' as const
  });
  const [showHarvestModal, setShowHarvestModal] = React.useState(false);
  const [ropesToHarvest, setRopesToHarvest] = React.useState(1);
  const [selectedHarvestBatch, setSelectedHarvestBatch] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { batches } = useStore();

  React.useEffect(() => {
    const batchesBySquare: Record<number, Batch[]> = {};
    
    batches.forEach((batch: any) => {
      if (batch.trempeSquareId) {
        if (!batchesBySquare[batch.trempeSquareId]) {
          batchesBySquare[batch.trempeSquareId] = [];
        }
        const trempeBatch: Batch = {
          id: batch.id,
          name: batch.batchNumber || `Lot ${batch.id}`,
          status: batch.status,
          quantity: batch.quantity,
          createdAt: batch.createdAt,
          updatedAt: batch.updatedAt,
          date: new Date(batch.startDate || Date.now()),
          trempeSquareId: batch.trempeSquareId
        };
        batchesBySquare[batch.trempeSquareId].push(trempeBatch);
      }
    });

    setTrempeSquares((squares) =>
      squares.map((square) => ({
        ...square,
        batches: batchesBySquare[square.id] || []
      }))
    );
  }, [batches]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <ModernCardBase>
        <div className="bg-brand-dark/30 rounded-xl p-6 border border-white/10 backdrop-blur-xl">
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Trempes</h2>
              <p className="text-sm text-white/60 mt-1">Gérez vos trempes en cours</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="primary"
                className="group bg-brand-accent hover:bg-brand-accent/90 text-white px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors transform hover:-translate-y-px backdrop-blur-xl flex items-center gap-2"
                style={{ willChange: 'transform' }}
              >
                <Plus className="w-4 h-4 transform transition-transform group-hover:scale-110" />
                <span>Nouvelle trempe</span>
              </Button>
              <Button 
                variant="outline"
                className="group bg-brand-darker/30 hover:bg-brand-darker/50 text-white px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors transform hover:-translate-y-px backdrop-blur-xl flex items-center gap-2"
                style={{ willChange: 'transform' }}
                onClick={() => setShowNewTableModal(true)}
              >
                <Plus className="w-4 h-4 transform transition-transform group-hover:scale-110" />
                <span>Nouvelle table</span>
              </Button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Rechercher une trempe..."
                className="w-full bg-brand-darker/30 border border-white/10 hover:border-white/20 rounded-lg pl-10 pr-4 py-2 text-white backdrop-blur-xl transition-colors"
              />
            </div>
            <Button 
              variant="outline" 
              className="group px-4 py-2 rounded-lg text-white bg-brand-darker/30 hover:bg-brand-darker/50 border border-white/10 hover:border-white/20 transition-colors transform hover:-translate-y-px backdrop-blur-xl flex items-center gap-2"
              style={{ willChange: 'transform' }}
            >
              <Filter className="w-4 h-4 transform transition-transform group-hover:rotate-180" />
              <span>Filtres</span>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trempeSquares.map((trempe) => (
              <motion.div
                key={trempe.id}
                variants={itemVariants}
                initial={trempe.id === 1 ? "initial" : undefined}
                animate={trempe.id === 1 ? "highlight" : undefined}
                className="bg-brand-dark/30 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors backdrop-blur-md cursor-pointer"
                style={trempe.id === 1 ? { willChange: 'transform, border-color' } : undefined}
                onClick={() => {
                  setSelectedSquare(trempe);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <motion.h3 
                    initial="initial"
                    animate="highlight"
                    variants={statusVariants}
                    className="text-lg font-semibold text-white stat-title bg-brand-darker/30 px-3 py-1.5 rounded-lg backdrop-blur-xl border border-white/10 hover:border-white/20 transition-colors transform hover:-translate-y-px"
                    style={trempe.id === 1 ? { willChange: 'transform' } : undefined}
                  >
                    {trempe.tableName}
                  </motion.h3>
                  <motion.span 
                    initial="initial"
                    animate="highlight"
                    variants={statusVariants}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all duration-200 transform hover:-translate-y-px backdrop-blur-xl ${
                      trempe.status === 'en_trempe' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                      trempe.status === 'pret' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/20'
                    }`}
                    style={trempe.id === 1 ? { willChange: 'transform' } : undefined}
                  >
                    {trempe.status === 'en_trempe' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>En trempe</span>
                      </>
                    ) : trempe.status === 'pret' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Prêt</span>
                      </>
                    ) : (
                      <>
                        <CircleDot className="w-3.5 h-3.5" />
                        <span>Disponible</span>
                      </>
                    )}
                  </motion.span>
                </div>
                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <p>Lots actifs:</p>
                    <motion.span
                      key={trempe.batches.length}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
                      style={trempe.id === 1 ? { willChange: 'transform, opacity' } : undefined}
                      className={`px-2 py-0.5 rounded-md text-xs ${
                        trempe.batches.length > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {trempe.batches.length}
                    </motion.span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p>Cordes restantes: 
                        <motion.span
                          key={trempe.remainingRopes}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
                          className="ml-1"
                          style={trempe.id === 1 ? { willChange: 'transform, opacity' } : undefined}
                        >
                          {trempe.remainingRopes}
                        </motion.span>
                      </p>
                      <motion.span
                        key={trempe.remainingRopes}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
                        className="text-xs"
                        style={trempe.id === 1 ? { willChange: 'transform, opacity' } : undefined}
                      >
                        {Math.round((trempe.remainingRopes / trempe.totalRopes) * 100)}%
                      </motion.span>
                    </div>
                    <div className="w-full h-1.5 bg-brand-darker/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial="initial"
                        animate="animate"
                        variants={getProgressVariants(trempe)}
                        className="h-full rounded-full origin-left"
                        style={{ 
                          willChange: trempe.id === 1 ? 'transform, filter' : undefined,
                          backgroundColor: trempe.status === 'en_trempe' ? 'rgb(34 197 94 / 0.5)' :
                                         trempe.status === 'pret' ? 'rgb(59 130 246 / 0.5)' :
                                         'rgb(107 114 128 / 0.5)'
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Button 
                    variant="outline" 
                    className="group w-full px-4 py-2 rounded-lg text-white bg-brand-darker/30 hover:bg-brand-darker/50 border border-white/10 hover:border-white/20 transition-colors transform hover:-translate-y-px backdrop-blur-xl flex items-center justify-center gap-2"
                    style={{ willChange: 'transform' }}
                  >
                    <span>Voir les détails</span>
                    <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ModernCardBase>

      {/* Modales déplacées à l'intérieur de la div avec la classe border border-white/10 rounded-lg overflow-hidden */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogPortal>
            <DialogContent 
              className="bg-brand-darker/95 border-white/10 max-w-2xl w-full"
              style={{
                WebkitBackdropFilter: 'blur(16px)',
                backdropFilter: 'blur(16px)',
                willChange: 'transform'
              }}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative"
                style={{ willChange: 'transform, opacity' }}
              >
                <DialogHeader className="pb-4 border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-2xl font-bold text-white">
                        {selectedSquare?.tableName}
                      </DialogTitle>
                      <DialogDescription className="text-white/60 mt-1">
                        {selectedSquare?.description}
                      </DialogDescription>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-white/60 hover:text-white transition-colors"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </DialogHeader>

                <div className="py-4 space-y-6">
                  {/* Status et Informations */}
                  <motion.div variants={modalItemVariants} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                          selectedSquare?.status === 'en_trempe' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                          selectedSquare?.status === 'pret' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                          'bg-gray-500/20 text-gray-400 border border-gray-500/20'
                        }`}>
                          {selectedSquare?.status === 'en_trempe' ? (
                            <>
                              <Clock className="w-4 h-4" />
                              <span>Active</span>
                            </>
                          ) : selectedSquare?.status === 'pret' ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Prêt</span>
                            </>
                          ) : (
                            <>
                              <CircleDot className="w-4 h-4" />
                              <span>Disponible</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 border-b border-white/10">
                      <button className="px-4 py-2 text-white border-b-2 border-brand-accent">Informations</button>
                      <button className="px-4 py-2 text-white/60 hover:text-white">Historique</button>
                    </div>

                    {/* Occupation de la table */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">Occupation de la table</h3>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">Progression</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {selectedSquare?.occupancy.current}/{selectedSquare?.occupancy.total} unités
                          </span>
                          <span className="text-white/60">
                            ({Math.round((selectedSquare?.occupancy.current || 0) / (selectedSquare?.occupancy.total || 1) * 100)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-brand-darker/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ 
                            scaleX: selectedSquare ? selectedSquare.occupancy.current / selectedSquare.occupancy.total : 0,
                            backgroundColor: 'rgb(34 197 94 / 0.5)'
                          }}
                          transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
                          className="h-full rounded-full origin-left"
                          style={{ willChange: 'transform' }}
                        />
                      </div>
                    </div>

                    {/* Progression du calibre */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Progression du calibre</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-white/60 mb-1">Début</div>
                          <div className="px-3 py-2 rounded-lg bg-brand-darker/30 border border-white/10">
                            <span className="text-white font-medium">T15</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-white/60 mb-1">Objectif</div>
                          <div className="px-3 py-2 rounded-lg bg-brand-darker/30 border border-white/10">
                            <span className="text-white font-medium">{selectedSquare?.targetSize}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-white/60 mb-1">Final</div>
                          <div className="px-3 py-2 rounded-lg bg-brand-darker/30 border border-white/10">
                            <span className="text-white font-medium">{selectedSquare?.currentSize}</span>
                          </div>
                        </div>
                      </div>

                      {/* Gauge optimisée avec dégradé et curseur dynamique */}
                      <div className="relative">
                        <div className="h-[3px] w-full rounded-full overflow-hidden" 
                             style={{ 
                               background: 'linear-gradient(to right, #3b82f6 0%, #3b82f6 30%, #60a5fa 50%, #93c5fd 75%, #22c55e 85%, #f97316 95%, #ef4444 100%)'
                             }}>
                        </div>
                        
                        {/* Marqueur d'objectif */}
                        <div className="absolute top-0 bottom-0 w-px bg-white/40" 
                             style={{ 
                               left: '85%',
                               transform: 'translateX(-50%)',
                               willChange: 'transform'
                             }} />

                        {/* Curseur dynamique */}
                        <motion.div 
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ 
                            left: `${(['T15', 'N°5', 'N°4', 'N°3', 'N°2', 'N°1'].indexOf(selectedSquare?.currentSize || 'T15') / 5) * 100}%`,
                            willChange: 'transform, left'
                          }}
                          initial={false}
                          animate={{
                            scale: [1, 1.2, 1],
                            transition: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                        >
                          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse" />
                          <div className="absolute inset-[2px] rounded-full bg-blue-500" />
                        </motion.div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 py-2">
                        {['T15', 'N°5', 'N°4', 'N°3', 'N°2', 'N°1'].map((size) => (
                          <div key={size} className="flex-1 text-center">
                            <div className={`text-xs ${
                              size === selectedSquare?.currentSize 
                                ? 'text-blue-400 font-medium' 
                                : size === selectedSquare?.targetSize
                                  ? 'text-green-400 font-medium'
                                  : 'text-white/40'
                            }`}>
                              {size}
                            </div>
                            <div className={`h-1 mt-1 rounded-full transform origin-center transition-transform ${
                              size === selectedSquare?.currentSize 
                                ? 'bg-blue-500 scale-100' 
                                : size === selectedSquare?.targetSize
                                  ? 'bg-green-500 scale-100'
                                  : 'bg-white/10 scale-75'
                            }`} 
                            style={{ willChange: 'transform' }} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Calibres actuels */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-white/60">Calibre actuel</div>
                        <div className="px-3 py-2 rounded-lg bg-brand-darker/30 border border-white/10">
                          <span className="text-white font-medium">{selectedSquare?.currentSize}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-white/60">Calibre cible</div>
                        <div className="px-3 py-2 rounded-lg bg-brand-darker/30 border border-white/10">
                          <span className="text-white font-medium">{selectedSquare?.targetSize}</span>
                        </div>
                      </div>
                    </div>

                    {/* Informations de production */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Informations de production</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-white/60">Date de démarrage</div>
                          <div className="px-3 py-2 rounded-lg bg-brand-darker/30 border border-white/10">
                            <span className="text-white font-medium">
                              {new Date(selectedSquare?.startDate || '').toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-white/60">Date de récolte prévue</div>
                          <div className="px-3 py-2 rounded-lg bg-brand-darker/30 border border-white/10">
                            <span className="text-white font-medium">
                              {new Date(selectedSquare?.harvestDate || '').toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-white/60">Taux de mortalité</div>
                          <div className="px-3 py-2 rounded-lg bg-brand-darker/30 border border-white/10">
                            <span className="text-white font-medium">{selectedSquare?.mortalityRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <motion.div variants={modalItemVariants} className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <Button 
                      variant="primary"
                      className="flex-1 bg-brand-accent hover:bg-brand-accent/90"
                    >
                      Ajouter des cordes
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                    >
                      Récolter
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}

      {/* Modal Nouvelle Table */}
      {showNewTableModal && (
        <Dialog open={showNewTableModal} onOpenChange={setShowNewTableModal}>
          <DialogPortal>
            <DialogContent 
              className="bg-brand-darker/95 border-white/10 max-w-2xl w-full"
              style={{
                WebkitBackdropFilter: 'blur(16px)',
                backdropFilter: 'blur(16px)',
                willChange: 'transform'
              }}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative"
                style={{ willChange: 'transform, opacity' }}
              >
                <DialogHeader className="pb-4 border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-2xl font-bold text-white">
                        Nouvelle table
                      </DialogTitle>
                      <DialogDescription className="text-white/60 mt-1">
                        Créer une nouvelle table de trempe
                      </DialogDescription>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-white/60 hover:text-white transition-colors"
                      onClick={() => setShowNewTableModal(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </DialogHeader>

                <div className="py-4 space-y-6">
                  <motion.div variants={modalItemVariants} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Nom de la table</label>
                      <Input
                        value={newTableData.tableName}
                        onChange={(e) => setNewTableData({ ...newTableData, tableName: e.target.value })}
                        placeholder="ex: Table Nord #128"
                        className="w-full bg-brand-darker/30 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Description</label>
                      <Input
                        value={newTableData.description}
                        onChange={(e) => setNewTableData({ ...newTableData, description: e.target.value })}
                        className="w-full bg-brand-darker/30 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">Date de démarrage</label>
                        <Input
                          type="date"
                          value={newTableData.startDate}
                          onChange={(e) => setNewTableData({ ...newTableData, startDate: e.target.value })}
                          className="w-full bg-brand-darker/30 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">Date de récolte prévue</label>
                        <Input
                          type="date"
                          value={newTableData.harvestDate}
                          onChange={(e) => setNewTableData({ ...newTableData, harvestDate: e.target.value })}
                          className="w-full bg-brand-darker/30 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">Calibre initial</label>
                        <select
                          value={newTableData.currentSize}
                          onChange={(e) => setNewTableData({ ...newTableData, currentSize: e.target.value as typeof newTableData.currentSize })}
                          className="w-full bg-brand-darker/30 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          {['T15', 'N°5', 'N°4', 'N°3', 'N°2', 'N°1'].map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">Calibre cible</label>
                        <select
                          value={newTableData.targetSize}
                          onChange={(e) => setNewTableData({ ...newTableData, targetSize: e.target.value as typeof newTableData.targetSize })}
                          className="w-full bg-brand-darker/30 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          {['T15', 'N°5', 'N°4', 'N°3', 'N°2', 'N°1'].map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <motion.div variants={modalItemVariants} className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <Button 
                      variant="primary"
                      className="flex-1 bg-brand-accent hover:bg-brand-accent/90"
                      onClick={() => {
                        const newTable: TrempeSquare = {
                          id: trempeSquares.length + 1,
                          status: 'disponible',
                          batches: [],
                          number: trempeSquares.length + 1,
                          remainingRopes: 100,
                          totalRopes: 100,
                          tableName: newTableData.tableName,
                          description: newTableData.description,
                          startDate: newTableData.startDate,
                          harvestDate: newTableData.harvestDate,
                          mortalityRate: 0,
                          currentSize: newTableData.currentSize,
                          targetSize: newTableData.targetSize,
                          occupancy: {
                            current: 0,
                            total: 10
                          }
                        };
                        setTrempeSquares([...trempeSquares, newTable]);
                        setShowNewTableModal(false);
                      }}
                    >
                      Créer la table
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowNewTableModal(false)}
                    >
                      Annuler
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </motion.div>
  );
};
