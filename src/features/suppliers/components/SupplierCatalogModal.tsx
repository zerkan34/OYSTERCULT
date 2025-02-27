import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSupplierProducts } from '../hooks/useSupplierProducts';
import { SupplierProduct } from '@/types/supplier';
import { Shell, Fish, GanttChartSquare, Waves, X, ShoppingCart, Search, Plus, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface SupplierCatalogModalProps {
  isOpen: boolean;
  supplierId: string;
  supplierName: string;
  onClose: () => void;
  onAddToCart: (product: SupplierProduct, quantity: number) => void;
}

export function SupplierCatalogModal({ 
  isOpen, 
  supplierId, 
  supplierName, 
  onClose, 
  onAddToCart 
}: SupplierCatalogModalProps) {
  const { data: products = [], isLoading } = useSupplierProducts(supplierId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orders, setOrders] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedCategory('all');
      setOrders({});
    }
  }, [isOpen]);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleAddToCart = () => {
    Object.entries(orders).forEach(([productId, quantity]) => {
      if (quantity > 0) {
        const product = products.find(p => p.id === productId);
        if (product) {
          onAddToCart(product, quantity);
        }
      }
    });
    onClose();
  };

  const getOrderQuantity = (productId: string) => {
    return orders[productId] || 0;
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const minQuantity = product.min_order_quantity;
    const validQuantity = Math.max(0, quantity);

    setOrders(prev => ({
      ...prev,
      [productId]: validQuantity
    }));
  };

  const totalItemsInCart = Object.values(orders).reduce((sum, qty) => sum + qty, 0);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category?: string) => {
    if (!category) return <Shell size={36} className="text-indigo-400/70" strokeWidth={1.5} />;
    
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('huître') || categoryLower.includes('moule') || categoryLower.includes('coquillage')) {
      return <Shell size={36} className="text-indigo-400/70" strokeWidth={1.5} />;
    }
    
    if (categoryLower.includes('poisson') || categoryLower.includes('caviar')) {
      return <Fish size={36} className="text-indigo-400/70" strokeWidth={1.5} />;
    }
    
    if (categoryLower.includes('crustacé') || categoryLower.includes('crevette') || categoryLower.includes('algue')) {
      return <Waves size={36} className="text-indigo-400/70" strokeWidth={1.5} />;
    }
    
    return <Shell size={36} className="text-indigo-400/70" strokeWidth={1.5} />;
  };

  if (!isOpen) return null;

  // Calculer la hauteur maximale en fonction du nombre de produits (moins de produits = modal plus petite)
  const maxHeight = Math.min(Math.max(filteredProducts.length * 100, 400), 700);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="overflow-hidden p-0 rounded-2xl border border-white/10 max-w-3xl w-[95%] mx-auto shadow-xl"
        style={{
          background: 'rgba(13, 14, 20, 0.75)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.1), 0 0 0 1px rgba(99, 102, 241, 0.05)'
        }}
      >
        <div className="flex flex-col max-h-[80vh]" style={{ maxHeight: `${maxHeight}px` }}>
          {/* Header avec titre et recherche */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center gap-2">
            <h2 className="font-semibold text-lg text-white flex items-center gap-2">
              <span className="text-indigo-400">{supplierName}</span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-sm font-normal text-gray-400">Catalogue</span>
            </h2>
            
            <div className="flex items-center gap-3">
              <div className="relative w-48">
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/20 border-white/10 text-white py-1 h-8 text-sm pl-8 pr-2 rounded-lg"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              </div>
              
              <AnimatePresence>
                {totalItemsInCart > 0 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative cursor-pointer"
                    onClick={handleAddToCart}
                  >
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-1.5 shadow-lg">
                      <ShoppingCart className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white text-indigo-600 text-xs font-semibold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                      {totalItemsInCart}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filtres par catégorie */}
          <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
            <Badge
              key="all"
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer text-xs whitespace-nowrap px-2 py-1 ${
                selectedCategory === 'all' 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-black/20 text-gray-300 hover:bg-white/10'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              Tous les produits
            </Badge>
            
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`cursor-pointer text-xs capitalize whitespace-nowrap px-2 py-1 ${
                  selectedCategory === category 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-black/20 text-gray-300 hover:bg-white/10'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Contenu du catalogue */}
          <div className="overflow-y-auto flex-1 p-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="group bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-md p-3 rounded-xl flex flex-col transition-all duration-300 border border-white/[0.03] hover:border-indigo-500/20 relative"
                  >
                    {/* Effet de lueur sur le contour au survol */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                      style={{ 
                        boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)', 
                        zIndex: -1 
                      }} 
                    />
                    
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-3 items-center">
                        <div className="bg-indigo-500/5 p-2 rounded-lg">
                          {getCategoryIcon(product.category)}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{product.name}</h3>
                          <Badge variant="outline" className="mt-0.5 bg-black/30 text-indigo-300 border-indigo-500/30 text-[10px] py-0 capitalize">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium text-white">
                          {product.price.toFixed(2)}€
                        </div>
                        <div className="text-xs text-gray-400">
                          / {product.unit}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-300 mb-3 line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      <div className="flex items-center bg-black/40 rounded-lg border border-white/5 overflow-hidden">
                        <button 
                          className="px-2 py-1 hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                          disabled={getOrderQuantity(product.id) <= 0}
                          onClick={() => handleQuantityChange(product.id, getOrderQuantity(product.id) - product.min_order_quantity)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        
                        <input
                          type="number"
                          min={0}
                          step={product.min_order_quantity}
                          value={getOrderQuantity(product.id) || ''}
                          onChange={(e) => handleQuantityChange(product.id, parseFloat(e.target.value) || 0)}
                          className="w-12 text-center bg-transparent border-0 text-white text-xs focus:ring-0 py-1 px-0"
                        />
                        
                        <div className="text-xs text-gray-500 px-1 border-l border-white/10">
                          {product.unit}
                        </div>
                        
                        <button 
                          className="px-2 py-1 hover:bg-white/5 text-gray-400 hover:text-white"
                          onClick={() => handleQuantityChange(product.id, getOrderQuantity(product.id) + product.min_order_quantity)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleQuantityChange(product.id, (getOrderQuantity(product.id) || 0) + product.min_order_quantity)}
                        className={`group-hover:opacity-100 ${getOrderQuantity(product.id) ? 'opacity-100' : 'opacity-0'} transition-opacity rounded-lg flex items-center gap-1 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-1.5 px-3`}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Ajouter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <GanttChartSquare className="h-10 w-10 mb-2 text-gray-500" />
                <p className="text-sm">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
