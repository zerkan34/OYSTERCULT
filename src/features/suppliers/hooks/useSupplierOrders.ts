import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';

interface SupplierOrder {
  id: string;
  supplier_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'delivering' | 'completed';
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  storage_location?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
  comments?: Array<{
    id: string;
    content: string;
    created_at: string;
    user_id: string;
  }>;
}

interface CreateOrderDTO {
  supplier_id: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
}

interface UpdateOrderDTO {
  status?: string;
  storage_location?: string;
  expiry_date?: string;
}

interface AddCommentDTO {
  order_id: string;
  content: string;
}

export function useSupplierOrders() {
  const queryClient = useQueryClient();
  const { addNotification } = useStore();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['supplier_orders'],
    queryFn: async () => {
      try {
        // Normalement, on ferait un appel à Supabase ici
        // const { data, error } = await supabase.from('supplier_orders').select('*');
        
        // Mais pour le moment, on utilise des données fictives
        const mockOrders: SupplierOrder[] = [
          {
            id: '1',
            supplier_id: 'hmo',
            status: 'pending', // Envoyé
            products: [
              { id: '1', name: 'Huîtres plates', quantity: 120, price: 8.5 },
              { id: '2', name: 'Huîtres creuses', quantity: 240, price: 7.2 }
            ],
            total_amount: 2748,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            comments: []
          },
          {
            id: '2',
            supplier_id: 'lpb',
            status: 'accepted', // Validé
            products: [
              { id: '3', name: 'Moules de Bouzigues', quantity: 50, price: 6.0 }
            ],
            total_amount: 300,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            comments: [
              {
                id: '1',
                content: 'Commande validée par le fournisseur. Livraison prévue la semaine prochaine.',
                created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                user_id: '1'
              }
            ]
          },
          {
            id: '3',
            supplier_id: 'ac',
            status: 'delivering', // En cours de livraison
            products: [
              { id: '4', name: 'Huîtres du Bassin', quantity: 80, price: 9.5 },
              { id: '5', name: 'Palourdes', quantity: 30, price: 12.0 }
            ],
            total_amount: 1120,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            comments: [
              {
                id: '2',
                content: 'Votre commande est en cours de livraison. Arrivée prévue demain matin.',
                created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                user_id: '1'
              }
            ]
          },
          {
            id: '4',
            supplier_id: 'cp',
            status: 'completed', // Reçu
            products: [
              { id: '6', name: 'Huîtres plates', quantity: 50, price: 8.5 },
              { id: '7', name: 'Moules de bouchot', quantity: 80, price: 5.2 }
            ],
            total_amount: 841,
            storage_location: 'Zone A, Étagère 3',
            created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            comments: [
              {
                id: '3',
                content: 'Commande reçue et stockée. Qualité conforme aux attentes.',
                created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                user_id: '1'
              }
            ]
          },
          {
            id: '5',
            supplier_id: 'hmo',
            status: 'rejected', // Refusé
            products: [
              { id: '8', name: 'Huîtres spéciales', quantity: 20, price: 15.0 }
            ],
            total_amount: 300,
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            comments: [
              {
                id: '4',
                content: 'Commande refusée par le fournisseur. Stock insuffisant pour le moment.',
                created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
                user_id: '2'
              }
            ]
          }
        ];
        
        return mockOrders;
      } catch (error) {
        console.error('Error fetching supplier orders:', error);
        return [];
      }
    },
  });

  const createOrder = useMutation({
    mutationFn: async (newOrder: CreateOrderDTO) => {
      const { data: products } = await supabase
        .from('supplier_products')
        .select('id, price')
        .in('id', newOrder.products.map(p => p.id));

      const total_amount = newOrder.products.reduce((sum, orderProduct) => {
        const product = products?.find(p => p.id === orderProduct.id);
        return sum + (product?.price || 0) * orderProduct.quantity;
      }, 0);

      const { data, error } = await supabase
        .from('supplier_orders')
        .insert([{
          ...newOrder,
          status: 'pending',
          total_amount
        }])
        .select()
        .single();
      
      if (error) throw error;

      addNotification({
        title: 'Commande créée',
        message: 'La commande a été créée avec succès',
        type: 'success',
        important: false,
        category: 'inventory'
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier_orders'] });
    }
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateOrderDTO & { id: string }) => {
      const { data, error } = await supabase
        .from('supplier_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;

      if (updates.status === 'completed') {
        // Mettre à jour le stock
        const order = await supabase
          .from('supplier_orders')
          .select('*')
          .eq('id', id)
          .single();

        if (order.data) {
          for (const product of order.data.products) {
            await supabase.rpc('update_stock', {
              product_id: product.id,
              quantity: product.quantity,
              storage_location: updates.storage_location,
              expiry_date: updates.expiry_date
            });
          }
        }

        addNotification({
          title: 'Stock mis à jour',
          message: 'Le stock a été mis à jour avec les produits livrés',
          type: 'success',
          important: false,
          category: 'inventory'
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier_orders'] });
    }
  });

  const addComment = useMutation({
    mutationFn: async ({ order_id, content }: AddCommentDTO) => {
      const { data, error } = await supabase
        .from('supplier_order_comments')
        .insert([{
          order_id,
          content,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier_orders'] });
    }
  });

  return {
    orders,
    isLoading,
    createOrder,
    updateOrder,
    addComment
  };
}
