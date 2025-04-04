import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shell, Fish, Anchor, Info, DollarSign, Scale, Truck, Package, Calendar, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Product {
  id: string;
  name: string;
  type: 'moules' | 'palourdes' | 'crevettes' | 'huitres';
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

const SUPPLIER_CATALOGS: { [key: string]: Product[] } = {
  'HBC': [
    {
      id: 'HBC-H1',
      name: 'Huîtres de Bouzigues Spéciales N°2',
      type: 'huitres',
      description: 'Huîtres de Bouzigues élevées dans l\'étang de Thau',
      origin: 'Étang de Thau, Bouzigues',
      price: 9.80,
      unit: 'douzaine',
      minOrder: 5,
      stock: 1000,
      deliveryTime: '24h',
      caliber: 'N°2 (85-110g)',
      conservation: '7 jours entre 2°C et 5°C'
    },
    {
      id: 'HBC-H2',
      name: 'Huîtres de Bouzigues Fines N°3',
      type: 'huitres',
      description: 'Huîtres fines de Bouzigues, saveur iodée caractéristique',
      origin: 'Étang de Thau, Bouzigues',
      price: 7.50,
      unit: 'douzaine',
      minOrder: 5,
      stock: 1200,
      deliveryTime: '24h',
      caliber: 'N°3 (66-85g)',
      conservation: '7 jours entre 2°C et 5°C'
    }
  ],
  'EW': [
    {
      id: 'EW-M1',
      name: 'Moules de Méditerranée',
      type: 'moules',
      description: 'Moules de pleine mer élevées en Méditerranée',
      origin: 'Méditerranée, Sète',
      price: 4.90,
      unit: 'kg',
      minOrder: 5,
      stock: 800,
      deliveryTime: '24h',
      caliber: '40-45 pièces/kg',
      conservation: '5 jours entre 2°C et 5°C'
    },
    {
      id: 'EW-P1',
      name: 'Palourdes de l\'Étang',
      type: 'palourdes',
      description: 'Palourdes sauvages pêchées dans l\'étang de Thau',
      origin: 'Étang de Thau',
      price: 12.50,
      unit: 'kg',
      minOrder: 2,
      stock: 300,
      deliveryTime: '24h',
      caliber: '30-35 pièces/kg',
      conservation: '4 jours entre 2°C et 5°C'
    }
  ],
  'CDB': [
    {
      id: 'CDB-H1',
      name: 'Huîtres Spéciales de Bretagne',
      type: 'huitres',
      description: 'Huîtres charnues de Bretagne Sud',
      origin: 'Golfe du Morbihan',
      price: 11.20,
      unit: 'douzaine',
      minOrder: 5,
      stock: 600,
      deliveryTime: '48h',
      caliber: 'N°2 (85-110g)',
      conservation: '7 jours entre 2°C et 5°C'
    },
    {
      id: 'CDB-P1',
      name: 'Palourdes Grises de Bretagne',
      type: 'palourdes',
      description: 'Palourdes sauvages pêchées à la main',
      origin: 'Golfe du Morbihan',
      price: 13.90,
      unit: 'kg',
      minOrder: 3,
      stock: 200,
      deliveryTime: '48h',
      caliber: '40-50 pièces/kg',
      conservation: '5 jours entre 2°C et 5°C'
    }
  ],
  'TB': [
    {
      id: 'TB-H1',
      name: 'Huîtres Spéciales Tarbouriech',
      type: 'huitres',
      description: 'Huîtres roses Tarbouriech, élevées selon la méthode des marées solaires',
      origin: 'Lagune de Thau, Marseillan',
      price: 18.90,
      unit: 'douzaine',
      minOrder: 3,
      stock: 400,
      deliveryTime: '24h',
      caliber: 'N°2 (85-110g)',
      conservation: '7 jours entre 2°C et 5°C'
    },
    {
      id: 'TB-H2',
      name: 'Huîtres Tarbouriech Prestige',
      type: 'huitres',
      description: 'Sélection prestige, affinées 6 mois minimum',
      origin: 'Lagune de Thau, Marseillan',
      price: 24.90,
      unit: 'douzaine',
      minOrder: 2,
      stock: 200,
      deliveryTime: '24h',
      caliber: 'N°2 (85-110g)',
      conservation: '7 jours entre 2°C et 5°C'
    }
  ]
};

export function SupplierCatalog() {
  const [selectedType, setSelectedType] = useState<'all' | 'moules' | 'palourdes' | 'crevettes' | 'huitres'>('all');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState('HBC');

  const filteredProducts = selectedType === 'all' 
    ? SUPPLIER_CATALOGS[supplierId] || []
    : (SUPPLIER_CATALOGS[supplierId] || []).filter(p => p.type === selectedType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'moules':
        return <Shell className="w-5 h-5" />;
      case 'palourdes':
        return <Fish className="w-5 h-5" />;
      case 'crevettes':
        return <Anchor className="w-5 h-5" />;
      case 'huitres':
        return <Package className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête du catalogue */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Catalogue {supplierId}</h2>
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
        {['all', 'moules', 'palourdes', 'crevettes', 'huitres'].map((type) => (
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
                  className="bg-brand-burgundy/20 hover:bg-brand-burgundy/30 flex items-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Ajouter au panier</span>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
