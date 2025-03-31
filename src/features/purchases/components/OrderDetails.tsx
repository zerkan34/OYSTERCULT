import React from 'react';
import { X } from 'lucide-react';
import PurchaseComments from './PurchaseComments';

interface Order {
  id: string;
  product: string;
  supplier: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed' | 'dispatched' | 'in_transit' | 'completed';
  price: number;
  quantity: number;
  stockLocation: string;
  lastUpdate: string;
  rating: number;
}

interface OrderDetailsProps {
  order: Order | undefined;
  onClose: () => void;
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-end z-50">
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 h-full w-[600px] border-l border-white/10">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {order.product}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
            aria-label="Fermer les détails"
          >
            <X className="w-6 h-6 text-white/60" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/60">Fournisseur</label>
              <p className="text-white">{order.supplier}</p>
            </div>
            <div>
              <label className="text-sm text-white/60">Statut</label>
              <p className="text-white">{order.status}</p>
            </div>
            <div>
              <label className="text-sm text-white/60">Quantité</label>
              <p className="text-white">{order.quantity} kg</p>
            </div>
            <div>
              <label className="text-sm text-white/60">Prix</label>
              <p className="text-white">{order.price} €</p>
            </div>
            <div>
              <label className="text-sm text-white/60">Emplacement</label>
              <p className="text-white">{order.stockLocation}</p>
            </div>
            <div>
              <label className="text-sm text-white/60">Dernière mise à jour</label>
              <p className="text-white">{order.lastUpdate}</p>
            </div>
          </div>

          {order.rating > 0 && (
            <div className="bg-white/5 rounded-lg p-4">
              <label className="text-sm text-white/60 block mb-2">Évaluation</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${
                      star <= order.rating ? 'text-yellow-400' : 'text-gray-400'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white/5 rounded-lg">
            <PurchaseComments orderId={order.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
