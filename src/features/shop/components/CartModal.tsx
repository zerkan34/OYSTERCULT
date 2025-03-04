import { X } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface CartModalProps {
  products: any[];
  onClose: () => void;
}

export function CartModal({ products, onClose }: CartModalProps) {
  const { cartItems, removeFromCart, clearCart, validateCart } = useCart();

  const cartProducts = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...product,
      quantity: item.quantity
    };
  });

  const totalPrice = cartProducts.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[rgb(var(--color-brand-surface))] p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">Panier</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgb(var(--color-brand-surface-hover))] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-[rgb(var(--color-text-secondary))] py-4">
            Votre panier est vide
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {cartProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-[rgb(var(--color-brand-surface-hover))] rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-[rgb(var(--color-text-primary))]">{item.name}</h3>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                      Quantité: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:bg-[rgb(var(--color-brand-surface))] rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-[rgb(var(--color-text-primary))]">Total</span>
                <span className="font-medium text-[rgb(var(--color-text-primary))]">
                  {totalPrice.toFixed(2)}€
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    clearCart();
                    const cartBubble = document.querySelector('.cart-bubble');
                    if (cartBubble) cartBubble.remove();
                  }}
                  className="flex-1 px-4 py-2 bg-[rgb(var(--color-brand-surface-hover))] text-[rgb(var(--color-text-primary))] rounded-lg hover:bg-[rgb(var(--color-brand-surface-hover))/0.8] transition-colors"
                >
                  Vider le panier
                </button>
                <button
                  onClick={() => {
                    validateCart();
                    const cartBubble = document.querySelector('.cart-bubble');
                    if (cartBubble) cartBubble.remove();
                  }}
                  className="flex-1 px-4 py-2 bg-[rgb(var(--color-brand-primary))] text-white rounded-lg hover:bg-[rgb(var(--color-brand-primary))/0.8] transition-colors"
                >
                  Commander
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
