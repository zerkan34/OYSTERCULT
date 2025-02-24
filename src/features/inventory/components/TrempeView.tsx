import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Edit2, Package, Info, PieChart, History, Eye, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AnimatedCard } from '@/components/ui/AnimatedCard';

interface TrempeConfig {
  squares: number;
  rows: number;
  columns: number;
}

interface TrempeSquare {
  id: number;
  number: number;
  status: 'empty' | 'partial' | 'full';
  batches: {
    id: number;
    name: string;
    date: Date;
  }[];
  remainingRopes: number;
  totalRopes: number;
}

// Configuration de base
const config: TrempeConfig = {
  squares: 10,
  rows: 5,
  columns: 2
};

// Données de test
const mockSquares: TrempeSquare[] = [
  {
    id: 1,
    number: 1,
    status: 'full',
    remainingRopes: 0,
    totalRopes: 100,
    batches: [
      { id: 1, name: 'LOT-2024-001', date: new Date('2024-02-24') },
      { id: 2, name: 'LOT-2024-002', date: new Date('2024-02-23') },
      { id: 3, name: 'LOT-2024-003', date: new Date('2024-02-22') }
    ]
  },
  {
    id: 2,
    number: 2,
    status: 'partial',
    remainingRopes: 50,
    totalRopes: 100,
    batches: [
      { id: 4, name: 'LOT-2024-004', date: new Date('2024-02-24') }
    ]
  },
  {
    id: 3,
    number: 3,
    status: 'empty',
    remainingRopes: 100,
    totalRopes: 100,
    batches: []
  },
  {
    id: 4,
    number: 4,
    status: 'full',
    remainingRopes: 0,
    totalRopes: 100,
    batches: [
      { id: 5, name: 'LOT-2024-005', date: new Date('2024-02-24') },
      { id: 6, name: 'LOT-2024-006', date: new Date('2024-02-23') }
    ]
  },
  {
    id: 5,
    number: 5,
    status: 'partial',
    remainingRopes: 50,
    totalRopes: 100,
    batches: [
      { id: 7, name: 'LOT-2024-007', date: new Date('2024-02-24') },
      { id: 8, name: 'LOT-2024-008', date: new Date('2024-02-23') }
    ]
  },
  {
    id: 6,
    number: 6,
    status: 'empty',
    remainingRopes: 100,
    totalRopes: 100,
    batches: []
  },
  {
    id: 7,
    number: 7,
    status: 'full',
    remainingRopes: 0,
    totalRopes: 100,
    batches: [
      { id: 9, name: 'LOT-2024-009', date: new Date('2024-02-24') },
      { id: 10, name: 'LOT-2024-010', date: new Date('2024-02-23') },
      { id: 11, name: 'LOT-2024-011', date: new Date('2024-02-22') }
    ]
  },
  {
    id: 8,
    number: 8,
    status: 'partial',
    remainingRopes: 50,
    totalRopes: 100,
    batches: [
      { id: 12, name: 'LOT-2024-012', date: new Date('2024-02-24') }
    ]
  },
  {
    id: 9,
    number: 9,
    status: 'empty',
    remainingRopes: 100,
    totalRopes: 100,
    batches: []
  },
  {
    id: 10,
    number: 10,
    status: 'full',
    remainingRopes: 0,
    totalRopes: 100,
    batches: [
      { id: 13, name: 'LOT-2024-013', date: new Date('2024-02-24') },
      { id: 14, name: 'LOT-2024-014', date: new Date('2024-02-23') }
    ]
  }
];

