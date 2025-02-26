import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { SupplierProduct, CreateSupplierProductDTO } from '@/types/supplier';
import toast from 'react-hot-toast';

export function useSupplierProducts(supplierId?: string) {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['supplier-products', supplierId],
    queryFn: async () => {
      const query = supabase
        .from('supplier_products')
        .select('*')
        .order('name');

      if (supplierId) {
        query.eq('supplier_id', supplierId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SupplierProduct[];
    },
    enabled: !!supplierId
  });

  const createProduct = useMutation({
    mutationFn: async (newProduct: CreateSupplierProductDTO) => {
      const { data, error } = await supabase
        .from('supplier_products')
        .insert([newProduct])
        .select()
        .single();

      if (error) throw error;
      return data as SupplierProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] });
      toast.success('Produit ajouté avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'ajout du produit');
      console.error('Error creating product:', error);
    }
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CreateSupplierProductDTO> & { id: string }) => {
      const { data, error } = await supabase
        .from('supplier_products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as SupplierProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] });
      toast.success('Produit mis à jour avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du produit');
      console.error('Error updating product:', error);
    }
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('supplier_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] });
      toast.success('Produit supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du produit');
      console.error('Error deleting product:', error);
    }
  });

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
