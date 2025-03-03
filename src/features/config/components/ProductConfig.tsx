import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  sizes: string[];
  unit: string;
  minStock: number;
  maxStock: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Huîtres Plates',
    category: 'Huîtres',
    description: 'Huîtres plates de qualité supérieure',
    sizes: ['2', '3', '4'],
    unit: 'douzaine',
    minStock: 100,
    maxStock: 1000
  },
  {
    id: '2',
    name: 'Huîtres Creuses',
    category: 'Huîtres',
    description: 'Huîtres creuses standard',
    sizes: ['2', '3', '4', '5'],
    unit: 'douzaine',
    minStock: 200,
    maxStock: 2000
  }
];

export function ProductConfig() {
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [products, setProducts] = useState(mockProducts);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowNewProduct(true);
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    setShowDeleteConfirm(null);
  };

  const handleSave = (data: Partial<Product>) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...p, ...data } : p
      ));
    } else {
      // Create new product
      const newProduct = {
        id: crypto.randomUUID(),
        ...data as Product
      };
      setProducts([...products, newProduct]);
    }
    setShowNewProduct(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Configuration des Produits</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowNewProduct(true);
          }}
          className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nouveau produit
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-brand-primary/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                  <Package size={20} className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{product.name}</h3>
                  <p className="text-sm text-white/60 mt-1">{product.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(product)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Edit2 size={20} className="text-white/60" />
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(product.id)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="text-white/60" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Calibres disponibles</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/70"
                    >
                      N°{size}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Gestion du stock</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <div>Stock minimum: {product.minStock} {product.unit}s</div>
                  <div>Stock maximum: {product.maxStock} {product.unit}s</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData.entries());
              handleSave(data as Partial<Product>);
            }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="Ex: Huîtres Plates"
                    defaultValue={editingProduct?.name}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Catégorie
                  </label>
                  <select 
                    name="category"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    defaultValue={editingProduct?.category}
                    required
                  >
                    <option value="huitres">Huîtres</option>
                    <option value="materiels">Matériels</option>
                    <option value="emballages">Emballages</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="Description du produit..."
                  defaultValue={editingProduct?.description}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Calibres disponibles
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1', '2', '3', '4', '5'].map((size) => (
                    <label key={size} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="sizes"
                        value={size}
                        className="w-4 h-4 bg-white/5 border border-white/10 rounded"
                        defaultChecked={editingProduct?.sizes.includes(size)}
                      />
                      <span className="text-white">N°{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Unité
                </label>
                <select
                  name="unit"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  defaultValue={editingProduct?.unit}
                  required
                >
                  <option value="douzaine">Douzaine</option>
                  <option value="piece">Pièce</option>
                  <option value="kg">Kilogramme</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProduct(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  {editingProduct ? 'Mettre à jour' : 'Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-md">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Confirmer la suppression</h3>
                <p className="mt-2 text-sm text-white/70">
                  Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                </p>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}