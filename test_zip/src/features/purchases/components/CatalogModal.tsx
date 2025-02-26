import React, { useState } from 'react';
import { X, Shell, Fish, Crab, Package, Check, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Product {
  id: string;
  name: string;
  type: 'moules' | 'palourdes' | 'crevettes';
  price: number;
  unit: string;
  minOrder: number;
  stock: number;
}

const CATALOG: Product[] = [
  {
    id: 'M001',
    name: 'Moules de Bouchot AOP',
    type: 'moules',
    price: 4.50,
    unit: 'kg',
    minOrder: 100,
    stock: 2500
  },
  {
    id: 'M002',
    name: 'Moules de Hollande',
    type: 'moules',
    price: 3.80,
    unit: 'kg',
    minOrder: 150,
    stock: 3000
  },
  {
    id: 'P001',
    name: 'Palourdes Grises',
    type: 'palourdes',
    price: 12.90,
    unit: 'kg',
    minOrder: 50,
    stock: 800
  }
];

type OrderStatus = 'reçu' | 'validé' | 'en cours d\'envoi' | 'livré';

interface Order {
  productId: string;
  quantity: number;
  status: OrderStatus;
}

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CatalogModal({ isOpen, onClose }: CatalogModalProps) {
  const [selectedType, setSelectedType] = useState<'all' | 'moules' | 'palourdes' | 'crevettes'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredProducts = selectedType === 'all' 
    ? CATALOG 
    : CATALOG.filter(p => p.type === selectedType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'moules': return <Shell className="w-5 h-5" />;
      case 'palourdes': return <Fish className="w-5 h-5" />;
      case 'crevettes': return <Crab className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'reçu': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'validé': return <Check className="w-5 h-5 text-green-400" />;
      case 'en cours d\'envoi': return <Truck className="w-5 h-5 text-yellow-400" />;
      case 'livré': return <Check className="w-5 h-5 text-brand-burgundy" />;
      default: return null;
    }
  };

  const handleOrder = (product: Product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity >= product.minOrder) {
      setOrders([...orders, {
        productId: product.id,
        quantity,
        status: 'reçu'
      }]);
      // Reset quantity
      setQuantities({ ...quantities, [product.id]: 0 });
    }
  };

  // Simuler le changement de statut toutes les 5 secondes
  React.useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          switch (order.status) {
            case 'reçu': return { ...order, status: 'validé' };
            case 'validé': return { ...order, status: 'en cours d\'envoi' };
            case 'en cours d\'envoi': return { ...order, status: 'livré' };
            default: return order;
          }
        })
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      {/* Modal */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl w-[1000px] max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Catalogue CDB</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg">
            <X className="w-6 h-6 text-white/60" />
          </button>
        </div>

        <div className="flex h-[calc(80vh-65px)]">
          {/* Catalogue */}
          <div className="flex-1 p-4 overflow-y-auto border-r border-white/10">
            {/* Filtres */}
            <div className="flex space-x-2 mb-4">
              {['all', 'moules', 'palourdes', 'crevettes'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as typeof selectedType)}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-2 ${
                    selectedType === type
                      ? 'bg-brand-burgundy text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {type !== 'all' && getIcon(type)}
                  <span>
                    {type === 'all' ? 'Tous' : type}
                  </span>
                </button>
              ))}
            </div>

            {/* Liste des produits */}
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/5 rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        {getIcon(product.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{product.name}</h3>
                        <p className="text-sm text-white/60">
                          Min. {product.minOrder} {product.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {product.price.toFixed(2)}€
                      </div>
                      <div className="text-sm text-white/60">
                        /{product.unit}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min={0}
                      max={product.stock}
                      value={quantities[product.id] || 0}
                      onChange={(e) => setQuantities({
                        ...quantities,
                        [product.id]: Math.max(0, parseInt(e.target.value) || 0)
                      })}
                      className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="Quantité"
                    />
                    <Button
                      onClick={() => handleOrder(product)}
                      disabled={(quantities[product.id] || 0) < product.minOrder}
                      variant="primary"
                    >
                      Commander
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commandes en cours */}
          <div className="w-[300px] p-4 overflow-y-auto">
            <h3 className="font-medium text-white mb-4">Commandes en cours</h3>
            <div className="space-y-3">
              {orders.map((order, index) => {
                const product = CATALOG.find(p => p.id === order.productId);
                if (!product) return null;

                return (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {product.name}
                      </span>
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="text-sm text-white/60">
                      {order.quantity} {product.unit}
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded bg-white/5 text-white/80">
                      {order.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
