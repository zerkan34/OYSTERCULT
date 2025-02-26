import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSuppliers } from '../hooks/useSuppliers';
import type { CreateSupplierDTO } from '@/types/supplier';

interface SupplierDialogProps {
  supplierId?: string | null;
  onClose: () => void;
}

export function SupplierDialog({ supplierId, onClose }: SupplierDialogProps) {
  const { suppliers, createSupplier, updateSupplier } = useSuppliers();
  const supplier = suppliers.find(s => s.id === supplierId);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateSupplierDTO>({
    defaultValues: supplier || {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  });

  const onSubmit = async (data: CreateSupplierDTO) => {
    try {
      if (supplierId) {
        await updateSupplier.mutateAsync({ id: supplierId, ...data });
      } else {
        await createSupplier.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {supplierId ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom
            </label>
            <input
              type="text"
              {...register('name', { required: 'Le nom est requis' })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide'
                }
              })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'Le téléphone est requis' })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Adresse
            </label>
            <textarea
              {...register('address', { required: 'L\'adresse est requise' })}
              rows={3}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {supplierId ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