const TrempeView: React.FC = () => {
  const [hoveredSquare, setHoveredSquare] = useState<TrempeSquare | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<TrempeSquare | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [modalHovered, setModalHovered] = useState(false);
  const [showFixedModal, setShowFixedModal] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedSquare, setEditedSquare] = useState<TrempeSquare | null>(null);

  // Fonction pour gérer la sauvegarde des modifications
  const handleSaveChanges = () => {
    if (editedSquare) {
      // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications dans votre backend
      setSelectedSquare(editedSquare);
      setEditMode(false);
    }
  };

  // Fonction pour gérer les modifications des champs
  const handleFieldChange = (field: keyof TrempeSquare, value: any) => {
    if (editedSquare) {
      setEditedSquare({
        ...editedSquare,
        [field]: value
      });
    }
  };

  // Gestionnaire pour fermer le modal
  const handleCloseModal = () => {
    setSelectedSquare(null);
    setEditMode(false);
    setEditedSquare(null);
  };

  // Gestionnaire pour la touche Echap
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Styles pour la scrollbar personnalisée et le modal
  const customStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .trempe-modal {
      pointer-events: all !important;
      user-select: none;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
  `;

  const handleSquareClick = (square: TrempeSquare) => {
    setSelectedSquare(square);
  };

  const handleMouseEnter = (square: TrempeSquare, e: React.MouseEvent) => {
    setHoveredSquare(square);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    if (!modalHovered) {
      setHoveredSquare(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="p-4">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-white">Vue satellite des trempes</h2>
          <button className="glass-effect p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Settings size={18} className="text-white/60" />
          </button>
        </div>

        {/* Vue principale */}
        <div className="glass-effect rounded-xl p-4">
          {/* Layout en grid pour organiser les éléments */}
          <div className="grid grid-cols-3 gap-4">
            {/* Colonne 1: Stats pleins + Table */}
            <div className="space-y-4">
              <div className="glass-effect rounded-lg p-2 text-center">
                <div className="text-brand-primary text-lg font-medium">
                  {mockSquares.filter(s => s.status === 'full').length}
                </div>
                <div className="text-[10px] text-white/60">Carrés pleins</div>
              </div>

              {/* Grille des carrés */}
              <div className="glass-effect rounded-xl p-4">
                <div className="grid gap-2" style={{ 
                  gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${config.rows}, minmax(0, 1fr))`,
                }}>
                  {mockSquares.map((square) => (
                    <div
                      key={square.id}
                      onMouseEnter={(e) => handleMouseEnter(square, e)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                      onClick={() => handleSquareClick(square)}
                      className={`relative flex flex-col justify-between p-2 transition-all duration-200 cursor-pointer rounded-lg ${
                        square.status === 'full' 
                          ? 'bg-brand-primary/10 border border-brand-primary/30' 
                          : square.status === 'partial'
                          ? 'bg-brand-tertiary/10 border border-brand-tertiary/30'
                          : 'bg-white/5 border border-white/10'
                      } hover:scale-[1.02]`}
                    >
                      {/* Indicateur de remplissage */}
                      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                        square.status === 'full'
                          ? 'bg-brand-primary/20'
                          : square.status === 'partial'
                          ? 'bg-brand-tertiary/20'
                          : 'bg-white/5'
                      }`} style={{
                        height: square.status === 'full' ? '100%' : square.status === 'partial' ? '50%' : '0%',
                        bottom: 0
                      }} />

                      {/* Contenu du carré */}
                      <div className="relative z-10">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            square.status === 'full'
                              ? 'bg-brand-primary'
                              : square.status === 'partial'
                              ? 'bg-brand-tertiary'
                              : 'bg-white/20'
                          }`} />
                          <div className="text-[10px] text-white/60">Carré {square.number}</div>
                        </div>
                      </div>
                      <div className="relative z-10 text-[10px] text-white/60">{square.batches.length} lots</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne 2: Stats partiels + Table */}
            <div className="space-y-4">
              <div className="glass-effect rounded-lg p-2 text-center">
                <div className="text-brand-tertiary text-lg font-medium">
                  {mockSquares.filter(s => s.status === 'partial').length}
                </div>
                <div className="text-[10px] text-white/60">Carrés partiels</div>
              </div>

              {/* Grille des carrés */}
              <div className="glass-effect rounded-xl p-4">
                <div className="grid gap-2" style={{ 
                  gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${config.rows}, minmax(0, 1fr))`,
                }}>
                  {mockSquares.map((square) => (
                    <div
                      key={square.id}
                      onMouseEnter={(e) => handleMouseEnter(square, e)}
                      onMouseLeave={() => {
                        if (!modalHovered) {
                          setHoveredSquare(null);
                        }
                      }}
                      onMouseMove={handleMouseMove}
                      onClick={() => handleSquareClick(square)}
                      className={`relative flex flex-col justify-between p-2 transition-all duration-200 cursor-pointer rounded-lg ${
                        square.status === 'full' 
                          ? 'bg-brand-primary/10 border border-brand-primary/30' 
                          : square.status === 'partial'
                          ? 'bg-brand-tertiary/10 border border-brand-tertiary/30'
                          : 'bg-white/5 border border-white/10'
                      } hover:scale-[1.02]`}
                    >
                      {/* Indicateur de remplissage */}
                      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                        square.status === 'full'
                          ? 'bg-brand-primary/20'
                          : square.status === 'partial'
                          ? 'bg-brand-tertiary/20'
                          : 'bg-white/5'
                      }`} style={{
                        height: square.status === 'full' ? '100%' : square.status === 'partial' ? '50%' : '0%',
                        bottom: 0
                      }} />

                      {/* Contenu du carré */}
                      <div className="relative z-10">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            square.status === 'full'
                              ? 'bg-brand-primary'
                              : square.status === 'partial'
                              ? 'bg-brand-tertiary'
                              : 'bg-white/20'
                          }`} />
                          <div className="text-[10px] text-white/60">Carré {square.number}</div>
                        </div>
                      </div>
                      <div className="relative z-10 text-[10px] text-white/60">{square.batches.length} lots</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne 3: Stats vides + Modal fixe */}
            <div className="space-y-4">
              <div className="glass-effect rounded-lg p-2 text-center flex items-center justify-between">
                <div>
                  <div className="text-white/60 text-lg font-medium">
                    {mockSquares.filter(s => s.status === 'empty').length}
                  </div>
                  <div className="text-[10px] text-white/60">Carrés vides</div>
                </div>
                <button
                  onClick={() => setShowFixedModal(!showFixedModal)}
                  className={`p-2 rounded-lg transition-colors ${
                    showFixedModal ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/5 text-white/60'
                  }`}
                >
                  <Eye size={18} />
                </button>
              </div>

              {/* Modal fixe */}
              <AnimatePresence>
                {showFixedModal && (hoveredSquare || modalHovered) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="glass-effect rounded-lg p-4 w-full trempe-modal"
                    onMouseEnter={() => setModalHovered(true)}
                    onMouseLeave={() => {
                      setModalHovered(false);
                      setHoveredSquare(null);
                    }}
                  >
                    {hoveredSquare ? (
                      <>
                        {/* En-tête du modal */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              hoveredSquare.status === 'full'
                                ? 'bg-brand-primary'
                                : hoveredSquare.status === 'partial'
                                ? 'bg-brand-tertiary'
                                : 'bg-white/20'
                            }`} />
                            <h3 className="text-sm font-medium text-white">Carré {hoveredSquare.number}</h3>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            hoveredSquare.status === 'full'
                              ? 'bg-brand-primary/20 text-brand-primary'
                              : hoveredSquare.status === 'partial'
                              ? 'bg-brand-tertiary/20 text-brand-tertiary'
                              : 'bg-white/10 text-white/60'
                          }`}>
                            {hoveredSquare.status === 'full' ? 'Plein' : hoveredSquare.status === 'partial' ? 'Partiel' : 'Vide'}
                          </div>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="glass-effect rounded-lg p-3 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 mb-2">
                              <Package size={14} className="text-white/60" />
                              <span className="text-xs text-white/60">Lots</span>
                            </div>
                            <div className="text-lg font-medium text-white">{hoveredSquare.batches.length}</div>
                          </div>
                          <div className="glass-effect rounded-lg p-3 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 mb-2">
                              <PieChart size={14} className="text-white/60" />
                              <span className="text-xs text-white/60">Capacité</span>
                            </div>
                            <div className="text-lg font-medium text-white">
                              {hoveredSquare.status === 'full' ? '100%' : hoveredSquare.status === 'partial' ? '50%' : '0%'}
                            </div>
                          </div>
                          <div className="glass-effect rounded-lg p-3 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 mb-2">
                              <Package size={14} className="text-white/60" />
                              <span className="text-xs text-white/60">Cordes restantes</span>
                            </div>
                            <div className="text-lg font-medium text-white">
                              {hoveredSquare.remainingRopes}/{hoveredSquare.totalRopes}
                            </div>
                          </div>
                        </div>

                        {/* Liste des lots */}
                        <div className="glass-effect rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <History size={14} className="text-white/60" />
                              <span className="text-xs text-white/60">Lots dans ce carré</span>
                            </div>
                            <span className="text-xs text-white/40">{hoveredSquare.batches.length} lots</span>
                          </div>
                          <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                            {hoveredSquare.batches.map((batch) => (
                              <div
                                key={batch.id}
                                className="glass-effect rounded-lg p-2 hover:bg-white/5 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-white">{batch.name}</span>
                                  <span className="text-xs text-white/60">
                                    {format(batch.date, 'dd MMM yyyy', { locale: fr })}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button 
                            className="flex-1 glass-effect rounded-lg py-2 px-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Edit2 size={14} className="text-white/60" />
                            <span className="text-xs text-white/60">Modifier</span>
                          </button>
                          <button 
                            className="flex-1 glass-effect rounded-lg py-2 px-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Plus size={14} className="text-white/60" />
                            <span className="text-xs text-white/60">Ajouter un lot</span>
                          </button>
                        </div>
                      </>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Modal de détail au clic */}
        <AnimatePresence>
          {selectedSquare && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={(e) => {
                // Ferme le modal uniquement si on clique sur l'arrière-plan
                if (e.target === e.currentTarget) {
                  handleCloseModal();
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="glass-effect rounded-xl p-6 max-w-2xl w-full mx-4 relative custom-scrollbar overflow-y-auto max-h-[90vh]"
              >
                {/* Bouton fermer */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>

                {/* En-tête */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedSquare.status === 'full'
                      ? 'bg-brand-primary'
                      : selectedSquare.status === 'partial'
                      ? 'bg-brand-tertiary'
                      : 'bg-white/20'
                  }`} />
                  {editMode ? (
                    <input
                      type="number"
                      value={editedSquare?.number || selectedSquare.number}
                      onChange={(e) => handleFieldChange('number', parseInt(e.target.value))}
                      className="bg-white/10 text-xl font-medium text-white px-3 py-1 rounded-lg outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  ) : (
                    <h2 className="text-xl font-medium text-white">Carré {selectedSquare.number}</h2>
                  )}
                  <select
                    value={editMode ? editedSquare?.status || selectedSquare.status : selectedSquare.status}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                    disabled={!editMode}
                    className={`text-sm px-3 py-1 rounded-full ${
                      selectedSquare.status === 'full'
                        ? 'bg-brand-primary/20 text-brand-primary'
                        : selectedSquare.status === 'partial'
                        ? 'bg-brand-tertiary/20 text-brand-tertiary'
                        : 'bg-white/10 text-white/60'
                    } ${!editMode && 'cursor-not-allowed'}`}
                  >
                    <option value="full">Plein</option>
                    <option value="partial">Partiel</option>
                    <option value="empty">Vide</option>
                  </select>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={16} className="text-white/60" />
                      <span className="text-sm text-white/60">Lots</span>
                    </div>
                    <div className="text-2xl font-medium text-white">
                      {editMode ? (
                        <input
                          type="number"
                          value={editedSquare?.batches.length || selectedSquare.batches.length}
                          onChange={(e) => handleFieldChange('batches', Array(parseInt(e.target.value)).fill(null))}
                          className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                      ) : (
                        selectedSquare.batches.length
                      )}
                    </div>
                  </div>
                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={16} className="text-white/60" />
                      <span className="text-sm text-white/60">Cordes restantes</span>
                    </div>
                    <div className="text-2xl font-medium text-white">
                      {editMode ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editedSquare?.remainingRopes || selectedSquare.remainingRopes}
                            onChange={(e) => handleFieldChange('remainingRopes', parseInt(e.target.value))}
                            className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                          <span>/</span>
                          <input
                            type="number"
                            value={editedSquare?.totalRopes || selectedSquare.totalRopes}
                            onChange={(e) => handleFieldChange('totalRopes', parseInt(e.target.value))}
                            className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                        </div>
                      ) : (
                        `${selectedSquare.remainingRopes}/${selectedSquare.totalRopes}`
                      )}
                    </div>
                  </div>
                </div>

                {/* Liste des lots */}
                <div className="glass-effect rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <History size={16} className="text-white/60" />
                      <h3 className="text-lg font-medium text-white">Lots dans ce carré</h3>
                    </div>
                    <span className="text-sm text-white/40">{selectedSquare.batches.length} lots</span>
                  </div>
                  <div className="space-y-3">
                    {(editMode ? editedSquare?.batches : selectedSquare.batches).map((batch, index) => (
                      <div
                        key={batch.id}
                        className="glass-effect rounded-lg p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          {editMode ? (
                            <>
                              <input
                                type="text"
                                value={batch.name}
                                onChange={(e) => {
                                  const newBatches = [...(editedSquare?.batches || selectedSquare.batches)];
                                  newBatches[index] = { ...batch, name: e.target.value };
                                  handleFieldChange('batches', newBatches);
                                }}
                                className="bg-white/10 text-lg font-medium text-white px-3 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                              />
                              <input
                                type="date"
                                value={format(batch.date, 'yyyy-MM-dd')}
                                onChange={(e) => {
                                  const newBatches = [...(editedSquare?.batches || selectedSquare.batches)];
                                  newBatches[index] = { ...batch, date: new Date(e.target.value) };
                                  handleFieldChange('batches', newBatches);
                                }}
                                className="bg-white/10 text-sm text-white/60 px-3 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                              />
                            </>
                          ) : (
                            <>
                              <span className="text-lg font-medium text-white">{batch.name}</span>
                              <span className="text-sm text-white/60">
                                {format(batch.date, 'dd MMM yyyy', { locale: fr })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {editMode ? (
                    <>
                      <button 
                        onClick={handleSaveChanges}
                        className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                      >
                        <Save size={16} className="text-white/60" />
                        <span>Sauvegarder</span>
                      </button>
                      <button 
                        onClick={handleCloseModal}
                        className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                      >
                        <X size={16} className="text-white/60" />
                        <span>Annuler</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setEditMode(true);
                          setEditedSquare({...selectedSquare});
                        }}
                        className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                      >
                        <Edit2 size={16} className="text-white/60" />
                        <span>Modifier</span>
                      </button>
                      <button 
                        className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                      >
                        <Plus size={16} className="text-white/60" />
                        <span>Ajouter un lot</span>
                      </button>
                      <button 
                        className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                      >
                        <History size={16} className="text-white/60" />
                        <span>Historique</span>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default TrempeView;
