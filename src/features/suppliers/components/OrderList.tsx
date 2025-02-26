import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { QrCode, MessageSquare, MapPin, Calendar } from 'lucide-react';
import type { Order } from '../types/order';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  accepted: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  delivering: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const statusLabels = {
  pending: 'En attente',
  accepted: 'Accepté',
  rejected: 'Refusé',
  delivering: 'En livraison',
};

interface OrderListProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: Order['status']) => void;
  onAddComment: (orderId: string, comment: string) => void;
  onScanQR: (orderId: string) => void;
}

export function OrderList({ orders, onStatusChange, onAddComment, onScanQR }: OrderListProps) {
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  const handleCommentSubmit = (orderId: string) => {
    const comment = newComments[orderId];
    if (comment?.trim()) {
      onAddComment(orderId, comment);
      setNewComments(prev => ({ ...prev, [orderId]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {orders.map(order => (
        <div
          key={order.id}
          className="bg-[rgb(var(--color-brand-surface)_/_0.5)] backdrop-blur-sm rounded-xl border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Commande #{order.id}
                </h3>
                <Badge
                  className={`${statusColors[order.status]} border backdrop-blur-sm`}
                >
                  {statusLabels[order.status]}
                </Badge>
              </div>
              <div className="space-x-2">
                {order.status === 'delivering' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onScanQR(order.id)}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Scanner QR
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                {order.products.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{product.name}</span>
                    <span>
                      {product.quantity} {product.unit} × {product.price}€
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between font-medium pt-2 border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
                  <span>Total</span>
                  <span>{order.total_amount.toFixed(2)}€</span>
                </div>
              </div>

              {order.storage_location && (
                <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                  <MapPin className="w-4 h-4" />
                  <span>Stockage : {order.storage_location}</span>
                </div>
              )}
              {order.expiry_date && (
                <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                  <Calendar className="w-4 h-4" />
                  <span>DLC : {new Date(order.expiry_date).toLocaleDateString()}</span>
                </div>
              )}

              {order.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                    onClick={() => onStatusChange(order.id, 'accepted')}
                  >
                    Accepter
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                    onClick={() => onStatusChange(order.id, 'rejected')}
                  >
                    Refuser
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                  <MessageSquare className="w-4 h-4" />
                  <span>Commentaires</span>
                </div>
                {order.comments.map(comment => (
                  <div
                    key={comment.id}
                    className="text-sm bg-[rgb(var(--color-brand-surface))] rounded-lg p-3"
                  >
                    {comment.content}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Textarea
                    value={newComments[order.id] || ''}
                    onChange={e => setNewComments(prev => ({ ...prev, [order.id]: e.target.value }))}
                    placeholder="Ajouter un commentaire..."
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleCommentSubmit(order.id)}
                  >
                    Envoyer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
