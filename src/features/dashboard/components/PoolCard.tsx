import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, ThermometerSun } from 'lucide-react';

// Type pour les produits dans un bassin
interface PoolProduct {
  name: string;
  quantity: number;
  unit: string;
  color: string;
}

// Type pour les données de qualité d'eau
interface WaterQuality {
  quality: number;
  oxygen: number;
  temperature: number;
}

// Type pour les données du bassin
interface Pool {
  name: string;
  value: number;
  color: string;
  type: string;
  capacity: number;
  currentLoad: number;
  products: PoolProduct[];
  waterQuality: WaterQuality;
}

interface PoolCardProps {
  pool: Pool;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

export const PoolCard: React.FC<PoolCardProps> = ({
  pool,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick
}) => {
  return (
    <motion.div 
      className={`relative bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer overflow-hidden ${
        isHovered ? 'ring-2 ring-brand-burgundy shadow-neon' : ''
      }`}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      {/* Effet de surbrillance */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/5 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pool.color }} />
            <div>
              <div className="text-sm md:text-base text-white">{pool.name}</div>
              <div className="text-xs text-white/70">{pool.type}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm md:text-base font-semibold text-white">{pool.value}%</div>
            <div className="text-xs text-white/70">occupé</div>
          </div>
        </div>

        {/* Jauge de capacité avec produits différenciés */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
            <span>Capacité</span>
            <span>{pool.currentLoad}/{pool.capacity} kg</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
            {pool.products.map((product, productIndex) => {
              const productPercentage = (product.quantity / pool.capacity) * 100;
              
              return (
                <div 
                  key={productIndex}
                  className="h-full" 
                  style={{ 
                    width: `${productPercentage}%`, 
                    backgroundColor: product.color,
                    marginLeft: productIndex === 0 ? 0 : '-1px', // Éviter les écarts entre segments
                  }} 
                />
              );
            })}
          </div>
        </div>

        {/* Liste des produits */}
        <div className="mb-3">
          <div className="text-xs font-medium text-white/80 mb-1">Produits:</div>
          <div className="flex flex-wrap gap-2">
            {pool.products.map((product, productIndex) => (
              <div key={productIndex} className="flex items-center text-xs">
                <div 
                  className="w-2 h-2 rounded-full mr-1" 
                  style={{ backgroundColor: product.color }} 
                />
                <span className="text-white/70">{product.name}:</span>
                <span className="ml-1 text-white font-medium">{product.quantity} {product.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Qualité de l'eau */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-white/60">
            <Droplets className="w-4 h-4 mr-1" />
            Qualité eau: 
            <span className={`ml-1 ${
              pool.waterQuality.quality >= 95 ? 'text-green-400' :
              pool.waterQuality.quality >= 90 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {pool.waterQuality.quality}%
            </span>
          </div>
          <div className="flex items-center text-white/60">
            <ThermometerSun className="w-4 h-4 mr-1" />
            {pool.waterQuality.temperature}°C
          </div>
        </div>
      </div>
    </motion.div>
  );
};
