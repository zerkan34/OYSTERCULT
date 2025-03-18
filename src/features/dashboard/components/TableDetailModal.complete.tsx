import React, { useState } from 'react';
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
  Waves,
  Clock3,
  User
} from 'lucide-react';

// Type étendu pour les tables d'huîtres avec toutes les propriétés nécessaires
export interface OysterTable {
  id: string;
  name: string;
  type: string;
  status: string;
  occupancy: number;
  startDate: string;
  harvestDate: string;
  mortality: number;
  alert: string | null;
  timeProgress: number;
  currentSize: string;
  targetSize: string;
}

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

// Composant de jauge pour afficher la progression du calibre avec dégradé optimisé
const CalibreGauge = ({ currentSize, targetSize, progress }: { currentSize: string, targetSize: string, progress: number }) => {
  // Déterminer les différentes étapes du calibre
  const calibreSteps = ['T15', 'N°5', 'N°4', 'N°3', 'N°2', 'N°1'];
  const currentIndex = calibreSteps.indexOf(currentSize);
  const targetIndex = calibreSteps.indexOf(targetSize);
  
  // Calculer le pourcentage de progression
  const calibreProgress = (currentIndex !== -1 && targetIndex !== -1) 
    ? Math.min(100, Math.round((currentIndex / targetIndex) * 100))
    : 0;
  
  // Obtenir la couleur du curseur basée sur la progression
  const getCursorColor = () => {
    if (progress > 100) return "#ef4444"; // Rouge si dépassé
    if (progress >= 85) return "#22c55e"; // Vert si à l'objectif ou proche
    if (progress >= 70) return "#3b82f6"; // Bleu sinon
    return "#3b82f6"; // Bleu par défaut
  };
  
  return (
    <div className="mt-4 mb-2">
      <div className="flex justify-between items-center mb-1">
        <div className="text-white/70 text-xs">Début</div>
        <div className="text-white/70 text-xs">Objectif</div>
        <div className="text-white/70 text-xs">Final</div>
      </div>
      
      {/* Barre de progression avec dégradé */}
      <div className="relative h-3 w-full rounded-full overflow-hidden">
        {/* Fond avec dégradé */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{ 
            background: 'linear-gradient(to right, #3b82f6, #3b82f6 30%, #3b82f6 50%, #3b82f6 75%, #22c55e 85%, #eab308 95%, #ef4444)'
          }}
        />
        
        {/* Overlay de transparence pour les sections non atteintes */}
        <div 
          className="absolute inset-y-0 right-0 bg-gray-900/70 rounded-r-full transition-all duration-1000 ease-out"
          style={{ width: `${100 - progress}%` }}
        />
        
        {/* Marqueur vertical à la position cible (85%) */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white/70"
          style={{ left: '85%' }}
        />
        
        {/* Curseur dynamique avec halo lumineux */}
        <div 
          className="absolute top-1/2 z-10 -translate-y-1/2 transition-all duration-1000"
          style={{ left: `${progress}%` }}
        >
          {/* Halo lumineux animé */}
          <motion.div 
            className="absolute -inset-2 rounded-full opacity-30"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ backgroundColor: getCursorColor() }}
          />
          
          {/* Point central */}
          <div 
            className="w-4 h-4 rounded-full shadow-lg border-2 border-white z-20"
            style={{ backgroundColor: getCursorColor() }}
          />
        </div>
      </div>
      
      {/* Calibres avec mise en évidence */}
      <div className="flex justify-between mt-1">
        {calibreSteps.map((step, index) => (
          <div 
            key={index} 
            className={`text-xs ${step === currentSize ? 'text-white font-bold' : step === targetSize ? 'text-green-400 font-bold' : 'text-white/50'}`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour la grille d'occupation
const OccupancyGrid = ({ occupancy }: { occupancy: number }) => {
  // Générer 10 carrés d'occupation
  const squares = Array.from({ length: 10 }, (_, i) => i + 1);
  
  // Calculer le nombre de carrés remplis
  const filledSquares = (occupancy / 100) * 10;
  
  // Style commun pour tous les carrés
  const squareStyle = "w-full h-7 rounded-sm border border-white/10";
  
  return (
    <div className="grid grid-cols-10 gap-1 w-full mt-2" style={{ backgroundColor: "rgb(7, 26, 64)" }}>
      {squares.map((square) => {
        // Déterminer si ce carré est vide, partiellement rempli ou complètement rempli
        const isEmpty = square > Math.ceil(filledSquares);
        const isPartiallyFilled = square === Math.ceil(filledSquares) && !Number.isInteger(filledSquares);
        const isFilled = square <= Math.floor(filledSquares);
        
        // Le premier carré est toujours vide (début de l'occupation)
        const isFirstSquare = square === 1;
        
        // Appliquer le style approprié
        if (isFirstSquare) {
          return <div key={square} className={`${squareStyle} bg-transparent`} />;
        } else if (isFilled) {
          return <div key={square} className={`${squareStyle} bg-[#a02648]`} />;
        } else if (isPartiallyFilled) {
          return (
            <div key={square} className={`${squareStyle} relative overflow-hidden`}>
              <div 
                className="absolute top-0 left-0 bottom-0 bg-[#a02648]" 
                style={{ width: "50%" }}
              />
            </div>
          );
        } else {
          return <div key={square} className={`${squareStyle} bg-transparent`} />;
        }
      })}
    </div>
  );
};

// Historique des manipulations
const ActivityHistory = () => {
  // Données d'exemple pour l'historique (ordonnées chronologiquement du plus récent au plus ancien)
  const activities = [
    { date: '13/01/2025', action: 'Échantillonnage', user: 'Sophie L.' },
    { date: '12/01/2025', action: 'Vider 15 cordes', user: 'Marc D.' },
    { date: '11/01/2025', action: 'Vider 15 cordes', user: 'Jean F.' },
    { date: '10/01/2025', action: 'Vider 15 cordes', user: 'Pierre M.' }
  ];
  
  return (
    <div className="space-y-3 mt-4">
      {activities.map((activity, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-white/10">
              <Clock3 size={16} className="text-blue-400" />
            </div>
            <div>
              <div className="text-white font-medium">{activity.action}</div>
              <div className="text-sm text-white/60">{activity.date}</div>
            </div>
          </div>
          <div className="flex items-center">
            <User size={16} className="text-white/40 mr-1" />
            <span className="text-white/70">{activity.user}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export function TableDetailModal({ table, onClose }: TableDetailModalProps) {
  const modalRef = useClickOutside(onClose);
  const hasAlert = table.alert || (table.timeProgress > 100);
  const alertColor = hasAlert ? 'text-red-400' : '';
  
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

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
          {/* Onglets */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'info' 
                  ? 'text-white border-b-2 border-brand-burgundy' 
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'history' 
                  ? 'text-white border-b-2 border-brand-burgundy' 
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Historique
            </button>
          </div>

          {activeTab === 'info' && (
            <>
              {/* Grille d'occupation */}
              <motion.div 
                initial={{ opacity: 0, transform: "translateY(10px)" }}
                animate={{ opacity: 1, transform: "translateY(0)" }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-xl p-6 space-y-4"
              >
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Waves size={18} className="mr-2 text-blue-400" />
                  Occupation de la table
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-white">{table.occupancy}%</div>
                  <div className="text-sm text-white/60">{Math.round(table.occupancy * 0.1)}/10 unités</div>
                </div>
                
                {/* Visualisation de l'occupation avec grille de 10 carrés */}
                <OccupancyGrid occupancy={table.occupancy} />
                
                {/* Alert si nécessaire */}
                {table.alert && (
                  <div className="flex items-center p-3 bg-red-500/20 rounded-lg mt-3">
                    <AlertCircle size={16} className="text-red-400 mr-2 flex-shrink-0" />
                    <p className="text-sm text-white">
                      {table.alert}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Jauge de calibre */}
              <motion.div 
                initial={{ opacity: 0, transform: "translateY(10px)" }}
                animate={{ opacity: 1, transform: "translateY(0)" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-effect rounded-xl p-6 space-y-4"
              >
                <h3 className="text-lg font-medium text-white flex items-center">
                  <LineChart size={18} className="mr-2 text-blue-400" />
                  Progression du calibre
                </h3>
                
                {/* Alerte si calibre dépassé */}
                {hasAlert && (
                  <div className="flex items-center p-3 bg-amber-500/20 rounded-lg">
                    <AlertTriangle size={16} className="text-amber-400 mr-2 flex-shrink-0" />
                    <p className="text-sm text-white">
                      {table.alert || "Calibre dépassé"}
                    </p>
                  </div>
                )}
                
                {/* Jauge de calibre avec dégradé */}
                <CalibreGauge 
                  currentSize={table.currentSize} 
                  targetSize={table.targetSize} 
                  progress={table.timeProgress} 
                />
                
                {/* Informations de calibre */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="glass-effect rounded-lg p-3">
                    <div className="text-white/60">Calibre actuel</div>
                    <div className="text-white font-semibold text-lg">{table.currentSize}</div>
                  </div>
                  <div className="glass-effect rounded-lg p-3">
                    <div className="text-white/60">Calibre cible</div>
                    <div className="text-white font-semibold text-lg">{table.targetSize}</div>
                  </div>
                </div>
              </motion.div>

              {/* Informations supplémentaires */}
              <motion.div 
                initial={{ opacity: 0, transform: "translateY(10px)" }}
                animate={{ opacity: 1, transform: "translateY(0)" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-effect rounded-xl p-6 space-y-4"
              >
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Calendar size={18} className="mr-2 text-blue-400" />
                  Informations de production
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 mb-1">Date de démarrage</div>
                    <div className="text-white font-medium">{table.startDate}</div>
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">Date de récolte prévue</div>
                    <div className="text-white font-medium">{table.harvestDate}</div>
                  </div>
                </div>
                
                {/* Mortalité */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-white/60">Taux de mortalité</div>
                    <div className={`text-sm ${
                      table.mortality > 20 ? 'text-red-400' : 
                      table.mortality > 15 ? 'text-amber-400' : 
                      'text-green-400'
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
                </div>
              </motion.div>
            </>
          )}
          
          {activeTab === 'history' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-effect rounded-xl p-6"
            >
              <h3 className="text-lg font-medium text-white mb-4">Historique des manipulations</h3>
              <ActivityHistory />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
