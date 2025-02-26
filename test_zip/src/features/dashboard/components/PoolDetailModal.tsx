import React from 'react';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';
import { 
  Shell, 
  ThermometerSun, 
  Droplets,
  X
} from 'lucide-react';

interface PoolDetailModalProps {
  pool: {
    name: string;
    type: string;
    value: number;
    capacity: number;
    currentLoad: number;
    waterQuality: {
      quality: number;
      oxygen: number;
      temperature: number;
    };
  };
  onClose: () => void;
}

export function PoolDetailModal({ pool, onClose }: PoolDetailModalProps) {
  const modalRef = useClickOutside(onClose);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-2xl"
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
                {Math.round((pool.currentLoad / pool.capacity) * 100)}%
              </div>
              <div className="text-sm text-white/60">
                {pool.currentLoad}/{pool.capacity}
              </div>
            </div>
          </div>

          {/* Liste des lots */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">Lots en purification</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">LOT-2025-001</div>
                  <div className="text-sm text-white/60">500 unités</div>
                </div>
                <div className="text-right">
                  <div className="text-white">12h</div>
                  <div className="text-sm text-white/60">restantes</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">LOT-2025-002</div>
                  <div className="text-sm text-white/60">300 unités</div>
                </div>
                <div className="text-right">
                  <div className="text-white">24h</div>
                  <div className="text-sm text-white/60">restantes</div>
                </div>
              </div>
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