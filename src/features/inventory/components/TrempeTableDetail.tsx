import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  ArrowRight,
  Droplets,
  X,
  Calendar,
  Tag,
  Scale,
  Shell,
  Package
} from 'lucide-react';
import type { TrempeTable } from './TrempeTables';

interface CellDetailProps {
  cell: any;
  onUpdate: (updates: Partial<any>) => void;
  index: number;
}

interface RopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pochonCount: number) => void;
  action: 'fill' | 'harvest';
  cellIndex: number;
  cell: any;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pochonCount: number;
  action: 'fill' | 'harvest';
}

interface FillSquareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lotNumber: string) => void;
  cellIndex: number;
}

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, pochonCount, action }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[300]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] p-6 rounded-lg w-[400px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Confirmation
            </h3>
            <p className="text-white/70">
              {action === 'fill' 
                ? `Les ${pochonCount} pochons seront inscrits dans les stocks de la trempe et leur traçabilité sera mise à jour.`
                : `Les ${pochonCount} pochons seront retirés des stocks de la trempe, mais seront disponible en référence pour le stockage dans les bassins et leur traçabilité sera mise à jour.`}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-cyan-400/30"
            >
              Non
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2 rounded-lg bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 text-cyan-400 hover:text-cyan-300"
            >
              Oui
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FillSquareModal: React.FC<FillSquareModalProps> = ({ isOpen, onClose, onConfirm, cellIndex }) => {
  const [selectedLot, setSelectedLot] = useState('2503-042');
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] p-6 rounded-lg w-[400px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Remplir le carré {cellIndex + 1}
            </h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-white/70 block">N° de lot :</label>
            <select
              value={selectedLot}
              onChange={(e) => setSelectedLot(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="2503-042">2503-042 (Dernier lot récolté - Table A-01)</option>
              <option value="2503-041">2503-041</option>
              <option value="2503-040">2503-040</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-cyan-400/30"
            >
              Annuler
            </button>
            <button
              onClick={() => setShowConfirmation(true)}
              className="flex-1 px-4 py-2 rounded-lg bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 text-cyan-400 hover:text-cyan-300"
            >
              Confirmer
            </button>
          </div>
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          onConfirm(selectedLot);
          onClose();
        }}
        pochonCount={50}
        action="fill"
      />
    </div>
  );
};

