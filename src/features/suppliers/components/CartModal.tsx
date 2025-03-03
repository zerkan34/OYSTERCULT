import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import type { SupplierProduct } from '@/types/supplier';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  products: SupplierProduct[];
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function CartModal({ isOpen, onClose, items, products, onRemoveItem, onClearCart }: CartModalProps) {
  if (!isOpen) return null;

  const totalPrice = items.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleValidateCart = () => {
    // Enregistrer la commande
    onClearCart();
    onClose();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50" style={{ minHeight: '100vh' }}>
      <div className="bg-[rgb(var(--color-brand-surface))] rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
          <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">Panier</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgb(var(--color-brand-surface-hover))] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
          </button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center text-[rgb(var(--color-text-secondary))]">
              Votre panier est vide
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;

                return (
                  <div key={item.productId} className="flex items-center justify-between gap-4 p-3 bg-[rgb(var(--color-brand-surface-hover))] rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-[rgb(var(--color-text-primary))]">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                        {item.quantity} {product.unit} × {product.price.toFixed(2)}€
                      </p>
                      <p className="text-sm font-medium text-[rgb(var(--color-brand-primary))]">
                        Total: {(item.quantity * product.price).toFixed(2)}€
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="p-2 hover:bg-[rgb(var(--color-brand-surface))] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-[rgb(var(--color-text-primary))]">Total</span>
              <span className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
                {totalPrice.toFixed(2)}€
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={onClearCart}
                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Vider
              </button>
              <button
                onClick={handleValidateCart}
                className="flex-1 px-4 py-2 bg-[rgb(var(--color-brand-primary))] text-white rounded-lg hover:bg-[rgb(var(--color-brand-primary)_/_0.9)] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Valider la commande
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
