import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';
import { 
  Clock, 
  Shell, 
  Thermometer, 
  Droplets, 
  X, 
  Check, 
  SquarePen, 
  Calendar, 
  ChevronRight, 
  FileSpreadsheet,
  Upload,
  Download,
  AlertCircle,
  Plus,
  Info,
  Edit,
  Scale,
  Hash,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as XLSX from 'xlsx';

interface TableCell {
  id: string;
  type: string;
  pochonCount: number;
  size: string;
  filled: boolean;
  fillOrder?: number;
}

interface Table {
  id: string;
  name: string;
  cells?: {
    id: string;
    filled: boolean;
    fillOrder?: number;
    type: string;
    rowIndex: number;
    columnIndex: number;
  }[];
  status: string;
  lastUpdate: string;
  temperature?: number;
  salinity?: number;
  tableNumber?: string;
  currentBatch?: {
    size: string;
    quantity: number;
    estimatedHarvestDate?: string;
  };
  lastCheck?: string;
  nextCheck?: string;
  mortalityRate?: number;
  naissainSource?: string;
  naissainBatchNumber?: string;
}

interface TableDetailProps {
  table?: Table;
  onClose: () => void;
  onTableUpdate?: (tableId: string, updates: Partial<Table>) => void;
}

interface CellModalProps {
  cell: TableCell;
  onClose: () => void;
  onUpdate: (data: Partial<TableCell>) => void;
  setShowNaissainModal?: (show: boolean) => void;
}

function CellModal({ cell, onClose, onUpdate, setShowNaissainModal }: CellModalProps) {
  const modalRef = useClickOutside(onClose);
  
  const [type, setType] = useState(cell.type || '');
  const [pochonCount, setPochonCount] = useState(cell.pochonCount || 0);
  const [size, setSize] = useState(cell.size || '');
  const [harvestedRopes, setHarvestedRopes] = useState(0);
  const [isEditing, setIsEditing] = useState(!cell.filled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let data;
    
    if (isEditing) {
      // Mode édition - mettre à jour les propriétés existantes
      data = {
        type,
        pochonCount,
        size,
        filled: true
      };
    } else if (cell.filled) {
      // Mode récolte
      data = {
        harvestedRopes,
        batchNumber: `LOT-${new Date().getTime()}`
      };
    } else {
      // Mode nouvelle production
      data = {
        type,
        pochonCount,
        size,
        filled: true
      };
    }
    
    onUpdate(data);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {cell.filled && !isEditing ? 'Récolte' : cell.filled && isEditing ? 'Modifier le bassin' : 'Nouvelle production'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {cell.filled && !isEditing && (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center text-brand-tertiary hover:text-brand-tertiary/80 transition-colors"
            >
              <Edit size={16} className="mr-1" />
              Modifier les propriétés
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!cell.filled || isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Type de production
                </label>
                <div className="flex justify-between items-center mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (setShowNaissainModal) {
                        setShowNaissainModal(true);
                      } else {
                        console.warn("setShowNaissainModal is not defined");
                      }
                    }}
                    className="px-4 py-2 bg-brand-tertiary rounded-lg text-white hover:bg-brand-tertiary/90 transition-colors"
                  >
                    Naissain
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'triplo', label: 'Triploïde', color: 'bg-brand-burgundy' },
                    { value: 'diplo', label: 'Diploïde', color: 'bg-brand-primary' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setType(option.value)}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                        type === option.value 
                          ? `${option.color} shadow-neon` 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-sm ${option.color} mb-2`} />
                      <span className="text-sm text-white">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre de pochons par perche
                </label>
                <div className="relative">
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                    <button
                      type="button"
                      onClick={() => setPochonCount(Math.max(0, pochonCount - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-white">{pochonCount}</span>
                    <button
                      type="button"
                      onClick={() => setPochonCount(pochonCount + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Taille des huîtres
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['T5', 'T10', 'T15', 'T20', 'T30'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSize(num)}
                      className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                        size === num
                          ? 'bg-brand-burgundy shadow-neon'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-white font-medium">{num}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre de pochons récoltés
                </label>
                <div className="relative">
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                    <button
                      type="button"
                      onClick={() => setHarvestedRopes(Math.max(0, harvestedRopes - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-white">{harvestedRopes}</span>
                    <button
                      type="button"
                      onClick={() => setHarvestedRopes(Math.min(cell.pochonCount, harvestedRopes + 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-white/60 text-center">
                    sur {cell.pochonCount} pochons au total
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-burgundy/20 rounded-lg">
                <div className="flex items-center text-brand-burgundy mb-2">
                  <Tag size={20} className="mr-2" />
                  <span className="font-medium">Numéro de lot</span>
                </div>
                <div className="text-white font-mono">
                  LOT-{new Date().getTime()}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
            >
              {cell.filled && !isEditing ? 'Valider la récolte' : cell.filled && isEditing ? 'Enregistrer les modifications' : 'Ajouter la production'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

interface TableDetailProps {
  table?: Table;
  onClose: () => void;
  onTableUpdate?: (tableId: string, updates: Partial<Table>) => void;
}

export function TableDetail({ table, onClose, onTableUpdate }: TableDetailProps) {
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la propagation du clic
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [selectedCell, setSelectedCell] = useState<TableCell | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  // États pour le modal de remplissage de colonne
  const [showFillColumnModal, setShowFillColumnModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<{side: 'left' | 'right'}>({ side: 'left' });
  const [fillOrderNumber, setFillOrderNumber] = useState<number | ''>('');
  const [fillDate, setFillDate] = useState('');

  // États pour l'édition du nom de la table
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedTableNumber, setEditedTableNumber] = useState(table?.tableNumber);

  // États pour la modale d'échantillonnage
  const [showSamplingModal, setShowSamplingModal] = useState(false);
  const [samplingMortalityRate, setSamplingMortalityRate] = useState<number | ''>('');
  const [iAMortalityPrediction, setIAMortalityPrediction] = useState<number | null>(null);
  const [samplingDate, setSamplingDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // États pour le modal de naissain
  const [showNaissainModal, setShowNaissainModal] = useState(false);
  const [naissainSource, setNaissainSource] = useState('');

  // États pour le modal d'historique
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyDate, setHistoryDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Nouveaux états pour l'importation de données
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCellUpdate = (cellId: string, data: Partial<TableCell>) => {
    console.log('Updating cell:', cellId, data);
    
    // Trouver l'index de la cellule à mettre à jour
    const cellIndex = table?.cells?.findIndex((c: any) => c.id === cellId);
    if (cellIndex === -1) return;

    // Créer une copie des cellules pour la mise à jour
    const updatedCells = [...(table?.cells || [])];
    updatedCells[cellIndex] = { ...updatedCells[cellIndex], ...data };

    // Mettre à jour la table avec les nouvelles cellules
    if (onTableUpdate) {
      onTableUpdate(table?.id, { cells: updatedCells });
    }
  };

  // Fonction pour ouvrir le modal de remplissage de colonne
  const openFillColumnModal = (side: 'left' | 'right') => {
    setSelectedColumn({ side });
    setShowFillColumnModal(true);
  };

  // Fonction pour gérer le remplissage de colonne
  const handleFillColumn = () => {
    // Simuler le remplissage de la colonne (l'implémentation réelle dépendra de la structure des données)
    console.log(`Remplissage de la colonne ${selectedColumn.side} avec ordre de remplissage ${fillOrderNumber} à la date ${fillDate}`);
    
    // Fermer le modal après le remplissage
    setShowFillColumnModal(false);
    // Réinitialiser les champs
    setFillOrderNumber('');
    setFillDate('');
  };

  // Fonction pour mettre à jour le nom de la table
  const handleTableNumberUpdate = () => {
    if (onTableUpdate && editedTableNumber.trim() !== '') {
      onTableUpdate(table?.id, { tableNumber: editedTableNumber.trim() });
    }
    setIsEditingName(false);
  };

  // Fonction pour annuler l'édition du nom de la table
  const cancelEditing = () => {
    setEditedTableNumber(table?.tableNumber);
    setIsEditingName(false);
  };

  // Fonction pour gérer l'échantillonnage
  const handleSampling = () => {
    // Calculer une prédiction IA simulée basée sur le taux de mortalité actuel
    // (dans une vraie implémentation, ce serait basé sur un modèle d'IA)
    if (typeof samplingMortalityRate === 'number') {
      // Simulation simple: prédiction est le taux actuel +/- 20%
      const variationFactor = 0.2;
      const randomVariation = (Math.random() * 2 - 1) * variationFactor;
      const prediction = samplingMortalityRate * (1 + randomVariation);
      setIAMortalityPrediction(Number(prediction.toFixed(1)));
    }

    // Enregistrer l'échantillonnage
    console.log(`Échantillonnage enregistré avec un taux de mortalité de ${samplingMortalityRate}% à la date ${samplingDate}`);
    
    // Fermer la modale
    setShowSamplingModal(false);
  };

  // Fonction pour ouvrir la modale d'échantillonnage
  const openSamplingModal = () => {
    // Réinitialiser les valeurs
    setSamplingMortalityRate('');
    setIAMortalityPrediction(null);
    setSamplingDate(format(new Date(), 'yyyy-MM-dd'));
    setShowSamplingModal(true);
  };

  // Fonction pour gérer l'enregistrement du naissain
  const handleNaissainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'enregistrement du naissain
    const naissainData = {
      source: naissainSource,
      date: format(new Date(), 'yyyy-MM-dd'),
      batchNumber: `NAIS-${new Date().getTime()}`
    };
    console.log('Naissain enregistré:', naissainData);
    
    // Mettre à jour la table avec l'information du naissain si nécessaire
    if (onTableUpdate) {
      onTableUpdate(table?.id, { 
        naissainSource: naissainData.source,
        naissainBatchNumber: naissainData.batchNumber
      });
    }
    
    // Fermer la modale
    setShowNaissainModal(false);
    // Réinitialiser le champ
    setNaissainSource('');
  };

  // Fonction pour rechercher dans l'historique
  const handleHistorySearch = () => {
    console.log(`Recherche dans l'historique pour la date: ${historyDate}`);
    // Dans une vraie implémentation, cette fonction ferait une requête à l'API
    // pour obtenir les données historiques de la table à la date spécifiée
    
    // Pour l'instant, nous utilisons des données fictives qui sont déjà affichées
  };

  // Fonction pour gérer l'importation de fichiers Excel
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          setImportError('Le fichier ne contient pas de données valides.');
          return;
        }

        setImportData(jsonData);
        setImportPreview(jsonData.slice(0, 5)); // Afficher les 5 premières lignes comme aperçu
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier Excel:', error);
        setImportError('Une erreur est survenue lors de la lecture du fichier. Vérifiez que le format est correct.');
      }
    };

    reader.onerror = () => {
      setImportError('Une erreur est survenue lors de la lecture du fichier.');
    };

    reader.readAsBinaryString(file);
  };

  // Fonction pour appliquer les données importées
  const handleImportData = () => {
    if (importData.length === 0) {
      setImportError('Aucune donnée à importer.');
      return;
    }

    console.log('Importation des données:', importData);
    // Ici, vous implémenterez la logique pour appliquer les données importées aux tables/carrés
    
    // Exemple: mettre à jour la table avec les données importées
    if (onTableUpdate) {
      // Adapter cette partie selon la structure des données importées
      const updates: any = {
        lastUpdated: new Date().toISOString(),
        // Ajouter d'autres champs en fonction de la structure des données importées
      };
      
      onTableUpdate(table?.id, updates);
    }
    
    setShowImportModal(false);
    setImportData([]);
    setImportPreview([]);
  };

  // Pour assurer que les cellules se suivent sans espace vide
  // et que la colonne gauche soit remplie avant la colonne droite
  const sortedCells = table?.cells?.sort((a, b) => {
    // Les cellules remplies d'abord, puis les vides
    if (a.filled && !b.filled) return -1;
    if (!a.filled && b.filled) return 1;
    
    // Si les deux sont remplies, on trie par colonne d'abord (gauche puis droite)
    // Colonne gauche = index pair, colonne droite = index impair
    const aIndex = table?.cells?.findIndex(c => c.id === a.id);
    const bIndex = table?.cells?.findIndex(c => c.id === b.id);
    
    const aIsLeftColumn = aIndex % 2 === 0;
    const bIsLeftColumn = bIndex % 2 === 0;
    
    if (aIsLeftColumn && !bIsLeftColumn) return -1;
    if (!aIsLeftColumn && bIsLeftColumn) return 1;
    
    // Si même colonne, trier par position (de haut en bas)
    const aRow = Math.floor(aIndex / 2);
    const bRow = Math.floor(bIndex / 2);
    
    return aRow - bRow;
  });

  // Fonctions pour générer une couleur basée sur le type d'huître
  const getCellColor = (type?: string) => {
    switch (type) {
      case 'triplo':
        return 'bg-brand-burgundy';
      case 'diplo':
        return 'bg-brand-primary';
      default:
        return 'bg-gray-500';
    }
  };

  const getCellTextColor = (type?: string) => {
    switch (type) {
      case 'triplo':
      case 'diplo':
        return 'text-white';
      default:
        return 'text-gray-200';
    }
  };

  // Cette fonction met à jour la table et informe le parent
  const updateTable = (updates: Partial<Table>) => {
    if (table && onTableUpdate) {
      onTableUpdate(table.id, updates);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="table-detail-title"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-2xl"
        onClick={handleModalClick}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="table-detail-title" className="text-xl font-bold text-white flex items-center">
            Table {table?.name}
            <div className="ml-2 text-white/60 text-sm">
              {table?.tableNumber}
            </div>
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-effect rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Thermometer size={20} className="mr-2 text-brand-burgundy" />
                Température
              </div>
              <div className="text-2xl font-bold text-white">
                {table?.temperature ? `${table.temperature}°C` : "Non disponible"}
              </div>
            </div>

            <div className="glass-effect rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Droplets size={20} className="mr-2 text-brand-primary" />
                Salinité
              </div>
              <div className="text-2xl font-bold text-white">
                {table?.salinity}g/L
              </div>
            </div>

            <div className="glass-effect rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <AlertCircle size={20} className="mr-2 text-brand-tertiary" />
                Mortalité
              </div>
              <div className="text-2xl font-bold text-white">
                {table?.mortalityRate}%
              </div>
            </div>
          </div>

          {/* Détails du lot */}
          {table?.cells?.some(cell => cell.filled) ? (
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Lot en cours</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/60 mb-1">
                    Source de naissain
                  </div>
                  <div className="text-white font-medium">
                    {table?.naissainSource || "Satmar"}
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/60 mb-1">
                    Numéro de lot
                  </div>
                  <div className="text-white font-medium">
                    {table?.naissainBatchNumber || "SAT-2024-0342"}
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/60 mb-1">
                    Calibre
                  </div>
                  <div className="text-white font-medium">
                    {table?.currentBatch?.size || "T3"}
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/60 mb-1">
                    Quantité
                  </div>
                  <div className="text-white font-medium">
                    Reste 1000 pochons
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-3">
                <Shell size={24} className="text-white/60" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Table vide</h3>
              <p className="text-white/60 text-sm">
                Cette table n'a pas de lot d'huîtres en cours.
              </p>
            </div>
          )}

          {/* Échantillonnage */}
          {table?.cells?.some(cell => cell.filled) && (
            <div className="glass-effect rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-4">
                <Clock size={20} className="mr-2 text-brand-tertiary" />
                Échantillonnage
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Dernier échantillonnage</span>
                  <span className="text-white">
                    {format(new Date(table.lastCheck), 'PP', { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Prochain échantillonnage</span>
                  <span className="text-white">
                    {format(new Date(table.nextCheck), 'PP', { locale: fr })}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center text-brand-burgundy mb-2">
                    <AlertCircle size={20} className="mr-2" />
                    <span className="font-medium">Taux de mortalité estimé</span>
                  </div>
                  <div className="text-lg font-medium text-white">
                    {table.mortalityRate}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button 
              className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
              onClick={() => setShowHistoryModal(true)}
            >
              Historique
            </button>
            <button 
              className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
              onClick={() => openFillColumnModal('left')}
            >
              Remplir colonne gauche
            </button>
            <button 
              className="px-4 py-2 bg-brand-tertiary rounded-lg text-white hover:bg-brand-tertiary/90 transition-colors"
              onClick={() => openFillColumnModal('right')}
            >
              Remplir colonne droite
            </button>
            <button 
              className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
              onClick={openSamplingModal}
            >
              Échantillonnage
            </button>
            <button 
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>

      {/* Légende des types d'huîtres */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-80 glass-effect rounded-lg p-4 self-start mt-8"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium flex items-center">
            <Info size={16} className="mr-2 text-brand-burgundy" />
            Types d'huîtres
          </h4>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {showLegend ? 'Réduire' : 'Voir'}
          </button>
        </div>
        
        <AnimatePresence>
          {showLegend && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {[
                { 
                  type: 'triplo', 
                  label: 'Triploïdes', 
                  color: 'bg-brand-burgundy',
                  description: 'Huîtres stériles à croissance rapide'
                },
                { 
                  type: 'diplo', 
                  label: 'Diploïdes', 
                  color: 'bg-brand-primary',
                  description: 'Huîtres naturelles améliorées'
                }
              ].map((type) => (
                <div key={type.type} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-lg ${type.color} shadow-neon border-2 border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.6)] flex-shrink-0`} />
                  <div>
                    <div className="text-white font-medium">{type.label}</div>
                    <div className="text-sm text-white/60">{type.description}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Vue principale de la table en portrait */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-[400px] h-[800px] bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 rounded-lg overflow-hidden border border-white/10"
      >
        <div className="relative h-full grid grid-cols-2 grid-rows-10 gap-1 p-8 transform rotate-0">
          {(() => {
            // Si la table a des cellules définies, utiliser ces données
            if (table?.cells && table.cells.length > 0) {
              // Trier les cellules par ligne puis par colonne pour l'affichage
              const sortedCells = [...table.cells].sort((a, b) => {
                if (a.rowIndex !== b.rowIndex) {
                  return a.rowIndex - b.rowIndex;
                }
                return a.columnIndex - b.columnIndex;
              });
              
              // Afficher les cellules triées
              return sortedCells.map((cell, index) => {
                const cellColor = getCellColor(cell.type);
                const textColor = getCellTextColor(cell.type);
                
                return (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedCell({
                      id: cell.id,
                      type: cell.type,
                      pochonCount: 20,
                      size: 'T3',
                      filled: cell.filled,
                      fillOrder: cell.filled ? cell.fillOrder : undefined
                    })}
                    className={`relative rounded-md transition-all duration-300 group ${
                      cell.filled ? `${cellColor} shadow-neon animate-pulse` : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {/* Overlay avec contour blanc et ombre */}
                    <div className="absolute inset-0 rounded-md border border-white/20">
                      {/* Affichage du numéro uniquement pour les cellules remplies */}
                      {cell.filled && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xs ${textColor} font-bold`}>{cell.fillOrder}</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              });
            }
            
            // Sinon, utiliser les données par défaut
            // Créer un tableau pour chaque colonne
            const leftCells = Array.from({ length: 10 }).map((_, idx) => ({
              id: `left-${idx}`,
              column: 0,
              row: idx,
              type: 'triplo',
              // Les premières cellules sont toujours remplies (jusqu'à 6)
              filled: idx < 6
            }));
            
            const rightCells = Array.from({ length: 10 }).map((_, idx) => ({
              id: `right-${idx}`,
              column: 1,
              row: idx,
              type: 'diplo',
              // Les premières cellules sont toujours remplies (jusqu'à 6)
              filled: idx < 6
            }));
            
            // Attribuer les numéros d'ordre consécutifs d'abord pour la colonne gauche, puis pour la droite
            let counter = 1;
            
            leftCells.forEach(cell => {
              if (cell.filled) {
                cell.fillOrder = counter++;
              }
            });
            
            rightCells.forEach(cell => {
              if (cell.filled) {
                cell.fillOrder = counter++;
              }
            });
            
            // Recombiner en alternant gauche/droite pour l'affichage
            const combinedCells = [];
            for (let i = 0; i < Math.max(leftCells.length, rightCells.length); i++) {
              if (i < leftCells.length) combinedCells.push(leftCells[i]);
              if (i < rightCells.length) combinedCells.push(rightCells[i]);
            }
            
            // Renvoyer le tableau JSX des cellules
            return combinedCells.map((cell, index) => {
              const cellColor = getCellColor(cell.type);
              const textColor = getCellTextColor(cell.type);
              
              return (
                <motion.button
                  key={index}
                  onClick={() => setSelectedCell({
                    id: cell.id,
                    type: cell.type,
                    pochonCount: 20,
                    size: 'T3',
                    filled: cell.filled,
                    fillOrder: cell.filled ? cell.fillOrder : undefined
                  })}
                  className={`relative rounded-md transition-all duration-300 group ${
                    cell.filled ? `${cellColor} shadow-neon animate-pulse` : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {/* Overlay avec contour blanc et ombre */}
                  <div className="absolute inset-0 rounded-md border border-white/20">
                    {/* Affichage du numéro uniquement pour les cellules remplies */}
                    {cell.filled && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs ${textColor} font-bold`}>{cell.fillOrder}</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            });
          })()}
        </div>
      </motion.div>

      {/* Panneau latéral d'informations */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-96 bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 h-full border-l border-white/10 overflow-y-auto custom-scrollbar"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{table?.name}</h2>
              {isEditingName ? (
                <div className="flex items-center mt-1 space-x-2">
                  <input
                    type="text"
                    value={editedTableNumber}
                    onChange={(e) => setEditedTableNumber(e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    autoFocus
                  />
                  <button
                    onClick={handleTableNumberUpdate}
                    className="p-2 bg-brand-primary/20 hover:bg-brand-primary/40 rounded-lg transition-colors"
                    title="Valider"
                  >
                    <Check size={18} className="text-white" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
                    title="Annuler"
                  >
                    <X size={18} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <p className="text-white/60">{table?.tableNumber}</p>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                    title="Modifier le numéro de table"
                  >
                    <Edit size={14} className="text-white/60" />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={24} className="text-white/60" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Thermometer size={20} className="mr-2 text-brand-burgundy" />
                Température
              </div>
              <div className="text-2xl font-bold text-white">
                {table?.temperature}°C
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Droplets size={20} className="mr-2 text-brand-primary" />
                Salinité
              </div>
              <div className="text-2xl font-bold text-white">
                {table?.salinity}g/L
              </div>
            </div>
          </div>

          {table?.cells?.some(cell => cell.filled) && (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-4">
                <Clock size={20} className="mr-2 text-brand-tertiary" />
                Échantillonnage
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Dernier échantillonnage</span>
                  <span className="text-white">
                    {format(new Date(table.lastCheck), 'PP', { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Prochain échantillonnage</span>
                  <span className="text-white">
                    {format(new Date(table.nextCheck), 'PP', { locale: fr })}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Taux de mortalité estimé</span>
                    <span className={`text-lg font-medium ${
                      table.mortalityRate > 3
                        ? 'text-red-400'
                        : table.mortalityRate > 2
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }`}>
                      {table.mortalityRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {table?.cells?.some(cell => cell.filled) ? (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-4">
                <Shell size={20} className="mr-2 text-brand-burgundy" />
                Lot en cours
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Calibre</span>
                  <span className="text-white font-medium">
                    N°{table?.currentBatch?.size}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Quantité</span>
                  <span className="text-white font-medium">
                    Reste 1000 pochons
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Récolte prévue</span>
                  <span className="text-white font-medium">
                    {table?.currentBatch?.estimatedHarvestDate 
                      ? format(new Date(table.currentBatch.estimatedHarvestDate), 'PP', { locale: fr })
                      : 'Non définie'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Source du naissain</span>
                  <span className="text-white font-medium">
                    {table?.naissainSource}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-3">
                <Shell size={24} className="text-white/60" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Table vide</h3>
              <p className="text-white/60 text-sm">
                Cette table n'a pas de lot d'huîtres en cours.
              </p>
            </div>
          )}
          
          {/* Bouton d'importation de données */}
          <div className="bg-white/5 rounded-lg p-4 mt-6">
            <div className="flex items-center text-white/80 mb-4">
              <FileSpreadsheet size={20} className="mr-2 text-brand-tertiary" />
              Importation de données
            </div>
            <div className="space-y-2">
              <p className="text-white/60 text-sm mb-4">
                Importez vos données existantes pour remplir rapidement les tables et suivre leur production.
              </p>
              <a href="#" className="text-brand-tertiary text-sm hover:underline flex items-center">
                <Download size={16} className="mr-1" />
                Télécharger un modèle de fichier
              </a>
              <p className="text-white/60 text-sm mb-4">
                Importez vos données existantes pour remplir rapidement les tables et suivre leur production.
              </p>
              <button
                onClick={() => setShowImportModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-tertiary/80 rounded-lg text-white hover:bg-brand-tertiary transition-colors"
              >
                <Upload size={18} />
                Importer des données
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de gestion des cellules */}
      <AnimatePresence>
        {selectedCell && (
          <CellModal
            cell={selectedCell}
            onClose={() => setSelectedCell(null)}
            onUpdate={(data) => handleCellUpdate(selectedCell.id, data)}
            setShowNaissainModal={setShowNaissainModal}
          />
        )}
      </AnimatePresence>

      {/* Modal de remplissage de colonne */}
      <AnimatePresence>
        {showFillColumnModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Remplissage de la colonne {selectedColumn.side}
                </h3>
                <button
                  onClick={() => setShowFillColumnModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleFillColumn();
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Ordre de remplissage
                  </label>
                  <input
                    type="number"
                    value={fillOrderNumber}
                    onChange={(e) => setFillOrderNumber(e.target.valueAsNumber)}
                    className="w-full p-4 bg-white/5 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Date de remplissage
                  </label>
                  <input
                    type="date"
                    value={fillDate}
                    onChange={(e) => setFillDate(e.target.value)}
                    className="w-full p-4 bg-white/5 rounded-lg text-white"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowFillColumnModal(false)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
                  >
                    Remplir la colonne
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'échantillonnage */}
      <AnimatePresence>
        {showSamplingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Échantillonnage
                </h3>
                <button
                  onClick={() => setShowSamplingModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleSampling();
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Taux évalué de mortalité
                  </label>
                  <input
                    type="number"
                    value={samplingMortalityRate}
                    onChange={(e) => setSamplingMortalityRate(e.target.valueAsNumber)}
                    className="w-full p-4 bg-white/5 rounded-lg text-white"
                    placeholder="Ex: 3.7%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Taux potentiel de mortalité (IA)
                  </label>
                  <input
                    type="number"
                    value={iAMortalityPrediction}
                    onChange={(e) => setIAMortalityPrediction(e.target.valueAsNumber)}
                    className="w-full p-4 bg-white/5 rounded-lg text-white"
                    placeholder="Prédiction IA calculée automatiquement"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Date d'échantillonnage
                  </label>
                  <input
                    type="date"
                    value={samplingDate}
                    onChange={(e) => setSamplingDate(e.target.value)}
                    className="w-full p-4 bg-white/5 rounded-lg text-white"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowSamplingModal(false)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
                  >
                    Enregistrer l'échantillonnage
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de naissain */}
      <AnimatePresence>
        {showNaissainModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Gestion du Naissain
                </h3>
                <button
                  onClick={() => setShowNaissainModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleNaissainSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Source du naissain (écloserie)
                  </label>
                  <input
                    type="text"
                    value={naissainSource}
                    onChange={(e) => setNaissainSource(e.target.value)}
                    className="w-full p-4 bg-white/5 rounded-lg text-white"
                    placeholder="Ex: Écloserie Atlantique"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Numéro de lot fournisseur
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-white/5 rounded-lg text-white"
                    placeholder="Ex: ATLANT-2025-0012"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Date de réception
                  </label>
                  <input
                    type="date"
                    className="w-full p-4 bg-white/5 rounded-lg text-white"
                    defaultValue={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Quantité reçue
                  </label>
                  <input
                    type="number"
                    className="w-full p-4 bg-white/5 rounded-lg text-white"
                    placeholder="Ex: 10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Notes sur la qualité
                  </label>
                  <textarea
                    className="w-full p-4 bg-white/5 rounded-lg text-white h-24 resize-none"
                    placeholder="Observations sur la qualité du naissain à la réception..."
                  />
                </div>

                <div className="bg-brand-burgundy/20 p-4 rounded-lg">
                  <div className="flex items-center text-brand-burgundy mb-2">
                    <Info size={20} className="mr-2" />
                    <span className="font-medium">Numéro de traçabilité</span>
                  </div>
                  <div className="text-white font-mono">
                    NAIS-{new Date().getTime()}
                  </div>
                  <p className="text-xs text-white/60 mt-2">
                    Ce numéro sera utilisé pour la traçabilité et permettra de suivre la performance de ce lot de naissain.
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNaissainModal(false)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
                  >
                    Enregistrer le naissain
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'historique */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Historique de la table {table?.name}
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-white">Rechercher par date</h4>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={historyDate}
                      onChange={(e) => setHistoryDate(e.target.value)}
                      className="p-2 bg-white/5 rounded-lg text-white"
                    />
                    <button
                      onClick={handleHistorySearch}
                      className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
                    >
                      Rechercher
                    </button>
                  </div>
                </div>

                {/* Affichage des informations historiques */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-4">Données pour le {format(new Date(historyDate), 'dd MMMM yyyy', { locale: fr })}</h4>
                  
                  {/* Métriques */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="glass-effect rounded-lg p-4">
                      <div className="flex items-center text-white/80 mb-2">
                        <Thermometer size={20} className="mr-2 text-brand-burgundy" />
                        Température
                      </div>
                      <div className="text-2xl font-bold text-white">12.5°C</div>
                    </div>

                    <div className="glass-effect rounded-lg p-4">
                      <div className="flex items-center text-white/80 mb-2">
                        <Droplets size={20} className="mr-2 text-brand-primary" />
                        Salinité
                      </div>
                      <div className="text-2xl font-bold text-white">35g/L</div>
                    </div>

                    <div className="glass-effect rounded-lg p-4">
                      <div className="flex items-center text-white/80 mb-2">
                        <AlertCircle size={20} className="mr-2 text-brand-tertiary" />
                        Mortalité
                      </div>
                      <div className="text-2xl font-bold text-white">2.5%</div>
                    </div>
                  </div>

                  {/* Informations sur le lot */}
                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex items-center text-white/80 mb-4">
                      <Shell size={20} className="mr-2 text-brand-burgundy" />
                      Lot en cours
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Calibre</span>
                        <span className="text-white font-medium">N°3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Quantité</span>
                        <span className="text-white font-medium">Reste 1000 pochons</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Date de récolte estimée</span>
                        <span className="text-white font-medium">15 juin 2025</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Source du naissain</span>
                        <span className="text-white font-medium">Écloserie Atlantique</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Échantillonnage */}
                  <div className="glass-effect rounded-lg p-4 mt-4">
                    <div className="flex items-center text-white/80 mb-4">
                      <Calendar size={20} className="mr-2 text-brand-tertiary" />
                      Échantillonnage
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Dernier échantillonnage</span>
                        <span className="text-white">19 févr. 2025</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Prochain échantillonnage</span>
                        <span className="text-white">26 févr. 2025</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-brand-tertiary rounded-lg text-white hover:bg-brand-tertiary/90 transition-colors"
                  >
                    Exporter les données
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHistoryModal(false)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'importation */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FileSpreadsheet size={24} className="mr-3 text-brand-tertiary" />
                  <h3 className="text-xl font-bold text-white">
                    Importer des données
                  </h3>
                </div>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6 bg-white/5 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Format de fichier attendu</h4>
                <p className="text-white/70 text-sm">
                  Votre fichier Excel doit contenir les colonnes suivantes :
                </p>
                <ul className="list-disc list-inside text-white/70 text-sm mt-2 space-y-1">
                  <li>Position (ID de la case)</li>
                  <li>Type (type de production)</li>
                  <li>Quantité (nombre d'unités)</li>
                  <li>Date de mise en place (format JJ/MM/AAAA)</li>
                  <li>Calibre (taille des huîtres)</li>
                  <li>Source (provenance du naissain)</li>
                </ul>
                <div className="mt-4">
                  <a href="#" className="text-brand-tertiary text-sm hover:underline flex items-center">
                    <Download size={16} className="mr-1" />
                    Télécharger un modèle de fichier
                  </a>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleImportData();
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Sélectionner un fichier Excel (.xlsx, .xls) ou CSV
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-white/40 transition-colors"
                    onClick={() => fileInputRef.current?.click()}>
                    <Upload size={36} className="mx-auto text-white/60 mb-3" />
                    <p className="text-white/80 mb-2">
                      Glissez-déposez votre fichier ici ou cliquez pour parcourir
                    </p>
                    <p className="text-white/50 text-sm">
                      Formats supportés: .xlsx, .xls, .csv
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".xlsx, .xls, .csv"
                    />
                  </div>
                </div>

                {importError && (
                  <div className="bg-red-900/30 border border-red-500/30 text-red-300 p-4 rounded-lg text-sm">
                    <div className="font-medium mb-1">Erreur d'importation</div>
                    {importError}
                  </div>
                )}

                {importPreview.length > 0 && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-4">Aperçu des données ({importData.length} enregistrements au total)</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            {Object.keys(importPreview[0]).map((key) => (
                              <th key={key} className="text-left py-2 px-3 text-white/80">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {importPreview.map((row, index) => (
                            <tr key={index} className="border-b border-white/5">
                              {Object.keys(row).map((key) => (
                                <td key={key} className="py-2 px-3 text-white/70">{row[key]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 text-white/60 text-sm">
                      * Seules les 5 premières lignes sont affichées
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={importData.length === 0}
                    className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center 
                    ${importData.length === 0 
                      ? 'bg-white/20 cursor-not-allowed' 
                      : 'bg-brand-burgundy hover:bg-brand-burgundy/90'}`}
                  >
                    <FileSpreadsheet size={18} />
                    Importer les données
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}