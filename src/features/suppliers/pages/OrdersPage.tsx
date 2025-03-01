import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { MessageSquare } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  description: string;
  products: string[];
}

const mockSuppliers: Supplier[] = [
  {
    id: 'hmo',
    name: 'HMO',
    description: 'Huîtres de Marennes Oléron',
    products: ['Huîtres plates', 'Huîtres creuses', 'Huîtres spéciales']
  },
  {
    id: 'lpb',
    name: 'LPB',
    description: 'Les Parcs de Bouzigues',
    products: ['Moules de Bouzigues', 'Huîtres de Bouzigues']
  },
  {
    id: 'ac',
    name: 'AC',
    description: 'Arcachon Coquillages',
    products: ['Huîtres du Bassin', 'Palourdes', 'Coques']
  },
  {
    id: 'cp',
    name: 'CP',
    description: 'Cancale Production',
    products: ['Huîtres plates', 'Huîtres creuses', 'Moules de bouchot']
  }
];

import { useSupplierOrders } from '../hooks/useSupplierOrders';
import { OrderDetails } from '../components/OrderDetails';
import { QRCodeScanner } from '../components/QRCodeScanner';
import { useStore } from '@/lib/store';
import { Bell } from 'lucide-react';

export function OrdersPage() {
  const { orders, isLoading, updateOrder } = useSupplierOrders();
  const [selectedOrder, setSelectedOrder] = React.useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = React.useState(false);
  const { addNotification } = useStore();

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrder(orderId, { status });
      
      if (status === 'delivering') {
        setSelectedOrder(orderId);
        setShowQRScanner(true);
      }
      
      addNotification({
        title: 'Statut mis à jour',
        message: `La commande a été marquée comme "${status}"`,
        type: 'success',
        important: false,
        category: 'inventory'
      });
    } catch (error) {
      addNotification({
        title: 'Erreur',
        message: 'Impossible de mettre à jour le statut',
        type: 'error',
        important: true,
        category: 'inventory'
      });
    }
  };

  const handleDeliveryData = async (data: any) => {
    if (!selectedOrder) return;

    try {
      const { storage_location, expiry_date } = data;
      await updateOrder(selectedOrder, { 
        storage_location, 
        expiry_date,
        status: 'completed'
      });
      
      addNotification({
        title: 'Livraison enregistrée',
        message: 'Les données de livraison ont été enregistrées',
        type: 'success',
        icon: <Bell className="h-5 w-5" />,
        important: false,
        category: 'inventory'
      });

      setShowQRScanner(false);
      setSelectedOrder(null);
    } catch (error) {
      addNotification({
        title: 'Erreur',
        message: 'Impossible d\'enregistrer les données de livraison',
        type: 'error',
        important: true,
        category: 'inventory'
      });
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--color-brand-primary))]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Commandes Fournisseurs</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Rechercher une commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Vos commandes récentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => {
              const supplier = mockSuppliers.find(s => s.id === order.supplier_id);
              const statusColorClass = 
                order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                order.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                order.status === 'delivering' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                order.status === 'completed' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30';
              
              const statusLabel = 
                order.status === 'pending' ? 'Envoyé' :
                order.status === 'accepted' ? 'Validé' :
                order.status === 'delivering' ? 'En cours de livraison' :
                order.status === 'completed' ? 'Reçu' :
                'Refusé';

              return (
                <AnimatedCard
                  key={order.id}
                  onClick={() => setSelectedOrder(order.id)}
                  className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white">{supplier?.name || 'Fournisseur'}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColorClass}`}>
                        {statusLabel}
                      </div>
                    </div>
                    
                    <div className="text-sm text-white/60 mb-3">
                      <p className="mb-1">Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                      <p className="font-medium text-white/80">Total: {order.total_amount.toFixed(2)}€</p>
                    </div>
                    
                    <div className="border-t border-white/5 pt-3 mt-auto">
                      <p className="text-sm font-medium text-white/70">
                        {order.products.length} produit{order.products.length > 1 ? 's' : ''}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {order.products.slice(0, 2).map(product => (
                          <span key={product.id} className="text-xs bg-white/5 px-2 py-1 rounded">
                            {product.quantity}× {product.name}
                          </span>
                        ))}
                        {order.products.length > 2 && (
                          <span className="text-xs bg-white/5 px-2 py-1 rounded">
                            +{order.products.length - 2} autre{order.products.length - 2 > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {order.comments && order.comments.length > 0 && (
                      <div className="mt-3 flex items-center text-white/50 text-sm">
                        <MessageSquare size={14} className="mr-1" />
                        {order.comments.length} commentaire{order.comments.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
