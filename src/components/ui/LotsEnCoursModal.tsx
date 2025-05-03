import React, { useState, useEffect, useMemo } from 'react';
import './scrollbar.css';
import { 
  X, 
  CheckCircle2, 
  Star, 
  StarOff, 
  Calendar,
  Shield,
  ShieldAlert,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCheck,
  Search,
  FileText,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  CircleDot,
  Package,
  Check,
  AlertTriangle,
  AlertCircle,
  Truck,
  PackageCheck,
  MailOpen,
  Info,
  MoreVertical,
  Trash2,
  MapPin,
  User,
  Sprout,
  Percent as PercentIcon,
  History,
  ArrowRight,
  PieChart
} from 'lucide-react';
import { Modal } from './Modal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Définition plus précise des statuts possibles
export type LotStatus = 'EN_TRANSIT' | 'TERMINE' | 'PROBLEME';

export const STATUTS_EN_COURS: LotStatus[] = ['EN_TRANSIT', 'PROBLEME'];

// Lots en cours de démonstration pour tables nord et tables de trempe
export const lotsEnCoursDemo: Lot[] = [
  // Tables nord
  {
    id: 'n1',
    nom: 'Lot Huîtres Triploïdes #NORD-101',
    numeroLot: 'N°03-0545',
    statut: 'EN_TRANSIT',
    datePrevue: '2025-05-02T09:00:00Z',
    dernierEvenement: 'Transfert vers Trempe',
    important: true,
    read: false,
    responsable: '',
    metadata: {
      origine: 'Table B-07 Bouzigues',
      destination: 'Trempe',
      estimationRemplissage: 15,
      unite: 'pochons',
      naissain: 'Charente Maritime',
      contenant: '10 cordes',
      mortalite: 16.9
    }
  },
  {
    id: 'n2',
    nom: 'Lot Huîtres Triploïdes #NORD-202',
    numeroLot: 'N°03-0782',
    statut: 'EN_TRANSIT',
    datePrevue: '2025-05-02T11:00:00Z',
    dernierEvenement: 'Transfert vers trempe',
    important: false,
    read: false,
    responsable: '',
    metadata: {
      origine: 'Table Nord #128',
      destination: 'Trempe',
      estimationRemplissage: 12,
      unite: 'pochons',
      naissain: 'Arcachon',
      contenant: '8 cordes',
      mortalite: 15.7
    }
  },
  // Tables de trempe
  {
    id: 't1',
    nom: 'Lot Huîtres Triploïdes #TREMPE-301',
    numeroLot: 'N°03-0614',
    statut: 'EN_TRANSIT',
    datePrevue: '2025-05-02T13:00:00Z',
    dernierEvenement: 'Transfert vers bassins',
    important: false,
    read: false,
    responsable: '',
    metadata: {
      origine: 'Trempe',
      destination: 'Bassins',
      estimationRemplissage: 130,
      unite: 'kg',
      naissain: 'Arcachon',
      contenant: '15 Pochons',
      mortalite: 24
    }
  },
];

export interface Lot {
  id: string;
  nom: string;
  numeroLot: string; // Numéro du lot (ex: N°03-0545)
  statut: LotStatus;
  datePrevue?: string; // Date de planification ou d'arrivée
  dernierEvenement?: string; // Ex: "Arrivé au Quai 5"
  important: boolean;
  read: boolean;
  responsable: string; // Personne qui a déplacé le lot
  metadata?: {
    origine?: string; // Table d'origine
    destination?: string;
    quantite?: number;
    estimationRemplissage?: number; // Estimation du remplissage en nombre de poches
    unite?: string;
    naissain?: string; // Type de naissain (ex: Charente Maritime)
    contenant?: string; // Contenant des coquillages (ex: 10 cordes)
    mortalite?: number; // Pourcentage de mortalité
  };
  actions?: LotAction[];
  timestamp?: string;
}

export interface LotAction {
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
}

export interface LotsEnCoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  lots?: Lot[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onToggleImportant: (id: string) => void;
}

const filterOptions = [
  { label: 'Tous', value: 'all' }
];

