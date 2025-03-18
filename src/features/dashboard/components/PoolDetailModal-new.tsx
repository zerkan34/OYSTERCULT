import React from 'react';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';
import { 
  Shell, 
  ThermometerSun, 
  Droplets,
  X,
  Activity,
  Fish,
  Gauge,
  BarChart4,
  AlertCircle,
  Waves
} from 'lucide-react';
import { Pool } from '../types';

interface PoolDetailModalProps {
  pool: Pool;
  onClose: () => void;
}

// Composant pour les barres de progression
const ProgressBar = ({ value, maxValue = 100, color }: { value: number; maxValue?: number; color: string }) => {
  const percent = Math.min(100, Math.round((value / maxValue) * 100));
  return (
    <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
    </div>
  );
};

export function PoolDetailModal({ pool, onClose }: PoolDetailModalProps) {
  const modalRef = useClickOutside(onClose);
  const loadPercentage = Math.round((pool.currentLoad / pool.capacity) * 100);
  const waterQualityColor = 
    pool.waterQuality.quality >= 95 ? '#22c55e' :
    pool.waterQuality.quality >= 90 ? '#eab308' : 
    '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      style={{ 
        WebkitBackdropFilter: "blur(16px)",
        backdropFilter: "blur(16px)",
        backgroundColor: "rgba(0, 0, 0, 0.7)"
      }}
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, transform: "translateY(30px)" }}
        animate={{ opacity: 1, transform: "translateY(0)" }}
        exit={{ opacity: 0, transform: "translateY(30px)" }}
        transition={{ 
          duration: 0.4,
          ease: [0.19, 1.0, 0.22, 1.0] // Expo ease out pour animation fluide
        }}
        className="glass-effect shadow-glass w-full max-w-4xl rounded-xl overflow-hidden relative"
      >
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-blue-800/80 to-blue-600/80 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                <Droplets size={24} className="text-white relative z-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{pool.name}</h2>
                <p className="text-white/70">Bassin de {pool.type}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Contenu avec effet de verre */}
        <div className="p-6 space-y-6">
          {/* Métriques principales avec animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              initial={{ opacity: 0, transform: "translateY(20px)" }}
              animate={{ opacity: 1, transform: "translateY(0)" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass-effect rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-white/60 mb-1 text-sm">Température</div>
                <div className="text-2xl font-bold text-white flex items-baseline">
                  {pool.waterQuality.temperature}°C
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-700/20 flex items-center justify-center">
                <ThermometerSun size={24} className="text-orange-400" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, transform: "translateY(20px)" }}
              animate={{ opacity: 1, transform: "translateY(0)" }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="glass-effect rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-white/60 mb-1 text-sm">Qualité eau</div>
                <div className={`text-2xl font-bold ${
                  pool.waterQuality.quality >= 95 ? 'text-green-400' :
                  pool.waterQuality.quality >= 90 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {pool.waterQuality.quality}%
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center">
                <Droplets size={24} className="text-blue-400" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, transform: "translateY(20px)" }}
              animate={{ opacity: 1, transform: "translateY(0)" }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="glass-effect rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-white/60 mb-1 text-sm">Occupation</div>
                <div className="text-2xl font-bold text-white flex items-baseline">
                  {loadPercentage}%
                  <span className="text-sm text-white/40 ml-1">capacité</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-700/20 flex items-center justify-center">
                <Gauge size={24} className="text-green-400" />
              </div>
            </motion.div>
          </div>

          {/* Détails de la qualité de l'eau */}
          <motion.div 
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-effect rounded-xl p-6"
          >
            <h3 className="text-lg font-medium text-white flex items-center">
              <Waves size={18} className="mr-2 text-blue-400" />
              Qualité de l'eau
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Graphique circulaire pour la qualité de l'eau */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-40 h-40">
                  {/* Cercle de fond */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth="8"
                    />
                    {/* Cercle de progression avec animation */}
                    <motion.circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke={waterQualityColor}
                      strokeWidth="8"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ 
                        strokeDashoffset: 283 - (283 * pool.waterQuality.quality / 100) 
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  {/* Texte au centre */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${
                      pool.waterQuality.quality >= 95 ? 'text-green-400' :
                      pool.waterQuality.quality >= 90 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {pool.waterQuality.quality}%
                    </span>
                    <span className="text-xs text-white/60">Qualité</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className={`text-sm ${
                    pool.waterQuality.quality >= 95 ? 'text-green-400' :
                    pool.waterQuality.quality >= 90 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {pool.waterQuality.quality >= 95 ? 'Excellente qualité' :
                    pool.waterQuality.quality >= 90 ? 'Qualité acceptable' :
                    'Qualité insuffisante'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Niveau d'oxygène */}
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-white/80">
                      <span className="flex items-center">
                        <Activity size={16} className="mr-1 text-blue-400" />
                        Niveau d'oxygène
                      </span>
                    </div>
                    <div className={`text-sm font-medium ${
                      pool.waterQuality.oxygen >= 90 ? 'text-green-400' :
                      pool.waterQuality.oxygen >= 80 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {pool.waterQuality.oxygen}%
                    </div>
                  </div>
                  <ProgressBar 
                    value={pool.waterQuality.oxygen} 
                    color={
                      pool.waterQuality.oxygen >= 90 ? '#22c55e' :
                      pool.waterQuality.oxygen >= 80 ? '#eab308' :
                      '#ef4444'
                    } 
                  />
                </div>
                
                {/* Température */}
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-white/80">
                      <span className="flex items-center">
                        <ThermometerSun size={16} className="mr-1 text-orange-400" />
                        Température
                      </span>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {pool.waterQuality.temperature}°C
                    </div>
                  </div>
                  <ProgressBar 
                    value={pool.waterQuality.temperature} 
                    maxValue={25} 
                    color="#f97316" 
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>Min: 10°C</span>
                    <span>Optimal: 12-16°C</span>
                    <span>Max: 25°C</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visualisations multi-produits */}
          <motion.div 
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-effect rounded-xl p-6"
          >
            <h3 className="text-lg font-medium text-white flex items-center mb-4">
              <BarChart4 size={18} className="mr-2 text-blue-400" />
              Répartition des produits
            </h3>
            
            <div className="space-y-5">
              {pool.products && pool.products.length > 0 ? (
                pool.products.map((product, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: product.color }} />
                        <span className="text-white/80">{product.name}</span>
                      </div>
                      <div className="text-white font-medium">{product.quantity} {product.unit}</div>
                    </div>
                    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(product.quantity / pool.capacity) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ backgroundColor: product.color }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>{Math.round((product.quantity / pool.capacity) * 100)}% de la capacité</span>
                      <span>{product.quantity} / {pool.capacity} {product.unit}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-lg">
                  <Fish className="text-white/40 mb-3" size={32} />
                  <p className="text-white/60 text-center">Aucun produit dans ce bassin</p>
                  <p className="text-white/40 text-sm mt-1 text-center">Le bassin est vide et prêt à être utilisé</p>
                </div>
              )}
              
              {/* Capacité totale */}
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white/80 flex items-center">
                    <Gauge size={16} className="mr-1 text-white/60" />
                    Capacité totale du bassin
                  </div>
                  <div className="text-white font-medium">{pool.capacity} kg</div>
                </div>
                <div className="glass-effect rounded-lg p-4 flex items-center justify-between">
                  <div className="text-white/80">Utilisation actuelle</div>
                  <div className={`text-sm font-medium ${
                    loadPercentage >= 90 ? 'text-red-400' :
                    loadPercentage >= 75 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {pool.currentLoad} kg ({loadPercentage}%)
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="flex justify-end space-x-3"
          >
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
