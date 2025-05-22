import React, { useState } from 'react';
import { X, Package, Calendar, MapPin, ArrowRight, Info, Percent as PercentIcon, History, CheckCircle2, CheckCheck } from 'lucide-react';

// Types
export type LotStatus = 'EN_CONFORMITE' | 'PLANIFIE' | 'EN_TRANSIT' | 'RECEPTIONNE' | 'PROBLEME' | 'TERMINE';

export interface Lot {
  id: string;
  nom: string;
  statut: LotStatus;
  origine?: string;
  destination?: string;
  quantite: number;
  unite: string;
  important: boolean;
  dateCreation: string;
  dateExpedition?: string;
  dateArrivee?: string;
  description?: string;
  estimationRemplissage?: number;
  datePrevue?: string;
  numeroLot?: string;
  mortalite?: number;
}

// Composant LotItem pour afficher chaque lot
const LotItem = ({ lot, onOpenDetails }: { lot: Lot, onOpenDetails: (lot: Lot) => void }) => {
  return (
    <div 
      className="p-5 mb-5 relative cursor-pointer hover:bg-white/3 rounded-lg transform hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-cyan-400/20 hover:border-cyan-400/30" 
      onClick={() => onOpenDetails(lot)}
    >
      <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)] z-50" title="Non lu"></div>
      <div className="flex-1 space-y-4">
        <div className="flex flex-col">
          <div>
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-4 rounded-lg border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_10px_rgba(34,211,238,0.1)_inset] mb-4 relative overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-50 blur-xl"></div>
              <div className="flex items-center justify-between relative z-10 gap-4">
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-3 text-cyan-400 flex-shrink-0" />
                  <span className="font-bold text-base text-white">{lot.nom}</span>
                </div>
                <div className="flex items-center text-xs text-white/60">
                  <Calendar className="w-4 h-4 mr-1 text-cyan-400 flex-shrink-0" />
                  <span>{lot.dateExpedition}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4 mt-4 text-white/60">
            <div className="grid grid-cols-2 gap-4 text-sm w-full">
              <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300">
                <MapPin className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate" title={`Origine: ${lot.origine}`}>{lot.origine}</span>
              </div>
              <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300">
                <ArrowRight className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate" title={`Destination: ${lot.destination}`}>{lot.destination}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/60 mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center">
                <Info className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0" />
                <span>{lot.quantite} {lot.unite}</span>
              </div>
              {lot.estimationRemplissage && (
                <div className="flex items-center">
                  <PercentIcon className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0" />
                  <span>{lot.estimationRemplissage}%</span>
                </div>
              )}
              {lot.mortalite !== undefined && (
                <div className="flex items-center text-red-400">
                  <History className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{lot.mortalite}% mortalité</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal
export const LotsEnCoursPanel = () => {
  // États pour gérer les modals et confirmations
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [estimationRemplissage, setEstimationRemplissage] = useState<number | undefined>();
  const [confirmationStep, setConfirmationStep] = useState<number>(1); // 1 = initial, 2 = confirmation finale
  const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  const [showFlash, setShowFlash] = useState<boolean>(false);

  // Fonctions de gestion des modals
  const openDetailsModal = (lot: Lot) => {
    setSelectedLot(lot);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const openConfirmationModal = (lot: Lot) => {
    setSelectedLot(lot);
    setEstimationRemplissage(lot.estimationRemplissage);
    setConfirmationStep(1);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setConfirmationStep(1);
  };

  // Fonction pour passer à l'étape de confirmation avec effet visuel
  const showTransitConfirmation = () => {
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
    setConfirmationStep(1);
  };
  
  // Fonction pour valider la fin de transit après confirmation
  const handleValidateTransit = () => {
    if (!selectedLot) return;
    
    // Afficher un effet visuel pendant le traitement
    setShowFlash(true);
    
    // Simuler la mise à jour du lot
    const updatedLot = {
      ...selectedLot,
      statut: 'TERMINE' as LotStatus,
      estimationRemplissage: estimationRemplissage
    };

    // Simuler la mise à jour de l'inventaire et de l'historique
    console.log('Lot arrivé à destination:', updatedLot);
    console.log('Inventaire mis à jour avec l\'estimation:', estimationRemplissage);
    console.log('Historique de traçabilité mis à jour');
    
    // Préparer le message de succès avec des informations détaillées
    const title = "Validation réussie";
    const message = `Le lot ${selectedLot.nom} est maintenant enregistré comme arrivé à ${selectedLot.destination || 'destination'} avec une estimation finale de ${estimationRemplissage} ${selectedLot.unite || 'unités'}. L'inventaire et l'historique de traçabilité ont été mis à jour.`;
    
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
    
    // Réinitialiser et fermer le modal
    setConfirmationStep(1);
    closeConfirmationModal();
  };

  // Fonction pour passer à l'étape de confirmation avec effet visuel
  const showTransitConfirmation = () => {
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
    setConfirmationStep(1);
  };
  
  // Fonction pour valider la fin de transit après confirmation
  const handleValidateTransit = () => {
    if (!selectedLot) return;
    
    // Afficher un effet visuel pendant le traitement
    setShowFlash(true);
    
    // Simuler la mise à jour du lot
    const updatedLot = {
      ...selectedLot,
      statut: 'TERMINE' as LotStatus,
      estimationRemplissage: estimationRemplissage
    };

    // Simuler la mise à jour de l'inventaire et de l'historique
    console.log('Lot arrivé à destination:', updatedLot);
    console.log('Inventaire mis à jour avec l\'estimation:', estimationRemplissage);
    console.log('Historique de traçabilité mis à jour');
    
    // Préparer le message de succès avec des informations détaillées
    const title = "Validation réussie";
    const message = `Le lot ${selectedLot.nom} est maintenant enregistré comme arrivé à ${selectedLot.destination || 'destination'} avec une estimation finale de ${estimationRemplissage} ${selectedLot.unite || 'unités'}. L'inventaire et l'historique de traçabilité ont été mis à jour.`;
    
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
    
    // Réinitialiser et fermer le modal
    setConfirmationStep(1);
    closeConfirmationModal();
  };

  // Données de démonstration
  const demoLots: Lot[] = [
    {
      id: "1",
      nom: "Lot Huîtres Triploïdes #1",
      numeroLot: "HT-2023-001",
      statut: "EN_TRANSIT",
      origine: "Port des Barques",
      destination: "La Tremblade",
      quantite: 500,
      estimationRemplissage: 450,
      unite: "kg",
      mortalite: 16.9,
      datePrevue: "2023-03-15",
      important: true,
      dateCreation: "2023-03-10",
      dateExpedition: "2023-03-12",
      dateArrivee: "2023-03-15",
      description: "Lot d'huîtres triploïdes de calibre 3, provenant des parcs de Port des Barques."
    },
    {
      id: "2",
      nom: "Lot Huîtres Triploïdes #2",
      numeroLot: "HT-2023-002",
      statut: "EN_TRANSIT",
      origine: "Bourcefranc",
      destination: "La Tremblade",
      quantite: 350,
      estimationRemplissage: 325,
      unite: "kg",
      mortalite: 15.7,
      datePrevue: "2023-03-16",
      important: false,
      dateCreation: "2023-03-11",
      dateExpedition: "2023-03-13",
      dateArrivee: "2023-03-16",
      description: "Lot d'huîtres triploïdes de calibre 2, provenant des parcs de Bourcefranc."
    },
    {
      id: "3",
      nom: "Lot Huîtres Triploïdes #3",
      numeroLot: "HT-2023-003",
      statut: "EN_TRANSIT",
      origine: "La Rochelle",
      destination: "La Tremblade",
      quantite: 420,
      estimationRemplissage: 400,
      unite: "kg",
      mortalite: 24.0,
      datePrevue: "2023-03-17",
      important: true,
      dateCreation: "2023-03-12",
      dateExpedition: "2023-03-14",
      dateArrivee: "2023-03-17",
      description: "Lot d'huîtres triploïdes de calibre 1, provenant des parcs de La Rochelle. Attention particulière requise en raison du taux de mortalité élevé."
    }
  ];

  return (
    <div 
      className="lots-en-cours-panel fixed top-16 bottom-0 right-0 z-50 md:rounded-l-xl flex flex-col focus:outline-none bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-[10px] border border-white/10 shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset] focus:outline-none focus:ring-2 focus:ring-cyan-500/40" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="lots-en-cours-title" 
      tabIndex={-1} 
      style={{ 
        width: '380px', 
        height: 'calc(-64px + 100vh)',
        right: '16px',
        top: '64px'
      }}
    >
      <div className="h-full flex flex-col">
        {/* En-tête */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-br from-[rgba(15,23,42,0.5)] to-[rgba(20,80,100,0.5)]">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg -z-10"></div>
          <div className="flex justify-center items-center my-2 relative">
            <div className="absolute left-0">
              <div className="relative">
                <div className="relative">
                  <Package className="text-cyan-400" />
                  <span className="absolute -bottom-2 -left-1 text-[10px] font-medium text-cyan-400">N°3</span>
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-[0_0_4px_rgba(0,180,180,0.3)]">3</span>
              </div>
            </div>
            <h2 id="lots-en-cours-title" className="text-3xl font-bold text-white whitespace-nowrap">Lots en cours</h2>
            <div className="absolute right-0 flex items-center">
              <button 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white/60 hover:text-cyan-400 ml-2" 
                aria-label="Fermer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 py-4 bg-gradient-to-br from-[rgba(15,23,42,0.4)] to-[rgba(20,90,90,0.4)] border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <History className="text-cyan-400" />
            <h3 className="text-lg font-medium text-white">Mouvement des lots</h3>
          </div>
          <div className="text-sm text-white/70">
            Suivez le parcours de vos lots en cours. Chaque mouvement validé sera automatiquement enregistré dans les modules Stocks et Traçabilité, permettant une mise à jour complète de votre inventaire et de l'historique de production.
          </div>
        </div>

        {/* Liste des lots */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6" style={{ overflowX: 'hidden', position: 'relative' }}>
          <div className="mt-5 flex flex-col gap-2">
            {demoLots.map((lot) => (
              <div 
                key={lot.id}
                className="p-5 mb-5 relative cursor-pointer hover:bg-white/3 rounded-lg transform hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-cyan-400/20 hover:border-cyan-400/30" 
                onClick={() => openDetailsModal(lot)}
              >
                <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)] z-50" title="Non lu"></div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col">
                    <div>
                      <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-4 rounded-lg border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_10px_rgba(34,211,238,0.1)_inset] mb-4 relative overflow-hidden">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-50 blur-xl"></div>
                        <div className="flex items-center justify-between relative z-10 gap-4">
                          <div className="flex items-center">
                            <Package className="w-5 h-5 mr-3 text-cyan-400 flex-shrink-0" />
                            <span className="font-bold text-base text-white">{lot.nom}</span>
                          </div>
                          <div className="flex items-center text-xs text-white/60">
                            <Calendar className="w-4 h-4 mr-1 text-cyan-400 flex-shrink-0" />
                            <span>{lot.dateExpedition}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4 mt-4 text-white/60">
                      <div className="grid grid-cols-2 gap-4 text-sm w-full">
                        <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300">
                          <MapPin className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" />
                          <span className="truncate" title={`Origine: ${lot.origine}`}>{lot.origine}</span>
                        </div>
                        <div className="flex items-center bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/20 transition-colors duration-300">
                          <ArrowRight className="w-4 h-4 mr-3 text-cyan-400 flex-shrink-0" />
                          <span className="truncate" title={`Destination: ${lot.destination}`}>{lot.destination}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/60 mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center">
                          <Info className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0" />
                          <span>{lot.quantite} {lot.unite}</span>
                        </div>
                        {lot.estimationRemplissage && (
                          <div className="flex items-center">
                            <PercentIcon className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0" />
                            <span>{lot.estimationRemplissage}%</span>
                          </div>
                        )}
                        {lot.mortalite !== undefined && (
                          <div className="flex items-center text-red-400">
                            <History className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{lot.mortalite}% mortalité</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Modal de détails du lot - ne se ferme JAMAIS lorsqu'on clique à l'intérieur */}
          {showDetailsModal && selectedLot && (
            <div 
              className="fixed inset-0 z-[9998] bg-black/60" 
              onClick={(e) => {
                // UNIQUEMENT fermer si on clique directement sur cet overlay
                if (e.target === e.currentTarget) {
                  closeDetailsModal();
                }
              }}
            >
              {/* Conteneur intermédiaire qui empêche les clics de remonter */}
              <div 
                className="fixed inset-0 flex items-center justify-center z-[9999]"
                onClick={(e) => {
                  // Bloquer TOUS les événements pour éviter la fermeture
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                {/* Contenu réel du modal avec blocage des clics */}
                <div 
                  onClick={(e) => {
                    // Triple protection pour bloquer les clics
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className="relative bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] backdrop-filter backdrop-blur-[10px] p-6 rounded-xl shadow-[rgba(0,0,0,0.4)_0px_10px_50px,rgba(0,150,255,0.2)_0px_0px_20px] max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-cyan-500/20 z-[10000] transform-gpu scale-100 animate-fadeIn"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-cyan-500/20">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Package className="text-cyan-400" />
                      {selectedLot.nom}
                    </h2>
                    <button 
                      onClick={closeDetailsModal}
                      className="p-2 rounded-full hover:bg-white/10 transition-all"
                      aria-label="Fermer"
                    >
                      <X className="text-white/70 hover:text-white" />
                    </button>
                  </div>
                  
                  {/* Contenu */}
                  <div className="py-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-white/70">Statut: <span className="text-white font-semibold">{selectedLot.statut}</span></p>
                        <p className="text-white/70">Origine: <span className="text-white font-semibold">{selectedLot.origine || 'Non spécifié'}</span></p>
                        <p className="text-white/70">Destination: <span className="text-white font-semibold">{selectedLot.destination || 'Non spécifié'}</span></p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-white/70">Quantité: <span className="text-white font-semibold">{selectedLot.quantite} {selectedLot.unite}</span></p>
                        <p className="text-white/70">Date d'expédition: <span className="text-white font-semibold">{selectedLot.dateExpedition || 'Non spécifié'}</span></p>
                        <p className="text-white/70">Date d'arrivée prévue: <span className="text-white font-semibold">{selectedLot.dateArrivee || 'Non spécifié'}</span></p>
                      </div>
                    </div>
                    
                    {/* Informations supplémentaires */}
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-cyan-400">Informations complémentaires</h3>
                      <p className="text-white/80">{selectedLot.description || 'Aucune information complémentaire disponible pour ce lot.'}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-cyan-500/20">
                    <button 
                      onClick={closeDetailsModal}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                    >
                      Fermer
                    </button>
                    {selectedLot.statut === 'EN_TRANSIT' && (
                      <button 
                        onClick={() => {
                          closeDetailsModal(); // Fermer le modal de détails
                          openConfirmationModal(selectedLot); // Ouvrir le modal de validation
                        }}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/50 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 flex items-center gap-2 min-w-[44px] min-h-[44px]"
                        aria-label="Valider l'arrivée du lot"
                      >
                        <CheckCircle2 size={18} />
                        Valider l'arrivée
                      </button>
                    )}
                  </div>
                </div>
            </div>
          )}
          
          {/* Modal de confirmation */}
          {showConfirmationModal && selectedLot && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60" onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeConfirmationModal();
                }
              }}></div>
              
              {/* Effet de flash */}
              {showFlash && (
                <div className="absolute inset-0 bg-cyan-400/10 z-[10001] animate-pulse"></div>
              )}
              
              {/* Contenu du modal */}
              <div 
                className="relative bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] p-6 rounded-lg shadow-[rgba(0,0,0,0.4)_0px_10px_50px,rgba(0,150,255,0.2)_0px_0px_20px] max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-cyan-500/20 z-[10000] transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-cyan-500/20">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {confirmationStep === 1 ? (
                      <>
                        <CheckCircle2 className="text-cyan-400" />
                        Validation d'arrivée
                      </>
                    ) : (
                      <>
                        <CheckCheck className="text-green-400" />
                        Confirmer la validation
                      </>
                    )}
                  </h2>
                  <button 
                    onClick={closeConfirmationModal}
                    className="p-2 rounded-full hover:bg-white/10 transition-all"
                    aria-label="Fermer"
                  >
                    <X className="text-white/70 hover:text-white" />
                  </button>
                </div>
                
                {/* Contenu */}
                <div className="py-4 space-y-4">
                  {confirmationStep === 1 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-cyan-400">Détails du lot</h3>
                          <p className="text-white/70">Nom: <span className="text-white font-semibold">{selectedLot.nom}</span></p>
                          <p className="text-white/70">Origine: <span className="text-white font-semibold">{selectedLot.origine || 'Non spécifié'}</span></p>
                          <p className="text-white/70">Destination: <span className="text-white font-semibold">{selectedLot.destination || 'Non spécifié'}</span></p>
                          <p className="text-white/70">Date d'expédition: <span className="text-white font-semibold">{selectedLot.dateExpedition || 'Non spécifié'}</span></p>
                          <p className="text-white/70">Date d'arrivée prévue: <span className="text-white font-semibold">{selectedLot.dateArrivee || 'Non spécifié'}</span></p>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-cyan-400">Estimation finale</h3>
                          <p className="text-white/70 mb-2">Quantité initiale: <span className="text-white font-semibold">{selectedLot.quantite} {selectedLot.unite}</span></p>
                          
                          <div className="space-y-2">
                            <label htmlFor="estimationRemplissage" className="text-white/70 block">Estimation finale à l'arrivée:</label>
                            <input 
                              type="number" 
                              id="estimationRemplissage"
                              value={estimationRemplissage} 
                              onChange={(e) => setEstimationRemplissage(Number(e.target.value))}
                              className="w-full bg-white/10 border border-cyan-500/30 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                              min={0}
                              max={selectedLot.quantite * 1.2} // Permet une estimation légèrement supérieure à la quantité initiale
                            />
                            <p className="text-white/50 text-sm">Unité: {selectedLot.unite}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 bg-white/5 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-cyan-400">Information</h3>
                        <p className="text-white/80">La validation de l'arrivée de ce lot entraînera la mise à jour de l'inventaire et de l'historique de traçabilité avec l'estimation finale fournie.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCheck size={24} className="text-green-400 mt-1" />
                          <div>
                            <h3 className="text-lg font-semibold text-green-400 mb-2">Confirmer la validation de l'arrivée</h3>
                            <p className="text-white/80">Vous êtes sur le point de confirmer l'arrivée du lot <span className="font-semibold">{selectedLot.nom}</span> à destination avec une estimation finale de <span className="font-semibold">{estimationRemplissage} {selectedLot.unite}</span>.</p>
                            <p className="text-white/80 mt-2">Cette action mettra à jour :</p>
                            <ul className="list-disc list-inside mt-1 ml-2 text-white/80">
                              <li>Le statut du lot (En transit → Terminé)</li>
                              <li>L'inventaire avec la quantité finale</li>
                              <li>L'historique de traçabilité</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-cyan-500/20">
                  {confirmationStep === 1 ? (
                    <>
                      <button 
                        onClick={closeConfirmationModal}
                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                      >
                        Annuler
                      </button>
                      <button 
                        onClick={showTransitConfirmation}
                        className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center gap-2"
                      >
                        <ArrowRight size={18} />
                        Continuer
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={cancelConfirmation}
                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                      >
                        Retour
                      </button>
                      <button 
                        onClick={handleValidateTransit}
                        className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center gap-2"
                      >
                        <CheckCheck size={18} />
                        Confirmer
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Notification de succès */}
          {showSuccessNotification && (
            <div className="fixed top-5 right-5 z-[10000] max-w-md w-full bg-gradient-to-r from-green-500/90 to-cyan-500/90 p-4 rounded-lg shadow-lg border border-white/10 animate-slideIn">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <CheckCheck size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{successMessage.title}</h3>
                  <p className="text-white/90 text-sm mt-1">{successMessage.message}</p>
                </div>
                <button 
                  onClick={() => setShowSuccessNotification(false)}
                  className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
                  aria-label="Fermer la notification"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export the component
export default LotsEnCoursPanel;
