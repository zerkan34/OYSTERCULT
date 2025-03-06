import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Edit2, Package, Info, PieChart, History, Eye, X, Save, Scale } from 'lucide-react';
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
  remainingPochons?: number;
  totalPochons?: number;
  type: 'triploide' | 'diploide';
}

interface Batch {
  id: string;
  name: string;
  date: Date;
}

// Configuration de base
const config: TrempeConfig = {
  squares: 10,
  rows: 2,
  columns: 5
};

// Données de test avec séparation triploïdes/diploïdes selon le standard
const mockSquares: TrempeSquare[] = [
  // Colonne gauche - Triploïdes (bordeaux)
  {
    id: '1',
    number: 1,
    status: 'full',
    remainingPochons: 0,
    totalPochons: 100,
    type: 'triploide', // Ajout du type pour différencier
    batches: [
      { id: '101', name: 'Lot Plates 2023-A', date: new Date(2023, 2, 15) },
      { id: '102', name: 'Lot Plates 2023-B', date: new Date(2023, 3, 20) }
    ]
  },
  {
    id: '2',
    number: 2,
    status: 'partial',
    remainingPochons: 50,
    totalPochons: 100,
    type: 'triploide',
    batches: [
      { id: '103', name: 'Lot Plates 2023-C', date: new Date(2023, 4, 5) }
    ]
  },
  {
    id: '3',
    number: 3,
    status: 'partial',
    remainingPochons: 75,
    totalPochons: 100,
    type: 'triploide',
    batches: [
      { id: '104', name: 'Lot Plates 2023-D', date: new Date(2023, 5, 10) }
    ]
  },
  {
    id: '4',
    number: 4,
    status: 'empty',
    remainingPochons: 100,
    totalPochons: 100,
    type: 'triploide',
    batches: []
  },
  {
    id: '5',
    number: 5,
    status: 'empty',
    remainingPochons: 100,
    totalPochons: 100,
    type: 'triploide',
    batches: []
  },
  // Colonne droite - Diploïdes (bleu)
  {
    id: '6',
    number: 1,
    status: 'full',
    remainingPochons: 0,
    totalPochons: 100,
    type: 'diploide',
    batches: [
      { id: '105', name: 'Lot Creuses 2023-A', date: new Date(2023, 2, 15) },
      { id: '106', name: 'Lot Creuses 2023-B', date: new Date(2023, 3, 20) }
    ]
  },
  {
    id: '7',
    number: 2,
    status: 'partial',
    remainingPochons: 50,
    totalPochons: 100,
    type: 'diploide',
    batches: [
      { id: '107', name: 'Lot Creuses 2023-C', date: new Date(2023, 4, 5) }
    ]
  },
  {
    id: '8',
    number: 3,
    status: 'empty',
    remainingPochons: 100,
    totalPochons: 100,
    type: 'diploide',
    batches: []
  },
  {
    id: '9',
    number: 4,
    status: 'empty',
    remainingPochons: 100,
    totalPochons: 100,
    type: 'diploide',
    batches: []
  },
  {
    id: '10',
    number: 5,
    status: 'empty',
    remainingPochons: 100,
    totalPochons: 100,
    type: 'diploide',
    batches: []
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
    date: format(new Date(), 'yyyy-MM-dd'),
    batchNumber: `LOT-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  });
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [pochonsToHarvest, setPochonsToHarvest] = useState<number>(0);
  const [selectedHarvestBatch, setSelectedHarvestBatch] = useState('');

  // Récupérer les lots depuis le store
  const { batches, updateBatch } = useStore();

  // Initialiser le carré sélectionné si nécessaire
  useEffect(() => {
    if (trempeSquares.length > 0 && !selectedSquare) {
      setSelectedSquare(trempeSquares[0]);
    }
  }, [trempeSquares, selectedSquare]);

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
        remainingPochons: squareBatches.length === 0 ? square.totalPochons : Math.max(0, square.totalPochons - (squareBatches.length * 25))
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

  // Gestion du clic sur un carré
  const handleSquareClick = (square: TrempeSquare) => {
    setSelectedSquare(square);
    // Si on est en mode édition, réinitialiser
    if (editMode) {
      setEditMode(false);
      setEditedSquare(null);
    }
  };

  // Gestion des changements dans les champs d'édition
  const handleFieldChange = (field: string, value: any) => {
    if (!editedSquare || !selectedSquare) return;
    
    setEditedSquare({
      ...editedSquare,
      [field]: value
    });
  };

  // Sauvegarder les modifications
  const handleSaveChanges = () => {
    if (!editedSquare || !selectedSquare) return;
    
    // Mise à jour du carré sélectionné dans la liste des carrés
    const updatedSquares = trempeSquares.map(square => 
      square.id === selectedSquare.id ? editedSquare : square
    );
    
    setTrempeSquares(updatedSquares);
    setSelectedSquare(editedSquare);
    setEditMode(false);
    setEditedSquare(null);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setSelectedSquare(null);
    setEditMode(false);
    setEditedSquare(null);
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

  // Gestionnaire pour fermer le modal
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCloseModal();
    }
  };

  React.useEffect(() => {
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

  const handleHarvestRopes = () => {
    if (selectedSquare && pochonsToHarvest > 0) {
      // Ici vous pouvez implémenter la logique pour récolter les pochons
      console.log(`Récolte de ${pochonsToHarvest} pochons du carré ${selectedSquare.number}, lot: ${selectedHarvestBatch}`);
      
      // Fermer le modal de récolte
      setShowHarvestModal(false);
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="p-4">
        {/* En-tête avec effet glow */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white relative">
            <span className="relative z-10">Gestion des tables de trempe</span>
            <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-gradient-to-r from-brand-primary via-blue-400 to-transparent rounded-full blur-[1px]"></span>
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Suivez et gérez les tables de trempe avec 10 carrés en format portrait.
          </p>
          <button
            aria-label="Ouvrir les paramètres"
            className="glass-effect p-2 rounded-lg hover:bg-white/5 transition-colors shadow-glow-subtle"
          >
            <Settings size={18} className="text-white/60" />
          </button>
        </div>

        {/* Vue principale avec effet de glow */}
        <div className="glass-effect rounded-xl p-6 border border-white/10 shadow-glow-main relative">
          {/* Layout en deux colonnes pour la vue satellite et les détails */}
          <div className="flex flex-col gap-6">
            {/* Statistiques générales - Maintenant dans une barre horizontale avec effet de glow */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 shadow-inner-glow">
              {/* Statistique des carrés pleins */}
              <div className="flex items-center gap-3 border-r border-r-white/10 pr-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center shadow-glow-blue">
                  <div className="w-3 h-3 rounded-full bg-brand-primary glow-dot-blue"/>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/60 text-xs">Tables pleines</span>
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
                  <span className="text-white/60 text-xs">Tables partielles</span>
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
                    <span className="text-white/60 text-xs">Tables vides</span>
                    <span className="text-white/80 text-lg font-medium">
                      {trempeSquares.filter((s) => s.status === 'empty').length}
                    </span>
                  </div>
                </div>
                
                {/* Bouton pour activer/désactiver le modal fixe */}
                <button
                  aria-label="Activer/Désactiver le modal fixe"
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

            {/* Layout en flex-col pour organiser les éléments verticalement */}
            <div className="flex flex-col gap-6">
              {/* Vue satellite - maintenant en pleine largeur */}
              <div className="w-full">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-inner-glow">
                  <h2 className="text-white/80 text-sm font-medium mb-3">Visualisation des tables</h2>
                  <p className="text-white/60 text-xs mb-4">
                    Tables de trempe avec 10 carrés en format portrait. 
                    <span className="ml-1 block mt-1">
                      <span className="text-brand-burgundy">■</span> Triploïdes (gauche) | 
                      <span className="text-blue-400 ml-1">■</span> Diploïdes (droite)
                    </span>
                  </p>
                  
                  {/* Vue des carrés avec effet de glow - structure en format portrait */}
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
                            ? `border-${square.type === 'triploide' ? 'brand-burgundy' : 'blue-400'}/30 bg-gradient-to-br from-${square.type === 'triploide' ? 'brand-burgundy' : 'blue-900'}/20 to-${square.type === 'triploide' ? 'brand-burgundy' : 'blue-800'}/5 shadow-trempe-${square.type === 'triploide' ? 'burgundy' : 'blue'}`
                            : square.status === 'partial'
                            ? 'border-yellow-400/30 bg-gradient-to-br from-yellow-700/20 to-yellow-600/5 shadow-trempe-gold'
                            : 'border-white/5 bg-gradient-to-br from-white/5 to-transparent'
                        } cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.03] hover:shadow-glow-${
                          square.status === 'full'
                            ? square.type === 'triploide' ? 'burgundy-intense' : 'blue-intense'
                            : square.status === 'partial'
                            ? 'gold-intense'
                            : 'white'
                        } h-32`}
                        aria-label={`Table ${square.number} - ${square.type === 'triploide' ? 'Plates (Triploïdes)' : 'Creuses (Diploïdes)'} - ${square.status === 'full' ? 'Pleine' : square.status === 'partial' ? 'Partiellement remplie' : 'Vide'}`}
                        role="button"
                        tabIndex={0}
                      >
                        {/* Indicateur de remplissage avec effet de glow */}
                        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                          square.status === 'full'
                            ? `bg-gradient-to-t from-${square.type === 'triploide' ? 'brand-burgundy' : 'blue-400'}/30 to-${square.type === 'triploide' ? 'brand-burgundy' : 'blue-400'}/5`
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
                                ? square.type === 'triploide' ? 'text-brand-burgundy' : 'text-blue-400'
                                : square.status === 'partial'
                                ? 'text-brand-tertiary'
                                : 'text-white/60'
                            }`}>
                              {square.number}
                            </span>
                            <div className={`h-2.5 w-2.5 rounded-full ${
                              square.status === 'full'
                                ? square.type === 'triploide' ? 'bg-brand-burgundy' : 'bg-blue-400'
                                : square.status === 'partial'
                                ? 'bg-brand-tertiary'
                                : 'bg-white/20'
                            }`} />
                          </div>
                          
                          {/* Indicateur de pochons */}
                          <div className="flex items-center justify-between">
                            <div className={`text-xs ${
                              square.batches.length > 0
                                ? 'text-white/80'
                                : 'text-white/40'
                            }`}>
                              {square.batches.length > 0 
                                ? `${square.batches.length} pochon${square.batches.length > 1 ? 's' : ''}`
                                : 'Aucun pochon'}
                            </div>
                            
                            {/* Indicateur de pochons */}
                            <div className={`text-xs flex items-center gap-1 ${
                              square.status !== 'empty'
                                ? 'text-white/80'
                                : 'text-white/40'
                            }`}>
                              {square.totalPochons !== undefined && square.remainingPochons !== undefined 
                                ? (square.totalPochons - square.remainingPochons) 
                                : 0}
                              <span className="text-white/20">/</span>
                              <span className="text-white/40">{square.totalPochons !== undefined ? square.totalPochons : 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Panneau de détails - maintenant en pleine largeur */}
              <div className="w-full glass-effect rounded-xl border border-white/10 backdrop-blur-md p-4 shadow-glow-subtle">
                {/* Affichage des détails du carré sélectionné ou survolé */}
                {(hoveredSquare || selectedSquare) ? (
                  <div className="h-full">
                    {/* En-tête du modal */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          (hoveredSquare || selectedSquare).status === 'full'
                            ? (hoveredSquare || selectedSquare).type === 'triploide' ? 'bg-brand-burgundy' : 'bg-blue-400'
                            : (hoveredSquare || selectedSquare).status === 'partial'
                            ? 'bg-brand-tertiary'
                            : 'bg-white/20'
                        }`} />
                        {editMode ? (
                          <input
                            type="number"
                            value={editedSquare?.number || (selectedSquare && selectedSquare.number) || 0}
                            onChange={(e) => handleFieldChange('number', parseInt(e.target.value))}
                            className="bg-white/10 text-xl font-medium text-white px-3 py-1 rounded-lg outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                        ) : (
                          <h2 className="text-xl font-medium text-white">Table {(selectedSquare && selectedSquare.number) || ''}</h2>
                        )}
                        <select
                          id="fixedModalStatusSelect"
                          value={editMode ? (editedSquare?.status || (selectedSquare && selectedSquare.status) || 'empty') : (selectedSquare ? selectedSquare.status : 'empty')}
                          onChange={(e) => handleFieldChange('status', e.target.value)}
                          disabled={!editMode}
                          aria-label="Statut de la table"
                          className={`text-sm px-3 py-1 rounded-full ${
                            selectedSquare.status === 'full'
                              ? selectedSquare.type === 'triploide' ? 'bg-brand-burgundy/20 text-brand-burgundy' : 'bg-blue-400/20 text-blue-400'
                              : selectedSquare.status === 'partial'
                              ? 'bg-brand-tertiary/20 text-brand-tertiary'
                              : 'bg-white/10 text-white/60'
                          } ${!editMode && 'cursor-not-allowed'} [&>option]:bg-gray-800 [&>option]:text-white`}
                        >
                          <option value="full" className="text-white">Plein</option>
                          <option value="partial" className="text-white">Partiel</option>
                          <option value="empty" className="text-white/60">Vide</option>
                        </select>
                        <select
                          id="fixedModalTypeSelect"
                          value={editMode ? (editedSquare?.type || (selectedSquare && selectedSquare.type) || 'triploide') : (selectedSquare ? selectedSquare.type : 'triploide')}
                          onChange={(e) => handleFieldChange('type', e.target.value)}
                          disabled={!editMode}
                          aria-label="Type d'huître de la table"
                          className={`text-sm px-3 py-1 rounded-full ${
                            selectedSquare && selectedSquare.type === 'triploide'
                              ? 'bg-brand-burgundy/20 text-brand-burgundy'
                              : selectedSquare && selectedSquare.type === 'diploide'
                              ? 'bg-blue-400/20 text-blue-400'
                              : 'bg-white/10 text-white/60'
                          } ${!editMode && 'cursor-not-allowed'} [&>option]:bg-gray-800 [&>option]:text-white`}
                        >
                          <option value="triploide" className="text-white">Triploïde (Plates)</option>
                          <option value="diploide" className="text-white">Diploïde (Creuses)</option>
                        </select>
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="glass-effect rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Package size={16} className="text-white/60" />
                          <span className="text-sm text-white/60">Pochons</span>
                        </div>
                        <div className="text-2xl font-medium text-white">
                          {editMode ? (
                            <input
                              type="number"
                              value={editedSquare?.batches.length || (selectedSquare && selectedSquare.batches.length) || 0}
                              onChange={(e) => handleFieldChange('batches', Array(parseInt(e.target.value)).fill(null))}
                              className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                          ) : (
                            selectedSquare ? selectedSquare.batches.length : 0
                          )}
                        </div>
                      </div>
                      <div className="glass-effect rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Package size={16} className="text-white/60" />
                          <span className="text-sm text-white/60">Pochons utilisés</span>
                        </div>
                        <div className="text-2xl font-medium text-white">
                          {editMode ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editedSquare?.totalPochons !== undefined ? editedSquare.totalPochons - editedSquare.remainingPochons : (selectedSquare && selectedSquare.totalPochons !== undefined ? selectedSquare.totalPochons - selectedSquare.remainingPochons : 0)}
                                onChange={(e) => handleFieldChange('remainingPochons', parseInt(e.target.value))}
                                className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                              />
                              <span>/</span>
                              <input
                                type="number"
                                value={editedSquare?.totalPochons !== undefined ? editedSquare.totalPochons : (selectedSquare && selectedSquare.totalPochons !== undefined ? selectedSquare.totalPochons : 0)}
                                onChange={(e) => handleFieldChange('totalPochons', parseInt(e.target.value))}
                                className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                              />
                            </div>
                          ) : (
                            selectedSquare ? `${selectedSquare.totalPochons !== undefined ? selectedSquare.totalPochons - selectedSquare.remainingPochons : 0}/${selectedSquare.totalPochons !== undefined ? selectedSquare.totalPochons : 0}` : '0/0'
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Liste des pochons */}
                    <div className="mb-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-white/10">
                            <History size={14} className="text-white" />
                          </div>
                          <span className="text-xs text-white/70 font-medium">Pochons dans cette table</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                          {selectedSquare ? selectedSquare.batches.length : 0} pochon{(selectedSquare && selectedSquare.batches.length !== 1) ? 's' : ''}
                        </span>
                      </div>
                      {(selectedSquare && selectedSquare.batches.length > 0) ? (
                        <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                          {selectedSquare.batches.map((batch) => (
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
                          Aucun pochon dans cette table
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">Détails de la table {(selectedSquare && selectedSquare.number) || ''}</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          aria-label="Récolter les pochons"
                          onClick={() => setShowHarvestModal(true)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white"
                        >
                          Récolter
                        </button>
                        <button
                          aria-label="Fermer le modal"
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
                        Les pochons affichés ici sont synchronisés avec la section traçabilité. 
                        Pour ajouter ou modifier un pochon, utilisez le bouton <Plus size={12} className="inline text-red-500" /> 
                        ci-dessus pour accéder à la section traçabilité.
                      </p>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {editMode ? (
                        <>
                          <button 
                            aria-label="Sauvegarder les modifications"
                            onClick={handleSaveChanges}
                            className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                          >
                            <Save size={16} className="text-white/60" />
                            <span>Sauvegarder</span>
                          </button>
                          <button 
                            aria-label="Annuler les modifications"
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
                            aria-label="Modifier la table"
                            onClick={() => {
                              setEditMode(true);
                              setEditedSquare(selectedSquare ? {...selectedSquare} : null);
                            }}
                            className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                          >
                            <Edit2 size={16} className="text-white/60" />
                            <span>Modifier</span>
                          </button>
                          <button 
                            aria-label="Ajouter un pochon"
                            onClick={() => setShowAddRopeModal(true)}
                            className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                          >
                            <Plus size={16} className="text-red-500" />
                            <span>Ajouter un pochon</span>
                          </button>
                          <button 
                            aria-label="Voir l'historique"
                            className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                          >
                            <History size={16} className="text-white/60" />
                            <span>Historique</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="p-3 rounded-full bg-white/5 mb-3">
                      <Info size={24} className="text-white/40" />
                    </div>
                    <p className="text-white/60 text-center">
                      Sélectionnez une table. Cliquez sur une table pour voir ses détails et gérer son contenu.
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
                  aria-label="Fermer le modal"
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>

                {/* En-tête */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedSquare.status === 'full'
                        ? selectedSquare.type === 'triploide' ? 'bg-brand-burgundy' : 'bg-blue-400'
                        : selectedSquare.status === 'partial'
                        ? 'bg-brand-tertiary'
                        : 'bg-white/20'
                    }`} />
                    {editMode ? (
                      <input
                        type="number"
                        value={editedSquare?.number || (selectedSquare && selectedSquare.number) || 0}
                        onChange={(e) => handleFieldChange('number', parseInt(e.target.value))}
                        className="bg-white/10 text-xl font-medium text-white px-3 py-1 rounded-lg outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    ) : (
                      <h2 className="text-xl font-medium text-white">Table {(selectedSquare && selectedSquare.number) || ''}</h2>
                    )}
                    <select
                      id="modalStatusSelect"
                      value={editMode ? (editedSquare?.status || (selectedSquare && selectedSquare.status) || 'empty') : (selectedSquare ? selectedSquare.status : 'empty')}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      disabled={!editMode}
                      aria-label="Statut de la table"
                      className={`text-sm px-3 py-1 rounded-full ${
                        selectedSquare.status === 'full'
                          ? selectedSquare.type === 'triploide' ? 'bg-brand-burgundy/20 text-brand-burgundy' : 'bg-blue-400/20 text-blue-400'
                          : selectedSquare.status === 'partial'
                          ? 'bg-brand-tertiary/20 text-brand-tertiary'
                          : 'bg-white/10 text-white/60'
                      } ${!editMode && 'cursor-not-allowed'} [&>option]:bg-gray-800 [&>option]:text-white`}
                    >
                      <option value="full" className="text-white">Plein</option>
                      <option value="partial" className="text-white">Partiel</option>
                      <option value="empty" className="text-white/60">Vide</option>
                    </select>
                    <select
                      id="modalTypeSelect"
                      value={editMode ? (editedSquare?.type || (selectedSquare && selectedSquare.type) || 'triploide') : (selectedSquare ? selectedSquare.type : 'triploide')}
                      onChange={(e) => handleFieldChange('type', e.target.value)}
                      disabled={!editMode}
                      aria-label="Type d'huître de la table"
                      className={`text-sm px-3 py-1 rounded-full ${
                        selectedSquare.type === 'triploide'
                          ? 'bg-brand-burgundy/20 text-brand-burgundy'
                          : selectedSquare.type === 'diploide'
                          ? 'bg-blue-400/20 text-blue-400'
                          : 'bg-white/10 text-white/60'
                      } ${!editMode && 'cursor-not-allowed'} [&>option]:bg-gray-800 [&>option]:text-white`}
                    >
                      <option value="triploide" className="text-white">Triploïde (Plates)</option>
                      <option value="diploide" className="text-white">Diploïde (Creuses)</option>
                    </select>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={16} className="text-white/60" />
                      <span className="text-sm text-white/60">Pochons</span>
                    </div>
                    <div className="text-2xl font-medium text-white">
                      {editMode ? (
                        <input
                          type="number"
                          value={editedSquare?.batches.length || (selectedSquare && selectedSquare.batches.length) || 0}
                          onChange={(e) => handleFieldChange('batches', Array(parseInt(e.target.value)).fill(null))}
                          className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                      ) : (
                        selectedSquare ? selectedSquare.batches.length : 0
                      )}
                    </div>
                  </div>
                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={16} className="text-white/60" />
                      <span className="text-sm text-white/60">Pochons utilisés</span>
                    </div>
                    <div className="text-2xl font-medium text-white">
                      {editMode ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editedSquare?.totalPochons !== undefined ? editedSquare.totalPochons - editedSquare.remainingPochons : (selectedSquare && selectedSquare.totalPochons !== undefined ? selectedSquare.totalPochons - selectedSquare.remainingPochons : 0)}
                            onChange={(e) => handleFieldChange('remainingPochons', parseInt(e.target.value))}
                            className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                          <span>/</span>
                          <input
                            type="number"
                            value={editedSquare?.totalPochons !== undefined ? editedSquare.totalPochons : (selectedSquare && selectedSquare.totalPochons !== undefined ? selectedSquare.totalPochons : 0)}
                            onChange={(e) => handleFieldChange('totalPochons', parseInt(e.target.value))}
                            className="bg-white/10 w-20 px-2 py-1 rounded outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                        </div>
                      ) : (
                        selectedSquare ? `${selectedSquare.totalPochons !== undefined ? selectedSquare.totalPochons - selectedSquare.remainingPochons : 0}/${selectedSquare.totalPochons !== undefined ? selectedSquare.totalPochons : 0}` : '0/0'
                      )}
                    </div>
                  </div>
                </div>

                {/* Liste des pochons */}
                <div className="mb-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/10">
                        <History size={14} className="text-white" />
                      </div>
                      <span className="text-xs text-white/70 font-medium">Pochons dans cette table</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                      {selectedSquare ? selectedSquare.batches.length : 0} pochon{(selectedSquare && selectedSquare.batches.length !== 1) ? 's' : ''}
                    </span>
                  </div>
                  {(selectedSquare && selectedSquare.batches.length > 0) ? (
                    <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                      {selectedSquare.batches.map((batch) => (
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
                      Aucun pochon dans cette table
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Détails de la table {(selectedSquare && selectedSquare.number) || ''}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      aria-label="Récolter les pochons"
                      onClick={() => setShowHarvestModal(true)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white"
                    >
                      Récolter
                    </button>
                    <button
                      aria-label="Fermer le modal"
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
                    Les pochons affichés ici sont synchronisés avec la section traçabilité. 
                    Pour ajouter ou modifier un pochon, utilisez le bouton <Plus size={12} className="inline text-red-500" /> 
                    ci-dessus pour accéder à la section traçabilité.
                  </p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-3">
                  {editMode ? (
                    <>
                      <button 
                        aria-label="Sauvegarder les modifications"
                        onClick={handleSaveChanges}
                        className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                      >
                        <Save size={16} className="text-white/60" />
                        <span>Sauvegarder</span>
                      </button>
                      <button 
                        aria-label="Annuler les modifications"
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
                        aria-label="Modifier la table"
                        onClick={() => {
                          setEditMode(true);
                          setEditedSquare(selectedSquare ? {...selectedSquare} : null);
                        }}
                        className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                      >
                        <Edit2 size={16} className="text-white/60" />
                        <span>Modifier</span>
                      </button>
                      <button 
                        aria-label="Ajouter un pochon"
                        onClick={() => setShowAddRopeModal(true)}
                        className="flex-1 glass-effect rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                      >
                        <Plus size={16} className="text-red-500" />
                        <span>Ajouter un pochon</span>
                      </button>
                      <button 
                        aria-label="Voir l'historique"
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

        {/* Modal d'ajout de pochon */}
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
                <h3 className="text-xl font-semibold text-white mb-4">Ajouter un pochon</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Types d'huîtres</label>
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
                    <label className="block text-sm text-white/60 mb-1">
                      Numéro de lot 
                      <span className="ml-2 text-white/40">(lot en cours)</span>
                    </label>
                    <div className="flex flex-col gap-3">
                      <select
                        value={newRopeData.batchNumber}
                        onChange={(e) => setNewRopeData({...newRopeData, batchNumber: e.target.value})}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white"
                      >
                        <option value={newRopeData.batchNumber}>{newRopeData.batchNumber}</option>
                        <option value={`LOT-${format(new Date(), 'yyyyMMdd')}-001`}>LOT-{format(new Date(), 'yyyyMMdd')}-001</option>
                        <option value={`LOT-${format(new Date(), 'yyyyMMdd')}-002`}>LOT-{format(new Date(), 'yyyyMMdd')}-002</option>
                        <option value={`LOT-${format(new Date(), 'yyyyMMdd')}-003`}>LOT-{format(new Date(), 'yyyyMMdd')}-003</option>
                      </select>
                      
                      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                        <span className="text-white/60 text-sm">Numéro de lot:</span>
                        <span className="text-white font-medium">
                          {selectedHarvestBatch ? (
                            `LOT-${format(new Date(), 'yyyyMMdd')}-${selectedHarvestBatch.split('-')[1].padStart(3, '0')}`
                          ) : (
                            'LOT-000000-000'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Nombre de pochons</label>
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
                    aria-label="Ajouter le pochon"
                    onClick={() => {
                      // Logique d'ajout de pochon
                      setShowAddRopeModal(false);
                    }}
                    className="flex-1 bg-brand-primary text-white rounded-lg py-2 px-4 hover:bg-brand-primary/80 transition-colors"
                  >
                    Ajouter
                  </button>
                  <button
                    aria-label="Annuler l'ajout"
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

        {/* Modal pour la récolte des pochons */}
        {showHarvestModal && selectedSquare && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Récolte de pochons</h3>
                <button
                  aria-label="Fermer le modal"
                  onClick={() => setShowHarvestModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="harvestBatch" className="block text-sm font-medium text-white mb-2">
                    Sélectionner une perche
                  </label>
                  <select
                    id="harvestBatch"
                    value={selectedHarvestBatch}
                    onChange={(e) => setSelectedHarvestBatch(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white"
                    aria-label="Sélectionner le lot concerné"
                  >
                    <option value="" className="text-white/60">Choisir une perche</option>
                    {[...Array(5)].map((_, index) => (
                      <option key={index} value={`perche-${index + 1}`}>
                        Perche {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="harvestQuantity" className="block text-sm font-medium text-white mb-2">
                    Nombre de pochons à récolter
                  </label>
                  <input
                    id="harvestQuantity"
                    type="number"
                    value={pochonsToHarvest}
                    onChange={(e) => setPochonsToHarvest(parseInt(e.target.value) || 0)}
                    min="1"
                    max={selectedSquare ? selectedSquare.batches.length : 0}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
                    aria-label="Nombre de pochons à récolter"
                  />
                  <p className="mt-2 text-sm text-white/70">
                    {selectedSquare ? `${selectedSquare.batches.length} pochons disponibles` : 'Nombre de pochons inconnu'}
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    aria-label="Annuler la récolte"
                    type="button"
                    onClick={() => setShowHarvestModal(false)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    aria-label="Récolter les pochons"
                    type="button"
                    onClick={handleHarvestRopes}
                    className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors"
                  >
                    Récolter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
