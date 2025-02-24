import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

interface BatchFormData {
  batchNumber: string;
  type: string;
  quantity: number;
  location: string;
  supplier: string;
  startDate: string;
  harvestDate: string;
  notes: string;
}

interface BatchFormProps {
  onClose: () => void;
}

export function BatchForm({ onClose }: BatchFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BatchFormData>();

  const onSubmit = (data: BatchFormData) => {
    console.log(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Nouveau Lot</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Numéro de lot
            </label>
            <input
              {...register('batchNumber', { required: 'Le numéro de lot est requis' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="Ex: LOT-2025-001"
            />
            {errors.batchNumber && (
              <p className="mt-1 text-sm text-red-400">{errors.batchNumber.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Type
            </label>
            <select
              {...register('type')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="plates">Huîtres Plates</option>
              <option value="creuses">Huîtres Creuses</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Quantité
            </label>
            <input
              type="number"
              {...register('quantity')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Emplacement
            </label>
            <select
              {...register('location')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="zone_nord">Zone Nord - Table A1</option>
              <option value="zone_sud">Zone Sud - Table B3</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Date de début
            </label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Date de récolte prévue
            </label>
            <input
              type="date"
              {...register('harvestDate')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Fournisseur
          </label>
          <select
            {...register('supplier')}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="naissain_express">Naissain Express</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            placeholder="Notes ou observations particulières..."
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
            className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
          >
            Créer le lot
          </button>
        </div>
      </div>
    </form>
  );
}