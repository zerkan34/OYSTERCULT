import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Edit2, Package, Info, PieChart, History, Eye, X, Save } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { useStore } from '@/lib/store';
import { Batch as TraceabilityBatch } from '@/features/traceability/types';

interface TrempeConfig {
  squares: number;
  rows: number;
  columns: number;
}

interface TrempeSquare {
  id: string;
  status: 'empty' | 'partial' | 'full';
  batches: Batch[];
  number: number;
  remainingRopes?: number;
  totalRopes?: number;
}

interface Batch {
  id: string;
  name: string;
  date: Date;
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
    id: '1',
    number: 1,
    status: 'full',
    remainingRopes: 0,     // 0 cordes restantes car carré plein
    totalRopes: 100,
    batches: [
      { id: '101', name: 'Lot 2023-A', date: new Date(2023, 2, 15) },
      { id: '102', name: 'Lot 2023-B', date: new Date(2023, 3, 20) }
    ]
  },
  {
    id: '2',
    number: 2,
    status: 'partial',
    remainingRopes: 50,    // 50 cordes restantes car carré partiellement rempli
    totalRopes: 100,
    batches: [
      { id: '103', name: 'Lot 2023-C', date: new Date(2023, 4, 10) }
    ]
  },
  {
    id: '3',
    number: 3,
    status: 'empty',
    remainingRopes: 100,   // 100 cordes restantes car carré vide
    totalRopes: 100,
    batches: []            // pas de lots car carré vide
  },
  {
    id: '4',
    number: 4,
    status: 'full',
    remainingRopes: 0,     // 0 cordes restantes car carré plein
    totalRopes: 100,
    batches: [
      { id: '104', name: 'Lot 2023-D', date: new Date(2023, 5, 15) },
      { id: '105', name: 'Lot 2023-E', date: new Date(2023, 6, 20) }
    ]
  },
  {
    id: '5',
    number: 5,
    status: 'partial',
    remainingRopes: 40,    // 40 cordes restantes avec 2 lots (30 cordes par lot)
    totalRopes: 100,
    batches: [
      { id: '106', name: 'Lot 2023-F', date: new Date(2023, 7, 10) },
      { id: '107', name: 'Lot 2023-G', date: new Date(2023, 8, 20) }
    ]
  },
  {
    id: '6',
    number: 6,
    status: 'empty',
    remainingRopes: 100,   // 100 cordes restantes car carré vide
    totalRopes: 100,
    batches: []            // pas de lots car carré vide
  },
  {
    id: '7',
    number: 7,
    status: 'full',
    remainingRopes: 0,     // 0 cordes restantes car carré plein
    totalRopes: 100,
    batches: [
      { id: '108', name: 'Lot 2023-H', date: new Date(2023, 9, 15) },
      { id: '109', name: 'Lot 2023-I', date: new Date(2023, 10, 20) },
      { id: '110', name: 'Lot 2023-J', date: new Date(2023, 11, 10) }
    ]
  },
  {
    id: '8',
    number: 8,
    status: 'partial',
    remainingRopes: 70,    // 70 cordes restantes avec 1 lot (30 cordes par lot)
    totalRopes: 100,
    batches: [
      { id: '111', name: 'Lot 2023-K', date: new Date(2023, 0, 15) }
    ]
  },
  {
    id: '9',
    number: 9,
    status: 'empty',
    remainingRopes: 100,   // 100 cordes restantes car carré vide
    totalRopes: 100,
    batches: []            // pas de lots car carré vide
  },
  {
    id: '10',
    number: 10,
    status: 'full',
    remainingRopes: 0,     // 0 cordes restantes car carré plein
    totalRopes: 100,
    batches: [
      { id: '112', name: 'Lot 2023-L', date: new Date(2023, 1, 20) },
      { id: '113', name: 'Lot 2023-M', date: new Date(2023, 2, 10) }
    ]
  }
];

// Fonction pour convertir un lot de traçabilité au format du lot de trempe
const convertBatchToTrempeBatch = (batch: TraceabilityBatch, index: number): Batch => {
  return {
    id: String(index + 1),
    name: batch.batchNumber || `Lot ${batch.id}`,
    date: batch.startDate ? new Date(batch.startDate) : new Date()
  };
};

