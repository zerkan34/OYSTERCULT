import React, { useState } from 'react';
import { X, MessageSquare, MapPin, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { SupplierOrder } from '@/types/supplier';
import { useStore } from '@/lib/store';

interface OrderDetailsProps {
  orderId: string;
  onClose: () => void;
  onUpdateStatus: (status: SupplierOrder['status']) => void;
  onScanQR?: () => void;
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  accepted: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  delivering: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
};

const statusLabels = {
  pending: 'En attente',
  accepted: 'Accepté',
  rejected: 'Refusé',
  delivering: 'En livraison',
  completed: 'Terminé'
};

export function OrderDetails({ orderId, onClose, onUpdateStatus, onScanQR }: OrderDetailsProps) {
  const [newComment, setNewComment] = useState('');
  const [location, setLocation] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const queryClient = useQueryClient();
  const { addNotification } = useStore();

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
          ),
          comments:supplier_order_comments(
            id,
            content,
            created_at,
            user_id
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('supplier_order_comments')
        .insert({
          order_id: orderId,
          content,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['order', orderId]);
      setNewComment('');
      addNotification({
        title: 'Commentaire ajouté',
        message: 'Votre commentaire a été ajouté avec succès',
        type: 'success'
      });
    }
  });

  const updateOrder = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('supplier_orders')
        .update(data)
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['order', orderId]);
      addNotification({
        title: 'Commande mise à jour',
        message: 'La commande a été mise à jour avec succès',
        type: 'success'
      });
    }
  });

  if (isLoading || !order) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const total = order.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrder.mutate({
      storage_location: location,
      expiry_date: expiryDate
    });
  };

  return (
    <div className="fixed inset-0 bg-[rgb(var(--color-background)_/_0.8)] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[rgb(var(--color-brand-surface))] p-6 rounded-xl border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Commande #{orderId.slice(0, 8)}</h2>
            <Badge className={`${statusColors[order.status]} border`}>
              {statusLabels[order.status]}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgb(var(--color-brand-muted))] rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] mb-1">
                Fournisseur
              </h3>
              <p className="font-medium">{order.supplier.name}</p>
              <p className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">{order.supplier.email}</p>
              <p className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">{order.supplier.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] mb-1">
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
            <h3 className="text-sm font-medium text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] mb-2">
              Articles
            </h3>
            <div className="bg-[rgb(var(--color-brand-muted))] rounded-lg p-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                      {item.quantity} {item.product.unit}
                    </p>
                  </div>
                  <p className="font-medium">{(item.quantity * item.unit_price).toFixed(2)}€</p>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
                <p className="font-bold">Total</p>
                <p className="font-bold">{total.toFixed(2)}€</p>
              </div>
            </div>
          </div>

          {/* Stockage et DLC */}
          {(order.storage_location || order.expiry_date) && (
            <div className="space-y-2">
              {order.storage_location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Stockage : {order.storage_location}</span>
                </div>
              )}
              {order.expiry_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>DLC : {format(new Date(order.expiry_date), 'P', { locale: fr })}</span>
                </div>
              )}
            </div>
          )}

          {/* Formulaire de mise à jour */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Emplacement de stockage
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Zone A, Étagère 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date d'expiration
              </label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer
              </Button>
            </div>
          </form>

          {/* Commentaires */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <h3 className="font-medium">Commentaires</h3>
            </div>
            
            <div className="space-y-4">
              {order.comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[rgb(var(--color-brand-muted))] rounded-lg p-4"
                >
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] mt-2">
                    {format(new Date(comment.created_at), 'Pp', { locale: fr })}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => addComment.mutate(newComment)}
                disabled={!newComment.trim()}
              >
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
