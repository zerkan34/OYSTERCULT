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
  CircleAlert,
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

export function TableDetailModal({ table, onClose }: TableDetailModalProps) {
  const modalRef = useClickOutside(onClose);
  const hasAlert = table.alert || (table.timeProgress > 100);
  const alertColor = hasAlert ? 'text-red-400' : '';

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
        <div className="bg-gradient-to-r from-blue-900/80 to-brand-burgundy/80 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                <Shell size={24} className="text-white relative z-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{table.name}</h2>
                <p className="text-white/70">{table.type}</p>
                {table.status && (
                  <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-white/10 text-white/80">
                    {table.status}
                  </span>
                )}
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
                <div className="text-white/60 mb-1 text-sm">Occupation</div>
                <div className="text-2xl font-bold text-white flex items-baseline">
                  {table.value}%
                  <span className="text-sm text-white/40 ml-1">capacité</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center">
                <Shell size={24} className="text-blue-400" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, transform: "translateY(20px)" }}
              animate={{ opacity: 1, transform: "translateY(0)" }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="glass-effect rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-white/60 mb-1 text-sm">Récolte</div>
                <div className="text-2xl font-bold text-white">
                  {table.harvest !== 'N/A' ? table.harvest : '-'}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-700/20 flex items-center justify-center">
                <Calendar size={24} className="text-green-400" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, transform: "translateY(20px)" }}
              animate={{ opacity: 1, transform: "translateY(0)" }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="glass-effect rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-white/60 mb-1 text-sm">Mortalité</div>
                <div className={`text-2xl font-bold ${
                  table.mortality <= 15 ? 'text-green-400' :
                  table.mortality <= 20 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {table.mortality > 0 ? `${table.mortality}%` : '-'}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
            </motion.div>
          </div>

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
                {hasAlert && (
                  <div className="flex items-center text-red-400 text-sm px-2.5 py-1 bg-red-500/10 rounded-full">
                    <CircleAlert size={14} className="mr-1" />
                    {table.alert || "Calibre dépassé"}
                  </div>
                )}
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
                        <div className={`w-5 h-5 rounded-full ${
                          isTarget ? 'ring-2 ring-offset-2 ring-offset-blue-900/50 ring-blue-400' : ''
                        } ${
                          isActive ? 'bg-blue-500' : 'bg-white/20'
                        } mb-2`}></div>
                        <span className={`text-xs ${
                          isActive ? 'text-white' : 'text-white/40'
                        } ${
                          isTarget ? 'font-bold' : ''
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
                    <span>Progression temporelle</span>
                    <span className={hasAlert ? 'text-red-400 font-medium' : 'text-white'}>
                      {table.timeProgress}%
                    </span>
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
                    <div className="text-white/60">Calibre actuel</div>
                    <div className="text-white font-medium">{table.currentSize}</div>
                  </div>
                  <ChevronRight size={16} className="text-white/40" />
                  <div className="glass-effect rounded-lg px-3 py-2">
                    <div className="text-white/60">Calibre cible</div>
                    <div className="text-white font-medium">{table.targetSize}</div>
                  </div>
                  <ChevronRight size={16} className="text-white/40" />
                  <div className="glass-effect rounded-lg px-3 py-2">
                    <div className="text-white/60">Début</div>
                    <div className="text-white font-medium">
                      {table.startDate !== 'N/A' ? table.startDate : '-'}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/40" />
                  <div className="glass-effect rounded-lg px-3 py-2">
                    <div className="text-white/60">Récolte</div>
                    <div className="text-white font-medium">
                      {table.harvest !== 'N/A' ? table.harvest : '-'}
                    </div>
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
                    Capacité de la table {table.value >= 90 ? '(presque pleine)' : 
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
                      {table.startDate !== 'N/A' && table.harvest !== 'N/A' 
                        ? calculateDuration(table.startDate, table.harvest) 
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="text-xs text-white/60">
                    {table.startDate !== 'N/A' ? `Depuis le ${table.startDate}` : '-'}
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
function calculateDuration(startDate: string, endDate: string): string {
  if (startDate === 'N/A' || endDate === 'N/A') return 'N/A';
  
  const [startDay, startMonth, startYear] = startDate.split('/').map(Number);
  const [endDay, endMonth, endYear] = endDate.split('/').map(Number);
  
  const start = new Date(2000 + startYear, startMonth - 1, startDay);
  const end = new Date(2000 + endYear, endMonth - 1, endDay);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffMonths > 0) {
    return `${diffMonths} mois ${diffDays % 30 > 0 ? `et ${diffDays % 30} jours` : ''}`;
  }
  
  return `${diffDays} jours`;
}
