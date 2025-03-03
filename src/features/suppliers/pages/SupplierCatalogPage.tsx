import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSuppliers } from '../hooks/useSuppliers';
import { useCart } from '../hooks/useCart';
import { ArrowLeft, ShoppingCart, Package2, Filter, Search, ChevronDown, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { CartModal } from '../components/CartModal';

interface OrderItem {
  productId: string;
  quantity: number;
}

export function SupplierCatalogPage() {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { suppliers, getSupplierProducts } = useSuppliers();
  const { cartItems, addToCart, removeFromCart, clearCart, isCartModalOpen, setIsCartModalOpen, toggleCartModal } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const supplier = suppliers.find(s => s.id === supplierId);

  React.useEffect(() => {
    const loadProducts = async () => {
      if (supplierId) {
        try {
          const supplierProducts = await getSupplierProducts(supplierId);
          setProducts(supplierProducts);
        } catch (error) {
          console.error("Erreur lors du chargement des produits:", error);
          // Fallback de produits fictifs pour la démo
          setProducts([
            {
              id: '1',
              name: 'Huîtres Spéciales de Normandie',
              description: 'Huîtres Spéciales de Normandie n°3, saveur iodée et douce',
              price: 12.99,
              unit: 'dz',
              min_order_quantity: 2,
              category: 'huîtres',
              stock: 50
            },
            {
              id: '2',
              name: 'Moules de Méditerranée',
              description: 'Moules de Méditerranée fraîches, chair généreuse',
              price: 8.50,
              unit: 'kg',
              min_order_quantity: 1,
              category: 'moules',
              stock: 30
            },
            {
              id: '3',
              name: 'Palourdes de l\'Atlantique',
              description: 'Palourdes fraîches de l\'Atlantique, idéales pour vos plats de fruits de mer',
              price: 14.99,
              unit: 'kg',
              min_order_quantity: 0.5,
              category: 'palourdes',
              stock: 20
            },
            {
              id: '4',
              name: 'Huîtres Fines de Claire',
              description: 'Huîtres Fines de Claire affinées en bassin, saveur délicate',
              price: 15.99,
              unit: 'dz',
              min_order_quantity: 1,
              category: 'huîtres',
              stock: 40
            }
          ]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadProducts();
  }, [supplierId, getSupplierProducts]);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const handleAddToCart = (productId: string) => {
    const quantity = quantities[productId] || 0;
    if (quantity > 0) {
      addToCart(productId, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-[rgb(var(--color-brand-primary))] border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[rgb(var(--color-brand-bg))]">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[rgb(var(--color-border)_/_var(--color-border-opacity))] bg-[rgb(var(--color-brand-surface))]">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-center relative">
            
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-[rgb(var(--color-brand-surface)_/_0.5)] hover:bg-[rgb(var(--color-brand-surface))] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h1 className="text-xl font-semibold text-[rgb(var(--color-text))]">
                  {supplier?.name || 'Catalogue Fournisseur'}
                </h1>
                <p className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                  {supplier?.address || 'Produits disponibles'}
                </p>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsCartModalOpen(true)}
                  className="p-2 rounded-full bg-[rgb(var(--color-brand-surface)_/_0.5)] hover:bg-[rgb(var(--color-brand-surface))] transition-colors relative"
                  style={{
                    boxShadow: cartItems.length > 0 ? '0 0 10px 2px rgb(var(--color-brand-primary))' : 'none'
                  }}
                >
                  <ShoppingCart className="w-5 h-5" style={{
                    color: cartItems.length > 0 ? 'rgb(var(--color-brand-primary))' : 'inherit'
                  }} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[rgb(var(--color-brand-primary))] text-white text-xs rounded-full animate-pulse">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--color-brand-surface)_/_0.5)] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg focus:border-[rgb(var(--color-brand-primary))] focus:outline-none"
              />
            </div>
            
            <div className="relative">
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="px-4 py-2 bg-[rgb(var(--color-brand-surface)_/_0.5)] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg focus:outline-none flex items-center gap-2 min-w-32"
                >
                  <Filter className="w-4 h-4" />
                  <span className="capitalize">{selectedCategory === 'all' ? 'Toutes catégories' : selectedCategory}</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </button>
                
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-2 bg-[rgb(var(--color-brand-surface))] rounded-lg shadow-lg border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] z-50"
                    >
                      <div className="py-1">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-[rgb(var(--color-brand-surface)_/_0.7)] ${
                              selectedCategory === category ? 'bg-[rgb(var(--color-brand-primary)_/_0.1)] text-[rgb(var(--color-brand-primary))]' : ''
                            }`}
                          >
                            <span className="capitalize">{category === 'all' ? 'Toutes catégories' : category}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Grille de produits responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-[rgb(var(--color-brand-surface)_/_0.5)] backdrop-blur-sm rounded-xl border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] overflow-hidden hover:border-[rgb(var(--color-brand-primary)_/_0.5)] transition-all duration-300 group hover:shadow-lg"
            >
              <div className="aspect-square bg-gradient-to-br from-[rgb(var(--color-brand-primary)_/_0.2)] to-[rgb(var(--color-brand-secondary)_/_0.2)] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package2 className="w-16 h-16 text-[rgb(var(--color-brand-primary)_/_0.3)] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold break-words w-full sm:w-auto">{product.name}</h3>
                  <Badge variant="default" className="capitalize whitespace-nowrap">
                    {product.category}
                  </Badge>
                </div>
                <p className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] mb-4 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
                    {product.price.toFixed(2)}€ / {product.unit}
                  </span>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step={product.min_order_quantity}
                    value={quantities[product.id] || product.min_order_quantity || 0}
                    onChange={(e) => handleQuantityChange(product.id, parseFloat(e.target.value))}
                    className="w-full sm:w-20 px-3 py-2 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg focus:border-[rgb(var(--color-brand-primary))] focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full sm:flex-1 py-2 px-4 flex items-center justify-center gap-1 bg-[rgb(var(--color-brand-primary)_/_0.1)] hover:bg-[rgb(var(--color-brand-primary)_/_0.2)] text-[rgb(var(--color-brand-primary))] rounded-lg transition-colors group-hover:shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Ajouter au panier</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal du panier */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        items={cartItems}
        products={products}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
    </div>
  );
}
