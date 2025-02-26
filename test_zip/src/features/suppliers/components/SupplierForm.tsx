import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useSuppliers } from '../hooks/useSuppliers';
import type { Supplier, CreateSupplierDTO } from '@/types/supplier';

interface SupplierFormProps {
  supplier?: Supplier | null;
  onClose: () => void;
}

export function SupplierForm({ supplier, onClose }: SupplierFormProps) {
  const { createSupplier, updateSupplier } = useSuppliers();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateSupplierDTO>({
    defaultValues: supplier || {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  });

  const onSubmit = async (data: CreateSupplierDTO) => {
    try {
      if (supplier) {
        await updateSupplier.mutateAsync({ id: supplier.id, ...data });
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {supplier ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
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
              Nom du fournisseur *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Le nom est obligatoire' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'L\'email est obligatoire',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide'
                }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Téléphone *
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'Le téléphone est obligatoire' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Adresse *
            </label>
            <textarea
              {...register('address', { required: 'L\'adresse est obligatoire' })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : supplier ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
