import React, { useState, useEffect } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { useSupplierProducts } from '../hooks/useSupplierProducts';
import { ProductForm } from './ProductForm';
import { ProductCard } from './ProductCard';
import { Package2, Search, Filter, AlertCircle } from 'lucide-react';
import type { Supplier, SupplierProduct } from '@/types/supplier';

export function SupplierCatalog() {
  const { suppliers } = useSuppliers();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null);
  const { products, isLoading } = useSupplierProducts(selectedSupplier?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [cartItems, setCartItems] = useState<Array<{ product: SupplierProduct; quantity: number }>>([]);

  const addToCart = (product: SupplierProduct, quantity: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Catégories disponibles basées sur les produits
  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  // Filtrer les produits en fonction du terme de recherche et de la catégorie
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--color-brand-primary))]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-9 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 max-w-xs">
            <select
              value={selectedSupplier?.id || ''}
              onChange={(e) => {
                const supplier = suppliers.find(s => s.id === e.target.value);
                setSelectedSupplier(supplier || null);
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="w-full px-4 py-3 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg focus:border-[rgb(var(--color-brand-primary))] text-[rgb(var(--color-text))] focus:outline-none"
            >
              <option value="">Sélectionner un fournisseur</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {selectedSupplier && (
            <>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg focus:border-[rgb(var(--color-brand-primary))] text-[rgb(var(--color-text))] focus:outline-none"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-10 py-3 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg focus:border-[rgb(var(--color-brand-primary))] text-[rgb(var(--color-text))] focus:outline-none appearance-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Toutes catégories' : category}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]" />
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-3 bg-[rgb(var(--color-brand-primary))] text-white rounded-lg hover:bg-[rgb(var(--color-brand-primary)_/_0.9)] transition-colors shadow-md hover:shadow-lg"
              >
                Ajouter un produit
              </button>
            </>
          )}
        </div>

        {selectedSupplier ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[rgb(var(--color-text))]">Catalogue de {selectedSupplier.name}</h2>
              <span className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={() => setEditingProduct(product)}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-[rgb(var(--color-brand-primary)_/_0.1)] rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-[rgb(var(--color-brand-primary))]" />
                </div>
                <h3 className="text-lg font-medium text-[rgb(var(--color-text))] mb-2">Aucun produit trouvé</h3>
                <p className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] max-w-md">
                  {searchTerm 
                    ? `Aucun produit ne correspond à "${searchTerm}". Essayez une autre recherche.` 
                    : 'Aucun produit disponible dans cette catégorie.'}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-[rgb(var(--color-brand-primary)_/_0.1)] rounded-full flex items-center justify-center mb-4">
              <Package2 className="w-8 h-8 text-[rgb(var(--color-brand-primary))]" />
            </div>
            <h3 className="text-lg font-medium text-[rgb(var(--color-text))] mb-2">Sélectionnez un fournisseur</h3>
            <p className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] max-w-md">
              Veuillez choisir un fournisseur dans la liste pour voir son catalogue de produits.
            </p>
          </div>
        )}
      </div>

      <div className="col-span-3">
        <div className="bg-[rgb(var(--color-brand-surface)_/_0.5)] backdrop-blur-sm p-4 rounded-lg shadow-md border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] sticky top-4">
          <h3 className="text-lg font-medium mb-4 text-[rgb(var(--color-text))]">Panier</h3>
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-[rgb(var(--color-brand-surface))] rounded-lg border border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
                  <div className="flex-1">
                    <p className="font-medium text-[rgb(var(--color-text))]">{product.name}</p>
                    <p className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                      {(product.price * quantity).toFixed(2)}€
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => updateCartQuantity(product.id, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg text-[rgb(var(--color-text))] focus:border-[rgb(var(--color-brand-primary))] focus:outline-none"
                    />
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-[rgb(var(--color-text-danger))] hover:text-[rgb(var(--color-text-danger)_/_0.8)] w-6 h-6 flex items-center justify-center rounded-full hover:bg-[rgb(var(--color-text-danger)_/_0.1)]"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))] pt-4 mt-4">
                <div className="flex justify-between font-medium text-[rgb(var(--color-text))]">
                  <span>Total</span>
                  <span>
                    {cartItems
                      .reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)
                      .toFixed(2)}
                    €
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  // TODO: Implement order creation
                  alert('Commande envoyée avec succès');
                  setCartItems([]);
                }}
                className="w-full px-4 py-3 bg-[rgb(var(--color-brand-primary))] hover:bg-[rgb(var(--color-brand-primary)_/_0.9)] text-white rounded-lg transition-colors shadow-md hover:shadow-lg mt-4"
              >
                Commander
              </button>
            </div>
          ) : (
            <div className="bg-[rgb(var(--color-brand-surface))] rounded-lg border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] p-4 text-center">
              <p className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">Votre panier est vide</p>
            </div>
          )}
        </div>
      </div>

      {(showAddProduct || editingProduct) && selectedSupplier && (
        <ProductForm
          supplierId={selectedSupplier.id}
          product={editingProduct}
          onClose={() => {
            setShowAddProduct(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
