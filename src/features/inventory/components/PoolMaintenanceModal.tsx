import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Clock, AlertTriangle, CheckCircle2, Calendar, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PoolMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: 'cleaning' | 'uv_lamp', notes?: string) => void;
  maintenanceType: 'cleaning' | 'uv_lamp';
  lastMaintenance: string;
  uvLampHours?: number;
}

export function PoolMaintenanceModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  maintenanceType,
  lastMaintenance,
  uvLampHours
}: PoolMaintenanceModalProps) {
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    onConfirm(maintenanceType, notes);
    setShowConfirm(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={maintenanceType === 'cleaning' ? 'Nettoyage du bassin' : 'Changement de la lampe UV'}
      size="md"
    >
      <div className="space-y-6">
        <div className="flex items-start space-x-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <AlertTriangle size={24} className="text-yellow-400 flex-shrink-0" />
          <p className="text-yellow-400">
            {maintenanceType === 'cleaning'
              ? 'Le bassin devra être vidé pour le nettoyage. Assurez-vous qu\'aucun lot n\'est en cours de purification.'
              : 'La lampe UV doit être changée après 8000 heures d\'utilisation pour garantir son efficacité.'}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <Clock size={20} className="text-white/60" />
            <div>
              <div className="text-sm text-white/60">
                Dernière maintenance
              </div>
              <div className="text-white font-medium">
                {format(new Date(lastMaintenance), 'PPP', { locale: fr })}
              </div>
            </div>
          </div>

          {maintenanceType === 'uv_lamp' && uvLampHours && (
            <div className="mt-4 flex items-center space-x-4">
              <Clock size={20} className="text-white/60" />
              <div>
                <div className="text-sm text-white/60">
                  Heures d'utilisation
                </div>
                <div className={`font-medium ${
                  uvLampHours >= 8000 ? 'text-red-400' :
                  uvLampHours >= 7000 ? 'text-yellow-400' :
                  'text-white'
                }`}>
                  {uvLampHours} heures
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Notes de maintenance
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            placeholder="Ajoutez des notes sur la maintenance..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
          >
            Confirmer la maintenance
          </button>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">
                Confirmer l'opération
              </h3>
              <p className="text-white/70 mb-6">
                Êtes-vous sûr de vouloir procéder à {maintenanceType === 'cleaning' ? 'ce nettoyage' : 'ce changement de lampe UV'} ?
                Cette action sera enregistrée dans l'historique de maintenance.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}