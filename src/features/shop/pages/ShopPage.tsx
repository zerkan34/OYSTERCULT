import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Package, Droplets, Thermometer, Activity, Gauge, Wifi, Smartphone } from 'lucide-react';

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
    }
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
    }
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
    }
  }
];

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(product =>
    !selectedCategory || product.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-brand-primary/10 backdrop-blur-md z-10 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            <h1 className="text-xl font-semibold">Boutique Oystercult</h1>
          </div>
          
          <div className="flex w-full sm:w-auto items-center space-x-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-9 bg-white/5 border border-white/10 rounded-lg focus:border-white/20 focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors flex items-center space-x-1"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => {}}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors relative"
                style={{
                  boxShadow: cartCount > 0 ? '0 0 10px 2px rgba(125, 211, 252, 0.5)' : 'none'
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-brand-primary text-white text-xs rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-32 pb-12">
      
        {/* Filtres */}
        <div className={`mb-6 bg-white/5 rounded-xl p-4 transition-all duration-300 ${showFilters ? 'max-h-96' : 'max-h-0 overflow-hidden p-0 mb-0'}`}>
          <h2 className="text-lg font-medium mb-3">Filtrer par catégorie</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedCategory('device')}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCategory === 'device'
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              Appareils
            </button>
            <button
              onClick={() => setSelectedCategory('accessory')}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCategory === 'accessory'
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              Accessoires
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all duration-200"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white break-words">{product.name}</h3>
                    <p className="text-sm text-white/60 mt-1 line-clamp-3">{product.description}</p>
                  </div>
                  <div className="text-xl font-bold text-white whitespace-nowrap">{product.price}€</div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/70"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-white mb-2">Spécifications</h4>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-white/60">{key}</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setCartCount(prev => prev + 1)}
                    className="w-full sm:flex-1 px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                  >
                    Ajouter au panier
                  </button>
                  <button className="w-full sm:w-auto px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                    Détails
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