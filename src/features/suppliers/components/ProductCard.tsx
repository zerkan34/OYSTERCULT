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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{product.name}</h3>
        <button
          onClick={onEdit}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <Edit2 size={16} />
        </button>
      </div>

      {product.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {product.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm mb-4">
        <span>Prix unitaire:</span>
        <span className="font-medium">{product.price.toFixed(2)}€ / {product.unit}</span>
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
        <span>Quantité minimum:</span>
        <span>{product.min_order_quantity} {product.unit}</span>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          min={product.min_order_quantity}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(product.min_order_quantity, parseInt(e.target.value)))}
          className="w-20 px-2 py-1 border rounded"
        />
        <button
          onClick={() => onAddToCart(product, quantity)}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <ShoppingCart size={16} />
          <span>Ajouter</span>
        </button>
      </div>
    </div>
  );
}
