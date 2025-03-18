import React from 'react';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';
import { 
  Shell, 
  ThermometerSun, 
  Droplets,
  X,
  Activity,
  Fish
} from 'lucide-react';
import { Pool } from '../types';

interface PoolDetailModalProps {
  pool: Pool;
  onClose: () => void;
}

export function PoolDetailModal({ pool, onClose }: PoolDetailModalProps) {
  const modalRef = useClickOutside(onClose);
  const loadPercentage = Math.round((pool.currentLoad / pool.capacity) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        WebkitBackdropFilter: "blur(8px)",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.8)"
      }}
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, transform: "translateY(20px)" }}
        animate={{ opacity: 1, transform: "translateY(0)" }}
        exit={{ opacity: 0, transform: "translateY(20px)" }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-blue-900/95 to-blue-700/95 p-6 rounded-lg w-full max-w-2xl shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{pool.name}</h2>
            <p className="text-white/60">Bassin de {pool.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Métriques principales */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <ThermometerSun size={20} className="mr-2 text-brand-burgundy" />
                Température
              </div>
              <div className="text-2xl font-bold text-white">
                {pool.waterQuality.temperature}°C
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Droplets size={20} className="mr-2 text-brand-burgundy" />
                Qualité eau
              </div>
              <div className={`text-2xl font-bold ${
                pool.waterQuality.quality >= 95 ? 'text-green-400' :
                pool.waterQuality.quality >= 90 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {pool.waterQuality.quality}%
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Shell size={20} className="mr-2 text-brand-burgundy" />
                Occupation
              </div>
              <div className="text-2xl font-bold text-white">
                {loadPercentage}%
              </div>
              <div className="text-sm text-white/60">
                {pool.currentLoad} / {pool.capacity} kg
              </div>
            </div>
          </div>

          {/* Détails de la qualité de l'eau */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">Paramètres du bassin</h3>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg mb-3">
              <div className="flex items-center">
                <Activity size={18} className="text-blue-400 mr-2" />
                <div className="text-white font-medium">Niveau d'oxygène</div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${
                  pool.waterQuality.oxygen >= 90 ? 'text-green-400' :
                  pool.waterQuality.oxygen >= 80 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {pool.waterQuality.oxygen}%
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center">
                <Droplets size={18} className="text-blue-400 mr-2" />
                <div className="text-white font-medium">Capacité totale</div>
              </div>
              <div className="text-right">
                <div className="text-white">{pool.capacity} kg</div>
              </div>
            </div>
          </div>

          {/* Liste des produits */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">Produits dans le bassin</h3>
            <div className="space-y-3">
              {pool.products && pool.products.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: product.color || '#3b82f6' }}
                      ></div>
                      <div className="text-white font-medium">{product.name}</div>
                    </div>
                    <div className="text-sm text-white/60">
                      {product.quantity} {product.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white">
                      {Math.round((product.quantity / pool.capacity) * 100)}%
                    </div>
                    <div className="text-sm text-white/60">
                      de la capacité
                    </div>
                  </div>
                </div>
              ))}
              
              {(!pool.products || pool.products.length === 0) && (
                <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-lg">
                  <Fish className="text-white/40 mb-2" size={32} />
                  <p className="text-white/60">Aucun produit dans ce bassin</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