// Fonction pour trouver le numéro de carré de trempe à partir du statut du lot
const getSquareNumberFromBatchStatus = (status: TraceabilityBatch['status'] | string) => {
  if (status === 'table1') return 1;
  if (status === 'table2') return 2;
  if (status === 'table3') return 3;
  return 0; // Par défaut, renvoie 0 (aucun carré assigné)
};

export function TrempeView() {
  const [hoveredSquare, setHoveredSquare] = useState<TrempeSquare | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<TrempeSquare | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [modalHovered, setModalHovered] = useState(false);
  const [showFixedModal, setShowFixedModal] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedSquare, setEditedSquare] = useState<TrempeSquare | null>(null);
  const [trempeSquares, setTrempeSquares] = useState<TrempeSquare[]>(mockSquares);
  const [showAddRopeModal, setShowAddRopeModal] = useState(false);
  const [newRopeData, setNewRopeData] = useState({
    type: '',
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd')
  });
  
  // Récupérer les lots depuis le store
  const { batches, updateBatch } = useStore();

  // Effet pour synchroniser les lots de traçabilité avec les carrés de trempe
  useEffect(() => {
    // Créer une carte des lots par carré de trempe
    const batchesBySquare: Record<number, Batch[]> = {};
    
    // Initialiser la carte avec des tableaux vides
    for (let i = 1; i <= config.squares; i++) {
      batchesBySquare[i] = [];
    }
    
    // Regrouper les lots par carré de trempe
    batches.forEach((batch: TraceabilityBatch, index: number) => {
      const squareNumber = getSquareNumberFromBatchStatus(batch.status);
      
      if (squareNumber > 0 && squareNumber <= config.squares) {
        batchesBySquare[squareNumber].push(convertBatchToTrempeBatch(batch, index));
      }
    });
    
    // Mettre à jour les carrés de trempe avec les lots réels
    const newTrempeSquares = trempeSquares.map(square => {
      const squareBatches = batchesBySquare[square.number] || [];
      
      // Déterminer le statut en fonction du nombre de lots
      let status: 'empty' | 'partial' | 'full' = 'empty';
      if (squareBatches.length > 0) {
        status = squareBatches.length >= 3 ? 'full' : 'partial';
      }
      
      return {
        ...square,
        batches: squareBatches,
        status: status,
        remainingRopes: squareBatches.length === 0 ? square.totalRopes : Math.max(0, square.totalRopes - (squareBatches.length * 25))
      };
    });
    
    setTrempeSquares(newTrempeSquares);
    
    // Si un carré est sélectionné, mettre à jour ses informations
    if (selectedSquare) {
      const updatedSelectedSquare = newTrempeSquares.find(s => s.id === selectedSquare.id) || null;
      setSelectedSquare(updatedSelectedSquare);
      if (editMode && editedSquare) {
        setEditedSquare(updatedSelectedSquare);
      }
    }
  }, [batches]);

  // Fonction pour gérer la sauvegarde des modifications
  const handleSaveChanges = () => {
    if (editedSquare) {
      // Mettre à jour les lots dans le store de traçabilité en fonction des modifications
      if (selectedSquare && selectedSquare.batches.length !== editedSquare.batches.length) {
        updateLotsForTrempeSquare(selectedSquare.number, editedSquare.number);
      }
      
      // Mettre à jour le carré sélectionné
      setSelectedSquare(editedSquare);
      setEditMode(false);
    }
  };
  
  // Fonction pour mettre à jour les lots dans le store lorsqu'on change le carré
  const updateLotsForTrempeSquare = (oldSquareNumber: number, newSquareNumber: number) => {
    // Récupérer le statut correspondant au nouveau carré
    let newStatus: 'table1' | 'table2' | 'table3';
    
    if (newSquareNumber === 1) newStatus = 'table1';
    else if (newSquareNumber === 2) newStatus = 'table2';
    else newStatus = 'table3';
    
    // Mettre à jour le statut des lots associés au carré
    batches.forEach((batch: TraceabilityBatch) => {
      const batchSquareNumber = getSquareNumberFromBatchStatus(batch.status);
      
      if (batchSquareNumber === oldSquareNumber) {
        updateBatch({
          ...batch,
          status: newStatus as TraceabilityBatch['status']
        });
      }
    });
  };

  // Fonction pour ajouter un lot à un carré (nouveau)
  const addBatchToSquare = (squareNumber: number) => {
    // Ouvrir un dialogue pour créer un nouveau lot
    if (selectedSquare) {
      // Ici, on pourrait ouvrir un modal de création de lot
      // ou rediriger vers le tableau de traçabilité
      
      alert(`Pour ajouter une corde au carré ${squareNumber}, veuillez utiliser la section Traçabilité`);
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
    /* Styles de scrollbar supprimés pour utiliser les styles globaux définis dans index.css */

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
        {/* En-tête avec effet glow */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-white relative">
            <span className="relative z-10">Vue satellite des trempes</span>
            <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-gradient-to-r from-brand-primary via-blue-400 to-transparent rounded-full blur-[1px]"></span>
          </h2>
          <button className="glass-effect p-2 rounded-lg hover:bg-white/5 transition-colors shadow-glow-subtle">
            <Settings size={18} className="text-white/60" />
          </button>
        </div>

        {/* Vue principale avec effet de glow */}
        <div className="glass-effect rounded-xl p-6 border border-white/10 shadow-glow-main relative">
          {/* Layout en grid pour organiser les éléments horizontalement */}
          <div className="flex flex-col gap-6">
            {/* Statistiques générales - Maintenant dans une barre horizontale avec effet de glow */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 shadow-inner-glow">
              {/* Statistique des carrés pleins */}
              <div className="flex items-center gap-3 border-r border-r-white/10 pr-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center shadow-glow-blue">
                  <div className="w-3 h-3 rounded-full bg-brand-primary glow-dot-blue"/>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/60 text-xs">Carrés pleins</span>
                  <span className="text-brand-primary text-lg font-medium glow-text-blue">
                    {trempeSquares.filter((s) => s.status === 'full').length}
                  </span>
                </div>
              </div>
              
              {/* Statistique des carrés partiels */}
              <div className="flex items-center gap-3 border-r border-r-white/10 pr-4">
                <div className="w-10 h-10 rounded-lg bg-brand-tertiary/20 flex items-center justify-center shadow-glow-gold">
                  <div className="w-3 h-3 rounded-full bg-brand-tertiary glow-dot-gold"/>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/60 text-xs">Carrés partiels</span>
                  <span className="text-brand-tertiary text-lg font-medium glow-text-gold">
                    {trempeSquares.filter((s) => s.status === 'partial').length}
                  </span>
                </div>
              </div>
              
              {/* Statistique des carrés vides */}
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white/20"/>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/60 text-xs">Carrés vides</span>
                    <span className="text-white/80 text-lg font-medium">
                      {trempeSquares.filter((s) => s.status === 'empty').length}
                    </span>
                  </div>
                </div>
                
                {/* Bouton pour activer/désactiver le modal fixe */}
                <button
                  onClick={() => setShowFixedModal(!showFixedModal)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    showFixedModal 
                      ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30 shadow-glow-blue-button' 
                      : 'bg-white/5 text-white/60 border border-white/10'
                  }`}
                  title={showFixedModal ? "Désactiver le modal fixe" : "Activer le modal fixe"}
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            {/* Layout en deux colonnes pour la vue satellite et les détails */}
            <div className="flex gap-6">
              {/* Vue satellite réduite de moitié */}
              <div className="w-1/2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-inner-glow">
                  <h2 className="text-white/80 text-sm font-medium mb-3">Vue satellite des trempes</h2>
                  
                  {/* Vue des carrés avec effet de glow - structure identique */}
                  <div className="grid grid-cols-5 gap-3">
                    {trempeSquares.map((square) => (
                      <div
                        key={square.id}
                        onMouseEnter={(e) => {
                          setHoveredSquare(square);
                          handleMouseEnter(square, e);
                        }}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                        onClick={() => handleSquareClick(square)}
                        className={`relative p-3 rounded-xl border ${
                          square.status === 'full'
                            ? 'border-blue-400/30 bg-gradient-to-br from-blue-900/20 to-blue-800/5 shadow-trempe-blue'
                            : square.status === 'partial'
                            ? 'border-yellow-400/30 bg-gradient-to-br from-yellow-700/20 to-yellow-600/5 shadow-trempe-gold'
                            : 'border-white/5 bg-gradient-to-br from-white/5 to-transparent'
                        } cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.03] hover:shadow-glow-${
                          square.status === 'full'
                            ? 'blue-intense'
                            : square.status === 'partial'
                            ? 'gold-intense'
                            : 'white'
                        }`}
                      >
                        {/* Indicateur de remplissage avec effet de glow */}
                        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                          square.status === 'full'
                            ? 'bg-gradient-to-t from-brand-primary/30 to-brand-primary/5'
                            : square.status === 'partial'
                            ? 'bg-gradient-to-t from-brand-tertiary/30 to-brand-tertiary/5'
                            : ''
                        }`} />
                        
                        {/* Contenu du carré avec nouveau layout */}
                        <div className="relative z-10 flex flex-col justify-between h-full">
                          {/* Numéro du carré et indicateur */}
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-lg font-medium ${
                              square.status === 'full'
                                ? 'text-brand-primary glow-text-blue'
                                : square.status === 'partial'
                                ? 'text-brand-tertiary glow-text-gold'
                                : 'text-white/60'
                            }`}>
                              {square.number}
                            </span>
                            <div className={`h-2.5 w-2.5 rounded-full ${
                              square.status === 'full'
                                ? 'bg-brand-primary glow-dot-blue'
                                : square.status === 'partial'
                                ? 'bg-brand-tertiary glow-dot-gold'
                                : 'bg-white/20'
                            }`} />
                          </div>
                          
                          {/* Indicateur de cordes */}
                          <div className="flex items-center justify-between">
                            <div className={`text-xs ${
                              square.batches.length > 0
                                ? 'text-white/80'
                                : 'text-white/40'
                            }`}>
                              {square.batches.length > 0 
                                ? `${square.batches.length} corde${square.batches.length > 1 ? 's' : ''}`
                                : 'Aucune corde'}
                            </div>
                            
                            {/* Indicateur de cordes */}
                            <div className={`text-xs flex items-center gap-1 ${
                              square.status !== 'empty'
                                ? 'text-white/80'
                                : 'text-white/40'
                            }`}>
                              {square.totalRopes !== undefined && square.remainingRopes !== undefined 
                                ? (square.totalRopes - square.remainingRopes) 
                                : 0}
                              <span className="text-white/20">/</span>
                              <span className="text-white/40">{square.totalRopes !== undefined ? square.totalRopes : 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Panneau de détails à droite */}
              <div className="w-1/2 glass-effect rounded-xl border border-white/10 backdrop-blur-md p-4 shadow-glow-subtle">
                {/* Affichage des détails du carré sélectionné ou survolé */}
                {(hoveredSquare || selectedSquare) ? (
                  <div className="h-full">
                    {/* En-tête du modal */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          (hoveredSquare || selectedSquare).status === 'full'
                            ? 'bg-brand-primary glow-dot-blue'
                            : (hoveredSquare || selectedSquare).status === 'partial'
                            ? 'bg-brand-tertiary glow-dot-gold'
                            : 'bg-white/20'
                        }`} />
                        <h3 className="text-sm font-semibold text-white">Carré {(hoveredSquare || selectedSquare).number}</h3>
                      </div>
                      <div className={`text-xs px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        (hoveredSquare || selectedSquare).status === 'full'
                          ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/20'
                          : (hoveredSquare || selectedSquare).status === 'partial'
                          ? 'bg-brand-tertiary/20 text-brand-tertiary border border-brand-tertiary/20'
                          : 'bg-white/10 text-white/60 border border-white/10'
                      }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                        {(hoveredSquare || selectedSquare).status === 'full' ? 'Plein' : (hoveredSquare || selectedSquare).status === 'partial' ? 'Partiel' : 'Vide'}
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className={`glass-effect rounded-lg p-2 text-center flex-1 border ${
                        (hoveredSquare || selectedSquare).batches.length > 0 
                        ? 'border-brand-primary/20 shadow-glow-blue' 
                        : 'border-white/10'
                      }`}>
                        <div className={`${(hoveredSquare || selectedSquare).batches.length > 0 ? 'text-brand-primary glow-text-blue' : 'text-white/60'} text-lg font-medium`}>
                          {(hoveredSquare || selectedSquare).batches.length}
                        </div>
                        <div className="text-[10px] text-white/60">Cordes</div>
                      </div>
                      
                      <div className={`glass-effect rounded-lg p-2 text-center flex-1 border ${
                        (hoveredSquare || selectedSquare).status !== 'empty'
                        ? 'border-brand-tertiary/20 shadow-glow-gold' 
                        : 'border-white/10'
                      }`}>
                        <div className={`${(hoveredSquare || selectedSquare).status !== 'empty' ? 'text-brand-tertiary glow-text-gold' : 'text-white/60'} text-lg font-medium`}>
                          {(hoveredSquare || selectedSquare).status === 'full' ? '100%' : (hoveredSquare || selectedSquare).status === 'partial' ? '50%' : '0%'}
                        </div>
                        <div className="text-[10px] text-white/60">Capacité</div>
                      </div>
                      
                      <div className="glass-effect rounded-lg p-2 flex flex-col justify-between border border-white/10">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-white/60 text-lg font-medium">{(hoveredSquare || selectedSquare).totalRopes !== undefined && (hoveredSquare || selectedSquare).remainingRopes !== undefined 
                              ? ((hoveredSquare || selectedSquare).totalRopes - (hoveredSquare || selectedSquare).remainingRopes) 
                              : 0}</span>
                            <span className="text-white/40 text-xs">/</span>
                            <span className="text-white/40 text-sm">{(hoveredSquare || selectedSquare).totalRopes !== undefined ? (hoveredSquare || selectedSquare).totalRopes : 0}</span>
                          </div>
                          <div className="text-[10px] text-white/60">Cordes</div>
                        </div>
                      </div>
                    </div>

                    {/* Liste des cordes */}
                    <div className="mb-1">
                      {(hoveredSquare || selectedSquare).batches.length > 0 ? (
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-white/10">
                              <History size={14} className="text-white" />
                            </div>
                            <span className="text-xs text-white/70 font-medium">Cordes dans ce carré</span>
                          </div>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                            {(hoveredSquare || selectedSquare).batches.length} corde{(hoveredSquare || selectedSquare).batches.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-white/40 text-sm">
                          Aucune corde dans ce carré
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="p-3 rounded-full bg-white/5 mb-3">
                      <Info size={24} className="text-white/40" />
                    </div>
                    <p className="text-white/60 text-center">
                      Sélectionnez un carré. Cliquez sur un carré pour voir ses détails et gérer son contenu.
                    </p>
                  </div>
                )}
              </div>
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
                  <div className="flex items-center gap-2">
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
                      } ${!editMode && 'cursor-not-allowed'} [&>option]:bg-gray-800 [&>option]:text-white`}
                    >
                      <option value="full" className="text-white">Plein</option>
                      <option value="partial" className="text-white">Partiel</option>
                      <option value="empty" className="text-white/60">Vide</option>
                    </select>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={16} className="text-white/60" />
                      <span className="text-sm text-white/60">Cordes</span>
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
                      <span className="text-sm text-white/60">Cordes utilisées</span>
                    </div>
                    <div className="text-2xl font-medium text-white">
                      {editMode ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editedSquare?.totalRopes !== undefined ? editedSquare.totalRopes - editedSquare.remainingRopes : selectedSquare.totalRopes !== undefined ? selectedSquare.totalRopes - selectedSquare.remainingRopes : 0}
                            onChange={(e) => handleFieldChange('remainingRopes', parseInt(e.target.value))}
                            className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                          <span>/</span>
                          <input
                            type="number"
                            value={editedSquare?.totalRopes !== undefined ? editedSquare.totalRopes : selectedSquare.totalRopes !== undefined ? selectedSquare.totalRopes : 0}
                            onChange={(e) => handleFieldChange('totalRopes', parseInt(e.target.value))}
                            className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                        </div>
                      ) : (
                        `${selectedSquare.totalRopes !== undefined ? selectedSquare.totalRopes - selectedSquare.remainingRopes : 0}/${selectedSquare.totalRopes !== undefined ? selectedSquare.totalRopes : 0}`
                      )}
                    </div>
                  </div>
                </div>

                {/* Liste des cordes */}
                <div className="mb-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/10">
                        <History size={14} className="text-white" />
                      </div>
                      <span className="text-xs text-white/70 font-medium">Cordes dans ce carré</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                      {(selectedSquare).batches.length} corde{(selectedSquare).batches.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {(selectedSquare).batches.length > 0 ? (
                    <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                      {(selectedSquare).batches.map((batch) => (
                        <div
                          key={batch.id}
                          className="bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/5 transition-all duration-200 cursor-pointer transform hover:translate-x-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{batch.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/60">
                                {batch.date && isValid(batch.date) 
                                  ? format(batch.date, 'dd MMM', { locale: fr })
                                  : 'Date inconnue'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-white/40 text-sm">
                      Aucune corde dans ce carré
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Détails du carré {selectedSquare.number}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        window.location.href = '/traceability';
                      }}
                      className="p-2 bg-brand-primary/20 hover:bg-brand-primary/40 rounded-lg transition-colors"
                      title="Ajouter une corde via la traçabilité"
                    >
                      <Plus size={16} className="text-red-500" />
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <X size={18} className="text-white/60" />
                    </button>
                  </div>
                </div>
                <div className="rounded-lg bg-white/5 p-3 mt-6">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Info size={16} className="text-brand-primary" />
                    Synchronisation avec la traçabilité
                  </h3>
                  <p className="text-xs text-white/60 mt-2">
                    Les cordes affichées ici sont synchronisées avec la section traçabilité. 
                    Pour ajouter ou modifier une corde, utilisez le bouton <Plus size={12} className="inline text-red-500" /> 
                    ci-dessus pour accéder à la section traçabilité.
                  </p>
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
                        onClick={() => {
                          setEditMode(false);
                          setEditedSquare(null);
                        }}
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
                        onClick={() => setShowAddRopeModal(true)}
                        className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                      >
                        <Plus size={16} className="text-red-500" />
                        <span>Ajouter une corde</span>
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

        {/* Modal d'ajout de corde */}
        <AnimatePresence>
          {showAddRopeModal && selectedSquare && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowAddRopeModal(false);
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="glass-effect rounded-xl p-6 max-w-md w-full mx-4 relative"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Ajouter une corde</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Type d'huître</label>
                    <select
                      value={newRopeData.type}
                      onChange={(e) => setNewRopeData({...newRopeData, type: e.target.value})}
                      className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
                    >
                      <option value="" className="text-white/60">Sélectionner un type</option>
                      <option value="plates" className="text-white">Plates</option>
                      <option value="creuses" className="text-white">Creuses</option>
                      <option value="speciales" className="text-white">Spéciales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Nombre de cordes</label>
                    <input
                      type="number"
                      min="1"
                      value={newRopeData.quantity}
                      onChange={(e) => setNewRopeData({...newRopeData, quantity: parseInt(e.target.value)})}
                      className="w-full bg-white/10 text-white rounded-lg p-2 outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Date de mise en place</label>
                    <input
                      type="date"
                      value={newRopeData.date}
                      onChange={(e) => setNewRopeData({...newRopeData, date: e.target.value})}
                      className="w-full bg-white/10 text-white rounded-lg p-2 outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      // Logique d'ajout de corde
                      setShowAddRopeModal(false);
                    }}
                    className="flex-1 bg-brand-primary text-white rounded-lg py-2 px-4 hover:bg-brand-primary/80 transition-colors"
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => setShowAddRopeModal(false)}
                    className="flex-1 bg-white/10 text-white rounded-lg py-2 px-4 hover:bg-white/20 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
