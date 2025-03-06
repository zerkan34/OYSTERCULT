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
  
  // Determine if table contains triploid or diploid oysters based on the type
  // Adding defensive checks to prevent errors if type is undefined
  const type = table?.type || '';
  const isTriploid = type.toLowerCase().includes('plate');
  const isDiploid = type.toLowerCase().includes('creuse');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
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
            <h2 id="modal-title" className="text-xl font-bold text-white" title={table.name}>{table.name}</h2>
            <p className="text-white/60" title={table.type}>{table.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Fermer la fenêtre"
            title="Fermer"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Métriques principales */}
          <div className="grid grid-cols-3 gap-4" role="group" aria-label="Métriques principales">
            <div className="bg-white/5 rounded-lg p-4" role="status" aria-label={`Occupation: ${table.value}%`}>
              <div className="flex items-center text-white/80 mb-2">
                <Shell size={20} className="mr-2 text-brand-burgundy" aria-hidden="true" />
                <span>Occupation</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {table.value}%
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4" role="status" aria-label={`Récolte prévue: ${table.harvest}`}>
              <div className="flex items-center text-white/80 mb-2">
                <Calendar size={20} className="mr-2 text-brand-burgundy" aria-hidden="true" />
                <span>Récolte prévue</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {table.harvest}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4" role="status" aria-label={`Mortalité: ${table.mortality}%`}>
              <div className="flex items-center text-white/80 mb-2">
                <AlertTriangle size={20} className="mr-2 text-brand-burgundy" aria-hidden="true" />
                <span>Mortalité</span>
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

          {/* Représentation stylisée de la table */}
          <div className="bg-white/5 rounded-lg p-4" role="region" aria-labelledby="table-representation-heading">
            <h3 id="table-representation-heading" className="text-lg font-medium text-white mb-4" title="Représentation graphique de la table d'huîtres">Représentation de la table</h3>
            <div className="flex justify-center">
              <div className="w-full max-w-md p-4 border border-white/20 rounded-lg bg-brand-dark/30">
                <div className="flex space-x-4">
                  {/* Colonne gauche (Triploïdes) */}
                  <div className="w-1/2 space-y-1" aria-label="Cellules triploïdes" role="region">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div 
                        key={`left-${index}`} 
                        className={`h-8 rounded ${index < Math.ceil((table.value / 100) * 10) / 2 ? 'bg-brand-burgundy' : 'bg-gray-800/50'}`}
                        aria-label={index < Math.ceil((table.value / 100) * 10) / 2 ? `Cellule triploïde ${index + 1}` : `Cellule triploïde vide ${index + 1}`}
                        role="img"
                        title={index < Math.ceil((table.value / 100) * 10) / 2 ? `Cellule triploïde ${index + 1} occupée` : `Cellule triploïde ${index + 1} non occupée`}
                      >
                        {index < Math.ceil((table.value / 100) * 10) / 2 && (
                          <div className="h-full flex items-center justify-center text-xs text-white font-bold">
                            {index + 1}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Colonne droite (Diploïdes) */}
                  <div className="w-1/2 space-y-1" aria-label="Cellules diploïdes" role="region">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div 
                        key={`right-${index}`} 
                        className={`h-8 rounded ${index < Math.floor((table.value / 100) * 10) / 2 ? 'bg-blue-600' : 'bg-gray-800/50'}`}
                        aria-label={index < Math.floor((table.value / 100) * 10) / 2 ? `Cellule diploïde ${index + 1}` : `Cellule diploïde vide ${index + 1}`}
                        role="img"
                        title={index < Math.floor((table.value / 100) * 10) / 2 ? `Cellule diploïde ${index + 1} occupée` : `Cellule diploïde ${index + 1} non occupée`}
                      >
                        {index < Math.floor((table.value / 100) * 10) / 2 && (
                          <div className="h-full flex items-center justify-center text-xs text-white font-bold">
                            {index + Math.ceil((table.value / 100) * 10) / 2 + 1}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-center text-white/60 text-xs">
                  Gauche: Triploïdes | Droite: Diploïdes
                </div>
              </div>
            </div>
          </div>

          {/* État des stocks */}
          <div className="bg-white/5 rounded-lg p-4" role="region" aria-labelledby="stock-status-heading">
            <h3 id="stock-status-heading" className="text-lg font-medium text-white mb-4" title="État actuel des stocks dans la table">État des stocks</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg" role="group" aria-label="Détails du stock">
                <div>
                  <div className="text-white font-medium" title="Stock actuel">Stock actuel</div>
                  <div className="text-sm text-white/60" title="5000 unités">5000 unités</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium" title="Pourcentage d'occupation">85%</div>
                  <div className="text-sm text-white/60" title="Pourcentage de la capacité">de la capacité</div>
                </div>
              </div>
              
              {/* Jauge de remplissage avec couleur correspondante au type d'huîtres */}
              <div 
                className="h-4 bg-white/10 rounded-full overflow-hidden" 
                role="progressbar" 
                aria-valuenow={table.value} 
                aria-valuemin={0} 
                aria-valuemax={100}
                aria-label={`Jauge de remplissage ${table.value}%`}
                title={`Niveau d'occupation: ${table.value}%`}
              >
                <div 
                  className={`h-full rounded-full ${
                    isTriploid ? 'bg-brand-burgundy' : 
                    isDiploid ? 'bg-blue-600' : 
                    'bg-gradient-to-r from-brand-burgundy to-blue-600'
                  }`}
                  style={{ width: `${table.value}%` }}
                  title={`${table.value}% de la capacité maximale`}
                ></div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-burgundy/10 hover:bg-brand-burgundy/20 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Fermer la fenêtre modale"
              title="Fermer la fenêtre modale"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}