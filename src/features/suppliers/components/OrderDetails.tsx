import React from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { SupplierOrder } from '@/types/supplier';

interface OrderDetailsProps {
  orderId: string;
  onClose: () => void;
  onUpdateStatus: (status: SupplierOrder['status']) => void;
}

export function OrderDetails({ orderId, onClose, onUpdateStatus }: OrderDetailsProps) {
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_orders')
        .select(`
          *,
          supplier:suppliers(name, email, phone),
          items:supplier_order_items(
            *,
            product:supplier_products(name, unit)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data as SupplierOrder & {
        supplier: { name: string; email: string; phone: string };
        items: Array<{
          id: string;
          quantity: number;
          unit_price: number;
          product: { name: string; unit: string };
        }>;
      };
    }
  });

  if (isLoading || !order) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Détails de la commande</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Fournisseur
              </h3>
              <p className="font-medium">{order.supplier.name}</p>
              <p className="text-sm text-gray-500">{order.supplier.email}</p>
              <p className="text-sm text-gray-500">{order.supplier.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Informations commande
              </h3>
              <p className="text-sm">
                Date: {format(new Date(order.created_at), 'Pp', { locale: fr })}
              </p>
              {order.delivery_date && (
                <p className="text-sm">
                  Livraison prévue: {format(new Date(order.delivery_date), 'P', { locale: fr })}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Articles
            </h3>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Produit
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    Quantité
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    Prix unitaire
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-sm">{item.product.name}</td>
                    <td className="px-4 py-2 text-sm text-right">
                      {item.quantity} {item.product.unit}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {item.unit_price.toFixed(2)}€
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {(item.quantity * item.unit_price).toFixed(2)}€
                    </td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <td colSpan={3} className="px-4 py-2 text-right">
                    Total
                  </td>
                  <td className="px-4 py-2 text-right">
                    {order.total_amount.toFixed(2)}€
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Statut de la commande
            </h3>
            <div className="flex space-x-2">
              {(['pending', 'accepted', 'rejected', 'delivering', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(status)}
                  disabled={order.status === status}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === status
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {status === 'pending' && 'En attente'}
                  {status === 'accepted' && 'Accepter'}
                  {status === 'rejected' && 'Refuser'}
                  {status === 'delivering' && 'En livraison'}
                  {status === 'completed' && 'Terminer'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
