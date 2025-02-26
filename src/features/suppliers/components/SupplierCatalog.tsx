import React, { useState } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { useSupplierProducts } from '../hooks/useSupplierProducts';
import { ProductForm } from './ProductForm';
import { ProductCard } from './ProductCard';
import type { Supplier, SupplierProduct } from '@/types/supplier';

export function SupplierCatalog() {
  const { suppliers } = useSuppliers();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null);
  const { products, isLoading } = useSupplierProducts(selectedSupplier?.id);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-9 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-xs">
            <select
              value={selectedSupplier?.id || ''}
              onChange={(e) => {
                const supplier = suppliers.find(s => s.id === e.target.value);
                setSelectedSupplier(supplier || null);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Ajouter un produit
            </button>
          )}
        </div>

        {selectedSupplier ? (
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => setEditingProduct(product)}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Sélectionnez un fournisseur pour voir son catalogue
          </div>
        )}
      </div>

      <div className="col-span-3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow sticky top-4">
          <h3 className="text-lg font-medium mb-4">Panier</h3>
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {(product.price * quantity).toFixed(2)}€
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => updateCartQuantity(product.id, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 border rounded"
                    />
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium">
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
                  toast.success('Commande envoyée avec succès');
                  setCartItems([]);
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mt-4"
              >
                Commander
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Votre panier est vide</p>
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
