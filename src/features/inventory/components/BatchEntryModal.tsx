import React, { useState } from 'react';
import { Plus, Shell, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BatchEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { number: string; quantity: number; type: 'plates' | 'creuses' | 'speciales' }) => void;
  lastBatchNumber?: string;
  pool?: any;
}

export function BatchEntryModal({ isOpen, onClose, onConfirm, lastBatchNumber, pool }: BatchEntryModalProps) {
  const [number, setNumber] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState<'plates' | 'creuses' | 'speciales'>('plates');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!number || !quantity) return;
    
    onConfirm({
      number,
      quantity: parseInt(quantity),
      type
    });
    
    // Reset form
    setNumber('');
    setQuantity('');
    setType('plates');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un nouveau lot" size="md">
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
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Numéro de lot
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={`${lastBatchNumber} (Dernier lot sorti de la trempe 1)`}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Quantité
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Type d'huîtres
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'plates' | 'creuses' | 'speciales')}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="plates">Plates</option>
              <option value="creuses">Creuses</option>
              <option value="speciales">Spéciales</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
            >
              <Plus size={16} />
              Ajouter
            </button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
}
