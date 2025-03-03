import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import type { SupplierProduct } from '@/types/supplier';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ product: SupplierProduct; quantity: number }>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function CartModal({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartModalProps) {
  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-end p-4 z-50">
      <div className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg w-full max-w-md h-[calc(100vh-2rem)] flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text))]">Panier</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg text-[rgb(var(--color-text-secondary))]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-[rgb(var(--color-text-secondary))]">
              Votre panier est vide
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div 
                key={product.id}
                className="bg-[rgb(var(--color-brand-surface))] p-4 rounded-lg border border-[rgb(var(--color-border)_/_var(--color-border-opacity))]"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-[rgb(var(--color-text))]">{product.name}</h3>
                  <button
                    onClick={() => onRemoveItem(product.id)}
                    className="p-1 text-[rgb(var(--color-text-secondary))] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(product.id, Math.max(product.min_order_quantity, quantity - 1))}
                      className="p-1 hover:bg-white/5 rounded text-[rgb(var(--color-text-secondary))]"
                      disabled={quantity <= product.min_order_quantity}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center text-[rgb(var(--color-text))]">{quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                      className="p-1 hover:bg-white/5 rounded text-[rgb(var(--color-text-secondary))]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[rgb(var(--color-text))]">{(product.price * quantity).toFixed(2)}€</p>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                      {product.price.toFixed(2)}€ / {product.unit}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))] p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[rgb(var(--color-text))] font-medium">Total</span>
              <span className="text-[rgb(var(--color-text))] font-medium">{total.toFixed(2)}€</span>
            </div>
            <button
              className="w-full py-3 bg-[rgb(var(--color-brand-primary))] text-white rounded-lg hover:bg-[rgb(var(--color-brand-primary)_/_0.9)] transition-colors"
            >
              Valider la commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
