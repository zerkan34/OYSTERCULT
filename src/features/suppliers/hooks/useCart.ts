import { useState, useEffect } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
}

const CART_STORAGE_KEY = 'oystercult_cart';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Erreur lors du chargement du panier:', e);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  const addToCart = (productId: string, quantity: number) => {
    const newCart = [...cartItems];
    const existingItem = newCart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      newCart.push({ productId, quantity });
    }
    
    setCartItems(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  };

  const removeFromCart = (productId: string) => {
    const newCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(newCart);
    
    if (newCart.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isCartModalOpen,
    setIsCartModalOpen: toggleCartModal,
  };
}
