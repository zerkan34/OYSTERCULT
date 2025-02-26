import React from 'react';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';
import { 
  Clock, 
  Shell, 
  ThermometerSun, 
  Droplets,
  Calendar,
  AlertTriangle,
  X
} from 'lucide-react';

interface TableDetailModalProps {
  table: {
    name: string;
    type: string;
    value: number;
    harvest: string;
    mortality: number;
  };
  onClose: () => void;
}

export function TableDetailModal({ table, onClose }: TableDetailModalProps) {
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
            <h2 className="text-xl font-bold text-white">{table.name}</h2>
            <p className="text-white/60">{table.type}</p>
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
                <Shell size={20} className="mr-2 text-brand-burgundy" />
                Occupation
              </div>
              <div className="text-2xl font-bold text-white">
                {table.value}%
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Calendar size={20} className="mr-2 text-brand-burgundy" />
                Récolte prévue
              </div>
              <div className="text-2xl font-bold text-white">
                {table.harvest}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <AlertTriangle size={20} className="mr-2 text-brand-burgundy" />
                Mortalité
              </div>
              <div className={`text-2xl font-bold ${
                table.mortality <= 2 ? 'text-green-400' :
                table.mortality <= 3 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {table.mortality}%
              </div>
            </div>
          </div>

          {/* État des stocks */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">État des stocks</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">Stock actuel</div>
                  <div className="text-sm text-white/60">5000 unités</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">85%</div>
                  <div className="text-sm text-white/60">de la capacité</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">Stock minimum</div>
                  <div className="text-sm text-white/60">1000 unités</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">20%</div>
                  <div className="text-sm text-white/60">de la capacité</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">Stock maximum</div>
                  <div className="text-sm text-white/60">6000 unités</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">100%</div>
                  <div className="text-sm text-white/60">de la capacité</div>
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