const RopeModal: React.FC<RopeModalProps> = ({ isOpen, onClose, onConfirm, action, cellIndex, cell }) => {
  const [pochonCount, setPochonCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getMaxPochons = (index: number) => {
    if (index === 5) return 17;
    if (index === 6) return 19;
    return 50;
  };

  const totalPochons = action === 'harvest' ? getMaxPochons(cellIndex) : 0;
  const remainingPochons = action === 'harvest' ? totalPochons - pochonCount : pochonCount;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] p-6 rounded-lg w-[400px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {action === 'fill' ? 'Ajouter des pochons' : 'Récolter les pochons'}
            </h3>
            <div className="text-center space-y-1">
              <div className="text-white/60">
                Carré N°{cellIndex + 1}
              </div>
              <div className="text-white/70">
                Pochons {action === 'fill' ? 'ajoutés' : 'restants'} : {remainingPochons}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-white/70">Nombre de pochons :</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPochonCount(Math.max(0, pochonCount - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 text-white/70 hover:text-white flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                value={pochonCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setPochonCount(Math.min(Math.max(0, value), getMaxPochons(cellIndex)));
                }}
                className="w-16 bg-black/20 border border-white/10 rounded px-3 py-1 text-white text-center"
              />
              <button
                onClick={() => setPochonCount(Math.min(pochonCount + 1, getMaxPochons(cellIndex)))}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 text-white/70 hover:text-white flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-cyan-400/30"
            >
              Annuler
            </button>
            <button
              onClick={() => setShowConfirmation(true)}
              className="flex-1 px-4 py-2 rounded-lg bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 text-cyan-400 hover:text-cyan-300"
            >
              Confirmer
            </button>
          </div>
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          onConfirm(pochonCount);
          onClose();
        }}
        pochonCount={pochonCount}
        action={action}
      />
    </div>
  );
};

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[300]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] p-6 rounded-lg w-[400px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
              Erreur
            </h3>
            <p className="text-white/70">
              {message}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-red-400/30"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CellDetail: React.FC<CellDetailProps> = ({ cell, onUpdate, index }) => {
  const [showFillSquareModal, setShowFillSquareModal] = useState(false);
  const [showPochonModal, setShowPochonModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const isEmptyCell = !cell.filled;
  const isTableEmpty = index <= 5 && index >= 0;

  const getWaterDate = (index: number) => {
    if (index === 9 || index === 10) return "23/03/25";
    if (index === 11 || index === 13) return "24/03/25";
    if (index === 14 || index === 18) return "25/03/25";
    if (index === 7 || index === 8) return "26/03/25";
    return "22/03/25";
  };

  const getLotNumber = (index: number) => {
    if (index >= 5 && index <= 19) { // Carrés 6 à 20
      return "2503-042 (Table A-01)";
    }
    return '-';
  };

  const handleFillSquare = (lotNumber: string) => {
    onUpdate({ 
      filled: 1,
      lotNumber
    });
  };

  const handlePochonUpdate = (pochonCount: number) => {
    onUpdate({ 
      pochonCount
    });
  };

  if (isEmptyCell) {
    return (
      <div className="space-y-4 bg-black/20 p-4 rounded-lg border border-white/10">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => !isTableEmpty ? setShowErrorModal(true) : setShowFillSquareModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 text-cyan-400 hover:text-cyan-300"
          >
            <Package size={20} />
            Remplir le carré {index + 1}
          </button>
          <button
            onClick={() => setShowPochonModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 text-white/70 hover:text-white"
          >
            <Package size={20} />
            Ajouter des pochons
          </button>
        </div>

        <FillSquareModal
          isOpen={showFillSquareModal}
          onClose={() => setShowFillSquareModal(false)}
          onConfirm={handleFillSquare}
          cellIndex={index}
        />

        <RopeModal
          isOpen={showPochonModal}
          onClose={() => setShowPochonModal(false)}
          onConfirm={handlePochonUpdate}
          action="fill"
          cellIndex={index}
          cell={cell}
        />

        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          message="Impossible, la table n'est pas vide."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-black/20 p-4 rounded-lg border border-white/10">
      <div className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Carré N°{index + 1}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white/60 text-sm">Date de mise à l'eau</label>
          <div className="text-white font-medium">{getWaterDate(index)}</div>
        </div>
        <div>
          <label className="text-white/60 text-sm">Numéro de lot</label>
          <div className="text-white font-medium">{getLotNumber(index)}</div>
        </div>
        <div>
          <label className="text-white/60 text-sm">Taille des huîtres</label>
          <div className="text-white font-medium">N°3</div>
        </div>
        <div>
          <label className="text-white/60 text-sm">Nombre d'exondations</label>
          <div className="text-white font-medium">12</div>
        </div>
        {index === 5 ? (
          <div className="col-span-2">
            <label className="text-white/60 text-sm">Pochons disponibles</label>
            <div className="text-white font-medium">17 / 50 - 170 Kg</div>
          </div>
        ) : index === 6 ? (
          <div className="col-span-2">
            <label className="text-white/60 text-sm">Pochons disponibles</label>
            <div className="text-white font-medium">19 / 50</div>
          </div>
        ) : index >= 7 && index <= 19 && (
          <div className="col-span-2">
            <label className="text-white/60 text-sm">Pochons disponibles</label>
            <div className="text-white font-medium">50 / 50</div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setShowPochonModal(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 text-cyan-400 hover:text-cyan-300 relative z-50"
        >
          <Package size={20} />
          Récolter les pochons
          <span className="text-sm text-white/60 ml-2">({index === 5 ? '17' : index === 6 ? '19' : '50'} max)</span>
        </button>
      </div>
      <RopeModal
        isOpen={showPochonModal}
        onClose={() => setShowPochonModal(false)}
        onConfirm={handlePochonUpdate}
        action="harvest"
        cellIndex={index}
        cell={cell}
      />
    </div>
  );
};

interface TrempeTableDetailProps {
  table: TrempeTable;
  onClose: () => void;
  onTableUpdate: (table: TrempeTable) => void;
}

export const TrempeTableDetail: React.FC<TrempeTableDetailProps> = ({
  table,
  onClose,
  onTableUpdate
}) => {
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  const initialCells = table.cells.map((cell, i) => ({
    ...cell,
    filled: i === 8 ? 1 : cell.filled // Index 8 correspond au carré 9
  }));

  useEffect(() => {
    onTableUpdate({
      ...table,
      cells: initialCells
    });
  }, []);

  const handleCellClick = (index: number) => {
    if (selectedCell === index) {
      setSelectedCell(null);
    } else {
      setSelectedCell(index);
    }
  };

  const handleCellUpdate = (index: number, updates: Partial<any>) => {
    const updatedTable = {
      ...table,
      cells: table.cells.map((cell, i) => 
        i === index ? { ...cell, ...updates } : cell
      )
    };
    onTableUpdate(updatedTable);
  };

  const handleFillAll = () => {
    const updatedTable = {
      ...table,
      cells: table.cells.map(cell => ({
        ...cell,
        filled: 1
      }))
    };
    onTableUpdate(updatedTable);
  };

  const handleExonder = () => {
    const updatedTable = {
      ...table,
      cells: table.cells.map(cell => ({
        ...cell,
        filled: 0
      }))
    };
    onTableUpdate(updatedTable);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]"
      onClick={handleBackdropClick}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] p-6 rounded-lg w-[800px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Gestion des cases
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-10 gap-0.5 bg-black/20 p-4 rounded-lg border border-white/10">
            {table.cells.map((cell, index) => (
              <button
                key={cell.id}
                onClick={() => handleCellClick(index)}
                className={`
                  w-16 h-10 rounded border relative overflow-hidden cursor-pointer transition-all duration-300
                  ${cell.filled > 0 
                    ? 'bg-cyan-500/40 border-cyan-400/50 hover:bg-cyan-500/50' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }
                  ${selectedCell === index ? 'ring-2 ring-cyan-400' : ''}
                `}
              >
                <div 
                  className="absolute top-0 right-0 bottom-0 bg-cyan-500/40"
                  style={{ width: `${cell.filled * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white/80">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>

          {selectedCell !== null && (
            <CellDetail 
              cell={table.cells[selectedCell]}
              onUpdate={(updates) => handleCellUpdate(selectedCell, updates)}
              index={selectedCell}
            />
          )}

          {selectedCell !== null && selectedCell <= 5 && (
            <div className="flex justify-center">
              <button
                onClick={handleFillAll}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 text-cyan-400 hover:text-cyan-300 transition-all duration-300"
              >
                <Droplets size={20} />
                Remplir Table
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