// Fonction pour obtenir l'icône et les couleurs en fonction du statut
const getStatusInfo = (status: LotStatus): {
  icon: React.ElementType;
  color: string;
  textColor: string;
  bgColor: string;
  label: string;
} => {
  switch (status) {
    // Statut supprimé selon la demande
    case 'EN_TRANSIT': 
      return { 
        icon: Truck, 
        color: 'text-cyan-400',
        textColor: 'text-cyan-400',
        bgColor: 'bg-gradient-to-r from-cyan-500/20 to-green-500/20', 
        label: 'En transit' 
      };
    // Statut supprimé selon la demande
    // Statut supprimé selon la demande
    case 'TERMINE': 
      return { 
        icon: CheckCircle2, 
        color: 'text-green-400',
        textColor: 'text-green-400',
        bgColor: 'bg-green-500/20', 
        label: 'Terminé' 
      };
    case 'PROBLEME': 
    default: 
      return { 
        icon: AlertCircle, 
        color: 'text-red-400',
        textColor: 'text-red-400',
        bgColor: 'bg-red-500/20', 
        label: 'Problème' 
      };
  }
};

interface LotItemProps {
  lot: Lot;
  onMarkAsRead: (id: string) => void;
  onToggleImportant: (id: string) => void;
  selectedLotId: string | null;
  setSelectedLotId: (id: string | null) => void;
  onOpenValidationModal: (lot: Lot) => void;
}

