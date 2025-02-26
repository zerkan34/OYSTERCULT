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
    queryKey: ['supplier-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_orders')
        .select(`
          *,
          supplier:suppliers(name),
          comments:supplier_order_comments(
            id,
            content,
            created_at,
            user_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SupplierOrder[];
    }
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
        type: 'success'
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-orders'] });
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
          type: 'success'
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-orders'] });
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
      queryClient.invalidateQueries({ queryKey: ['supplier-orders'] });
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
