import React, { useState } from 'react';

interface ExondationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExondation: (option: 'all' | 'right' | 'left' | 'custom', cells?: number[]) => void;
}

export const ExondationModal: React.FC<ExondationModalProps> = ({ isOpen, onClose, onExondation }) => {
  const [selectedOption, setSelectedOption] = useState<'all' | 'right' | 'left' | 'custom' | null>(null);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  if (!isOpen) return null;

  const handleCellClick = (index: number) => {
    if (selectedOption === 'custom') {
      setSelectedCells(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    }
  };

  const handleOptionClick = (option: 'all' | 'right' | 'left' | 'custom') => {
    setSelectedOption(option);
    setSelectedCells([]);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      setShowWarning(true);
    }
  };

  const handleFinalConfirm = () => {
    if (selectedOption === 'custom') {
      onExondation('custom', selectedCells);
    } else if (selectedOption) {
      onExondation(selectedOption);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="absolute inset-0" onClick={onClose} />
      
      {!showWarning ? (
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] p-6 rounded-lg w-96 shadow-xl border border-white/10" onClick={e => e.stopPropagation()}>
          <h3 className="text-xl font-semibold text-cyan-500 mb-4">Sélectionner la zone à exonder</h3>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={() => handleOptionClick('all')}
              aria-pressed={selectedOption === 'all'}
              className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                selectedOption === 'all'
                  ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              Table complète
            </button>
            
            <button
              onClick={() => handleOptionClick('right')}
              aria-pressed={selectedOption === 'right'}
              className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                selectedOption === 'right'
                  ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              Colonne droite
            </button>
            
            <button
              onClick={() => handleOptionClick('left')}
              aria-pressed={selectedOption === 'left'}
              className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                selectedOption === 'left'
                  ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              Colonne gauche
            </button>
            
            <button
              onClick={() => handleOptionClick('custom')}
              aria-pressed={selectedOption === 'custom'}
              className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                selectedOption === 'custom'
                  ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              Sélection personnalisée
            </button>
          </div>

          {selectedOption === 'custom' && (
            <div className="mb-6">
              <div className="grid grid-cols-10 gap-1 mb-4">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    onClick={() => handleCellClick(i + 1)}
                    role="button"
                    aria-label={`Cellule ${i + 1}`}
                    aria-pressed={selectedCells.includes(i + 1)}
                    className={`w-8 h-8 rounded-sm border cursor-pointer transition-colors flex items-center justify-center relative ${
                      selectedCells.includes(i + 1)
                        ? 'bg-cyan-500/40 border-cyan-500/30 hover:bg-cyan-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="absolute bottom-1 right-1 text-[10px] text-white/40 flex items-center justify-center relative">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-white/70 text-sm">Sélectionnez les cellules à exonder</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedOption || (selectedOption === 'custom' && selectedCells.length === 0)}
              className={`px-4 py-2 rounded-lg ${
                selectedOption && (selectedOption !== 'custom' || selectedCells.length > 0)
                  ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              Confirmer
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] p-6 rounded-lg w-96 shadow-xl border border-white/10" onClick={e => e.stopPropagation()}>
          <h3 className="text-xl font-semibold text-red-400 mb-6">⚠️ Attention</h3>
          
          <div className="space-y-4 text-white/90">
            <p>Un timer de 24h sera lancé à partir de la confirmation.</p>
            <p>Une notification de rappel sera envoyée toutes les 12h pour éviter d'oublier les huîtres hors de l'eau.</p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowWarning(false)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70"
            >
              Annuler
            </button>
            <button
              onClick={handleFinalConfirm}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Confirmer l'exondation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
