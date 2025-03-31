import React from 'react';
import { useParams } from 'react-router-dom';
import { PageTitle } from '@/components/ui/PageTitle';
import { ModernCardBase } from '@/components/ui/ModernCardBase';
import { Package, Calendar, Shell, Euro } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PurchaseDetailsPage() {
  const { orderId } = useParams();

  // TODO: Fetch order details from API
  const order = {
    id: orderId,
    product: "Huîtres spéciales n°3",
    supplier: "Fournisseur A",
    deliveryDate: "2024-04-15",
    quantity: "500kg",
    price: "2,500",
    status: "pending",
    notes: "Commande à traiter en priorité. Livraison souhaitée avant 10h."
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/30' };
      case 'delivered':
        return { label: 'Livrée', bgColor: 'bg-green-500/20', textColor: 'text-green-400', borderColor: 'border-green-500/30' };
      case 'cancelled':
        return { label: 'Annulée', bgColor: 'bg-red-500/20', textColor: 'text-red-400', borderColor: 'border-red-500/30' };
      default:
        return { label: 'En attente', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/30' };
    }
  };

  const status = getStatusStyles(order.status);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageTitle
        title="Détails de la commande"
        icon={<Package className="w-6 h-6" />}
      />

      <ModernCardBase className="border border-white/10 rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{order.product}</h2>
              <div className={`px-3 py-1 rounded-full text-sm ${status.bgColor} ${status.textColor} ${status.borderColor} border`}>
                {status.label}
              </div>
            </div>
            <Button variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
              Modifier
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-cyan-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Package className="w-5 h-5" />
                <span className="font-medium">Fournisseur</span>
              </div>
              <span className="text-white">{order.supplier}</span>
            </div>

            <div className="bg-cyan-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Date de livraison</span>
              </div>
              <span className="text-white">{order.deliveryDate}</span>
            </div>

            <div className="bg-cyan-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Shell className="w-5 h-5" />
                <span className="font-medium">Quantité</span>
              </div>
              <span className="text-white">{order.quantity}</span>
            </div>

            <div className="bg-cyan-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Euro className="w-5 h-5" />
                <span className="font-medium">Montant</span>
              </div>
              <span className="text-white">{order.price}€</span>
            </div>
          </div>

          <div className="bg-cyan-500/10 rounded-lg p-4">
            <h3 className="text-cyan-400 font-medium mb-3">Notes</h3>
            <p className="text-white/70">
              {order.notes}
            </p>
          </div>
        </div>
      </ModernCardBase>
    </div>
  );
}
