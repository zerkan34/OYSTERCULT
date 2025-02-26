import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSuppliers } from '../hooks/useSuppliers';
import { ArrowLeft, ShoppingCart, Package2, Filter, Search, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  productId: string;
  quantity: number;
}

export function SupplierCatalogPage() {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { suppliers, getSupplierProducts } = useSuppliers();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Awaited<ReturnType<typeof getSupplierProducts>>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const supplier = suppliers.find(s => s.id === supplierId);

  React.useEffect(() => {
    const loadProducts = async () => {
      if (supplierId) {
        const supplierProducts = await getSupplierProducts(supplierId);
        setProducts(supplierProducts);
        setIsLoading(false);
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

  const handleQuantityChange = (productId: string, quantity: number) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        if (quantity <= 0) {
          return prev.filter(item => item.productId !== productId);
        }
        return prev.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        );
      }
      if (quantity > 0) {
        return [...prev, { productId, quantity }];
      }
      return prev;
    });
  };

  const getOrderQuantity = (productId: string) => {
    return orderItems.find(item => item.productId === productId)?.quantity || 0;
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (!supplier) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Fournisseur non trouvé</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-brand-surface))] text-[rgb(var(--color-text))]">
      {/* En-tête fixe */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-[rgb(var(--color-brand-surface)_/_0.8)] backdrop-blur-lg border-b border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-[rgb(var(--color-brand-primary)_/_0.1)] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{supplier.name}</h1>
                <p className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                  Catalogue des produits
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 hover:bg-[rgb(var(--color-brand-primary)_/_0.1)] rounded-lg transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 bg-[rgb(var(--color-brand-primary))]"
                    variant="default"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </button>

              {/* Panier */}
              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-96 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg shadow-xl"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Panier</h3>
                      {orderItems.length === 0 ? (
                        <p className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] text-center py-4">
                          Votre panier est vide
                        </p>
                      ) : (
                        <>
                          <div className="space-y-3 mb-4">
                            {orderItems.map(item => {
                              const product = products.find(p => p.id === item.productId);
                              if (!product) return null;
                              return (
                                <div key={item.productId} className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                                      {item.quantity} × {product.price.toFixed(2)}€
                                    </p>
                                  </div>
                                  <p className="font-medium">
                                    {(product.price * item.quantity).toFixed(2)}€
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div className="border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))] pt-4">
                            <div className="flex justify-between font-semibold mb-4">
                              <span>Total</span>
                              <span>{getTotalPrice().toFixed(2)}€</span>
                            </div>
                            <button
                              className="w-full py-2 bg-[rgb(var(--color-brand-primary))] hover:bg-[rgb(var(--color-brand-primary)_/_0.9)] text-white rounded-lg transition-colors"
                              onClick={() => {
                                // TODO: Implémenter la validation de la commande
                                alert('Commande validée !');
                                setOrderItems([]);
                                setIsCartOpen(false);
                              }}
                            >
                              Valider la commande
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg focus:outline-none focus:border-[rgb(var(--color-brand-primary))]"
              />
            </div>
            <div className="relative">
              <button
                className="px-4 py-2 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg flex items-center gap-2"
                onClick={() => setSelectedCategory(prev => prev === 'all' ? categories[1] || 'all' : 'all')}
              >
                <Filter className="w-4 h-4" />
                <span className="capitalize">{selectedCategory}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-[1400px] mx-auto px-6 pt-48 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-[rgb(var(--color-brand-surface)_/_0.5)] backdrop-blur-sm rounded-xl border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] overflow-hidden hover:border-[rgb(var(--color-brand-primary)_/_0.5)] transition-all duration-300"
            >
              <div className="aspect-square bg-gradient-to-br from-[rgb(var(--color-brand-primary)_/_0.2)] to-[rgb(var(--color-brand-secondary)_/_0.2)] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package2 className="w-16 h-16 text-[rgb(var(--color-brand-primary)_/_0.3)]" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                </div>
                <p className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                    Prix unitaire:
                  </span>
                  <span className="font-medium">
                    {product.price.toFixed(2)}€ / {product.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={product.min_order_quantity}
                    step={product.min_order_quantity}
                    value={getOrderQuantity(product.id)}
                    onChange={(e) => handleQuantityChange(product.id, parseFloat(e.target.value))}
                    className="w-20 px-3 py-2 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg"
                  />
                  <button
                    onClick={() => handleQuantityChange(product.id, getOrderQuantity(product.id) + product.min_order_quantity)}
                    className="flex-1 py-2 px-4 bg-[rgb(var(--color-brand-primary)_/_0.1)] hover:bg-[rgb(var(--color-brand-primary)_/_0.2)] text-[rgb(var(--color-brand-primary))] rounded-lg transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
