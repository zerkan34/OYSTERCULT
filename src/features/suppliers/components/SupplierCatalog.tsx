import React, { useState, useEffect } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { useSupplierProducts } from '../hooks/useSupplierProducts';
import { ProductForm } from './ProductForm';
import { ProductCard } from './ProductCard';
import { CartModal } from './CartModal';
import { Package2, Search, Filter, AlertCircle, ShoppingCart } from 'lucide-react';
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
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

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

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCartClick = () => {
    if (cartItems.length > 0) {
      setIsCartModalOpen(true);
    }
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
              <div className="flex items-center gap-4">
                <span className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                  {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
                </span>
                <button
                  className="relative p-2 text-[rgb(var(--color-brand-primary))] hover:bg-[rgb(var(--color-brand-primary)_/_0.1)] rounded-lg transition-colors"
                  onClick={handleCartClick}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[rgb(var(--color-brand-primary))] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>

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
          </>
        ) : (
          <div className="flex items-center justify-center h-96 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <p>Veuillez sélectionner un fournisseur pour voir son catalogue</p>
            </div>
          </div>
        )}
      </div>

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />

      {showAddProduct && (
        <ProductForm
          onClose={() => setShowAddProduct(false)}
          supplierId={selectedSupplier?.id || ''}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          supplierId={selectedSupplier?.id || ''}
        />
      )}
    </div>
  );
}
