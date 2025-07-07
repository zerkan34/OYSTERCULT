import React, { useState, useEffect, useCallback } from 'react';
import { Phone, MapPin, Clock, AlertTriangle, X, Anchor, Ship, LifeBuoy, Wrench, Bell, AlertOctagon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface EmergencyCallProps {
  isOpen: boolean;
  onClose: () => void;
}

// Composant pour la notification de confirmation
function ConfirmationModal({ isOpen, onClose, onFalseAlert }: { isOpen: boolean; onClose: () => void; onFalseAlert: () => void }) {
  const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Signal envoyé"
      size="lg"
      className="!bg-gradient-to-br !from-cyan-900/95 !to-brand-dark/95"
    >
      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Appel d'urgence activé</h3>
            <p className="text-white/70">
              Des notifications ont été envoyées aux producteurs à proximité et aux services de secours.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="font-medium text-white">Localisation</div>
                <div className="text-white/70">Position GPS transmise automatiquement</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="font-medium text-white">Heure de l'appel</div>
                <div className="text-white/70">{currentTime}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={onFalseAlert}
            className="w-full px-8 py-5 bg-green-600 rounded-full text-white text-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500/40 focus:outline-none transition-all duration-300 font-medium shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)] transform hover:-translate-y-1"
          >
            Fausse alerte - Tout va bien
          </button>
          <button
            onClick={onClose}
            className="w-full px-8 py-5 bg-white/5 rounded-full text-white/70 text-xl hover:bg-white/10 focus:ring-2 focus:ring-cyan-500/40 focus:outline-none transition-all duration-300 font-medium shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)] transform hover:-translate-y-1"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Composant pour la modale de panne
function BreakdownModal({ isOpen, onClose, onSignalSent, onFalseAlert }: { isOpen: boolean; onClose: () => void; onSignalSent: () => void; onFalseAlert: () => void }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Signalement de panne"
      size="lg"
      className="!bg-gradient-to-br !from-cyan-900/95 !to-brand-dark/95"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyan-500/20 rounded-full">
            <Wrench className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Besoin d'assistance technique ?</h3>
            <p className="text-white/70">
              Nous allons notifier les producteurs à proximité de votre position. 
              Un professionnel viendra vous aider dès que possible.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-white/70 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                onSignalSent();
                onClose();
              }}
              className="px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-full hover:bg-cyan-500/30 transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transform hover:-translate-y-1"
            >
              Envoyer le signal
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Composant pour la confirmation de fausse alerte
function FalseAlertConfirmModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmation"
      size="sm"
      className="!bg-gradient-to-br !from-cyan-900/95 !to-brand-dark/95 !z-[100]"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertOctagon className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Confirmer l'annulation</h3>
            <p className="text-white/70">
              Êtes-vous certain(e) que tout va bien et qu'il s'agit d'une fausse alerte ?
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            Retour
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(255,0,0,0.2)]"
          >
            Confirmer
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function EmergencyCall({ isOpen, onClose }: EmergencyCallProps) {
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(5);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(true);
  const [showDangerButton, setShowDangerButton] = useState<boolean>(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [showFalseAlertModal, setShowFalseAlertModal] = useState<boolean>(false);
  const [showEmergencyMessage, setShowEmergencyMessage] = useState<boolean>(false);
  
  const emergencyTypes = [
    { id: 'accident', label: 'Accident de travail' },
    { id: 'equipment', label: 'Panne critique' },
    { id: 'environmental', label: 'Incident environnemental' },
    { id: 'security', label: 'Problème de sécurité' },
    { id: 'boatIssue', label: 'Panne en mer' }
  ];

  const emergencyContacts = [
    { name: 'SAMU', number: '15', type: 'medical' },
    { name: 'Pompiers', number: '18', type: 'fire' },
    { name: 'Police', number: '17', type: 'security' },
    { name: 'Numéro d\'urgence européen', number: '112', type: 'all' },
    { name: 'CROSS', number: '196', type: 'sea' }
  ];

  // Gestion du compte à rebours
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen && isCountdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowEmergencyMessage(true);
      setIsCountdownActive(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, countdown, isCountdownActive]);

  // Réinitialiser le compte à rebours quand la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      setIsCountdownActive(true);
      setShowDangerButton(false);
      setShowEmergencyMessage(false);
    }
  }, [isOpen]);

  const handleStopCountdown = useCallback(() => {
    setIsCountdownActive(false);
    setShowDangerButton(true);
  }, []);

  const handleBreakdown = useCallback(() => {
    setShowBreakdownModal(true);
  }, []);

  const handleSendEmergency = useCallback(() => {
    setShowEmergencyMessage(true);
  }, []);

  const handleCloseEmergencyMessage = useCallback(() => {
    setShowEmergencyMessage(false);
    onClose();
  }, [onClose]);

  const handleFalseAlert = useCallback(() => {
    setShowFalseAlertModal(true);
  }, []);

  const handleFalseAlertConfirm = useCallback(() => {
    setShowFalseAlertModal(false);
    setShowConfirmationModal(false);
    setShowBreakdownModal(false);
    setShowEmergencyMessage(false);
    onClose();
  }, [onClose]);

  // Si le message d'urgence est affiché, afficher un écran plein page
  if (showEmergencyMessage) {
    return (
      <>
        <div className="fixed inset-0 bg-red-900 z-50 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white mb-4">
              {emergencyType === 'boatIssue' ? (
                <Ship className="text-red-600 h-12 w-12" />
              ) : (
                <AlertTriangle className="text-red-600 h-12 w-12" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {emergencyType === 'boatIssue' 
                ? 'Appel d\'aide en mer envoyé' 
                : 'Appel d\'urgence activé'}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {emergencyType === 'boatIssue' 
                ? 'Une notification a été envoyée aux producteurs à proximité et aux services de secours. Quelqu\'un viendra vous prêter main forte rapidement.' 
                : 'Des notifications ont été envoyées aux producteurs à proximité et aux services de secours.'}
            </p>
          </div>

          <div className="p-6 bg-white/10 rounded-lg max-w-2xl w-full mb-8">
            <div className="flex items-center mb-4">
              <MapPin className="text-white mr-3" size={24} />
              <div>
                <h3 className="text-lg font-medium text-white">Localisation</h3>
                <p className="text-white/70">
                  {location || 'Position GPS transmise automatiquement'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="text-white mr-3" size={24} />
              <div>
                <h3 className="text-lg font-medium text-white">Heure de l'appel</h3>
                <p className="text-white/70">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <button
              onClick={handleFalseAlert}
              className="w-full px-8 py-5 bg-green-600 rounded-full text-white text-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500/40 focus:outline-none transition-all duration-300 font-medium shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)] transform hover:-translate-y-1"
            >
              Fausse alerte - Tout va bien
            </button>
            <div className="h-2"></div>
            <button
              onClick={handleCloseEmergencyMessage}
              className="w-full px-8 py-5 bg-white/5 rounded-full text-white/70 text-xl hover:bg-white/10 focus:ring-2 focus:ring-cyan-500/40 focus:outline-none transition-all duration-300 font-medium shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)] transform hover:-translate-y-1"
            >
              Fermer
            </button>
          </div>
        </div>
        
        {/* Modale de confirmation de fausse alerte (z-index plus élevé pour apparaître au-dessus) */}
        <FalseAlertConfirmModal
          isOpen={showFalseAlertModal}
          onClose={() => setShowFalseAlertModal(false)}
          onConfirm={handleFalseAlertConfirm}
        />
      </>
    );
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-label="Appel d'urgence"
        >
          <div 
            className="bg-red-600 !rounded-full !p-0 w-[800px] aspect-square flex items-center justify-center mb-8"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Compte à rebours */}
            <div className="w-[600px] h-[600px] rounded-full flex items-center justify-center">
              <span className="text-[300px] font-bold text-white" aria-label={`Compte à rebours : ${countdown} secondes`}>
                {countdown}
              </span>
            </div>
          </div>
          
          {/* Boutons en dessous */}
          <div className="flex flex-col gap-6 w-full max-w-lg">
            {isCountdownActive ? (
              <button 
                onClick={handleStopCountdown}
                className="w-full px-8 py-5 bg-cyan-500/60 text-cyan-100 rounded-full text-xl hover:bg-cyan-500/70 focus:ring-2 focus:ring-cyan-500/80 focus:outline-none transition-all duration-300 font-medium shadow-[0_4px_10px_rgba(0,0,0,0.3),0_0_15px_rgba(0,210,200,0.4),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.4),0_0_20px_rgba(0,210,200,0.45),0_0_5px_rgba(0,0,0,0.2)_inset] transform hover:-translate-y-1"
              >
                Arrêter le compte à rebours
              </button>
            ) : (
              <button 
                onClick={() => setShowEmergencyMessage(true)}
                className="w-full px-8 py-5 bg-red-500 text-white rounded-full text-xl hover:bg-red-600 focus:ring-2 focus:ring-red-500/40 focus:outline-none transition-all duration-300 font-medium shadow-[0_4px_10px_rgba(255,0,0,0.25),0_0_15px_rgba(255,0,0,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(255,0,0,0.3),0_0_20px_rgba(255,0,0,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transform hover:-translate-y-1"
              >
                Je suis en danger
              </button>
            )}

            {showDangerButton && (
              <button 
                onClick={handleBreakdown}
                className="w-full px-8 py-5 bg-cyan-500/20 text-cyan-400 rounded-full text-xl hover:bg-cyan-500/30 focus:ring-2 focus:ring-cyan-500/40 focus:outline-none transition-all duration-300 font-medium shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transform hover:-translate-y-1"
              >
                Je suis en panne
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full mt-4 px-8 py-5 bg-white/40 rounded-full text-white text-xl hover:bg-white/50 focus:ring-2 focus:ring-cyan-500/80 focus:outline-none transition-all duration-300 font-medium shadow-[0_4px_10px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.5)] transform hover:-translate-y-1"
              aria-label="Fermer la modale d'urgence"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Modale de panne */}
      <BreakdownModal 
        isOpen={showBreakdownModal} 
        onClose={() => setShowBreakdownModal(false)}
        onSignalSent={() => setShowConfirmationModal(true)}
        onFalseAlert={handleFalseAlert}
      />

      {/* Modale de confirmation */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onFalseAlert={handleFalseAlert}
      />

      {/* Modale de confirmation de fausse alerte */}
      <FalseAlertConfirmModal
        isOpen={showFalseAlertModal}
        onClose={() => setShowFalseAlertModal(false)}
        onConfirm={handleFalseAlertConfirm}
      />
    </>
  );
}