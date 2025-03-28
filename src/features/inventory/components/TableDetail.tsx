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
  ClipboardCheck
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

const CellModal: React.FC<CellModalProps> = ({ cell, onClose, onSave }) => {
  const generateBatchNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}${month}-${random}`;
  };

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

  const handleSave = () => {
    const remainingRopes = (cell.ropeCount || 0) - ropesToHarvest;
    onSave({
      ...cell,
      filled: remainingRopes > 0,
      ropeCount: remainingRopes > 0 ? remainingRopes : 0,
      spat: remainingRopes > 0 ? cell.spat : undefined,
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
        <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#22c55e] to-[#16a34a] bg-clip-text text-transparent">
          Récolter des cordes
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Nombre de cordes à récolter</label>
            <input
              type="number"
              value={ropesToHarvest}
              onChange={(e) => setRopesToHarvest(Math.min(Number(e.target.value), cell.ropeCount || 0))}
              className="w-full bg-black/20 rounded-lg p-3 border border-white/10 focus:border-[#22c55e]/30 focus:ring-2 focus:ring-[#22c55e]/20 transition-all duration-200"
              min="1"
              max={cell.ropeCount}
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-white/70">
              <span className="font-medium">Numéro de lot :</span>{' '}
              <span className="text-white">{cell.spat?.batchNumber}</span>
            </div>
            <div className="text-sm text-white/70">
              <span className="font-medium">Naissain :</span>{' '}
              <span className="text-white">{cell.spat?.name}</span>
            </div>
            <div className="text-sm text-white/70">
              <span className="font-medium">Cordes restantes après récolte :</span>{' '}
              <span className="text-white">{(cell.ropeCount || 0) - ropesToHarvest}</span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e]/30 transition-colors"
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

  // Initialiser les cellules avec les cellules 9 et 17 remplies
  React.useEffect(() => {
    if (table.id === '1' && onTableUpdate) {  // Table A-12 et onTableUpdate existe
      const newCells = [...table.cells];
      if (newCells[8]) newCells[8] = { ...newCells[8], filled: true };  // Cellule 9
      if (newCells[16]) newCells[16] = { ...newCells[16], filled: true };  // Cellule 17
      
      onTableUpdate({
        ...table,
        cells: newCells
      });
    }
  }, [table.id, onTableUpdate]);  // Ajouter les dépendances

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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
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
                onClick={() => fillColumn(0)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-white/5 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <ArrowLeft className="text-cyan-400" size={20} />
                  <span className="text-gray-300">Remplir colonne gauche</span>
                </span>
              </button>
              <button
                onClick={() => fillColumn(10)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-white/5 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <ArrowRight className="text-cyan-400" size={20} />
                  <span className="text-gray-300">Remplir colonne droite</span>
                </span>
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-white/5 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <History className="text-cyan-400" size={20} />
                  <span className="text-gray-300">Voir l'historique</span>
                </span>
              </button>
              <button
                onClick={() => setShowSamplingModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-white/5 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <ClipboardCheck className="text-cyan-400" size={20} />
                  <span className="text-gray-300">Échantillonnage</span>
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
              className={`h-8 rounded-sm border border-white/10 hover:border-[#22c55e]/30 cursor-pointer transition-all duration-200 relative overflow-hidden`}
              style={getCellStyle(cell)}
            >
              {cell.filled && cell.ropeCount && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[#22c55e]">
                  {cell.ropeCount}
                </div>
              )}
              <div className="absolute bottom-1 right-1 text-[10px] text-white/40">
                {index + 1}
              </div>
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
      </div>
    </motion.div>
  );
};