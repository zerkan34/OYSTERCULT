import React from 'react';
import { X } from 'lucide-react';
import PurchaseComments from './PurchaseComments';

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
          <h2 className="text-xl font-semibold text-white">Commenter la commande {order.id}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg"
          >
            <X className="text-white/60" size={20} />
          </button>
        </div>

        <PurchaseComments 
          purchase={order}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
