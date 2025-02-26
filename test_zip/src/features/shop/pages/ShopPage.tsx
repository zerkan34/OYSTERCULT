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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Shop</h1>
        <button className="relative p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-xs">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
        >
          <Filter size={20} className="mr-2" />
          Filtres
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
            !selectedCategory
              ? 'bg-brand-primary text-white'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setSelectedCategory('sensor')}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
            selectedCategory === 'sensor'
              ? 'bg-brand-primary text-white'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          Capteurs
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{product.name}</h3>
                  <p className="text-sm text-white/60 mt-1">{product.description}</p>
                </div>
                <div className="text-xl font-bold text-white">{product.price}€</div>
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

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setCartCount(prev => prev + 1)}
                  className="flex-1 px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  Ajouter au panier
                </button>
                <button className="px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                  Détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}