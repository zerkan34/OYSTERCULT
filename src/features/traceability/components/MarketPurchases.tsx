import React, { useState } from 'react';
import { Package, Calendar, AlertTriangle, Clock, Tag, X, Edit2, Save, MessageCircle, Star } from 'lucide-react';
import { Input } from '@/components/ui/Input';

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
  fresh: 'bg-blue-400/20 text-blue-300',
  warning: 'bg-blue-500/30 text-blue-400',
  expired: 'bg-blue-600/20 text-blue-400'
};

export function MarketPurchases() {
  const [selectedPurchase, setSelectedPurchase] = useState<MarketPurchase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPurchase, setEditedPurchase] = useState<MarketPurchase | null>(null);

  const handleEdit = () => {
    setEditedPurchase(selectedPurchase);
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editedPurchase) {
      // Dans un environnement réel, nous ferions un appel API ici
      const updatedPurchases = mockPurchases.map(purchase => 
        purchase.id === editedPurchase.id ? editedPurchase : purchase
      );
      // Mettre à jour le state global (à implémenter avec un vrai backend)
      setSelectedPurchase(editedPurchase);
      setIsEditModalOpen(false);
      setEditedPurchase(null);
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setEditedPurchase(null);
  };

  const handleInputChange = (field: keyof MarketPurchase, value: string | number) => {
    if (editedPurchase) {
      setEditedPurchase({
        ...editedPurchase,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockPurchases.map((purchase) => (
          <div
            key={purchase.id}
            onClick={() => setSelectedPurchase(purchase)}
            className={`bg-white/5 border border-blue-400/50 rounded-lg p-6 hover:border-blue-400/70 transition-colors cursor-pointer shadow-[0_0_5px_rgba(59,130,246,0.2)]`}
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

      {selectedPurchase && !isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-3xl bg-[rgb(var(--color-card))/95] border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-lg rounded-xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Détails de l'achat</h2>
              <button
                onClick={() => setSelectedPurchase(null)}
                className="p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="text-white/60" size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-white/40">Produit</p>
                <p className="text-sm text-white mt-1">{selectedPurchase.type}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Fournisseur</p>
                <p className="text-sm text-white mt-1">{selectedPurchase.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Quantité</p>
                <p className="text-sm text-white mt-1">{selectedPurchase.quantity} {selectedPurchase.unit}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Date d'achat</p>
                <p className="text-sm text-white mt-1">{new Date(selectedPurchase.purchaseDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Date d'expiration</p>
                <p className="text-sm text-white mt-1">{new Date(selectedPurchase.expiryDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Emplacement de stockage</p>
                <p className="text-sm text-white mt-1">{selectedPurchase.storageLocation}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Numéro de lot</p>
                <p className="text-sm text-white mt-1">{selectedPurchase.batchNumber}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Prix unitaire</p>
                <p className="text-sm text-white mt-1">{selectedPurchase.price}€/{selectedPurchase.unit}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Qualité</p>
                <p className="text-sm text-white mt-1">{selectedPurchase.quality}%</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-brand-burgundy hover:bg-brand-burgundy/90 rounded-lg text-white transition-colors"
              >
                <Edit2 size={20} className="mr-2" />
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editedPurchase && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-3xl bg-[rgb(var(--color-card))/95] border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-lg rounded-xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Modifier l'achat</h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="text-white/60" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Type</label>
                  <Input
                    type="text"
                    value={editedPurchase.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Fournisseur</label>
                  <Input
                    type="text"
                    value={editedPurchase.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Quantité</label>
                  <Input
                    type="number"
                    value={editedPurchase.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Unité</label>
                  <Input
                    type="text"
                    value={editedPurchase.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Date d'achat</label>
                  <Input
                    type="date"
                    value={editedPurchase.purchaseDate}
                    onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Date d'expiration</label>
                  <Input
                    type="date"
                    value={editedPurchase.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Emplacement de stockage</label>
                  <Input
                    type="text"
                    value={editedPurchase.storageLocation}
                    onChange={(e) => handleInputChange('storageLocation', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Numéro de lot</label>
                  <Input
                    type="text"
                    value={editedPurchase.batchNumber}
                    onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Prix unitaire (€)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editedPurchase.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Qualité (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editedPurchase.quality}
                    onChange={(e) => handleInputChange('quality', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Statut</label>
                <select
                  value={editedPurchase.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="fresh">Frais</option>
                  <option value="warning">À surveiller</option>
                  <option value="expired">Périmé</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-brand-burgundy hover:bg-brand-burgundy/90 rounded-lg text-white transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}