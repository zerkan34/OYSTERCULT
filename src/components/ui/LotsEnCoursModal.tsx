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
import LotsEnCoursPanel from './LotsEnCoursPanel';
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
  onOpenInfoModal: (lot: Lot) => void;
}

const LotItem = React.forwardRef<HTMLDivElement, LotItemProps>((props, ref) => {
  const { lot, onMarkAsRead, onToggleImportant, selectedLotId, setSelectedLotId, onOpenValidationModal, onOpenInfoModal } = props;
  const { icon: StatusIcon, color: statusColor, textColor, bgColor, label: statusLabel } = getStatusInfo(lot.statut);
  const isSelected = selectedLotId === lot.id;
  const formattedDate = lot.datePrevue 
    ? format(new Date(lot.datePrevue), 'd MMM yyyy, HH:mm', { locale: fr })
    : '';

  const handleItemClick = () => {
    if (!lot.read) {
      onMarkAsRead(lot.id);
    }
    // Ouvrir le modal d'information détaillé quand on clique sur le lot
    onOpenInfoModal(lot);
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
                <div 
                  className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Empêcher la propagation du clic au parent
                    // Ne rien faire ici car le handleItemClick du parent va s'occuper d'ouvrir le modal
                  }}
                  role="button"
                  aria-label={`Voir les détails de l'origine: ${lot.metadata.naissain}`}
                >
                  <MapPin className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate" title={`Origine: ${lot.metadata.naissain}`}>{lot.metadata.naissain}</span>
                </div>
              )}

              {/* Contenant (cordes) avec icône adaptée */}
              {lot.metadata?.contenant && (
                <div 
                  className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Empêcher la propagation du clic au parent
                    // Ne rien faire ici car le handleItemClick du parent va s'occuper d'ouvrir le modal
                  }}
                  role="button"
                  aria-label={`Voir les détails du contenant: ${lot.metadata.contenant}`}
                >
                  <ArrowRight className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate" title={`${lot.metadata.contenant}`}>{lot.metadata.contenant}</span>
                </div>
              )}
              
              {/* Numéro de lot - Troisième élément */}
              <div 
                className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Empêcher la propagation du clic au parent
                  // Ne rien faire ici car le handleItemClick du parent va s'occuper d'ouvrir le modal
                }}
                role="button"
                aria-label={`Voir les détails du lot: ${lot.numeroLot}`}
              >
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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [lotToValidate, setLotToValidate] = useState<Lot | null>(null);
  const [lotToShow, setLotToShow] = useState<Lot | null>(null);
  const [estimationRemplissage, setEstimationRemplissage] = useState<number | undefined>();
  const [confirmationStep, setConfirmationStep] = useState(1);
  const [showFlash, setShowFlash] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });

  // Aucune référence ou gestionnaire de clic ici - nous laissons simplement les modals ouverts jusqu'à ce qu'on clique sur le bouton de fermeture X
  
  // Réinitialiser les états des modals à chaque ouverture/fermeture du panel principal
  useEffect(() => {
    if (!isOpen) {
      // Réinitialiser les états des modals lorsque le panel principal est fermé
      setShowValidationModal(false);
      setShowInfoModal(false);
      setLotToValidate(null);
      setLotToShow(null);
      setConfirmationStep(1);
    }
  }, [isOpen]);

  const lotsEnCoursCount = useMemo(() => {
    return lots.filter(lot => !lot.read && STATUTS_EN_COURS.includes(lot.statut)).length;
  }, [lots]);
  
  // Fonction pour ouvrir le modal d'information détaillé
  const openInfoModal = (lot: Lot) => {
    setLotToShow(lot);
    setShowInfoModal(true);
  };
  
  // Fonction pour ouvrir le modal de validation
  const openValidationModal = (lot: Lot) => {
    setLotToValidate(lot);
    setEstimationRemplissage(lot.metadata?.estimationRemplissage);
    setConfirmationStep(1); // S'assurer que nous démarrons toujours à l'étape 1
    setShowValidationModal(true);
  };
  
  // Fonction pour fermer le modal de validation
  const closeValidationModal = () => {
    setShowValidationModal(false);
    setLotToValidate(null);
  };
  
  // Fonction pour passer à l'étape de confirmation avec effet visuel
  const showTransitConfirmation = () => {
    console.log('Passage à l\'étape de confirmation');
    
    // Activer l'effet de flash
    setShowFlash(true);
    
    // Attendre un court moment puis passer à l'étape suivante
    setTimeout(() => {
      setShowFlash(false);
      setConfirmationStep(2);
    }, 300);
  };
  
  // Fonction pour revenir à l'étape initiale
  const cancelConfirmation = () => {
    console.log('Retour à l\'étape initiale');
    setConfirmationStep(1);
  };
  
  // Fonction pour valider la fin de transit après confirmation
  const handleValidateTransit = () => {
    if (!lotToValidate) return;
    
    // Afficher un effet visuel pendant le traitement
    setShowFlash(true);
    
    // Créer une copie du lot avec le statut mis à jour et l'estimation modifiée
    const updatedLot = {
      ...lotToValidate,
      statut: 'TERMINE' as LotStatus,
      read: true, // Marquer comme lu automatiquement
      dernierEvenement: `Arrivé à ${lotToValidate.metadata?.destination || 'destination'}`,
      timestamp: new Date().toISOString(),
      metadata: {
        ...lotToValidate.metadata,
        estimationRemplissage: estimationRemplissage // Utiliser la valeur modifiée
      }
    };

    // Simuler la mise à jour de l'inventaire et de l'historique
    console.log('Lot arrivé à destination:', updatedLot);
    console.log('Inventaire mis à jour avec l\'estimation:', estimationRemplissage);
    console.log('Historique de traçabilité mis à jour');
    
    // Dans un cas réel, vous appelleriez ici des fonctions pour :
    // 1. Mettre à jour le statut du lot dans la base de données
    // 2. Mettre à jour l'inventaire des stocks
    // 3. Ajouter une entrée dans l'historique de traçabilité
    
    // Préparer le message de succès avec des informations détaillées
    const title = "Validation réussie";
    const message = `Le lot ${lotToValidate.nom} est maintenant enregistré comme arrivé à ${lotToValidate.metadata?.destination || 'destination'} avec une estimation finale de ${estimationRemplissage} ${lotToValidate.metadata?.unite || 'unités'}. L'inventaire et l'historique de traçabilité ont été mis à jour.`;
    
    setSuccessMessage({ title, message });
    
    // Simuler un temps de traitement puis afficher la notification de succès
    setTimeout(() => {
      setShowFlash(false);
      setShowSuccessNotification(true);
      
      // Fermer automatiquement la notification après quelques secondes
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
    }, 800);
    
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
        className="lots-en-cours-panel fixed top-16 bottom-0 right-0 z-50 md:rounded-l-xl flex flex-col focus:outline-none bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] border border-white/10 shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
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
                    onOpenInfoModal={openInfoModal}
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
      {/* Effet de flash visuel */}
      {showFlash && (
        <div className="fixed inset-0 z-[99999] bg-green-500/10 pointer-events-none animate-pulse" />
      )}
      
      {/* Notification de succès */}
      {showSuccessNotification && (
        <div className="fixed bottom-6 right-6 z-[99999] max-w-md transform transition-all duration-500 ease-in-out animate-slideInRight">
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] backdrop-filter backdrop-blur-[10px] rounded-xl shadow-[rgba(0,0,0,0.4)_0px_10px_30px,rgba(0,150,255,0.2)_0px_0px_20px] border border-green-400/30 p-5 flex items-start gap-4">
            <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-2 flex-shrink-0">
              <CheckCheck size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                {successMessage.title}
              </h4>
              <p className="text-white text-sm">
                {successMessage.message}
              </p>
              <div className="mt-3 flex justify-end">
                <button 
                  onClick={() => setShowSuccessNotification(false)}
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de validation - style exportation de données */}
      {showValidationModal && lotToValidate && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            className={`validation-modal bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] backdrop-filter backdrop-blur-[10px] rounded-xl shadow-[rgba(0,0,0,0.4)_0px_10px_30px,rgba(0,150,255,0.2)_0px_0px_20px] transform-gpu scale-100 border border-white/10 hover:border-white/20 transition-all duration-300 animate-fadeIn overflow-hidden ${confirmationStep === 2 ? 'ring-2 ring-green-500/30' : ''}` } 
            style={{ position: 'fixed', top: '50%', left: 'calc(50% - 1000px)', transform: 'translate(-50%, -50%)', margin: '0 auto', width: '28.5vw', maxWidth: '600px', maxHeight: '90vh' }}
          >
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
              
              <p className="text-white mb-4">
                Voulez-vous confirmer l'arrivée du lot <span className="font-semibold">{lotToValidate.nom}</span> à destination ? Cette action mettra à jour l'inventaire, l'historique et la traçabilité.
              </p>
              
              {/* Champ modifiable pour l'estimation de remplissage */}
              <div className="mb-6 bg-gradient-to-r from-green-500/10 to-green-400/5 rounded-lg p-4 border border-green-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,200,100,0.2)]">
                <h4 className="text-green-400 font-medium mb-3 flex items-center">
                  <PercentIcon size={18} className="mr-2" />
                  Estimation de remplissage
                </h4>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={estimationRemplissage || ''}
                      onChange={(e) => setEstimationRemplissage(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 focus:border-green-400/50 rounded-lg p-3 text-white text-xl font-medium transition-all duration-300 focus:ring-2 focus:ring-green-400/30 focus:outline-none"
                      placeholder="Entrez l'estimation"
                    />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-xl min-w-[80px] text-center">
                    {lotToValidate.metadata?.unite || 'unités'}
                  </div>
                </div>
                
                <p className="text-white/60 text-sm mt-2">
                  Valeur initiale: {lotToValidate.metadata?.estimationRemplissage || '-'} {lotToValidate.metadata?.unite || 'unités'}
                </p>
              </div>
              
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
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white transition-all duration-300"
                    aria-label="Annuler la validation"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={showTransitConfirmation}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] transition-all duration-300 font-medium"
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
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white transition-all duration-300"
                    aria-label="Revenir à l'étape précédente"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleValidateTransit}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,200,100,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,200,100,0.25)] transition-all duration-300 font-medium animate-pulse flex items-center justify-center gap-2"
                    aria-label="Confirmer définitivement l'arrivée du lot"
                  >
                    <CheckCheck size={18} />
                    Confirmer définitivement
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal d'information détaillé qui ne se ferme QUE par le bouton X */}
      {showInfoModal && lotToShow && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Overlay qui ne réagit pas aux clics */}
          <div className="absolute inset-0 bg-black/60" onClick={(e) => e.stopPropagation()} />          
          
          {/* Contenu du modal */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] backdrop-filter backdrop-blur-[10px] rounded-xl shadow-[rgba(0,0,0,0.4)_0px_10px_30px,rgba(0,150,255,0.2)_0px_0px_20px] transform-gpu scale-100 border border-white/10 hover:border-white/20 transition-all duration-300 animate-fadeIn overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Détails des lots en cours</h3>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="text-white/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-full p-1"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Lot spécifique mis en évidence */}
              <div className="mb-8 p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-400/30 shadow-[0_4px_15px_rgba(0,0,0,0.25),0_0_20px_rgba(0,210,200,0.2)_inset]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{lotToShow.nom}</h4>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-400/30 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-sm font-medium text-cyan-400">En transit</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-md px-3 py-2 border border-white/10">
                    <Package className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-base mb-4">
                  <span className="text-white/70">{lotToShow.metadata?.origine || '-'}</span>
                  <ArrowRight size={18} className="text-cyan-400" />
                  <span className="text-cyan-400 font-medium">{lotToShow.metadata?.destination || '-'}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Origine</div>
                    <div className="text-base font-medium">{lotToShow.metadata?.naissain || '-'}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Contenant</div>
                    <div className="text-base font-medium">{lotToShow.metadata?.contenant || '-'}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Numéro de lot</div>
                    <div className="text-base font-medium">{lotToShow.numeroLot}</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500/20 to-green-400/10 rounded-lg p-3 border border-green-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,200,100,0.2)]">
                    <div className="text-xs text-white/70 mb-1">Estimation remplissage</div>
                    <div className="text-base font-medium">
                      {lotToShow.metadata?.estimationRemplissage || '-'} <span className="text-green-400">{lotToShow.metadata?.unite || ''}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Mortalité */}
                  {lotToShow.metadata?.mortalite !== undefined && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <h4 className="text-sm font-medium text-white">Mortalité</h4>
                        </div>
                        <span className="text-base font-medium text-green-400">{lotToShow.metadata.mortalite}%</span>
                      </div>
                      
                      <div className="relative h-4 w-full bg-gray-700/50 rounded-md overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-green-500"
                          style={{ width: `${Math.min(lotToShow.metadata.mortalite, 100)}%` }}
                        ></div>
                        
                        {/* Marqueurs de seuil */}
                        <div className="absolute top-0 bottom-0 left-[10%] w-px bg-white/20"></div>
                        <div className="absolute top-0 bottom-0 left-[15%] w-px bg-white/20"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Date prévue */}
                  {lotToShow.datePrevue && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center">
                      <Calendar className="w-6 h-6 mr-3 text-cyan-400" aria-hidden="true" />
                      <div>
                        <div className="text-xs text-white/60 mb-1">Date prévue</div>
                        <div className="text-base font-medium">
                          {format(new Date(lotToShow.datePrevue), 'd MMM yyyy, HH:mm', { locale: fr })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                

              </div>
              
              {/* Actions pour le lot en cours */}
              <div className="flex justify-end gap-3 mb-6">
                <button
                  onClick={() => {
                    setShowInfoModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white transition-all duration-300"
                >
                  Retour aux lots
                </button>
                
                <button
                  onClick={() => {
                    setShowInfoModal(false);
                    openValidationModal(lotToShow);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] transition-all duration-300 font-medium"
                >
                  Valider l'arrivée
                </button>
              </div>
              
              {/* Liste de tous les autres lots */}
              <h4 className="text-lg font-semibold text-white mb-4">Tous les lots en cours</h4>
              
              <div className="space-y-6">
                {/* Premier lot */}
                <div 
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-white/10 hover:border-cyan-400/20 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.2)] cursor-pointer"
                  onClick={() => {
                    // Simuler un clic sur le lot NORD-101
                    const lot101 = lots.find(l => l.id === 'n1');
                    if (lot101) {
                      setLotToShow(lot101);
                    }
                  }}
                  role="button"
                  aria-label="Voir les détails du lot NORD-101"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-lg font-medium text-white">Lot Huîtres Triploïdes #NORD-101</h5>
                    <div className="px-2 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-400/30 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                      <span className="text-xs font-medium text-cyan-400">En transit</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="text-white/70">Table B-07 Bouzigues</span>
                    <ArrowRight size={14} className="text-cyan-400" />
                    <span className="text-cyan-400 font-medium">Trempe</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-white/60">Origine:</span>
                      <span className="text-white ml-1">Charente Maritime</span>
                    </div>
                    <div>
                      <span className="text-white/60">Contenant:</span>
                      <span className="text-white ml-1">10 cordes</span>
                    </div>
                    <div>
                      <span className="text-white/60">N°:</span>
                      <span className="text-white ml-1">03-0545</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-white/60">Remplissage:</span>
                      <span className="text-green-400 ml-1">15 pochons</span>
                    </div>
                    <div>
                      <span className="text-white/60">Mortalité:</span>
                      <span className="text-green-400 ml-1">16.9%</span>
                    </div>
                    <div>
                      <span className="text-white/60">Date:</span>
                      <span className="text-white ml-1">2 mai 2025, 11:00</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/60 mt-2">Huîtres N°3</div>
                </div>
                
                {/* Deuxième lot */}
                <div 
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-white/10 hover:border-cyan-400/20 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.2)] cursor-pointer"
                  onClick={() => {
                    // Simuler un clic sur le lot NORD-202
                    const lot202 = lots.find(l => l.id === 'n2');
                    if (lot202) {
                      setLotToShow(lot202);
                    }
                  }}
                  role="button"
                  aria-label="Voir les détails du lot NORD-202"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-lg font-medium text-white">Lot Huîtres Triploïdes #NORD-202</h5>
                    <div className="px-2 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-400/30 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                      <span className="text-xs font-medium text-cyan-400">En transit</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="text-white/70">Table Nord #128</span>
                    <ArrowRight size={14} className="text-cyan-400" />
                    <span className="text-cyan-400 font-medium">Trempe</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-white/60">Origine:</span>
                      <span className="text-white ml-1">Arcachon</span>
                    </div>
                    <div>
                      <span className="text-white/60">Contenant:</span>
                      <span className="text-white ml-1">8 cordes</span>
                    </div>
                    <div>
                      <span className="text-white/60">N°:</span>
                      <span className="text-white ml-1">03-0782</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-white/60">Remplissage:</span>
                      <span className="text-green-400 ml-1">12 pochons</span>
                    </div>
                    <div>
                      <span className="text-white/60">Mortalité:</span>
                      <span className="text-green-400 ml-1">15.7%</span>
                    </div>
                    <div>
                      <span className="text-white/60">Date:</span>
                      <span className="text-white ml-1">2 mai 2025, 13:00</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/60 mt-2">Huîtres N°3</div>
                </div>
                
                {/* Troisième lot */}
                <div 
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-white/10 hover:border-cyan-400/20 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.2)] cursor-pointer"
                  onClick={() => {
                    // Simuler un clic sur le lot TREMPE-301
                    const lot301 = lots.find(l => l.id === 't1');
                    if (lot301) {
                      setLotToShow(lot301);
                    }
                  }}
                  role="button"
                  aria-label="Voir les détails du lot TREMPE-301"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-lg font-medium text-white">Lot Huîtres Triploïdes #TREMPE-301</h5>
                    <div className="px-2 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-400/30 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                      <span className="text-xs font-medium text-cyan-400">En transit</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="text-white/70">Trempe</span>
                    <ArrowRight size={14} className="text-cyan-400" />
                    <span className="text-cyan-400 font-medium">Bassins</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-white/60">Origine:</span>
                      <span className="text-white ml-1">Arcachon</span>
                    </div>
                    <div>
                      <span className="text-white/60">Contenant:</span>
                      <span className="text-white ml-1">15 Pochons</span>
                    </div>
                    <div>
                      <span className="text-white/60">N°:</span>
                      <span className="text-white ml-1">03-0614</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-white/60">Remplissage:</span>
                      <span className="text-green-400 ml-1">130 kg</span>
                    </div>
                    <div>
                      <span className="text-white/60">Mortalité:</span>
                      <span className="text-green-400 ml-1">24%</span>
                    </div>
                    <div>
                      <span className="text-white/60">Date:</span>
                      <span className="text-white ml-1">2 mai 2025, 15:00</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/60 mt-2">Huîtres N°3</div>
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white transition-all duration-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}    
    </>
  );
};

export default LotsEnCoursModal;
