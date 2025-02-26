import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';

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
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Erreur',
        message: 'Impossible de mettre à jour le statut',
        type: 'error'
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
        icon: <Bell className="h-5 w-5" />
      });

      setShowQRScanner(false);
      setSelectedOrder(null);
    } catch (error) {
      addNotification({
        title: 'Erreur',
        message: 'Impossible d\'enregistrer les données de livraison',
        type: 'error'
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
          <h1 className="text-2xl font-bold text-white">Catalogue Fournisseurs</h1>
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Rechercher un fournisseur ou un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSuppliers.map((supplier) => (
            <AnimatedCard
              key={supplier.id}
              onClick={() => setSelectedSupplier(supplier)}
              className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-blue transition-colors">
                    {supplier.name}
                  </h3>
                  <p className="text-white/60">{supplier.description}</p>
                </div>
                
                <div className="flex-grow">
                  <h4 className="text-sm font-medium text-white/80 mb-2">Produits disponibles :</h4>
                  <ul className="space-y-1">
                    {supplier.products.map((product, index) => (
                      <li key={index} className="text-sm text-white/60 flex items-center">
                        <span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-2"></span>
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue/20 transition-colors">
                    <Plus size={16} className="mr-2" />
                    Commander
                  </button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
}
