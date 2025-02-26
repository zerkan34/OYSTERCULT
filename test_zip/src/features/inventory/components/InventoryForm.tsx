import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';

interface InventoryFormData {
  name: string;
  sku: string;
  category: string;
  description: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
  location: string;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
}

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InventoryForm({ isOpen, onClose }: InventoryFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<InventoryFormData>();

  const onSubmit = (data: InventoryFormData) => {
    console.log(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvel Article"
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Nom de l'article
            </label>
            <input
              {...register('name', { required: 'Le nom est requis' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              SKU
            </label>
            <input
              {...register('sku', { required: 'Le SKU est requis' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.sku && (
              <p className="mt-1 text-sm text-red-400">{errors.sku.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Catégorie
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="huitres">Huîtres</option>
              <option value="materiels">Matériels</option>
              <option value="emballages">Emballages</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Unité
            </label>
            <select
              {...register('unit')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="douzaines">Douzaines</option>
              <option value="unites">Unités</option>
              <option value="kg">Kilogrammes</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Stock actuel
            </label>
            <input
              type="number"
              {...register('currentStock')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Stock minimum
            </label>
            <input
              type="number"
              {...register('minimumStock')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Stock maximum
            </label>
            <input
              type="number"
              {...register('maximumStock')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Prix d'achat
            </label>
            <input
              type="number"
              step="0.01"
              {...register('costPrice')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Prix de vente
            </label>
            <input
              type="number"
              step="0.01"
              {...register('sellingPrice')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Emplacement
            </label>
            <input
              {...register('location')}
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
            <option value="">Sélectionner un fournisseur</option>
            <option value="supplier1">Fournisseur 1</option>
            <option value="supplier2">Fournisseur 2</option>
          </select>
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
            className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
          >
            Créer l'article
          </button>
        </div>
      </form>
    </Modal>
  );
}