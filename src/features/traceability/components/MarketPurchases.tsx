import React, { useState } from 'react';
import { Package, Calendar, AlertTriangle, Clock, Tag, X, Edit2, Save, MessageCircle, Star } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface Purchase {
  id: string;
  date: string;
  supplier: string;
  products: {
    name: string;
    quantity: string;
    price: number;
  }[];
  totalAmount: number;
  status: 'completed' | 'pending' | 'cancelled';
}

interface Product {
  name: string;
  quantity: string;
  price: number;
}

const mockPurchases: Purchase[] = [
  {
    id: '1',
    date: '2025-03-15',
    supplier: 'Fournisseur A',
    products: [
      { name: 'Huîtres Fines de Claire', quantity: '100kg', price: 800 },
      { name: 'Huîtres Spéciales', quantity: '50kg', price: 500 }
    ],
    totalAmount: 1300,
    status: 'completed'
  },
  // ... autres achats
];

const statusColors = {
  completed: 'bg-green-400/20 text-green-300',
  pending: 'bg-blue-400/20 text-blue-300',
  cancelled: 'bg-red-400/20 text-red-300'
};

export function MarketPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPurchase, setEditedPurchase] = useState<Purchase | null>(null);

  const handleEdit = (purchase: Purchase) => {
    setEditedPurchase({ ...purchase });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editedPurchase) {
      const updatedPurchases = purchases.map(purchase => 
        purchase.id === editedPurchase.id ? editedPurchase : purchase
      );
      setPurchases(updatedPurchases);
      setIsEditModalOpen(false);
      setEditedPurchase(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            onClick={() => setSelectedPurchase(purchase)}
            className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-4 cursor-pointer hover:shadow-lg transition-all rounded-xl hover:bg-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{purchase.supplier}</h3>
                <p className="text-sm text-white/60">
                  {new Date(purchase.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(purchase);
                }}
                className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white/80 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {purchase.products.map((product, index) => (
                <div key={index} className="bg-white/5 p-2 rounded-lg border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white">{product.name}</span>
                    <span className="text-sm text-white/60">{product.quantity}</span>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-sm text-teal-400">{product.price}€</span>
                  </div>
                </div>
              ))}

              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Total</span>
                  <span className="text-sm font-medium text-white">{purchase.totalAmount}€</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && editedPurchase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl p-6 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Modifier l'achat</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Fournisseur
                </label>
                <Input
                  value={editedPurchase.supplier}
                  onChange={(e) => setEditedPurchase({ ...editedPurchase, supplier: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Date
                </label>
                <Input
                  type="date"
                  value={editedPurchase.date}
                  onChange={(e) => setEditedPurchase({ ...editedPurchase, date: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              {editedPurchase.products.map((product, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Produit {index + 1}
                  </label>
                  <Input
                    value={product.name}
                    onChange={(e) => {
                      const updatedProducts = [...editedPurchase.products];
                      updatedProducts[index] = { ...product, name: e.target.value };
                      setEditedPurchase({ ...editedPurchase, products: updatedProducts });
                    }}
                    className="bg-white/5 border-white/10 text-white placeholder-white/40 mb-2"
                    placeholder="Nom du produit"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={product.quantity}
                      onChange={(e) => {
                        const updatedProducts = [...editedPurchase.products];
                        updatedProducts[index] = { ...product, quantity: e.target.value };
                        setEditedPurchase({ ...editedPurchase, products: updatedProducts });
                      }}
                      className="bg-white/5 border-white/10 text-white placeholder-white/40"
                      placeholder="Quantité"
                    />
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) => {
                        const updatedProducts = [...editedPurchase.products];
                        updatedProducts[index] = { ...product, price: Number(e.target.value) };
                        setEditedPurchase({ ...editedPurchase, products: updatedProducts });
                      }}
                      className="bg-white/5 border-white/10 text-white placeholder-white/40"
                      placeholder="Prix"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg"
                >
                  <Save className="w-4 h-4 inline-block mr-2" />
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