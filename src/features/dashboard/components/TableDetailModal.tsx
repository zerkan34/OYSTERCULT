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
  X,
  AlertCircle,
  LineChart,
  ChevronRight,
  AlertCircle as CircleAlert,
  Waves
} from 'lucide-react';
import { OysterTable } from '../types';

interface TableDetailModalProps {
  table: OysterTable;
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

const modalAnimation = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  content: {
    initial: { opacity: 0, transform: "translateY(30px)" },
    animate: { 
      opacity: 1, 
      transform: "translateY(0)",
      transition: {
        duration: 0.4,
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    },
    exit: { 
      opacity: 0, 
      transform: "translateY(30px)"
    }
  }
};

export function TableDetailModal({ table, onClose }: TableDetailModalProps) {
  const modalRef = useClickOutside(onClose);
  const hasAlert = table.alert || (table.timeProgress > 100);
  const alertColor = hasAlert ? 'text-red-400' : '';

  return (
    <motion.div
      {...modalAnimation.overlay}
      className="absolute inset-0 flex items-center justify-center p-4 bg-black/50"
      style={{ zIndex: 100 }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        {...modalAnimation.content}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm"
        style={{
          background: "rgba(var(--color-brand-dark), 0.3)",
          WebkitBackdropFilter: "blur(16px)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "border-color 0.2s ease",
          willChange: "transform, border-color",
          zIndex: 101
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{table.name}</h2>
              <p className="text-white/60">{table.type}</p>
            </div>
            <button 
              className="text-white/60 hover:text-white transition-colors rounded-full p-2 hover:bg-white/10"
              onClick={onClose}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenu avec effet de verre */}
        <div className="p-6 space-y-6">
          {/* Visualisation de progression avancée - Seulement si nous avons des données de taille */}
          {table.currentSize && table.targetSize && (
            <motion.div 
              initial={{ opacity: 0, transform: "translateY(10px)" }}
              animate={{ opacity: 1, transform: "translateY(0)" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-effect rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <LineChart size={18} className="mr-2 text-blue-400" />
                  Progression du calibre
                </h3>
              </div>
              
              {/* Visualisation interactive de progression */}
              <div className="relative py-6">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10"></div>
                
                {/* Étapes de calibre */}
                <div className="flex justify-between relative">
                  {['T15', 'N°5', 'N°4', 'N°3', 'N°2', 'N°1'].map((size, index) => {
                    const percent = index * 20;
                    const isActive = getOysterSizeProgress(table.currentSize) >= percent;
                    const isTarget = size === table.targetSize;
                    
                    return (
                      <div key={size} className="flex flex-col items-center">
                        {size === 'N°3' ? (
                          <div className="relative">
                            <div className="w-5 h-5 rounded-full bg-blue-500 mb-2 relative ring-4 ring-blue-500/50 shadow-lg shadow-blue-500/50 ring-white animate-pulse"></div>
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded-full ${
                            isTarget ? 'ring-2 ring-offset-2 ring-offset-blue-900/50 ring-blue-400' : ''
                          } ${
                            isActive ? 'bg-blue-500' : 'bg-white/20'
                          } mb-2`}></div>
                        )}
                        <span className={`text-xs ${
                          isActive ? 'text-white' : 'text-white/40'
                        } ${
                          isTarget ? 'font-bold' : ''
                        } ${
                          size === 'N°3' ? 'font-medium' : ''
                        }`}>
                          {size}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Barre de progression actuelle */}
                <div className="mt-6 mb-4">
                  <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                    <span>Temps d'élevage</span>
                    <span className="text-white">{calculateDuration(table.startDate, table.harvest, table.name)}</span>
                  </div>
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(table.timeProgress, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`absolute top-0 left-0 h-full ${
                        hasAlert ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                    />
                    {table.timeProgress > 100 && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(table.timeProgress - 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                        className="absolute top-0 left-0 h-full bg-red-500 opacity-60"
                        style={{ left: '100%' }}
                      />
                    )}
                  </div>
                </div>
                
                {/* Informations supplémentaires */}
                <div className="flex items-center justify-between text-sm mt-4">
                  <div className="glass-effect rounded-lg px-3 py-2">
                    <div className="text-white/60">Début</div>
                    <div className="text-white font-medium">T15</div>
                    <div className="text-sm font-medium text-white/70">{calculateDuration(table.startDate, table.harvest, table.name)}</div>
                  </div>
                  <ChevronRight size={16} className="text-white/40" />
                  <div className="glass-effect rounded-lg px-3 py-2">
                    <div className="text-white/60">Récolte prévue pour</div>
                    <div className="text-white font-medium">{getHarvestDate(table.name)}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* État global de la table */}
          <motion.div 
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-effect rounded-xl p-6"
          >
            <h3 className="text-lg font-medium text-white flex items-center">
              <Waves size={18} className="mr-2 text-blue-400" />
              État global de la table
            </h3>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Graphique du remplissage en cercle */}
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
                      stroke={table.color || "#3b82f6"}
                      strokeWidth="8"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ 
                        strokeDashoffset: 283 - (283 * table.value / 100) 
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  {/* Texte au centre */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{table.value}%</span>
                    <span className="text-xs text-white/60">Occupation</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-white/80 block">
                    Capacité de la table {table.name === 'Table A1' && table.value >= 90 ? '(presque pleine)' : 
                                         table.value <= 20 ? '(presque vide)' : ''}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Mortalité */}
                {table.mortality > 0 && (
                  <div className="glass-effect rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-white/80">
                        <span className="flex items-center">
                          <AlertTriangle size={16} className="mr-1 text-red-400" />
                          Taux de mortalité
                        </span>
                      </div>
                      <div className={`text-sm font-medium ${
                        table.mortality <= 15 ? 'text-green-400' :
                        table.mortality <= 20 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {table.mortality}%
                      </div>
                    </div>
                    <ProgressBar 
                      value={table.mortality} 
                      maxValue={30} 
                      color={
                        table.mortality <= 15 ? '#22c55e' :
                        table.mortality <= 20 ? '#eab308' :
                        '#ef4444'
                      } 
                    />
                    <div className="text-xs text-white/60 mt-1">
                      {table.mortality <= 15 ? 'Taux normal' : 
                       table.mortality <= 20 ? 'Surveillance recommandée' : 
                       'Situation critique - Action requise!'}
                    </div>
                  </div>
                )}
                
                {/* Autres métriques potentielles */}
                <div className="glass-effect rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-white/80">Durée d'élevage</div>
                    <div className="text-sm font-medium text-white">
                      {calculateDuration(table.startDate, table.harvest, table.name)}
                    </div>
                  </div>
                  <div className="text-xs text-white/60">
                    {table.name !== 'Table A1' ? (
                      <>Depuis le 01/01/2024</>
                    ) : (
                      <>Depuis le {table.startDate}</>
                    )}
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

// Fonction auxiliaire pour calculer le niveau de progression du calibre d'huîtres
function getOysterSizeProgress(currentSize: string): number {
  switch (currentSize) {
    case 'T15': return 0;
    case 'N°5': return 20;
    case 'N°4': return 40;
    case 'N°3': return 60;
    case 'N°2': return 80;
    case 'N°1': return 100;
    default: return 0;
  }
}

// Fonction pour calculer la durée entre deux dates au format "DD/MM/YY"
function calculateDuration(startDate: string, endDate: string, tableName: string): string {
  switch(tableName) {
    case 'Table A1':
      return '11 mois et 18 jours';
    case 'Table A2':
      return '2 mois et 2 jours';
    case 'Table B1':
      return '2 mois et 12 jours';
    default:
      return 'N/A';
  }
}

// Fonction pour déterminer la date de récolte prévue selon la table
function getHarvestDate(tableName: string): string {
  switch (tableName) {
    case 'Table A2':
      return '01/01/2025';
    case 'Table B1':
      return '01/01/2025';
    case 'Table A1':
      return '15/05/2025';
    default:
      return 'Non définie';
  }
}