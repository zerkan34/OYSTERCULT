import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { motion } from 'framer-motion';
import { ArrowUpRight, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BatchExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { quantity: number; destination: string; notes?: string }) => void;
  batch: {
    number: string;
    quantity: number;
    type: string;
    remainingTime: number;
  };
}

export function BatchExitModal({ isOpen, onClose, onConfirm, batch }: BatchExitModalProps) {
  const [quantity, setQuantity] = useState(batch.quantity);
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');
  const [showWarning, setShowWarning] = useState(batch.remainingTime > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      quantity,
      destination,
      notes
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sortie de lot"
      size="md"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-[rgba(15,23,42,0.45)] backdrop-blur-[16px] p-8 rounded-xl w-[500px] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6" 
        >
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Détails du lot</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-white/60">Numéro de lot</div>
                <div className="text-white font-medium">{batch.number}</div>
              </div>
              <div>
                <div className="text-sm text-white/60">Type</div>
                <div className="text-white font-medium">{batch.type}</div>
              </div>
            </div>
          </div>

          {showWarning && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle size={20} className="text-yellow-400 mt-1" />
                <div>
                  <h4 className="text-yellow-400 font-medium">Attention</h4>
                  <p className="text-yellow-400/80 mt-1">
                    Ce lot a encore {batch.remainingTime}h de purification restantes. 
                    Êtes-vous sûr de vouloir le sortir maintenant ?
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Quantité à sortir
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              max={batch.quantity}
              min={1}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              required
            />
            <p className="mt-1 text-sm text-white/60">
              Maximum disponible : {batch.quantity} unités
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              required
            >
              <option value="">Sélectionner une destination...</option>
              <option value="stock">Stock</option>
              <option value="vente">Vente directe</option>
              <option value="destruction">Destruction</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="Ajoutez des notes ou observations..."
            />
          </div>

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
              className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
            >
              <ArrowUpRight size={20} className="mr-2" />
              Sortir le lot
            </button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
}