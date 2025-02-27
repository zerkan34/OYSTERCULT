import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { SupplierProduct, CreateSupplierProductDTO } from '@/types/supplier';
import toast from 'react-hot-toast';

// Données fictives pour la démo
const mockProducts: SupplierProduct[] = [
  {
    id: 'p1',
    supplier_id: '',
    name: 'Huîtres spéciales n°2',
    description: 'Huîtres creuses de qualité supérieure, idéales pour la dégustation',
    unit: 'douzaine',
    price: 14.50,
    min_order_quantity: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: 'Huîtres creuses',
  },
  {
    id: 'p2',
    supplier_id: '',
    name: 'Huîtres plates Belon n°00',
    description: 'Huîtres plates au goût délicat et iodé, parfaites pour les connaisseurs',
    unit: 'douzaine',
    price: 36.80,
    min_order_quantity: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: 'Huîtres plates',
  },
  {
    id: 'p3',
    supplier_id: '',
    name: 'Moules de bouchot AOP',
    description: 'Moules de bouchot de la Baie du Mont-Saint-Michel, certifiées AOP',
    unit: 'kg',
    price: 6.90,
    min_order_quantity: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: 'Moules',
  },
  {
    id: 'p4',
    supplier_id: '',
    name: 'Palourdes de pêche',
    description: 'Palourdes fraîches pêchées localement, idéales pour les pâtes alle vongole',
    unit: 'kg',
    price: 12.80,
    min_order_quantity: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: 'Coquillages',
  },
  {
    id: 'p5',
    supplier_id: '',
    name: 'Bulots prêts à cuire',
    description: 'Bulots frais de Normandie, prêts à être cuisinés',
    unit: 'kg',
    price: 9.40,
    min_order_quantity: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: 'Coquillages',
  },
  {
    id: 'p6',
    supplier_id: '',
    name: 'Crevettes roses bio',
    description: 'Crevettes roses élevées en agriculture biologique, sans antibiotiques',
    unit: 'kg',
    price: 24.90,
    min_order_quantity: 0.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: 'Crustacés',
  },
  {
    id: 'p7',
    supplier_id: '',
    name: 'Homard vivant breton',
    description: 'Homard bleu pêché au large des côtes bretonnes, livré vivant',
    unit: 'pièce',
    price: 32.00,
    min_order_quantity: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: 'Crustacés',
  },
  {
    id: 'p8',
    supplier_id: '',
    name: 'Filet de dorade royale',
    description: 'Filet de dorade royale frais, pêche du jour, élevage responsable',
    unit: 'kg',
    price: 29.80,
    min_order_quantity: 0.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: 'Poissons',
  },
  {
    id: 'p9',
    supplier_id: '',
    name: 'Caviar d\'esturgeon Osciètre',
    description: 'Caviar d\'esturgeon français, grains dorés au goût subtil de noisette',
    unit: 'pot de 30g',
    price: 85.00,
    min_order_quantity: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: 'Produits d\'exception',
  },
  {
    id: 'p10',
    supplier_id: '',
    name: 'Algues fraîches Kombu',
    description: 'Algues Kombu fraîches de Bretagne, riches en saveurs et minéraux',
    unit: 'kg',
    price: 18.50,
    min_order_quantity: 0.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: 'Algues',
  },
];

export function useSupplierProducts(supplierId?: string) {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['supplier-products', supplierId],
    queryFn: async () => {
      if (!supplierId) return [];

      // Pour la démo, on renvoie toujours les données fictives
      return mockProducts.map(product => ({
        ...product,
        supplier_id: supplierId
      }));

      /* Commenté pour la démo
      const query = supabase
        .from('supplier_products')
        .select('*')
        .order('name');

      if (supplierId) {
        query.eq('supplier_id', supplierId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Si aucune donnée n'est retournée, utiliser les données fictives
      if (!data || data.length === 0) {
        return mockProducts.map(product => ({
          ...product,
          supplier_id: supplierId || product.supplier_id
        }));
      }
      
      return data as SupplierProduct[];
      */
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
    products: data as SupplierProduct[],
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