const LotItem = React.forwardRef<HTMLDivElement, LotItemProps>((props, ref) => {
  const { lot, onMarkAsRead, onToggleImportant, selectedLotId, setSelectedLotId, onOpenValidationModal } = props;
  const { icon: StatusIcon, color: statusColor, textColor, bgColor, label: statusLabel } = getStatusInfo(lot.statut);
  const isSelected = selectedLotId === lot.id;
  const formattedDate = lot.datePrevue 
    ? format(new Date(lot.datePrevue), 'd MMM yyyy, HH:mm', { locale: fr })
    : '';

  const handleItemClick = () => {
    if (!lot.read) {
      onMarkAsRead(lot.id);
    }
    // Ouvrir le modal de validation
    onOpenValidationModal(lot);
  };

  return (
    <div
      className={`p-5 mb-5 relative cursor-pointer hover:bg-white/3 rounded-lg transform hover:-translate-y-0.5 transition-all duration-300 ${
        lot.read 
          ? 'bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-white/15' 
          : 'bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-cyan-400/20 hover:border-cyan-400/30'
      }`}
      onClick={handleItemClick}
      tabIndex={0}
      role="button"
      aria-label={`Lot: ${lot.nom}. ${lot.read ? "Lu" : "Non lu"}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleItemClick();
        }
      }}
    >
      {/* Statut/lu */}
      {!lot.read && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)] z-50" title="Non lu"></div>
      )}
      {/* Contenu principal */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-col">
          <div>
            {/* Encart spécial pour titre et statut */}
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-4 rounded-lg border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_10px_rgba(34,211,238,0.1)_inset] mb-4 relative overflow-hidden">
              {/* Effet de glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-50 blur-xl"></div>
              
              <div className="flex items-center justify-between relative z-10 gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent mb-1.5">{lot.nom}</h3>
                  <div className="h-[2px] w-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                </div>
                
                {lot.statut === 'EN_TRANSIT' ? (
                  <div className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 px-4 py-2 rounded-lg border border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15)] min-w-[44px] min-h-[32px] flex items-center gap-2 transform hover:-translate-y-0.5 transition-all duration-300">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span className="text-sm font-medium text-cyan-400">{statusLabel}</span>
                  </div>
                ) : (
                  <span className={`px-3 py-1.5 text-sm ${bgColor} rounded-full font-medium shadow-sm`}>
                    {statusLabel}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2">
              {lot.id === 'n1' && (
                <div className="flex items-center gap-2 text-sm mt-1 p-2">
                  <span className="text-white/70">Table B-07 Bouzigues</span>
                  <ArrowRight size={18} className="text-cyan-400" />
                  <span className="text-cyan-400 font-medium">Trempe</span>
                </div>
              )}
              
              {lot.id !== 'n1' && lot.dernierEvenement && lot.metadata?.origine && (
                <div className="flex items-center gap-2 text-sm mt-1 p-2">
                  <span className="text-white/70">{lot.metadata.origine}</span>
                  <ArrowRight size={18} className="text-cyan-400" />
                  <span className="text-cyan-400 font-medium">
                    {lot.dernierEvenement.replace('Transfert vers', '').replace('Prévu pour', '').replace('Réceptionné au', '')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4 mt-4 text-white/60">
            {/* Métadonnées */}
            <div className="grid grid-cols-2 gap-4 text-sm w-full">
              {/* Origine (sans préfixe "Naissain") */}
              {lot.metadata?.naissain && (
                <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300">
                  <MapPin className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate" title={`Origine: ${lot.metadata.naissain}`}>{lot.metadata.naissain}</span>
                </div>
              )}

              {/* Contenant (cordes) avec icône adaptée */}
              {lot.metadata?.contenant && (
                <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300">
                  <ArrowRight className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate" title={`${lot.metadata.contenant}`}>{lot.metadata.contenant}</span>
                </div>
              )}
              
              {/* Numéro de lot - Troisième élément */}
              <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300">
                <Info className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" aria-hidden="true" />
                <span className="truncate" title={`${lot.numeroLot}`}>{lot.numeroLot}</span>
              </div>

              {/* Estimation remplissage - Quatrième élément, mise en évidence */}
              {lot.metadata?.estimationRemplissage && (
                <div className="flex items-center bg-gradient-to-r from-green-500/20 to-green-400/10 rounded-lg p-3 border border-green-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,200,100,0.2)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,200,100,0.25)]">
                  <PercentIcon className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="text-xs text-white/70 mb-0.5">Estimation remplissage</span>
                    <span className="font-bold text-base text-white" title={`${lot.metadata.estimationRemplissage} ${lot.metadata.unite}`}>
                      {lot.metadata.estimationRemplissage} <span className="text-green-400">{lot.metadata.unite}</span>
                    </span>
                  </div>
                </div>
              )}
            {lot.metadata?.mortalite !== undefined && (
              <div className="bg-white/5 p-3 rounded-lg border border-white/10 col-span-2 transition-all duration-300 hover:border-cyan-400/20">
                {/* En-tête simplifié */}
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <h4 className="text-sm font-medium text-white">Mortalité</h4>
                  </div>
                  <span className="text-base font-medium text-green-400">{lot.metadata.mortalite}%</span>
                </div>
                
                {/* Jauge simplifiée */}
                <div className="relative h-4 w-full bg-gray-700/50 rounded-md overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-green-500"
                    style={{ width: `${Math.min(lot.metadata.mortalite, 100)}%` }}
                  ></div>
                  
                  {/* Marqueurs de seuil */}
                  <div className="absolute top-0 bottom-0 left-[10%] w-px bg-white/20"></div>
                  <div className="absolute top-0 bottom-0 left-[15%] w-px bg-white/20"></div>
                </div>
              </div>
            )}
          </div>
          {/* Date et infos supplémentaires */}
          <div className="flex items-center justify-between w-full mt-2">
            {formattedDate && (
              <div className="flex items-center bg-white/5 rounded-md px-2 py-1.5 border border-white/10">
                <Calendar className="w-4 h-4 mr-2 text-cyan-400" aria-hidden="true" />
                <span className="text-sm text-white/80 font-medium">{formattedDate}</span>
              </div>
            )}
            <div className="flex items-center bg-white/5 rounded-md px-2 py-1.5 border border-white/10">
              <Package className="w-4 h-4 mr-2 text-cyan-400" aria-hidden="true" />
              <span className="text-sm text-white/80 font-medium">Huîtres N°3</span>
            </div>
          </div>
        </div>
      </div>
      {/* Boutons d'action */}

    </div>
  );

});

LotItem.displayName = "LotItem";

export const LotsEnCoursModal: React.FC<LotsEnCoursModalProps> = ({
  isOpen,
  onClose,
  lots = lotsEnCoursDemo, // Utilise les lots de démo si aucun lot n'est fourni
  onMarkAsRead = (id: string) => console.log('Mark as read:', id),
  onMarkAllAsRead = () => console.log('Mark all as read'),
  onToggleImportant = (id: string) => console.log('Toggle important:', id)
}) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [lotToValidate, setLotToValidate] = useState<Lot | null>(null);
  const [confirmationStep, setConfirmationStep] = useState(1); // 1 = initial, 2 = confirmation

  const lotsEnCoursCount = useMemo(() => {
    return lots.filter(lot => !lot.read && STATUTS_EN_COURS.includes(lot.statut)).length;
  }, [lots]);
  
  // Fonction pour ouvrir le modal de validation
  const openValidationModal = (lot: Lot) => {
    setLotToValidate(lot);
    setShowValidationModal(true);
  };
  
  // Fonction pour fermer le modal de validation
  const closeValidationModal = () => {
    setShowValidationModal(false);
    setLotToValidate(null);
  };
  
  // Fonction pour passer à l'étape de confirmation
  const showTransitConfirmation = () => {
    console.log('Passage à l\'étape de confirmation');
    setConfirmationStep(2);
  };
  
  // Fonction pour revenir à l'étape initiale
  const cancelConfirmation = () => {
    console.log('Retour à l\'étape initiale');
    setConfirmationStep(1);
  };
  
  // Fonction pour valider la fin de transit après confirmation
  const handleValidateTransit = () => {
    if (!lotToValidate) return;
    
    // Créer une copie du lot avec le statut mis à jour
    const updatedLot = {
      ...lotToValidate,
      statut: 'TERMINE' as LotStatus,
      read: true, // Marquer comme lu automatiquement
      dernierEvenement: `Arrivé à ${lotToValidate.metadata?.destination || 'destination'}`,
      timestamp: new Date().toISOString()
    };

    // Simuler la mise à jour de l'inventaire et de l'historique
    console.log('Lot arrivé à destination:', updatedLot);
    console.log('Inventaire mis à jour');
    console.log('Historique de traçabilité mis à jour');
    
    // Dans un cas réel, vous appelleriez ici des fonctions pour :
    // 1. Mettre à jour le statut du lot dans la base de données
    // 2. Mettre à jour l'inventaire des stocks
    // 3. Ajouter une entrée dans l'historique de traçabilité
    
    // Afficher une notification de succès (simulée)
    setTimeout(() => {
      alert(`Arrivée du lot ${lotToValidate.nom} validée avec succès.`);
    }, 500);
    
    // Réinitialiser l'étape de confirmation et fermer le modal
    setConfirmationStep(1);
    closeValidationModal();
  };

  // Filtrage basé sur le filtre sélectionné et la recherche
  const filteredLots = useMemo(() => {
    // S'assurer que les lots sont un tableau et non undefined
    if (!Array.isArray(lots) || lots.length === 0) {
      return lotsEnCoursDemo;
    }

    let result = lots.filter(lot => {
      // Vérifier si le lot a un statut valide
      if (!lot.statut) {
        return false;
      }
      const included = STATUTS_EN_COURS.includes(lot.statut);
      return included;
    });

    if (selectedFilter === 'important') {
      result = result.filter(lot => lot.important);
    }

    if (searchQuery) {
      result = result.filter(lot =>
        lot.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.statut.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lot.dernierEvenement && lot.dernierEvenement.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lot.metadata?.origine && lot.metadata.origine.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lot.metadata?.destination && lot.metadata.destination.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Si après filtrage il n'y a aucun lot, utiliser les lots de démo
    if (result.length === 0) {
      return lotsEnCoursDemo;
    }
    
    return result;
  }, [lots, selectedFilter, searchQuery]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.querySelector('.lots-en-cours-panel');
      const triggerButton = document.querySelector('[data-lots-trigger="true"]');
      
      if (triggerButton && triggerButton.contains(event.target as Node)) {
        return;
      }
      
      if (panel && !panel.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="lots-en-cours-panel fixed top-16 bottom-0 right-0 z-50 md:rounded-l-xl flex flex-col focus:outline-none bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-[10px] border border-white/10 shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lots-en-cours-title"
        tabIndex={-1}
        style={{ 
          width: '380px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          position: 'fixed',
          right: '16px',
          top: '64px',
          margin: 0,
          padding: 0,
          transform: 'translateX(0)',
          pointerEvents: 'auto'
        }}  
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-br from-[rgba(15,23,42,0.5)] to-[rgba(20,80,100,0.5)]">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg -z-10"></div>
            
            {/* Titre centré avec compteur de lots */}
            <div className="flex justify-center items-center my-2 relative">
              <div className="absolute left-0">
                <div className="relative">
                  <div className="relative">
                    <Package size={26} className="text-cyan-400" />
                    <span className="absolute -bottom-2 -left-1 text-[10px] font-medium text-cyan-400">N°3</span>
                  </div>
                  {lotsEnCoursCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-[0_0_4px_rgba(0,180,180,0.3)]">
                      {lotsEnCoursCount}
                    </span>
                  )}
                </div>
              </div>
              <h2 id="lots-en-cours-title" className="text-3xl font-bold text-white whitespace-nowrap">Lots en cours</h2>
              
              {/* Boutons alignés à droite */}
              <div className="absolute right-0 flex items-center">
                {/* Seul bouton de fermeture */}
                <>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white/60 hover:text-cyan-400 ml-2"
                    aria-label="Fermer"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </>
              </div>
            </div>
            {/* Barre de recherche supprimée */}
          </div>
          {/* Section historique déplacée en haut */}
          <div className="px-6 py-4 bg-gradient-to-br from-[rgba(15,23,42,0.4)] to-[rgba(20,90,90,0.4)] border-b border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <History className="text-cyan-400" size={20} />
              <h3 className="text-lg font-medium text-white">Mouvement des lots</h3>
            </div>
            <div className="text-sm text-white/70">
              Suivez le parcours de vos lots en cours. Chaque mouvement validé sera automatiquement enregistré dans les modules Stocks et Traçabilité, permettant une mise à jour complète de votre inventaire et de l'historique de production.
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6" style={{ overflowX: 'hidden', position: 'relative' }}>
            <div className="space-y-8">
            <div className="space-y-6">
              {filteredLots.length > 0 ? 
                filteredLots.map((lot) => (
                  <LotItem
                    key={lot.id}
                    lot={lot}
                    onMarkAsRead={onMarkAsRead}
                    onToggleImportant={onToggleImportant}
                    selectedLotId={selectedLotId}
                    setSelectedLotId={setSelectedLotId}
                    onOpenValidationModal={openValidationModal}
                  />
                ))
               : 
                <div className="p-6 text-center text-white/50">
                  {searchQuery ? 
                    <span>Aucun lot trouvé pour "{searchQuery}"</span>
                   : 
                    <span>Aucun lot à afficher</span>
                  }
                </div>
              }
            </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de validation - style exportation de données */}
      {showValidationModal && lotToValidate && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] backdrop-filter backdrop-blur-[10px] rounded-xl shadow-[rgba(0,0,0,0.4)_0px_10px_30px,rgba(0,150,255,0.2)_0px_0px_20px] transform-gpu scale-100 border border-white/10 hover:border-white/20 transition-all duration-300 animate-fadeIn overflow-hidden" style={{ position: 'fixed', top: '50%', left: 'calc(50% - 1000px)', transform: 'translate(-50%, -50%)', margin: '0 auto', width: '28.5vw', maxWidth: '600px', maxHeight: '90vh' }}>
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Valider l'arrivée du lot</h3>
                <button
                  onClick={closeValidationModal}
                  className="text-white/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-full p-1"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-white mb-6">
                Voulez-vous confirmer l'arrivée du lot <span className="font-semibold">{lotToValidate.nom}</span> à destination ? Cette action mettra à jour l'inventaire, l'historique et la traçabilité.
              </p>
              
              <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-lg p-4 mb-6">
                <h4 className="text-cyan-400 font-medium mb-2 flex items-center">
                  <Info size={18} className="mr-2" />
                  Informations importantes
                </h4>
                <ul className="text-white/80 space-y-2 text-sm">
                  <li className="flex">
                    <div className="mr-2 mt-0.5">•</div>
                    <div>L'inventaire sera automatiquement mis à jour avec le transfert du lot de <span className="text-cyan-400">{lotToValidate.metadata?.origine || '-'}</span> vers <span className="text-cyan-400">{lotToValidate.metadata?.destination || '-'}</span></div>
                  </li>
                  <li className="flex">
                    <div className="mr-2 mt-0.5">•</div>
                    <div>Un nouvel enregistrement sera créé dans l'historique de traçabilité</div>
                  </li>
                  <li className="flex">
                    <div className="mr-2 mt-0.5">•</div>
                    <div>Cette opération sera enregistrée avec l'horodatage et l'utilisateur actuels</div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] flex justify-end gap-3">
              {confirmationStep === 1 ? (
                // Étape 1: Première confirmation
                <>
                  <button
                    onClick={closeValidationModal}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white transition-all duration-300 min-w-[100px]"
                    aria-label="Annuler la validation"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={showTransitConfirmation}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] transition-all duration-300 min-w-[100px] font-medium"
                    aria-label="Confirmer l'arrivée du lot"
                  >
                    Confirmer
                  </button>
                </>
              ) : (
                // Étape 2: Confirmation finale
                <>
                  <button
                    onClick={cancelConfirmation}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white transition-all duration-300 min-w-[100px]"
                    aria-label="Revenir à l'étape précédente"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleValidateTransit}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,200,100,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,200,100,0.25)] transition-all duration-300 min-w-[100px] font-medium animate-pulse"
                    aria-label="Confirmer définitivement l'arrivée du lot"
                  >
                    Confirmer définitivement
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      </>
  );
};

export default LotsEnCoursModal;
