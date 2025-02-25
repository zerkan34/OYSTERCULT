import React, { useState } from 'react';
import { Calendar, MapPin, Truck, Plus, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Dialog } from '@/components/ui/Dialog';

interface Supplier {
  id: string;
  name: string;
  address: string;
  contact: string;
  preferredProducts: string[];
}

interface Product {
  id: string;
  name: string;
  supplier: string;
  expiryDate: string;
  storageLocation: string;
  quantity: number;
  unit: string;
  price: number;
  batchNumber: string;
}

export function PurchaseConfiguration() {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const mockSuppliers: Supplier[] = [
    { id: '1', name: 'Fournisseur A', address: '123 Rue de la Mer', contact: '0123456789', preferredProducts: ['Huîtres'] },
    { id: '2', name: 'Fournisseur B', address: '456 Avenue des Algues', contact: '9876543210', preferredProducts: ['Moules'] }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Gestion des Achats</h2>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center bg-brand-primary hover:bg-brand-primary/90"
        >
          <Plus size={20} className="mr-2" />
          Nouveau Produit
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
        />
      </div>

      {/* Liste des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-white">{supplier.name}</h3>
                <div className="mt-1 text-sm text-white/60 space-y-1">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {supplier.address}
                  </div>
                  <div className="flex items-center">
                    <Truck size={16} className="mr-2" />
                    {supplier.preferredProducts.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout de produit */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        title="Ajouter un nouveau produit"
      >
        <div className="space-y-4">
          <Input
            label="Nom du produit"
            value={product.name || ''}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
          <Select
            label="Fournisseur"
            value={product.supplier || ''}
            onChange={(value) => setProduct({ ...product, supplier: value })}
            options={mockSuppliers.map(s => ({ label: s.name, value: s.id }))}
          />
          <DatePicker
            label="Date d'expiration"
            value={product.expiryDate || ''}
            onChange={(date) => setProduct({ ...product, expiryDate: date })}
          />
          <Input
            label="Emplacement de stockage"
            value={product.storageLocation || ''}
            onChange={(e) => setProduct({ ...product, storageLocation: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantité"
              type="number"
              value={product.quantity?.toString() || ''}
              onChange={(e) => setProduct({ ...product, quantity: parseInt(e.target.value) })}
            />
            <Input
              label="Unité"
              value={product.unit || ''}
              onChange={(e) => setProduct({ ...product, unit: e.target.value })}
            />
          </div>
          <Input
            label="Prix"
            type="number"
            value={product.price?.toString() || ''}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
          />
          <Input
            label="Numéro de lot"
            value={product.batchNumber || ''}
            onChange={(e) => setProduct({ ...product, batchNumber: e.target.value })}
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={() => setShowAddDialog(false)}
              className="bg-white/10 hover:bg-white/20"
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                // Logique de sauvegarde
                setShowAddDialog(false);
              }}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
