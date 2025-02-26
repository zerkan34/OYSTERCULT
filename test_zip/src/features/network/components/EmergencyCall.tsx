import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Phone, MapPin, Clock } from 'lucide-react';

interface EmergencyCallProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyCall({ isOpen, onClose }: EmergencyCallProps) {
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const emergencyTypes = [
    { id: 'accident', label: 'Accident de travail' },
    { id: 'equipment', label: 'Panne critique' },
    { id: 'environmental', label: 'Incident environnemental' },
    { id: 'security', label: 'Problème de sécurité' }
  ];

  const emergencyContacts = [
    { name: 'SAMU', number: '15', type: 'medical' },
    { name: 'Pompiers', number: '18', type: 'fire' },
    { name: 'Police', number: '17', type: 'security' },
    { name: 'Numéro d\'urgence européen', number: '112', type: 'all' }
  ];

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
            className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
          >
            Signaler l'urgence
          </button>
        </div>
      </div>
    </Modal>
  );
}