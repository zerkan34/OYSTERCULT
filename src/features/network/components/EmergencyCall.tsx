import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Phone, MapPin, Clock, AlertTriangle, X, Anchor, Ship, LifeBuoy } from 'lucide-react';

interface EmergencyCallProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyCall({ isOpen, onClose }: EmergencyCallProps) {
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(8);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(true);
  const [showBreakdownButton, setShowBreakdownButton] = useState<boolean>(false);
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
      // Action à effectuer lorsque le compte à rebours atteint 0
      setShowEmergencyMessage(true);
      setIsCountdownActive(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, countdown, isCountdownActive]);

  // Réinitialiser le compte à rebours quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCountdown(8);
      setIsCountdownActive(true);
      setShowBreakdownButton(false);
      setShowEmergencyMessage(false);
    }
  }, [isOpen]);

  const handleStopCountdown = useCallback(() => {
    setIsCountdownActive(false);
    setShowBreakdownButton(true);
  }, []);

  const handleReportBreakdown = useCallback(() => {
    // Logique pour signaler une panne
    setShowEmergencyMessage(true);
    setEmergencyType('boatIssue');
  }, []);

  const handleSendEmergency = useCallback(() => {
    setShowEmergencyMessage(true);
  }, []);

  const handleCloseEmergencyMessage = useCallback(() => {
    setShowEmergencyMessage(false);
    onClose();
  }, [onClose]);

  // Si le message d'urgence est affiché, afficher un écran plein page
  if (showEmergencyMessage) {
    return (
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

        <button
          onClick={handleCloseEmergencyMessage}
          className="px-8 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-white/90 transition-colors"
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appel d'Urgence"
      size="xl"
      showCloseButton={false}
      className="!bg-gradient-to-br !from-red-900/95 !to-brand-dark/95"
    >
      <div className="space-y-6">
        {/* Compte à rebours */}
        {isCountdownActive && (
          <div className="text-center mb-6">
            <p className="text-white text-lg mb-2">Appel automatique dans :</p>
            <div className="flex justify-center items-center mb-4">
              <div className="flex items-center justify-center bg-red-500 text-white w-16 h-16 rounded-full text-3xl font-bold">
                {countdown}
              </div>
            </div>
            <button 
              onClick={handleStopCountdown}
              className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              Arrêter le compte à rebours
            </button>
          </div>
        )}

        {/* Bouton "Je suis en panne" - apparaît après l'arrêt du compte à rebours */}
        {showBreakdownButton && (
          <div className="mb-6 p-4 border border-red-500/30 rounded-lg bg-red-500/10">
            <div className="flex items-start">
              <LifeBuoy className="text-red-500 mr-3 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-medium text-red-400 mb-2">En panne en mer ?</h3>
                <p className="text-white/70 mb-4">
                  Vous êtes en panne en mer avec votre bateau ? Cliquez ici pour envoyer un appel d'aide immédiat. 
                  Une notification sera envoyée aux producteurs à proximité, et quelqu'un viendra rapidement vous prêter main forte.
                </p>
                <button 
                  onClick={handleReportBreakdown}
                  className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                >
                  Je suis en panne
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-red-400 mb-2">Numéros d'urgence</h3>
          <div className="grid grid-cols-2 gap-4">
            {emergencyContacts.map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-medium text-white">{contact.name}</div>
                  <div className="text-red-400 text-lg font-bold">{contact.number}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Type d'urgence
            </label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="">Sélectionner le type d'urgence</option>
              {emergencyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Description de l'urgence
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="Décrivez la situation d'urgence..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Localisation
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Précisez l'emplacement..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSendEmergency}
            className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
          >
            Signaler l'urgence
          </button>
        </div>
      </div>
    </Modal>
  );
}