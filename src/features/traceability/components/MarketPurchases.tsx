import React, { useState } from 'react';
import { Package, Calendar, AlertTriangle, Clock, Tag, X } from 'lucide-react';

interface MarketPurchase {
  id: string;
  type: string;
  supplier: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
  storageLocation: string;
  status: 'fresh' | 'warning' | 'expired';
  batchNumber: string;
  price: number;
  quality: number;
}

const mockPurchases: MarketPurchase[] = [
  {
    id: '1',
    type: 'Palourdes',
    supplier: 'Mareyeur Express',
    quantity: 500,
    unit: 'kg',
    purchaseDate: '2025-02-18',
    expiryDate: '2025-02-25',
    storageLocation: 'Bassin A3',
    status: 'fresh',
    batchNumber: 'PAL-2025-001',
    price: 12.50,
    quality: 95
  },
  {
    id: '2',
    type: 'Moules',
    supplier: 'Fruits de Mer Pro',
    quantity: 300,
    unit: 'kg',
    purchaseDate: '2025-02-17',
    expiryDate: '2025-02-22',
    storageLocation: 'Bassin B1',
    status: 'warning',
    batchNumber: 'MOU-2025-002',
    price: 8.75,
    quality: 88
  }
];

const statusColors = {
  fresh: 'bg-green-500/20 text-green-300',
  warning: 'bg-yellow-500/20 text-yellow-300',
  expired: 'bg-blue-500/20 text-blue-300'
};

export function MarketPurchases() {
  const [selectedPurchase, setSelectedPurchase] = useState<MarketPurchase | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockPurchases.map((purchase) => (
          <div
            key={purchase.id}
            onClick={() => setSelectedPurchase(purchase)}
            className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-brand-burgundy/20 flex items-center justify-center">
                  <Package size={20} className="text-brand-burgundy" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{purchase.type}</h3>
                  <div className="text-sm text-white/60">{purchase.supplier}</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs ${statusColors[purchase.status]}`}>
                {purchase.status === 'fresh' ? 'Frais' :
                 purchase.status === 'warning' ? 'À surveiller' : 'Périmé'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60">Quantité</div>
                <div className="text-lg font-medium text-white">
                  {purchase.quantity} {purchase.unit}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/60">DLC</div>
                <div className="text-lg font-medium text-white">
                  {new Date(purchase.expiryDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-white/60">
                <Tag size={16} className="mr-2" />
                Lot: {purchase.batchNumber}
              </div>
              <div className="flex items-center text-white/60">
                <Package size={16} className="mr-2" />
                Stockage: {purchase.storageLocation}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{selectedPurchase.type}</h3>
              <button
                onClick={() => setSelectedPurchase(null)}
                className="text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/60">Prix unitaire</div>
                  <div className="text-2xl font-bold text-white">
                    {selectedPurchase.price}€/{selectedPurchase.unit}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/60">Qualité</div>
                  <div className="text-2xl font-bold text-white">
                    {selectedPurchase.quality}%
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/60">Total</div>
                  <div className="text-2xl font-bold text-white">
                    {(selectedPurchase.price * selectedPurchase.quantity).toFixed(2)}€
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-2">Dates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Achat:</span>
                      <span className="text-white">
                        {new Date(selectedPurchase.purchaseDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">DLC:</span>
                      <span className="text-white">
                        {new Date(selectedPurchase.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-2">Stockage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Emplacement:</span>
                      <span className="text-white">{selectedPurchase.storageLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Lot:</span>
                      <span className="text-white">{selectedPurchase.batchNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedPurchase(null)}
                  className="px-4 py-2 bg-white/10 rounded-lg text-white"
                >
                  Fermer
                </button>
                <button
                  className="px-4 py-2 bg-brand-burgundy rounded-lg text-white"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}