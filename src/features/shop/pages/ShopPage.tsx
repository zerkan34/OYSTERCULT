import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { CartModal } from '../components/CartModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'sensor' | 'device' | 'accessory';
  features: string[];
  inStock: boolean;
  specifications: {
    [key: string]: string;
  };
  image: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Capteur de courantologie',
    description: 'Mesure précise des courants marins avec transmission en temps réel',
    price: 899.99,
    category: 'sensor',
    features: [
      'Mesure bidirectionnelle',
      'Précision ±0.1 m/s',
      'Transmission sans fil',
      'Batterie longue durée'
    ],
    inStock: true,
    specifications: {
      'Plage de mesure': '0-10 m/s',
      'Autonomie': '12 mois',
      'Profondeur max': '50m',
      'Protection': 'IP68'
    },
    image: 'https://example.com/image1.jpg'
  },
  {
    id: '2',
    name: 'Sonde pH connectée',
    description: 'Surveillance continue du pH avec alertes automatiques',
    price: 299.99,
    category: 'sensor',
    features: [
      'Calibration automatique',
      'Alertes personnalisables',
      'Interface intuitive',
      'Installation facile'
    ],
    inStock: true,
    specifications: {
      'Plage pH': '0-14',
      'Précision': '±0.01 pH',
      'Temps de réponse': '<5s',
      'Température': '0-50°C'
    },
    image: 'https://example.com/image2.jpg'
  },
  {
    id: '3',
    name: 'Bracelet d\'urgence',
    description: 'Bracelet connecté étanche avec bouton d\'appel d\'urgence',
    price: 149.99,
    category: 'device',
    features: [
      'Étanche IP68',
      'Batterie 7 jours',
      'Géolocalisation',
      'Bouton SOS'
    ],
    inStock: true,
    specifications: {
      'Matériau': 'Silicone médical',
      'Connectivité': 'Bluetooth 5.0',
      'Autonomie': '7 jours',
      'Résistance': '5 ATM'
    },
    image: 'https://example.com/image3.jpg'
  }
];

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const { cartItems, addToCart, isCartModalOpen, setIsCartModalOpen } = useCart();

  // Fermer le dropdown des catégories quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCategoryDropdown) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  // Get unique categories
  const categories = ['all', ...new Set(mockProducts.map(product => product.category))];

  // Filter products based on category and search query
  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[rgb(var(--color-brand-bg))]">
      {/* Header avec effet de flou */}
      <header className="sticky top-0 z-40 w-full border-b border-[rgb(var(--color-border)_/_var(--color-border-opacity))] bg-[rgb(var(--color-brand-surface))]">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
              Boutique
            </h1>
            <div className="flex items-center gap-4">
              <button 
                className="p-2 rounded-lg hover:bg-[rgb(var(--color-brand-surface-hover))] transition-colors relative"
                onClick={() => setIsCartModalOpen()}
              >
                <ShoppingCart className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[rgb(var(--color-brand-primary))] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal avec espacement correct */}
      <main className="max-w-[1400px] mx-auto px-6 pt-12 pb-24">
        {/* Barre de recherche et filtres */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg focus:outline-none focus:border-[rgb(var(--color-brand-primary))]"
            />
          </div>

          {/* Filtre par catégorie */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full sm:w-48 px-4 py-2.5 bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg flex items-center justify-between gap-2"
            >
              <span className="text-[rgb(var(--color-text-primary))]">
                {selectedCategory === 'all' ? 'Toutes catégories' : selectedCategory}
              </span>
              <ChevronDown className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-[rgb(var(--color-brand-surface))] border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded-lg shadow-lg">
                <div className="p-1">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category 
                          ? 'bg-[rgb(var(--color-brand-primary)_/_0.1)] text-[rgb(var(--color-brand-primary))]'
                          : 'hover:bg-[rgb(var(--color-brand-surface-hover))] text-[rgb(var(--color-text-primary))]'
                      }`}
                    >
                      <span className="capitalize">
                        {category === 'all' ? 'Toutes catégories' : category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[rgb(var(--color-brand-surface))] rounded-lg overflow-hidden border border-[rgb(var(--color-border)_/_var(--color-border-opacity))]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
                    {product.price}€
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="w-16 px-2 py-1 text-sm border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] rounded"
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value, 10);
                        if (quantity > 0) {
                          addToCart(product.id, quantity);
                        }
                      }}
                    />
                    <button
                      onClick={() => addToCart(product.id, 1)}
                      className="px-3 py-1 bg-[rgb(var(--color-brand-primary))] text-white rounded hover:bg-[rgb(var(--color-brand-primary))/0.8] transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal du panier */}
        {isCartModalOpen && (
          <CartModal
            products={mockProducts}
            onClose={() => setIsCartModalOpen()}
          />
        )}
      </main>
    </div>
  );
}