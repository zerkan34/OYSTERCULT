import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Batch } from '../types';

interface EditBatchModalProps {
  batch: Batch;
  isOpen: boolean;
  onClose: () => void;
}

export function EditBatchModal({ batch, isOpen, onClose }: EditBatchModalProps) {
  const { updateBatch } = useStore();
  const [formData, setFormData] = React.useState({
    quantity: batch.quantity,
    perchNumber: batch.perchNumber,
    status: batch.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBatch({
      ...batch,
      ...formData,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-medium text-white mb-6">
          Modifier le lot {batch.batchNumber}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">
              Quantité
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">
              Numéro de perche
            </label>
            <input
              type="number"
              value={formData.perchNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, perchNumber: parseInt(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">
              Table
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            >
              <option value="table1">Table 1</option>
              <option value="table2">Table 2</option>
              <option value="table3">Table 3</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-medium py-2 px-4 rounded-lg"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
}
