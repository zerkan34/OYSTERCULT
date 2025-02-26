import React from 'react';
import { X } from 'lucide-react';
import { Batch } from '../types';

interface EditBatchModalProps {
  batch: Batch;
  onClose: () => void;
  onSave: (updatedBatch: Batch) => void;
}

export function EditBatchModal({ batch, onClose, onSave }: EditBatchModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedBatch: Batch = {
      ...batch,
      type: formData.get('type') as string,
      quantity: Number(formData.get('quantity')),
      location: formData.get('location') as string,
      harvestDate: formData.get('harvestDate') as string,
      supplier: formData.get('supplier') as string,
    };
    onSave(updatedBatch);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Modifier le lot {batch.batchNumber}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={20} className="text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Type d'huîtres
            </label>
            <input
              type="text"
              name="type"
              defaultValue={batch.type}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Quantité
            </label>
            <input
              type="number"
              name="quantity"
              defaultValue={batch.quantity}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Emplacement
            </label>
            <input
              type="text"
              name="location"
              defaultValue={batch.location}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Date de récolte prévue
            </label>
            <input
              type="date"
              name="harvestDate"
              defaultValue={batch.harvestDate}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Fournisseur
            </label>
            <input
              type="text"
              name="supplier"
              defaultValue={batch.supplier}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
