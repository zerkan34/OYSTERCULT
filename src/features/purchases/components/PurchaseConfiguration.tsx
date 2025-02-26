import React, { useState } from 'react';
import { Package, Shell, Fish, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';

interface Supplier {
  id: string;
  name: string;
  address: string;
  contact: string;
  preferredProducts: string[];
  lastDelivery: string;
  reliability: number;
  status: 'active' | 'pending';
}

interface Product {
  id: string;
  name: string;
  type: 'moules' | 'palourdes';
  price: number;
  unit: string;
  minOrder: number;
  description: string;
  origin: string;
  calibre?: string;
  conservation?: string;
  certification?: string[];
}

const PRODUCTS: Product[] = [
  {
    id: 'M001',
    name: 'Moules de Méditerranée',
    type: 'moules',
    price: 4.50,
    unit: 'kg',
    minOrder: 100,
    description: 'Moules de Méditerranée, chair généreuse et iodée',
    origin: 'Méditerranée',
    calibre: '40-50 pièces/kg',
    conservation: '5 jours entre 2°C et 5°C',
    certification: ['Label Rouge', 'Pêche Durable']
  },
  {
    id: 'P001',
    name: 'Palourdes de l\'étang de Thau',
    type: 'palourdes',
    price: 12.90,
    unit: 'kg',
    minOrder: 50,
    description: 'Palourdes sauvages de l\'étang de Thau, qualité exceptionnelle',
    origin: 'Étang de Thau',
    calibre: '20-30 pièces/kg',
    conservation: '7 jours entre 2°C et 5°C',
    certification: ['Pêche Artisanale', 'Produit en Occitanie']
  }
];

export function PurchaseConfiguration() {
  const [showCatalog, setShowCatalog] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(0);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [showProductDetails, setShowProductDetails] = useState<string | null>(null);

  // Liste des fournisseurs
  const SUPPLIERS: Supplier[] = [
    { 
      id: 'CDB',
      name: 'CDB - Coquillages De Bretagne', 
      address: '12 Quai des Marées, 56000 Vannes', 
      contact: '02.97.54.32.10', 
      preferredProducts: ['Moules', 'Palourdes'],
      lastDelivery: '2025-02-24',
      reliability: 97,
      status: 'active'
    },
    { 
      id: '1', 
      name: 'Fournisseur A', 
      address: '123 Rue de la Mer', 
      contact: '0123456789', 
      preferredProducts: ['Huîtres', 'Palourdes'],
      lastDelivery: '2025-02-20',
      reliability: 98,
      status: 'active'
    }
  ];

  const handleOrder = (product: Product) => {
    setSelectedProduct(product);
    setOrderQuantity(product.minOrder);
    setShowOrderModal(true);
  };

  const handleConfirmOrder = () => {
    // Ici on pourrait envoyer la commande à l'API
    console.log('Commande confirmée:', {
      product: selectedProduct?.name,
      quantity: orderQuantity,
      total: (selectedProduct?.price || 0) * orderQuantity
    });
    setShowOrderModal(false);
    setSelectedProduct(null);
    setOrderQuantity(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'moules': return <Shell className="w-5 h-5" />;
      case 'palourdes': return <Fish className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Liste des fournisseurs */}
      <div className="grid gap-4">
        {SUPPLIERS.map((supplier) => (
          <div key={supplier.id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-white">{supplier.name}</h3>
                <p className="text-sm text-white/60">{supplier.address}</p>
                <div className="mt-2 flex items-center text-sm text-white/60">
                  <Package className="w-4 h-4 mr-2" />
                  {supplier.preferredProducts.join(', ')}
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelectedSupplierId(supplier.id);
                  setShowCatalog(true);
                }}
                className="bg-brand-burgundy hover:bg-brand-burgundy/80"
              >
                Commander
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal du catalogue */}
      {showCatalog && selectedSupplierId === 'CDB' && (
        <Dialog
          open={showCatalog}
          onClose={() => {
            setShowCatalog(false);
            setSelectedSupplierId(null);
          }}
          title="Catalogue CDB"
        >
          <div className="bg-white/5 p-6 rounded-lg space-y-6">
            {/* En-tête avec description */}
            <div className="text-center pb-4 border-b border-white/10">
              <h3 className="text-xl font-medium text-white">Produits de la Mer</h3>
              <p className="text-sm text-white/60 mt-1">
                Sélection de produits frais de qualité, pêchés de manière responsable
              </p>
            </div>

            {/* Grille de produits */}
            <div className="grid grid-cols-2 gap-6">
              {PRODUCTS.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-brand-burgundy/20 rounded-lg">
                          {getIcon(product.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-white">{product.name}</h4>
                          <p className="text-sm text-white/60">{product.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowProductDetails(product.id)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Info size={20} className="text-white/60" />
                      </button>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Prix</span>
                        <span className="text-lg font-bold text-white">
                          {product.price.toFixed(2)}€/{product.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Minimum</span>
                        <span className="text-sm text-white/80">
                          {product.minOrder} {product.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Origine</span>
                        <span className="text-sm text-white/80">{product.origin}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button 
                        onClick={() => handleOrder(product)} 
                        className="w-full bg-brand-burgundy hover:bg-brand-burgundy/80"
                      >
                        Commander
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Dialog>
      )}

      {/* Modal des détails du produit */}
      {showProductDetails && (
        <Dialog
          open={!!showProductDetails}
          onClose={() => setShowProductDetails(null)}
          title="Détails du produit"
        >
          {(() => {
            const product = PRODUCTS.find(p => p.id === showProductDetails);
            if (!product) return null;

            return (
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-brand-burgundy/20 rounded-lg">
                      {getIcon(product.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{product.name}</h4>
                      <p className="text-sm text-white/60">{product.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h5 className="font-medium text-white mb-2">Caractéristiques</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/60">Calibre</span>
                        <span className="text-sm text-white">{product.calibre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/60">Conservation</span>
                        <span className="text-sm text-white">{product.conservation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg">
                    <h5 className="font-medium text-white mb-2">Certifications</h5>
                    <div className="flex flex-wrap gap-2">
                      {product.certification?.map((cert, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-brand-burgundy/20 rounded text-sm text-white"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleOrder(product)}>
                    Commander
                  </Button>
                </div>
              </div>
            );
          })()}
        </Dialog>
      )}

      {/* Modal de commande */}
      {showOrderModal && selectedProduct && (
        <Dialog
          open={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedProduct(null);
          }}
          title={`Commander ${selectedProduct.name}`}
        >
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-burgundy/20 rounded-lg">
                  {getIcon(selectedProduct.type)}
                </div>
                <div>
                  <h4 className="font-medium text-white">{selectedProduct.name}</h4>
                  <p className="text-sm text-white/60">{selectedProduct.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60">Quantité (en {selectedProduct.unit})</label>
              <Input
                type="number"
                min={selectedProduct.minOrder}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                className="bg-white/5"
              />
              <p className="text-xs text-white/40">
                Minimum: {selectedProduct.minOrder} {selectedProduct.unit}
              </p>
            </div>

            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Total</span>
                <span className="text-lg font-bold text-white">
                  {(selectedProduct.price * orderQuantity).toFixed(2)}€
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedProduct(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleConfirmOrder}
                disabled={orderQuantity < selectedProduct.minOrder}
                className="bg-brand-burgundy hover:bg-brand-burgundy/80"
              >
                Confirmer la commande
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
