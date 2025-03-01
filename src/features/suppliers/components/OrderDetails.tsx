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
        type: 'success',
        important: false,
        category: 'inventory'
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
        type: 'success',
        important: false,
        category: 'inventory'
      });
    }
  });

  if (isLoading || !order) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--color-brand-primary))]" />
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

  const handleAddComment = () => {
    addComment.mutate(newComment);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[rgb(var(--color-brand-surface)_/_0.9)] backdrop-blur-md border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Détails de la commande</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-135px)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-white font-medium">Fournisseur: {order.supplier?.name || '-'}</h3>
              <p className="text-white/60 text-sm">
                Commandé le {format(new Date(order.created_at), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h4 className="text-white font-medium mb-3">Produits commandés</h4>
            <div className="space-y-3">
              {order.items.map(product => (
                <div key={product.id} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div>
                    <p className="text-white">{product.product.name}</p>
                    <p className="text-white/60 text-sm">{product.quantity} × {product.unit_price.toFixed(2)}€</p>
                  </div>
                  <p className="text-white font-medium">{(product.quantity * product.unit_price).toFixed(2)}€</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <p className="text-white font-medium">Total</p>
                <p className="text-white font-bold">{total.toFixed(2)}€</p>
              </div>
            </div>
          </div>
          
          {(order.status === 'completed' || order.status === 'delivering') && (
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <h4 className="text-white font-medium mb-3">Informations de livraison</h4>
              
              {order.storage_location && (
                <div className="flex items-start mb-3">
                  <MapPin size={18} className="text-white/60 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/60 mb-1">Emplacement de stockage</p>
                    <p className="text-white">{order.storage_location}</p>
                  </div>
                </div>
              )}
              
              {order.expiry_date && (
                <div className="flex items-start">
                  <Calendar size={18} className="text-white/60 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/60 mb-1">Date d'expiration</p>
                    <p className="text-white">{format(new Date(order.expiry_date), 'dd MMMM yyyy', { locale: fr })}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h4 className="text-white font-medium mb-3">Actions</h4>
            <div className="flex flex-wrap gap-2">
              {order.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onUpdateStatus('accepted')}
                    className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                  >
                    Valider la commande
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onUpdateStatus('rejected')}
                    className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                  >
                    Refuser
                  </Button>
                </>
              )}
              
              {order.status === 'accepted' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus('delivering')}
                  className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"
                >
                  Marquer comme en livraison
                </Button>
              )}
              
              {order.status === 'delivering' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus('completed')}
                  className="bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20"
                >
                  Confirmer réception
                </Button>
              )}
              
              {(order.status === 'delivering' || order.status === 'completed') && onScanQR && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onScanQR}
                  className="bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
                >
                  Scanner QR Code
                </Button>
              )}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Commentaires</h4>
            <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
              {order.comments && order.comments.length > 0 ? (
                order.comments.map(comment => (
                  <div 
                    key={comment.id} 
                    className={`p-3 rounded-lg ${
                      comment.user_id.startsWith('supplier') 
                      ? 'bg-blue-500/10 border border-blue-500/20 ml-6' 
                      : 'bg-white/10 border border-white/10 mr-6'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-white/80">
                        {comment.user_id.startsWith('supplier') ? 'Fournisseur' : 'Vous'}
                      </p>
                      <p className="text-xs text-white/40">
                        {format(new Date(comment.created_at), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    <p className="text-white/80">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-white/60 text-center py-4">Aucun commentaire</p>
              )}
            </div>
            
            <div className="flex items-end gap-2">
              <Textarea 
                className="flex-1 bg-white/5 border border-white/10 resize-none text-white placeholder-white/40 focus:border-white/20"
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button 
                className="bg-[rgb(var(--color-brand-primary))] hover:bg-[rgb(var(--color-brand-primary)_/_0.8)]"
                disabled={!newComment.trim()}
                onClick={handleAddComment}
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
