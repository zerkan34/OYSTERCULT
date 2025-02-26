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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* En-tête fixe */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/suppliers')}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">{supplier.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-brand-primary border-brand-primary">
                    {supplier.friend_code}
                  </Badge>
                  {supplier.is_friend && (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Ami
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white text-xs flex items-center justify-center rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {selectedCategory === 'all' ? 'Toutes catégories' : selectedCategory}
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                      selectedCategory === category ? 'text-brand-primary' : 'text-gray-300'
                    }`}
                  >
                    {category === 'all' ? 'Toutes catégories' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-[1400px] mx-auto px-6 pt-40 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="group bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-brand-primary/50 transition-all duration-300"
            >
              {/* Image du produit */}
              <div className="aspect-square bg-gray-900 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                <Badge
                  className="absolute top-4 right-4 bg-gray-900/80 text-brand-primary border-brand-primary"
                >
                  {product.category}
                </Badge>
              </div>

              {/* Informations du produit */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{product.description}</p>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Prix unitaire</div>
                    <div className="text-2xl font-bold text-white">
                      {product.price.toFixed(2)} €
                      <span className="text-sm text-gray-400 ml-1">/ {product.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(product.id, getOrderQuantity(product.id) - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={getOrderQuantity(product.id) === 0}
                    >
                      -
                    </button>
                    <div className="w-12 text-center font-medium">
                      {getOrderQuantity(product.id)}
                    </div>
                    <button
                      onClick={() => handleQuantityChange(product.id, getOrderQuantity(product.id) + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {getOrderQuantity(product.id) > 0 && (
                  <div className="mt-4 text-right text-sm text-brand-primary font-medium">
                    Sous-total: {(product.price * getOrderQuantity(product.id)).toFixed(2)} €
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Panier flottant */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed top-0 right-0 bottom-0 w-96 bg-gray-900 border-l border-gray-800 shadow-2xl z-50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Votre commande</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {orderItems.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div key={item.productId} className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="text-sm text-gray-400">
                          {item.quantity} × {product.price.toFixed(2)} €
                        </div>
                      </div>
                      <div className="font-medium">
                        {(product.price * item.quantity).toFixed(2)} €
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-400">Total</div>
                  <div className="text-2xl font-bold">{getTotalPrice().toFixed(2)} €</div>
                </div>

                <button className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg transition-colors">
                  Valider la commande
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
