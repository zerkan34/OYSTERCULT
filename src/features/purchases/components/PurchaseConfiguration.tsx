import React, { useState } from 'react';
import { ModernCardBase } from '@/components/ui/ModernCardBase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog/index';
import { Plus, Shell, Truck, Euro, Scale, Award, Info, Package, Fish, UserCircle, Phone, Star, Camera, Scan, Upload, X } from 'lucide-react';

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
  type: string;
  price: number;
  unit: string;
  minOrder: number;
  description: string;
  origin: string;
  calibre?: string;
  conservation?: string;
  certification?: string[];
}

const CATALOG: Product[] = [
  {
    id: 'M001',
    name: 'Moules de Méditerranée',
    type: 'moules',
    price: 4.50,
    unit: 'kg',
    minOrder: 100,
    description: 'Moules de Méditerranée, chair généreuse et iodée',
    origin: 'Méditerranée',
    calibre: '40/50',
    conservation: '5 jours',
    certification: ['Label Rouge', 'Pêche durable']
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
    calibre: '20/30',
    conservation: '7 jours',
    certification: ['IGP Thau']
  }
];

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

export function PurchaseConfiguration() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [showProductDetails, setShowProductDetails] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    supplier: '',
    product: '',
    expiryDate: '',
    storageLocation: '',
    invoice: null as File | null
  });

  const handleQuantityChange = (value: string) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty >= 0) {
      setQuantity(qty);
    }
  };

  const calculateTotal = () => {
    if (selectedProduct && quantity) {
      return (selectedProduct.price * quantity).toFixed(2);
    }
    return '0.00';
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'moules': return <Shell className="w-4 h-4" />;
      case 'palourdes': return <Fish className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleConfirmOrder = () => {
    // Ici on pourrait envoyer la commande à l'API
    console.log('Commande confirmée:', {
      product: selectedProduct?.name,
      quantity: quantity,
      total: calculateTotal()
    });
    setSelectedProduct(null);
    setQuantity(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, invoice: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la logique d'envoi
    // 1. Envoyer les données au backend
    // 2. Mettre à jour la traçabilité
    // 3. Mettre à jour la comptabilité
    console.log('Nouveau achat:', { ...formData, rating });
    setShowNewPurchaseModal(false);
    setFormData({
      supplier: '',
      product: '',
      expiryDate: '',
      storageLocation: '',
      invoice: null
    });
    setRating(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Configuration des achats</h2>
        <Button
          onClick={() => setShowNewPurchaseModal(true)}
          className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white"
        >
          <Plus className="w-4 h-4" />
          Nouvel achat
        </Button>
      </div>

      {/* Liste des fournisseurs */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {SUPPLIERS.map((supplier) => (
          <ModernCardBase key={supplier.id} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="relative p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-brand-burgundy" />
                    <h3 className="text-base font-medium text-white">{supplier.name}</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-white/60">{supplier.address}</p>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Phone className="w-4 h-4" />
                      {supplier.contact}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-green-500/20 text-green-500 rounded-lg">
                      Fiabilité {supplier.reliability}%
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-500/20 text-blue-500 rounded-lg">
                      Dernière livraison : {supplier.lastDelivery}
                    </span>
                  </div>
                </div>
                {/* Bouton "Voir catalogue" supprimé */}
              </div>
            </div>
          </ModernCardBase>
        ))}
      </div>

      {/* Catalogue du fournisseur sélectionné */}
      {selectedSupplierId === 'CDB' && (
        <div className="space-y-6">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Catalogue CDB</h2>
              <p className="text-sm text-white/60">Sélectionnez vos produits et passez commande</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau produit
            </Button>
          </div>

          {/* Grille de produits */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {CATALOG.map((product) => (
              <ModernCardBase
                key={product.id}
                className={`relative overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedProduct?.id === product.id 
                    ? 'ring-2 ring-brand-burgundy ring-offset-2 ring-offset-black' 
                    : 'hover:bg-white/5'
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <div className="relative p-4">
                  {/* En-tête du produit */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-medium text-white">{product.name}</h3>
                      <p className="text-sm text-white/60">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-brand-burgundy/20 rounded-lg">
                      {getIcon(product.type)}
                      <span className="text-xs font-medium text-brand-burgundy">{product.type}</span>
                    </div>
                  </div>

                  {/* Caractéristiques */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white">{product.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white">{product.price}€/{product.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white">Min. {product.minOrder}{product.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white">{product.calibre}</span>
                    </div>
                  </div>

                  {/* Certifications */}
                  {product.certification && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                      {product.certification.map((cert, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-lg"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </ModernCardBase>
            ))}
          </div>
        </div>
      )}

      {/* Panneau de commande */}
      {selectedProduct && (
        <ModernCardBase className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="relative p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-white">Commander {selectedProduct.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/60 hover:text-white"
                    onClick={() => setShowProductDetails(selectedProduct.id)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Quantité ({selectedProduct.unit})</label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      min={0}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Total estimé</label>
                    <div className="h-9 px-3 flex items-center bg-white/5 rounded-md border border-white/10">
                      <span className="text-white font-medium">{calculateTotal()}€</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <p className="text-sm text-white/60">
                    Minimum de commande : {selectedProduct.minOrder}{selectedProduct.unit}
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={quantity < selectedProduct.minOrder}
                    className="bg-brand-burgundy hover:bg-brand-burgundy/90"
                    onClick={handleConfirmOrder}
                  >
                    Confirmer la commande
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ModernCardBase>
      )}

      {/* Modal des détails du produit */}
      {showProductDetails && (
        <Dialog open={!!showProductDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails du produit</DialogTitle>
            </DialogHeader>
            {(() => {
              const product = CATALOG.find(p => p.id === showProductDetails);
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
                            className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowProductDetails(null)}
                    >
                      Fermer
                    </Button>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Nouvel Achat */}
      {showNewPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg p-6 w-full max-w-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Nouvel achat</h2>
              <button
                onClick={() => setShowNewPurchaseModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="text-white/60" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Nom du fournisseur</label>
                <Input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Nom du produit</label>
                <Input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">DLC</label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Lieu de stockage</label>
                <Input
                  type="text"
                  value={formData.storageLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, storageLocation: e.target.value }))}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Évaluation du produit</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Facture</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1">
                    <div className="flex items-center justify-center px-4 py-3 border border-dashed border-white/20 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 text-white/60 mr-2" />
                      <span className="text-white/60">Choisir un fichier</span>
                    </div>
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {/* TODO: Implement camera capture */}}
                  >
                    <Camera className="w-4 h-4" />
                    Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {/* TODO: Implement scanner */}}
                  >
                    <Scan className="w-4 h-4" />
                    Scanner
                  </Button>
                </div>
                {formData.invoice && (
                  <p className="mt-2 text-sm text-white/60">
                    Fichier sélectionné : {formData.invoice.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowNewPurchaseModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-blue hover:bg-brand-blue/90"
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
