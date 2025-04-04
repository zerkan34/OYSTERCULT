import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSuppliers } from '../hooks/useSuppliers';
import { useCart } from '../hooks/useCart';
import { ArrowLeft, ShoppingCart, Package2, Filter, Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartModal } from '../components/CartModal';
import type { SupplierProduct } from '@/types/supplier';

// Alias de SupplierProduct pour compatibilité avec le code existant
type Product = SupplierProduct;

export function SupplierCatalogPage() {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { suppliers, getSupplierProducts } = useSuppliers();
  const { cartItems, addToCart, removeFromCart, clearCart, isCartModalOpen, setIsCartModalOpen } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [initialized, setInitialized] = useState(false);
  
  const supplier = suppliers.find(s => s.id === supplierId);

  useEffect(() => {
    if (!initialized) {
      console.log("SupplierCatalogPage chargée, supplierId:", supplierId);
      console.log("URL actuelle:", window.location.pathname);
      console.log("Fournisseur trouvé:", supplier);
      setInitialized(true);
    }
  }, [supplierId, supplier, initialized]);

  useEffect(() => {
    if (!supplierId || products.length > 0) return; // Ne pas charger si déjà chargé ou pas d'ID
    
    console.log("useEffect appelé pour charger les produits");
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        console.log("⚡ Chargement des produits pour le fournisseur:", supplierId);
        const supplierProducts = await getSupplierProducts(supplierId);
        console.log("⚡ Produits reçus:", supplierProducts);

        if (Array.isArray(supplierProducts) && supplierProducts.length > 0) {
          setProducts(supplierProducts);
          console.log("⚡ Produits définis avec succès:", supplierProducts.length);

          // Initialiser les quantités avec les quantités minimales
          const initialQuantities: Record<string, number> = {};
          supplierProducts.forEach(product => {
            initialQuantities[product.id] = product.min_order_quantity || product.minOrder || 1;
          });
          setQuantities(initialQuantities);
        } else {
          console.log("⚡ Aucun produit trouvé ou format incorrect:", supplierProducts);
          setProducts([]);
          setQuantities({});
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des produits:", error);
        setProducts([]);
        setQuantities({});
      }
      setIsLoading(false);
    };

    loadProducts();
  }, [supplierId, getSupplierProducts, products.length]);

  useEffect(() => {
    // Filtrer les produits seulement s'il y en a
    if (products.length === 0) return;
    
    console.log("useEffect appelé pour filtrer les produits");
    // Filtrer les produits en fonction de la catégorie et de la recherche
    let newFilteredProducts = [...products];

    if (selectedCategory !== 'all') {
      newFilteredProducts = newFilteredProducts.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      newFilteredProducts = newFilteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(newFilteredProducts);
  }, [products, selectedCategory, searchQuery]);

  useEffect(() => {
    console.log("Cart items:", cartItems);
    console.log("Products:", products);
  }, [cartItems, products]);

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || product.min_order_quantity || product.minOrder || 1;
    console.log('----------------------------------------');
    console.log('Adding to cart:');
    console.log(`Product ID: ${product.id}`);
    console.log(`Product Name: ${product.name}`);
    console.log(`Quantity: ${quantity}`);
    console.log('Current cart items:', cartItems);
    console.log('----------------------------------------');
    
    addToCart(product.id, quantity);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  const categories = ['all', ...new Set(products.map(product => product.category))];

  if (!supplier) {
    return (
      <div className="container mx-auto px-4 mt-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Retour
        </button>
        <h1 className="text-2xl font-bold text-white">Fournisseur non trouvé</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-12">
      {/* En-tête avec le bouton de retour et le nom du fournisseur */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Retour
        </button>
        <h1 className="text-2xl font-bold text-white">{supplier.name}</h1>
        <button onClick={() => setIsCartModalOpen(true)} className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
          <ShoppingCart className="h-6 w-6 text-white hover:text-cyan-400 transition-colors duration-300" aria-hidden="true" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Barre de recherche et filtre par catégorie */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/2">
          <Search 
            className="search-icon-fixed left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 pointer-events-none z-10" 
            aria-label="Search icon" 
          />
          <input
            type="search"
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500 transition-colors duration-300"
          >
            Catégorie: {selectedCategory === 'all' ? 'Toutes' : selectedCategory}
            <ChevronDown className="h-5 w-5" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {showCategoryDropdown && (
              <motion.ul
                className="absolute top-full right-0 mt-2 rounded-lg bg-gray-800 border border-gray-700 shadow-lg overflow-hidden z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {categories.map(category => (
                  <motion.li
                    key={category}
                    className="px-4 py-2 text-white hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                    whileHover={{ backgroundColor: '#4a5568' }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {selectedCategory === category && <Check className="h-4 w-4 text-cyan-500" aria-hidden="true" />}
                    <span>{category === 'all' ? 'Toutes' : category}</span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Affichage des produits ou message de chargement/vide */}
      {isLoading ? (
        <div className="text-white">Chargement des produits...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-white">
          Aucun produit trouvé pour le fournisseur <strong>{supplier.name}</strong> dans la catégorie <strong>{selectedCategory}</strong>
          {searchQuery && ` avec le terme de recherche ${searchQuery}`}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => {
            const quantity = quantities[product.id] || product.min_order_quantity || product.minOrder || 1;
            return (
              <div key={product.id} className="rounded-lg border border-gray-700 bg-gray-800 p-4">
                <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                <p className="text-white/70">{product.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">{product.price} {product.unit}</span>
                  <div>
                    <input
                      type="number"
                      min={product.min_order_quantity || product.minOrder || 1}
                      className="w-20 px-2 py-1 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-cyan-500 transition-colors duration-300"
                      value={quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value, 10);
                        handleQuantityChange(product.id, newQuantity);
                      }}
                    />
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="ml-2 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors duration-300"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
