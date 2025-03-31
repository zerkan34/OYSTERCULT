import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Table, TableCell, HistoryEntry } from '../types';
import { 
  Clock, 
  Calendar,
  ThermometerSun,
  Droplets,
  ArrowLeft,
  ArrowRight,
  History,
  AlertTriangle,
  MapPin,
  ClipboardCheck,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Plus,
  ShoppingCart,
  Shell,
  Check,
  X,
  Filter,
  FileText
} from 'lucide-react';
import { generateTablePDF } from './TablePDF';

interface TableDetailProps {
  table: Table;
  onClose: () => void;
  onTableUpdate: (table: Table) => void;
}

interface CellModalProps {
  cell: TableCell;
  onClose: () => void;
  onSave: (updatedCell: TableCell) => void;
}

interface HarvestModalProps {
  cell: TableCell;
  onClose: () => void;
  onSave: (updatedCell: TableCell) => void;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table;
}

const generateBatchNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${year}${month}-${random}`;
};

const CellModal: React.FC<CellModalProps> = ({ cell, onClose, onSave }) => {
  const [ropeCount, setRopeCount] = useState<number>(cell.ropeCount || 0);
  const [spatName, setSpatName] = useState(cell.spat?.name || '');
  const [batchNumber, setBatchNumber] = useState(cell.spat?.batchNumber || generateBatchNumber());

  const handleSave = () => {
    const now = new Date().toISOString();
    const historyEntry: HistoryEntry = {
      date: now,
      action: 'Ajout de cordes',
      details: `${ropeCount} cordes ajoutées`,
      naissain: spatName,
      lotNumber: batchNumber,
      mortalityRate: 0,
      notes: ''
    };

    onSave({
      ...cell,
      ropeCount: (cell.ropeCount || 0) + ropeCount,
      spat: {
        name: spatName,
        batchNumber: batchNumber,
        dateAdded: new Date().toISOString()
      },
      history: [...(cell.history || []), historyEntry]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg w-[480px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10"
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg"></div>
          <div className="relative">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Ajouter des cordes
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Nombre de cordes</label>
                <input
                  type="number"
                  value={ropeCount}
                  onChange={(e) => setRopeCount(Number(e.target.value))}
                  className="w-full bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-3 rounded-lg border border-white/10 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white min-h-[44px] transition-all duration-300"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Naissain</label>
                <input
                  type="text"
                  value={spatName}
                  onChange={(e) => setSpatName(e.target.value)}
                  className="w-full bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-3 rounded-lg border border-white/10 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white min-h-[44px] transition-all duration-300"
                  placeholder="Nom du naissain"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Numéro de lot</label>
                <div className="relative">
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-3 rounded-lg border border-white/10 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white min-h-[44px] transition-all duration-300"
                    placeholder="Numéro de lot"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                    <ClipboardCheck size={20} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 transform hover:-translate-y-1 text-white/70 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/50 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Check size={20} />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HarvestModal: React.FC<HarvestModalProps> = ({ cell, onClose, onSave }) => {
  const [ropesToHarvest, setRopesToHarvest] = useState<number>(1);

  // Constantes pour les calculs
  const ROPES_PER_POLE = 10;
  const POLES_PER_CELL = 5;
  const TOTAL_ROPES_PER_CELL = ROPES_PER_POLE * POLES_PER_CELL;
  const OYSTERS_PER_ROPE = 150;

  const handleSave = () => {
    const now = new Date().toISOString();
    const currentRopes = cell.ropeCount || TOTAL_ROPES_PER_CELL;
    const remainingRopes = Math.max(0, currentRopes - ropesToHarvest);

    // Si on récolte toutes les cordes de la cellule
    const isFullyHarvested = remainingRopes === 0;

    const historyEntry: HistoryEntry = {
      date: now,
      action: 'Récolte',
      details: `${ropesToHarvest} cordes récoltées`,
      naissain: cell.spat?.name || '',
      lotNumber: cell.spat?.batchNumber || '',
      mortalityRate: 0,
      notes: ''
    };

    onSave({
      ...cell,
      filled: !isFullyHarvested,
      ropeCount: remainingRopes,
      spat: isFullyHarvested ? undefined : cell.spat,
      history: [...(cell.history || []), historyEntry]
    });
    onClose();
  };

  const calculateOysterCount = (ropes: number) => {
    return ropes * OYSTERS_PER_ROPE;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg w-[480px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10"
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg"></div>
          <div className="relative">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Récolter des cordes
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Nombre de cordes à récolter</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={ropesToHarvest}
                    onChange={(e) => setRopesToHarvest(Math.min(Math.max(1, Number(e.target.value)), cell.ropeCount || TOTAL_ROPES_PER_CELL))}
                    className="flex-1 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-3 rounded-lg border border-white/10 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white min-h-[44px] transition-all duration-300"
                    min="1"
                    max={cell.ropeCount || TOTAL_ROPES_PER_CELL}
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setRopesToHarvest(prev => Math.min(prev + 1, cell.ropeCount || TOTAL_ROPES_PER_CELL))}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => setRopesToHarvest(prev => Math.max(1, prev - 1))}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-white/70">
                  <span className="font-medium">Numéro de lot :</span>{' '}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-2 rounded-lg border border-white/10">
                      <span className="text-white">{cell.spat?.batchNumber || generateBatchNumber()}</span>
                    </div>
                    <button
                      onClick={() => {
                        const newBatchNumber = generateBatchNumber();
                        const historyEntry: HistoryEntry = {
                          date: new Date().toISOString(),
                          action: 'Mise à jour du numéro de lot',
                          details: `Nouveau numéro de lot : ${newBatchNumber}`,
                          naissain: cell.spat?.name || '',
                          lotNumber: newBatchNumber,
                          mortalityRate: 0,
                          notes: ''
                        };

                        onSave({
                          ...cell,
                          spat: { ...cell.spat, batchNumber: newBatchNumber },
                          history: [...(cell.history || []), historyEntry]
                        });
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-white/70">
                  <span className="font-medium">Naissain à récolter :</span>{' '}
                  <span className="text-white">Marennes-Oléron</span>
                </div>
                <div className="text-sm text-white/70">
                  <span className="font-medium">Cordes restantes après récolte :</span>{' '}
                  <span className="text-white">{(cell.ropeCount || TOTAL_ROPES_PER_CELL) - ropesToHarvest}</span>
                </div>
                <div className="text-sm text-white/70">
                  <span className="font-medium">Huîtres restantes après récolte :</span>{' '}
                  <span className="text-white">{calculateOysterCount((cell.ropeCount || TOTAL_ROPES_PER_CELL) - ropesToHarvest)}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    const now = new Date().toISOString();
                    const newExondationCount = (cell.exondation?.exondationCount || 0) + 1;
                    
                    const historyEntry: HistoryEntry = {
                      date: now,
                      action: 'Exondation',
                      details: `Exondation #${newExondationCount}`,
                      type: 'exondation',
                      naissain: cell.spat?.name || '',
                      lotNumber: cell.spat?.batchNumber || '',
                      mortalityRate: 0,
                      notes: ''
                    };

                    onSave({
                      ...cell,
                      exondation: {
                        startTime: now,
                        isExonded: true,
                        exondationCount: newExondationCount
                      },
                      history: [...(cell.history || []), historyEntry]
                    });

                    setTimeout(() => {
                      if (cell.exondation?.isExonded) {
                        alert('⚠️ ATTENTION : Cette table est exondée depuis plus de 24 heures !');
                        // Ici, vous pouvez ajouter votre logique de notification
                      }
                    }, 24 * 60 * 60 * 1000); // 24 heures
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    cell.exondation?.isExonded 
                      ? 'bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
                  } transition-colors`}
                  aria-label={cell.exondation?.isExonded ? 'Table exondée' : 'Exonder'}
                >
                  <div className="flex items-center gap-2">
                    <Droplets size={16} />
                    {cell.exondation?.isExonded ? 'Exondé' : 'Exonder'}
                  </div>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                >
                  Récolter
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, table }) => {
  const handleExportPDF = () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    
    const pdfData = {
      naissainName: "Naissain Premium",
      lotNumber: "T15-" + Math.floor(Math.random() * 10000),
      origin: "Bretagne Sud",
      startDate: startDate.toLocaleDateString('fr-FR'),
      waterQuality: "Excellente",
      mortality: "14%"
    };
    
    const doc = generateTablePDF(pdfData);
    doc.save('rapport-production.pdf');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
          <div className="flex items-center justify-center min-h-screen p-4 pt-[15vh]">
            <motion.div
              initial={{ opacity: 0, transform: "translateY(30px)" }}
              animate={{ 
                opacity: 1, 
                transform: "translateY(0)",
                transition: {
                  duration: 0.4,
                  ease: [0.19, 1.0, 0.22, 1.0]
                }
              }}
              exit={{ 
                opacity: 0, 
                transform: "translateY(30px)"
              }}
              className="relative w-full max-w-4xl"
            >
              {/* Effet de glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-75" />
              
              {/* Contenu principal */}
              <div 
                className="relative rounded-2xl shadow-2xl border border-white/10"
                style={{
                  background: "rgba(15, 23, 42, 0.45)",
                  WebkitBackdropFilter: "blur(16px)",
                  backdropFilter: "blur(16px)",
                  transition: "border-color 0.2s ease",
                  willChange: "transform, border-color"
                }}
              >
                {/* Header avec style moderne */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1.5">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Historique {table?.name}
                      </h2>
                      <p className="text-sm text-white/40">
                        Suivi détaillé des lots et performances
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2.5 rounded-full hover:bg-white/10 transition-colors group focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      aria-label="Fermer"
                    >
                      <X size={20} className="text-white/40 group-hover:text-white/60 transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Content avec style raffiné */}
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {[1, 2, 3].map((_, index) => (
                    <div
                      key={index}
                      className="group relative"
                    >
                      {/* Fond avec effet de glow */}
                      <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[0.5px]" />
                      
                      <div 
                        className="relative p-5 rounded-xl border border-white/[0.03] hover:border-cyan-500/10 transition-all duration-300"
                        style={{
                          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.04) 100%)",
                          backdropFilter: "blur(8px)"
                        }}
                      >
                        <div className="grid grid-cols-[auto,1fr] gap-x-5 gap-y-3">
                          {/* En-tête du lot avec effet glass */}
                          <div className="flex items-center space-x-2.5 glass-effect px-3 py-1.5 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-cyan-400/70 shadow-[0_0_10px_rgba(34,211,238,0.3)]" />
                            <span className="text-sm font-medium text-cyan-400/90">Naissain Premium</span>
                          </div>
                          
                          {/* Bouton Export */}
                          <div className="text-right">
                            <button
                              onClick={handleExportPDF}
                              className="inline-flex items-center px-3.5 py-1.5 text-sm font-medium rounded-lg bg-cyan-500/5 text-cyan-400/90 hover:bg-cyan-500/10 hover:-translate-y-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.15),0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 group/btn focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                            >
                              <FileText size={14} className="mr-2 group-hover/btn:scale-110 transition-transform" />
                              Exporter PDF
                            </button>
                          </div>
                          
                          {/* Détails du lot */}
                          <div className="col-span-2 mt-2 space-y-3">
                            <div className="flex items-center text-sm text-white/60 glass-effect px-3 py-1.5 rounded-lg self-start">
                              <MapPin size={14} className="mr-2 text-white/40" />
                              <span className="font-medium">Lot T15-{1000 + index}</span>
                              <span className="mx-2 text-white/30">•</span>
                              <span>Bretagne Sud</span>
                            </div>
                            
                            {/* Stats et date */}
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-4">
                                <div className="glass-effect rounded-lg px-3 py-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                                  <span className="text-white/50">
                                    {new Date(2025, 3 - index, 1).toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                                <div className="h-3.5 w-[1px] bg-white/10" />
                                <div className="glass-effect rounded-lg px-3 py-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                                  <span className="text-white/50">11 mois</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="glass-effect px-3 py-1.5 text-sm font-medium rounded-lg text-white/70 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                                  Mortalité: {14 + index}%
                                </span>
                                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const TableDetail: React.FC<TableDetailProps> = ({ table, onClose, onTableUpdate }) => {
  const [selectedCell, setSelectedCell] = useState<TableCell | null>(null);
  const [showCellModal, setShowCellModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSamplingModal, setShowSamplingModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [showExondationModal, setShowExondationModal] = useState(false);
  const [selectedExondationOption, setSelectedExondationOption] = useState<'all' | 'right' | 'left' | 'custom'>('all');
  const [selectedCells, setSelectedCells] = useState<number[]>([]);

  // Initialiser les cellules avec les cellules 9 et 17 remplies
  React.useEffect(() => {
    if (table.id === '1' && onTableUpdate) {  // Table A-12 et onTableUpdate existe
      const newCells = [...table.cells];
      if (newCells[3]) newCells[3] = { ...newCells[3], filled: true, ropeCount: 7 };  // Cellule 4 (1.75 sur 2)
      if (newCells[8]) newCells[8] = { ...newCells[8], filled: true };  // Cellule 9
      if (newCells[16]) newCells[16] = { ...newCells[16], filled: true };  // Cellule 17
      
      onTableUpdate({
        ...table,
        cells: newCells
      });
    }
  }, [table.id, onTableUpdate]);  // Ajouter les dépendances

  // Fonction pour gérer l'exondation
  const handleExondation = (option: 'all' | 'right' | 'left' | 'custom', cells?: number[]) => {
    const now = new Date().toISOString();
    const newExondationCount = (table.exondation?.exondationCount || 0) + 1;
    
    const historyEntry: HistoryEntry = {
      date: now,
      action: 'Exondation',
      details: `Exondation #${newExondationCount} - ${
        option === 'all' ? 'Table complète' :
        option === 'right' ? 'Colonne droite' :
        option === 'left' ? 'Colonne gauche' :
        'Cellules spécifiques'
      }`,
      type: 'exondation',
      naissain: '',
      lotNumber: '',
      mortalityRate: 0,
      notes: ''
    };

    const updatedCells = [...table.cells];
    if (option === 'all') {
      updatedCells.forEach(cell => {
        cell.exondation = {
          startTime: now,
          isExonded: true,
          exondationCount: newExondationCount
        };
      });
    } else if (option === 'right') {
      updatedCells.slice(50).forEach(cell => {
        cell.exondation = {
          startTime: now,
          isExonded: true,
          exondationCount: newExondationCount
        };
      });
    } else if (option === 'left') {
      updatedCells.slice(0, 50).forEach(cell => {
        cell.exondation = {
          startTime: now,
          isExonded: true,
          exondationCount: newExondationCount
        };
      });
    } else if (cells) {
      cells.forEach(index => {
        if (updatedCells[index]) {
          updatedCells[index].exondation = {
            startTime: now,
            isExonded: true,
            exondationCount: newExondationCount
          };
        }
      });
    }

    onTableUpdate({
      ...table,
      cells: updatedCells,
      history: [...(table.history || []), historyEntry]
    });

    setTimeout(() => {
      const exondedCells = updatedCells.filter(cell => cell.exondation?.isExonded);
      if (exondedCells.length > 0) {
        alert('⚠️ ATTENTION : Des huîtres sont exondées depuis plus de 24 heures !');
      }
    }, 24 * 60 * 60 * 1000);

    setShowExondationModal(false);
  };

  const handleCellUpdate = (updatedCell: TableCell) => {
    const newCells = [...table.cells];
    const index = newCells.findIndex((c) => c.id === updatedCell.id);
    if (index !== -1) {
      newCells[index] = updatedCell;

      const historyEntry: HistoryEntry = {
        date: new Date().toISOString(),
        action: 'Mise à jour cellule',
        details: `Cellule ${index + 1} mise à jour avec ${updatedCell.ropeCount} cordes`,
        naissain: updatedCell.spat?.name || '',
        lotNumber: updatedCell.spat?.batchNumber || '',
        mortalityRate: 0,
        notes: ''
      };

      onTableUpdate({
        ...table,
        cells: newCells,
        history: [...table.history, historyEntry],
      });
    }
    setShowCellModal(false);
  };

  const handleHarvest = (updatedCell: TableCell) => {
    const newCells = [...table.cells];
    const index = newCells.findIndex((c) => c.id === updatedCell.id);
    if (index !== -1) {
      newCells[index] = updatedCell;

      const historyEntry: HistoryEntry = {
        date: new Date().toISOString(),
        action: 'Récolte de cordes',
        details: `Cellule ${index + 1} récoltée`,
        naissain: updatedCell.spat?.name || '',
        lotNumber: updatedCell.spat?.batchNumber || '',
        mortalityRate: 0,
        notes: ''
      };

      onTableUpdate({
        ...table,
        cells: newCells,
        history: [...table.history, historyEntry],
      });
    }
    setShowHarvestModal(false);
  };

  const fillColumn = (startIndex: number) => {
    const updatedCells = [...table.cells];
    const now = new Date().toISOString();
    
    for (let i = startIndex; i < startIndex + 10; i++) {
      if (i < updatedCells.length) {
        updatedCells[i] = {
          ...updatedCells[i],
          filled: true,
          ropeCount: 10,
          spat: {
            name: "Naissain standard",
            batchNumber: generateBatchNumber(),
            dateAdded: now
          }
        };
      }
    }

    onTableUpdate({
      ...table,
      cells: updatedCells,
      history: [
        ...table.history,
        {
          date: now,
          action: 'Remplissage colonne',
          details: `Colonne ${startIndex === 0 ? 'gauche' : 'droite'} remplie`,
          naissain: '',
          lotNumber: '',
          mortalityRate: 0,
          notes: ''
        },
      ],
    });
  };

  const handleSampling = () => {
    const newHistory = [
      ...table.history,
      {
        date: new Date().toISOString(),
        action: 'Échantillonnage',
        details: 'Contrôle de croissance effectué',
        naissain: '',
        lotNumber: '',
        mortalityRate: 0,
        notes: ''
      },
    ];

    onTableUpdate({
      ...table,
      sampling: {
        ...table.sampling,
        lastCheckDate: new Date().toISOString(),
        nextCheckDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // +7 jours
        mortalityRate: Math.round(Math.random() * 5), // 0-5%
        currentSize: (Math.round(70 + Math.random() * 30)).toString() // 70-100mm
      },
      history: newHistory,
    });

    setShowSamplingModal(false);
  };

  const handleCellClick = (cell: TableCell) => {
    setSelectedCell(cell);
    if (cell.filled) {
      setShowHarvestModal(true);
    } else {
      setShowCellModal(true);
    }
  };

  const getCellStyle = (cell: TableCell) => {
    if (typeof cell.filled === 'number') {
      return {
        background: `linear-gradient(to left, rgba(34, 197, 94, 0.2) ${cell.filled * 100}%, transparent ${cell.filled * 100}%)`,
        borderColor: 'rgba(34, 197, 94, 0.3)'
      };
    } else if (cell.filled) {
      return {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 0.3)'
      };
    }
    return {};
  };

  return (
    <>
      {/* Modale principale */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/90" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-gray-900/95 p-6 rounded-xl max-w-4xl w-full border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
                Table {table.name}
              </h2>
              <div className="text-white/70 mt-1">Temps de grossissement: 75 jours</div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-white/5">
              <h3 className="text-xl font-semibold mb-6 text-cyan-300">
                Informations générales
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ThermometerSun size={20} className="text-cyan-400" />
                    <span className="text-gray-300">Température</span>
                  </div>
                  <span className="text-white font-medium">{table.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Droplets size={20} className="text-cyan-400" />
                    <span className="text-gray-300">Salinité</span>
                  </div>
                  <span className="text-white font-medium">{table.salinity}g/L</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock size={20} className="text-cyan-400" />
                    <span className="text-gray-300">Dernière mise à jour</span>
                  </div>
                  <span className="text-white font-medium">
                    {new Date(table.lastUpdate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin size={20} className="text-cyan-400" />
                    <span className="text-gray-300">Provenance naissain</span>
                  </div>
                  <span className="text-white font-medium">Marennes-Oléron</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-white/5">
              <h3 className="text-xl font-semibold mb-6 text-cyan-300">Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowExondationModal(true)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 ${
                    table.exondation?.isExonded 
                      ? 'bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Droplets className={table.exondation?.isExonded ? 'text-orange-400' : 'text-cyan-400'} size={20} />
                    <span className="text-white">{table.exondation?.isExonded ? 'Exondé' : 'Exonder'}</span>
                  </span>
                </button>

                <button
                  onClick={() => setShowSamplingModal(true)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <ClipboardCheck className="text-cyan-400" size={20} />
                    <span className="text-white">Échantillonnage</span>
                  </span>
                </button>

                <button
                  onClick={() => fillColumn(10)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <ArrowRight className="text-cyan-400" size={20} />
                    <span className="text-white">Remplir colonne droite</span>
                  </span>
                </button>

                <button
                  onClick={() => fillColumn(0)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <ArrowLeft className="text-cyan-400" size={20} />
                    <span className="text-white">Remplir colonne gauche</span>
                  </span>
                </button>

                <button
                  onClick={() => setShowHistory(true)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <History className="text-cyan-400" size={20} />
                    <span className="text-white">Voir l'historique</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-1">
            {table.cells.map((cell, index) => (
              <div
                key={cell.id}
                onClick={() => handleCellClick(cell)}
                className={`h-8 rounded-sm border cursor-pointer transition-colors flex items-center justify-center relative backdrop-blur-sm ${
                  cell.filled 
                    ? index === 3
                      ? 'bg-gradient-to-l from-cyan-500/40 to-transparent from-[87.5%] to-[87.5%] border-cyan-500/30'
                      : 'bg-cyan-500/40 border-cyan-500/30 hover:bg-cyan-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="absolute bottom-1 right-1 text-[10px] text-white/40">
                  {index + 1}
                </div>
                {cell.filled && cell.ropeCount && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-white/70">{cell.ropeCount}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showCellModal && selectedCell && (
            <CellModal
              cell={selectedCell}
              onClose={() => setShowCellModal(false)}
              onSave={handleCellUpdate}
            />
          )}

          {showHarvestModal && selectedCell && (
            <HarvestModal
              cell={selectedCell}
              onClose={() => setShowHarvestModal(false)}
              onSave={handleHarvest}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Modale d'historique indépendante */}
      {showHistory && (
        <HistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          table={table}
        />
      )}
      {showSamplingModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) setShowSamplingModal(false);
        }}>
          <div className="bg-gray-900/95 backdrop-blur-sm p-8 rounded-xl w-[600px] border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Échantillonnage
              </h3>
              <button
                onClick={() => setShowSamplingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <p className="text-gray-300">
                Voulez-vous effectuer un contrôle d'échantillonnage sur cette table ?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowSamplingModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSampling}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showExondationModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) setShowExondationModal(false);
        }}>
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] p-6 rounded-lg w-96 shadow-xl border border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-cyan-500 mb-4">Sélectionner la zone à exonder</h3>
            <div className="space-y-4 mb-6">
              <button
                onClick={() => setSelectedExondationOption('all')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  selectedExondationOption === 'all'
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Table complète
              </button>
              <button
                onClick={() => setSelectedExondationOption('right')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  selectedExondationOption === 'right'
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Colonne droite
              </button>
              <button
                onClick={() => setSelectedExondationOption('left')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  selectedExondationOption === 'left'
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Colonne gauche
              </button>
              <button
                onClick={() => setSelectedExondationOption('custom')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  selectedExondationOption === 'custom'
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Sélection personnalisée
              </button>
            </div>

            {selectedExondationOption === 'custom' && (
              <div className="mb-6">
                <div className="grid grid-cols-10 gap-1 mb-4">
                  {table.cells.map((cell, index) => (
                    <div
                      key={cell.id}
                      onClick={() => {
                        setSelectedCells(prev => 
                          prev.includes(index)
                            ? prev.filter(i => i !== index)
                            : [...prev, index]
                        );
                      }}
                      className={`w-8 h-8 rounded-sm border cursor-pointer transition-colors flex items-center justify-center relative ${
                        selectedCells.includes(index)
                          ? 'bg-cyan-500/50 border-cyan-400'
                          : index < 3 
                            ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                            : index === 3
                              ? 'bg-cyan-500/20 border-cyan-500/30 hover:bg-cyan-500/30'
                              : 'bg-cyan-500/40 border-cyan-500/30 hover:bg-cyan-500/50'
                      }`}
                    >
                      <div className="absolute bottom-1 right-1 text-[10px] text-white/40 flex items-center justify-center relative">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-white/70 text-sm">
                  Sélectionnez les cellules à exonder
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExondationModal(false)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (selectedExondationOption === 'custom') {
                    handleExondation('custom', selectedCells);
                  } else {
                    handleExondation(selectedExondationOption);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};