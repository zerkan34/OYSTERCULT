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
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const handleQuantityChange = (productId: string, quantity: number) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        if (quantity <= 0) {
          return prev.filter(item => item.productId !== productId);
        }
        return prev.map(item => item.productId === productId ? { ...item, quantity } : item);
      }
      if (quantity <= 0) return prev;
      return [...prev, { productId, quantity }];
    });
  };

  const getOrderQuantity = (productId: string) => {
    const item = orderItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return orderItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-[rgb(var(--color-brand-primary))] border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-brand-bg))]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[rgb(var(--color-brand-bg)_/_0.8)] backdrop-blur-md border-b border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-center relative">
            <button
              onClick={() => navigate('/suppliers')}
              className="absolute left-0 p-2 rounded-full bg-[rgb(var(--color-brand-surface)_/_0.5)] hover:bg-[rgb(var(--color-brand-surface))] transition-colors hover:shadow-[0_0_10px_rgba(var(--color-brand-primary),0.3)]"
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
            
            <div className="absolute right-0">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 rounded-full bg-[rgb(var(--color-brand-surface)_/_0.5)] hover:bg-[rgb(var(--color-brand-surface))] transition-colors relative"
                style={{
                  boxShadow: getTotalItems() > 0 ? '0 0 10px 2px rgb(var(--color-brand-primary))' : 'none'
                }}
              >
                <ShoppingCart className="w-5 h-5" style={{
                  color: getTotalItems() > 0 ? 'rgb(var(--color-brand-primary))' : 'inherit'
                }} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[rgb(var(--color-brand-primary))] text-white text-xs rounded-full animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-[rgb(var(--color-brand-surface))] rounded-lg shadow-lg border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] z-50"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold mb-4">Votre commande</h3>
                      {orderItems.length === 0 ? (
                        <p className="text-center text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] py-4">Votre panier est vide</p>
                      ) : (
                        <>
                          <div className="space-y-3 max-h-80 overflow-y-auto">
                            {orderItems.map(item => {
                              const product = products.find(p => p.id === item.productId);
                              if (!product) return null;
                              return (
                                <div key={item.productId} className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                                      {item.quantity} {product.unit} × {product.price}€
                                    </p>
                                  </div>
                                  <span className="font-medium">
                                    {(product.price * item.quantity).toFixed(2)}€
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))] mt-4 pt-4">
                            <div className="flex justify-between font-semibold mb-4">
                              <span>Total</span>
                              <span>{getTotalPrice().toFixed(2)}€</span>
                            </div>
                            <button 
                              className="w-full py-2 bg-[rgb(var(--color-brand-primary))] text-white rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--color-brand-primary),0.5)] hover:translate-y-[-2px]"
                              onClick={() => {
                                console.log('Commande passée:', orderItems);
                                alert('Commande confirmée ! Votre commande a été transmise au fournisseur.\n\nVous trouverez son statut dans "commandes".');
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
      </div>

      {/* Contenu principal */}
      <div className="max-w-[1400px] mx-auto px-6 pt-24 pb-12 mt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <Badge variant="default" className="capitalize">
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
                    className="w-20 px-3 py-2 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg focus:border-[rgb(var(--color-brand-primary))] focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(product.id, getOrderQuantity(product.id) + product.min_order_quantity)}
                    className="flex-1 py-2 px-4 flex items-center justify-center gap-1 bg-[rgb(var(--color-brand-primary)_/_0.1)] hover:bg-[rgb(var(--color-brand-primary)_/_0.2)] text-[rgb(var(--color-brand-primary))] rounded-lg transition-colors group-hover:shadow-md"
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
    </div>
  );
}
