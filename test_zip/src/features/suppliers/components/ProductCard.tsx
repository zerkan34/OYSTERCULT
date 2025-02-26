import React, { useState } from 'react';
import { Edit2, ShoppingCart } from 'lucide-react';
import type { SupplierProduct } from '@/types/supplier';

interface ProductCardProps {
  product: SupplierProduct;
  onEdit: () => void;
  onAddToCart: (product: SupplierProduct, quantity: number) => void;
}

export function ProductCard({ product, onEdit, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(product.min_order_quantity);

  return (
    <div className="w-[320px] h-[420px] bg-[rgb(var(--color-brand-surface)_/_0.5)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] hover:border-[rgb(var(--color-brand-primary)_/_0.5)] transition-all duration-300">
      <div className="relative">
        {/* En-tête avec dégradé */}
        <div className="h-32 bg-gradient-to-br from-[rgb(var(--color-brand-primary)_/_0.2)] to-[rgb(var(--color-brand-secondary)_/_0.2)] flex items-center justify-center">
          {/* Image du produit ou placeholder */}
          <div className="w-24 h-24 rounded-2xl bg-[rgb(var(--color-brand-surface))] flex items-center justify-center text-3xl font-bold text-[rgb(var(--color-brand-primary))] border-2 border-[rgb(var(--color-brand-primary)_/_0.3)] shadow-xl">
            {product.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 flex flex-col h-[calc(420px-128px)]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-[rgb(var(--color-text))]">{product.name}</h3>
          <button
            onClick={onEdit}
            className="p-1 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] hover:text-[rgb(var(--color-brand-primary))]"
          >
            <Edit2 size={16} />
          </button>
        </div>

        {product.description && (
          <p className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] mb-4">
            {product.description}
          </p>
        )}

        <div className="space-y-3 flex-grow">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">Prix unitaire:</span>
            <span className="font-medium text-[rgb(var(--color-text))]">{product.price.toFixed(2)}€ / {product.unit}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">Quantité minimum:</span>
            <span className="text-[rgb(var(--color-text))]">{product.min_order_quantity} {product.unit}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
          <input
            type="number"
            min={product.min_order_quantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(product.min_order_quantity, parseInt(e.target.value)))}
            className="w-20 px-3 py-2 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg text-[rgb(var(--color-text))]"
          />
          <button
            onClick={() => onAddToCart(product, quantity)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[rgb(var(--color-brand-primary)_/_0.1)] hover:bg-[rgb(var(--color-brand-primary)_/_0.2)] text-[rgb(var(--color-brand-primary))] rounded-lg transition-colors duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Ajouter au panier</span>
          </button>
        </div>
      </div>
    </div>
  );
}
