import React from 'react';
import { Shell, Fish, Anchor, Package, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  type: 'moules' | 'palourdes' | 'crevettes';
  description: string;
  price: number;
  unit: string;
  caliber: string;
  stock: number;
  minOrder: number;
  image?: string;
  origin: string;
  conservation: string;
  certification?: string;
}

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'M001',
    name: 'Moules de Bouchot AOP',
    type: 'moules',
    description: 'Moules de Bouchot AOP Mont Saint-Michel, chair généreuse et goût iodé unique. Élevées selon des méthodes traditionnelles.',
    origin: 'Baie du Mont Saint-Michel, France',
    price: 4.50,
    unit: 'kg',
    caliber: '40-45 pièces/kg',
    stock: 2500,
    minOrder: 100,
    conservation: '7 jours entre 2°C et 5°C',
    certification: 'AOP Mont Saint-Michel',
    image: '/images/products/moules-bouchot.jpg'
  },
  {
    id: 'M002',
    name: 'Moules de Hollande Jumbo',
    type: 'moules',
    description: 'Moules extra jumbo de Hollande, parfaites pour les marinières. Chair abondante et saveur douce.',
    origin: 'Yerseke, Pays-Bas',
    price: 3.80,
    unit: 'kg',
    caliber: '35-40 pièces/kg',
    stock: 3000,
    minOrder: 150,
    conservation: '7 jours entre 2°C et 5°C',
    image: '/images/products/moules-hollande.jpg'
  },
  {
    id: 'P001',
    name: 'Palourdes Grises Sauvages',
    type: 'palourdes',
    description: 'Palourdes sauvages pêchées à la main, qualité premium. Goût authentique de la mer.',
    origin: 'Golfe du Morbihan, France',
    price: 12.90,
    unit: 'kg',
    caliber: '40-50 pièces/kg',
    stock: 800,
    minOrder: 50,
    conservation: '5 jours entre 2°C et 5°C',
    image: '/images/products/palourdes-grises.jpg'
  },
  {
    id: 'P002',
    name: 'Palourdes Japonaises',
    type: 'palourdes',
    description: 'Palourdes d\'élevage, chair tendre et goût délicat. Idéales pour les plats méditerranéens.',
    origin: 'Marennes-Oléron, France',
    price: 9.90,
    unit: 'kg',
    caliber: '35-45 pièces/kg',
    stock: 1200,
    minOrder: 50,
    conservation: '5 jours entre 2°C et 5°C',
    image: '/images/products/palourdes-japonaises.jpg'
  },
  {
    id: 'C001',
    name: 'Crevettes Grises de la Mer du Nord',
    type: 'crevettes',
    description: 'Crevettes grises sauvages, pêchées en mer du Nord. Petit format mais goût intense.',
    origin: 'Mer du Nord',
    price: 15.90,
    unit: 'kg',
    caliber: '60-80 pièces/kg',
    stock: 600,
    minOrder: 25,
    conservation: '4 jours entre 0°C et 4°C',
    image: '/images/products/crevettes-grises.jpg'
  },
  {
    id: 'C002',
    name: 'Crevettes Royales Crues',
    type: 'crevettes',
    description: 'Crevettes royales crues, qualité sashimi. Chair ferme et goût subtil.',
    origin: 'Atlantique Nord-Est',
    price: 29.90,
    unit: 'kg',
    caliber: '16-20 pièces/kg',
    stock: 400,
    minOrder: 20,
    conservation: '4 jours entre 0°C et 4°C',
    image: '/images/products/crevettes-royales.jpg'
  }
];

// Déplacer la fonction getProductIcon en dehors des composants pour qu'elle soit accessible partout
const getProductIcon = (type: string) => {
  switch (type) {
    case 'moules': return <Shell className="w-5 h-5" />;
    case 'palourdes': return <Fish className="w-5 h-5" />;
    case 'crevettes': return <Anchor className="w-5 h-5" />;
    default: return <Package className="w-5 h-5" />;
  }
};

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
}

function ProductCard({ product, onOrder }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
    >
      <div className="aspect-video bg-white/10 relative overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
            {getProductIcon(product.type)}
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/50 backdrop-blur-sm text-sm text-white">
          {product.type}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium text-white">{product.name}</h3>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-white">{product.price.toFixed(2)}€</span>
              <span className="text-sm text-white/60 ml-1">/{product.unit}</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-white/60">{product.description}</p>
        </div>

        <div className="space-y-2 text-sm text-white/60">
          <div className="flex items-center justify-between">
            <span>Origine</span>
            <span className="text-white">{product.origin}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Calibre</span>
            <span className="text-white">{product.caliber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Conservation</span>
            <span className="text-white">{product.conservation}</span>
          </div>
          {product.certification && (
            <div className="flex items-center justify-between">
              <span>Certification</span>
              <span className="text-green-400">{product.certification}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className={`px-2 py-1 rounded ${
              product.stock > product.minOrder * 2
                ? 'bg-green-500/20 text-green-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              Stock: {product.stock} {product.unit}
            </div>
            <div className="text-white/60">
              Min. {product.minOrder} {product.unit}
            </div>
          </div>
          <button
            onClick={() => onOrder(product)}
            className="w-full py-2 px-4 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Ajouter au panier</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface ProductCatalogProps {
  onOrder: (product: Product) => void;
}

export function ProductCatalog({ onOrder }: ProductCatalogProps) {
  const [selectedType, setSelectedType] = React.useState<'all' | 'moules' | 'palourdes' | 'crevettes'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProducts = PRODUCTS_CATALOG.filter(product => {
    const matchesType = selectedType === 'all' || product.type === selectedType;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-white">Catalogue CDB</h2>
        <p className="mt-2 text-white/60">
          Découvrez notre sélection de produits de la mer, soigneusement sélectionnés pour leur qualité exceptionnelle.
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex space-x-2">
          {['all', 'moules', 'palourdes', 'crevettes'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as typeof selectedType)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                selectedType === type
                  ? 'bg-brand-burgundy text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {type !== 'all' && getProductIcon(type)}
              <span>
                {type === 'all' ? 'Tous les produits' : type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </button>
          ))}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
          />
        </div>
      </div>

      {/* Grille de produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOrder={onOrder}
          />
        ))}
      </div>
    </div>
  );
}
