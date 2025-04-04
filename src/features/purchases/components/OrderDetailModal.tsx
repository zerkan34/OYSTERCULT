import { X, Plus } from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    product: string;
    status: string;
    supplier: string;
    deliveryDate: string;
    quantity: string;
    price: string;
  };
}

export function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop avec effet de flou */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal avec effet néon et glassmorphism */}
      <div className="relative w-full max-w-lg p-6 rounded-lg bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] border border-white/10 shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset]">
        {/* Effet de glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur-lg opacity-75" />
        
        <div className="relative">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Détails de la commande
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Contenu */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-white">{order.product}</span>
              <div className="px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                {order.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <label className="text-sm text-white/60">Fournisseur</label>
                <p className="text-white font-medium mt-1">{order.supplier}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <label className="text-sm text-white/60">Date de livraison</label>
                <p className="text-white font-medium mt-1">{order.deliveryDate}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <label className="text-sm text-white/60">Quantité</label>
                <p className="text-white font-medium mt-1">{order.quantity}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <label className="text-sm text-white/60">Prix</label>
                <p className="text-white font-medium mt-1">{order.price}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 text-white/70 hover:text-white shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1">
                <Plus size={18} className="text-cyan-400" />
                <span>Recommander</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
