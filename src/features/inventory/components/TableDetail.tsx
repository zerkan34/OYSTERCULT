import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  ShoppingCart
} from 'lucide-react';

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
    onSave({
      ...cell,
      filled: true,
      ropeCount,
      spat: {
        name: spatName,
        batchNumber,
        dateAdded: new Date().toISOString(),
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] p-6 rounded-lg w-96 shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10"
      >
        <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Ajouter des cordes
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Nombre de cordes</label>
            <input
              type="number"
              value={ropeCount}
              onChange={(e) => setRopeCount(Number(e.target.value))}
              className="w-full bg-black/20 rounded-lg p-3 border border-white/10 focus:border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Naissain</label>
            <input
              type="text"
              value={spatName}
              onChange={(e) => setSpatName(e.target.value)}
              className="w-full bg-black/20 rounded-lg p-3 border border-white/10 focus:border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
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
                className="w-full bg-black/20 rounded-lg p-3 border border-white/10 focus:border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                placeholder="Auto-généré"
              />
              <button
                onClick={() => setBatchNumber(generateBatchNumber())}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors"
              >
                Générer
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-colors font-medium"
            >
              Enregistrer
            </button>
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
    const currentRopes = cell.ropeCount || TOTAL_ROPES_PER_CELL;
    const remainingRopes = Math.max(0, currentRopes - ropesToHarvest);

    // Si on récolte toutes les cordes de la cellule
    const isFullyHarvested = remainingRopes === 0;

    onSave({
      ...cell,
      filled: !isFullyHarvested,
      ropeCount: remainingRopes,
      spat: isFullyHarvested ? undefined : cell.spat,
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
        className="bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] p-6 rounded-lg w-96 shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10"
      >
        <h3 className="text-2xl font-semibold mb-1 text-cyan-500">
          Récolter des cordes
        </h3>
        <div className="text-xl text-white/90 mb-4">Bouzigues</div>
        <div className="text-sm text-white/70 mb-6">
          <div className="mb-1">Table A-12</div>
          <div>Carré n°5</div>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Nombre de cordes à récolter</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={ropesToHarvest}
                onChange={(e) => setRopesToHarvest(Math.min(Math.max(1, Number(e.target.value)), cell.ropeCount || TOTAL_ROPES_PER_CELL))}
                className="flex-1 bg-black/20 rounded-lg p-3 border border-white/10 focus:border-[#22c55e]/30 focus:ring-2 focus:ring-[#22c55e]/20 transition-all duration-200"
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
                <div className="flex-1 bg-black/20 rounded-lg p-2 border border-white/10">
                  <span className="text-white">{cell.spat?.batchNumber || generateBatchNumber()}</span>
                </div>
                <button
                  onClick={() => {
                    const newBatchNumber = generateBatchNumber();
                    onSave({
                      ...cell,
                      spat: { ...cell.spat, batchNumber: newBatchNumber }
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
                
                // Créer une nouvelle entrée d'historique
                const historyEntry: HistoryEntry = {
                  date: now,
                  action: 'Exondation',
                  details: `Exondation #${newExondationCount}`,
                  type: 'exondation'
                };

                // Mettre à jour la cellule
                onSave({
                  ...cell,
                  exondation: {
                    startTime: now,
                    isExonded: true,
                    exondationCount: newExondationCount
                  },
                  history: [...(cell.history || []), historyEntry]
                });

                // Démarrer le timer pour l'alerte
                setTimeout(() => {
                  if (cell.exondation?.isExonded) {
                    alert('⚠️ ATTENTION : Cette table est exondée depuis plus de 24 heures !');
                    // Ici, vous pouvez ajouter votre logique de notification
                  }
                }, 24 * 60 * 60 * 1000); // 24 heures
              }}
              className={`px-4 py-2 rounded-lg ${
                cell.exondation?.isExonded 
                  ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
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
      </motion.div>
    </div>
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
      type: 'exondation'
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
        spat: updatedCell.spat,
        details: `Cellule ${index + 1} mise à jour avec ${updatedCell.ropeCount} cordes`,
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
        spat: updatedCell.spat,
        details: `Cellule ${index + 1} récoltée`,
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
    const newCells = [...table.cells];
    for (let i = startIndex; i < startIndex + 10; i++) {
      if (!newCells[i].filled) {
        newCells[i] = {
          ...newCells[i],
          filled: true,
          ropeCount: 10,
          spat: {
            name: "Naissain standard",
            dateAdded: new Date().toISOString(),
          },
        };
      }
    }
    onTableUpdate({
      ...table,
      cells: newCells,
      history: [
        ...table.history,
        {
          date: new Date().toISOString(),
          action: 'Remplissage colonne',
          details: `Colonne ${startIndex === 0 ? 'gauche' : 'droite'} remplie`,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-900/95 backdrop-blur-sm p-8 rounded-xl w-[1000px] max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
              Table {table.name}
            </h2>
            <div className="flex items-center space-x-3 text-gray-400">
              <span className="text-lg">Table n° {table.tableNumber}</span>
              <span className="text-gray-500">•</span>
              <span className="text-lg">{table.oysterType}</span>
            </div>
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
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-white/5 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <ClipboardCheck className="text-cyan-400" size={20} />
                  <span className="text-white">Échantillonnage</span>
                </span>
              </button>

              <button
                onClick={() => fillColumn(10)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-white/5 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <ArrowRight className="text-cyan-400" size={20} />
                  <span className="text-white">Remplir colonne droite</span>
                </span>
              </button>

              <button
                onClick={() => fillColumn(0)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-white/5 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <ArrowLeft className="text-cyan-400" size={20} />
                  <span className="text-white">Remplir colonne gauche</span>
                </span>
              </button>

              <button
                onClick={() => setShowHistory(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-white/5 transition-colors"
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

        {showHistory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => {
            if (e.target === e.currentTarget) setShowHistory(false);
          }}>
            <div className="bg-gray-900/95 backdrop-blur-sm p-8 rounded-xl w-[600px] border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
                  Historique
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
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
              <div className="space-y-4">
                {table.history.map((entry, i) => (
                  <div key={i} className="p-4 bg-gray-800/50 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-400 font-medium">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {entry.action}
                      </span>
                    </div>
                    <p className="text-gray-300">{entry.details}</p>
                    {entry.spat && (
                      <div className="mt-2 text-sm text-gray-400">
                        Naissain : {entry.spat.name}
                        {entry.spat.batchNumber && ` (Lot ${entry.spat.batchNumber})`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {showSamplingModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => {
            if (e.target === e.currentTarget) setShowSamplingModal(false);
          }}>
            <div className="bg-gray-900/95 backdrop-blur-sm p-8 rounded-xl w-[600px] border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => {
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
      </div>
    </motion.div>
  );
};