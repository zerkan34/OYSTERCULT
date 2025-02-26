import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useSupplierProducts } from '../hooks/useSupplierProducts';
import type { SupplierProduct, CreateSupplierProductDTO } from '@/types/supplier';

interface ProductFormProps {
  supplierId: string;
  product?: SupplierProduct | null;
  onClose: () => void;
}

export function ProductForm({ supplierId, product, onClose }: ProductFormProps) {
  const { createProduct, updateProduct } = useSupplierProducts(supplierId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateSupplierProductDTO>({
    defaultValues: product || {
      supplier_id: supplierId,
      name: '',
      description: '',
      unit: '',
      price: 0,
      min_order_quantity: 1
    }
  });

  const onSubmit = async (data: CreateSupplierProductDTO) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...data });
      } else {
        await createProduct.mutateAsync(data);
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
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="hidden"
            {...register('supplier_id')}
            value={supplierId}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Nom du produit *
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
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Unité *
              </label>
              <input
                type="text"
                {...register('unit', { required: 'L\'unité est obligatoire' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ex: kg, pièce, lot"
              />
              {errors.unit && (
                <p className="mt-1 text-sm text-red-500">{errors.unit.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Prix unitaire (€) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Le prix est obligatoire',
                  min: { value: 0, message: 'Le prix doit être positif' }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Quantité minimum de commande
            </label>
            <input
              type="number"
              {...register('min_order_quantity', {
                min: { value: 1, message: 'La quantité minimum doit être supérieure à 0' }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.min_order_quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.min_order_quantity.message}</p>
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
              {isSubmitting ? 'Enregistrement...' : product ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
