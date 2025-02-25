import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shell, Fish, Shrimp, Info, DollarSign, Scale, Truck, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Product {
  id: string;
  name: string;
  type: 'moules' | 'palourdes' | 'crevettes';
  description: string;
  origin: string;
  price: number;
  unit: string;
  minOrder: number;
  stock: number;
  deliveryTime: string;
  caliber?: string;
  conservation: string;
}

const CDB_CATALOG: Product[] = [
  {
    id: 'M001',
    name: 'Moules de Bouchot',
    type: 'moules',
    description: 'Moules de Bouchot AOP Mont Saint-Michel, chair généreuse et goût iodé',
    origin: 'Baie du Mont Saint-Michel, France',
    price: 4.50,
    unit: 'kg',
    minOrder: 100,
    stock: 2500,
    deliveryTime: '48h',
    caliber: '40-45 pièces/kg',
    conservation: '7 jours entre 2°C et 5°C'
  },
  {
    id: 'M002',
    name: 'Moules de Hollande',
    type: 'moules',
    description: 'Moules extra jumbo, parfaites pour les préparations marinières',
    origin: 'Yerseke, Pays-Bas',
    price: 3.80,
    unit: 'kg',
    minOrder: 150,
    stock: 3000,
    deliveryTime: '72h',
    caliber: '35-40 pièces/kg',
    conservation: '7 jours entre 2°C et 5°C'
  },
  {
    id: 'P001',
    name: 'Palourdes Grises',
    type: 'palourdes',
    description: 'Palourdes sauvages pêchées à la main, qualité premium',
    origin: 'Golfe du Morbihan, France',
    price: 12.90,
    unit: 'kg',
    minOrder: 50,
    stock: 800,
    deliveryTime: '48h',
    caliber: '40-50 pièces/kg',
    conservation: '5 jours entre 2°C et 5°C'
  },
  {
    id: 'P002',
    name: 'Palourdes Japonaises',
    type: 'palourdes',
    description: 'Palourdes d\'élevage, chair tendre et goût délicat',
    origin: 'Marennes-Oléron, France',
    price: 9.90,
    unit: 'kg',
    minOrder: 50,
    stock: 1200,
    deliveryTime: '48h',
    caliber: '35-45 pièces/kg',
    conservation: '5 jours entre 2°C et 5°C'
  },
  {
    id: 'C001',
    name: 'Crevettes Grises',
    type: 'crevettes',
    description: 'Crevettes grises sauvages de la Mer du Nord, pêche durable',
    origin: 'Mer du Nord',
    price: 15.90,
    unit: 'kg',
    minOrder: 25,
    stock: 600,
    deliveryTime: '48h',
    caliber: '60-80 pièces/kg',
    conservation: '4 jours entre 0°C et 4°C'
  },
  {
    id: 'C002',
    name: 'Crevettes Royales',
    type: 'crevettes',
    description: 'Crevettes royales crues, qualité sashimi',
    origin: 'Atlantique Nord-Est',
    price: 29.90,
    unit: 'kg',
    minOrder: 20,
    stock: 400,
    deliveryTime: '24h',
    caliber: '16-20 pièces/kg',
    conservation: '4 jours entre 0°C et 4°C'
  }
];

export function SupplierCatalog() {
  const [selectedType, setSelectedType] = useState<'all' | 'moules' | 'palourdes' | 'crevettes'>('all');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const filteredProducts = selectedType === 'all' 
    ? CDB_CATALOG 
    : CDB_CATALOG.filter(p => p.type === selectedType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'moules':
        return <Shell className="w-5 h-5" />;
      case 'palourdes':
        return <Fish className="w-5 h-5" />;
      case 'crevettes':
        return <Shrimp className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête du catalogue */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Catalogue CDB</h2>
          <p className="text-white/60">Fournisseur de produits de la mer depuis 1985</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-white/60">
          <div className="flex items-center">
            <Truck className="w-4 h-4 mr-1" />
            Livraison 6j/7
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Commande avant 16h
          </div>
        </div>
      </div>

      {/* Filtres */}
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
            {type !== 'all' && getIcon(type)}
            <span>
              {type === 'all' ? 'Tous les produits' : type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </button>
        ))}
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className={`bg-white/5 rounded-lg p-4 relative overflow-hidden transition-all duration-200 ${
              hoveredProduct === product.id ? 'ring-2 ring-brand-burgundy shadow-lg' : ''
            }`}
            onHoverStart={() => setHoveredProduct(product.id)}
            onHoverEnd={() => setHoveredProduct(null)}
            whileHover={{ y: -4 }}
          >
            {/* Badge de stock */}
            <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs ${
              product.stock > product.minOrder * 2
                ? 'bg-green-500/20 text-green-400'
                : product.stock > product.minOrder
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {product.stock} {product.unit} en stock
            </div>

            <div className="space-y-4">
              {/* En-tête du produit */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  {getIcon(product.type)}
                </div>
                <div>
                  <h3 className="font-medium text-white">{product.name}</h3>
                  <p className="text-sm text-white/60">{product.origin}</p>
                </div>
              </div>

              {/* Description et caractéristiques */}
              <p className="text-sm text-white/80">{product.description}</p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-white/60">
                  <Scale className="w-4 h-4 mr-1" />
                  {product.caliber}
                </div>
                <div className="flex items-center text-white/60">
                  <Truck className="w-4 h-4 mr-1" />
                  Livraison {product.deliveryTime}
                </div>
                <div className="flex items-center text-white/60">
                  <Package className="w-4 h-4 mr-1" />
                  Min. {product.minOrder} {product.unit}
                </div>
                <div className="flex items-center text-white/60">
                  <Info className="w-4 h-4 mr-1" />
                  {product.conservation}
                </div>
              </div>

              {/* Prix et action */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-brand-burgundy" />
                  <span className="text-xl font-bold text-white">{product.price.toFixed(2)}€</span>
                  <span className="text-sm text-white/60">/{product.unit}</span>
                </div>
                <Button
                  className="bg-brand-burgundy/20 hover:bg-brand-burgundy/30"
                >
                  Commander
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
