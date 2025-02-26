import React from 'react';
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--color-brand-primary))]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Commandes Fournisseurs</h1>
      
      <div className="grid gap-6">
        {orders.map((order) => (
          <OrderDetails
            key={order.id}
            orderId={order.id}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={(status) => handleStatusChange(order.id, status)}
            onScanQR={() => {
              setSelectedOrder(order.id);
              setShowQRScanner(true);
            }}
          />
        ))}
      </div>

      <QRCodeScanner
        open={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleDeliveryData}
      />
    </div>
  );
}
