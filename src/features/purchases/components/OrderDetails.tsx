import React from 'react';
import { X } from 'lucide-react';

interface Order {
  id: string;
  product: string;
  supplier: string;
  status: string;
  price: number;
  quantity: string;
  stockLocation: string;
  lastUpdate: string;
}

interface OrderDetailsProps {
  order: Order | undefined;
  onClose: () => void;
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Détails de la commande {order.id}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg"
          >
            <X className="text-white/60" size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-white/40">Produit</p>
            <p className="text-sm text-white mt-1">{order.product}</p>
          </div>
          <div>
            <p className="text-sm text-white/40">Fournisseur</p>
            <p className="text-sm text-white mt-1">{order.supplier}</p>
          </div>
          <div>
            <p className="text-sm text-white/40">Prix</p>
            <p className="text-sm text-white mt-1">{order.price}€</p>
          </div>
          <div>
            <p className="text-sm text-white/40">Quantité</p>
            <p className="text-sm text-white mt-1">{order.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-white/40">Emplacement stock</p>
            <p className="text-sm text-white mt-1">{order.stockLocation}</p>
          </div>
          <div>
            <p className="text-sm text-white/40">Dernière mise à jour</p>
            <p className="text-sm text-white mt-1">{order.lastUpdate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
