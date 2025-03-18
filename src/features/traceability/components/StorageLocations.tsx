import React, { useState } from 'react';
import { 
  Droplets, 
  ThermometerSun, 
  Package, 
  Map, 
  Plus, 
  X,
  Edit2,
  Save
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Input } from '@/components/ui/Input';

interface StorageProduct {
  id: string;
  name: string;
  quantity: string;
  arrivalDate: string;
  expiryDate: string;
}

interface StorageData {
  [key: string]: StorageProduct[];
}

export function StorageLocations() {
  const [selectedStorageLocation, setSelectedStorageLocation] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState<StorageProduct | null>(null);
  const [storageData, setStorageData] = useState<StorageData>({
    'Frigo 1': [
      { id: 'F1-01', name: 'Huîtres Fines de Claire', quantity: '50kg', arrivalDate: '2025-02-25', expiryDate: '2025-03-10' },
      { id: 'F1-02', name: 'Moules de Bouchot', quantity: '25kg', arrivalDate: '2025-03-01', expiryDate: '2025-03-08' },
      { id: 'F1-03', name: 'Palourdes', quantity: '15kg', arrivalDate: '2025-02-28', expiryDate: '2025-03-07' }
    ],
    'Frigo 2': [
      { id: 'F2-01', name: 'Huîtres Spéciales', quantity: '75kg', arrivalDate: '2025-03-02', expiryDate: '2025-03-15' },
      { id: 'F2-02', name: 'Coques', quantity: '30kg', arrivalDate: '2025-03-03', expiryDate: '2025-03-10' }
    ],
    'Chambre froide': [
      { id: 'CF-01', name: 'Huîtres Plates', quantity: '100kg', arrivalDate: '2025-02-20', expiryDate: '2025-03-05' },
      { id: 'CF-02', name: 'Moules', quantity: '80kg', arrivalDate: '2025-02-22', expiryDate: '2025-03-08' }
    ]
  });

  const handleEdit = (product: StorageProduct) => {
    setEditedProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editedProduct && selectedStorageLocation) {
      const updatedStorageData = { ...storageData };
      const locationProducts = updatedStorageData[selectedStorageLocation];
      const productIndex = locationProducts.findIndex(p => p.id === editedProduct.id);
      
      if (productIndex !== -1) {
        locationProducts[productIndex] = editedProduct;
        setStorageData(updatedStorageData);
      }
      
      setIsEditModalOpen(false);
      setEditedProduct(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(storageData).map(([location, products]) => (
          <AnimatedCard
            key={location}
            onClick={() => setSelectedStorageLocation(location)}
            className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-4 cursor-pointer hover:shadow-lg transition-all rounded-xl hover:bg-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{location}</h3>
                <p className="text-sm text-white/60">{products.length} produits</p>
              </div>
              <ThermometerSun className="w-5 h-5 text-teal-400" />
            </div>

            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="bg-white/5 p-2 rounded-lg border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white">{product.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}
                      className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white/80 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-white/60">{product.quantity}</span>
                    <span className="text-xs text-white/40">
                      Exp. {new Date(product.expiryDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        ))}
      </div>

      {isEditModalOpen && editedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl p-6 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Modifier le produit</h2>
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
                  Nom du produit
                </label>
                <Input
                  value={editedProduct.name}
                  onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Quantité
                </label>
                <Input
                  value={editedProduct.quantity}
                  onChange={(e) => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Date d'expiration
                </label>
                <Input
                  type="date"
                  value={editedProduct.expiryDate}
                  onChange={(e) => setEditedProduct({ ...editedProduct, expiryDate: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

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
