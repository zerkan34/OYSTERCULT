import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';
import { 
  Clock, 
  Shell, 
  AlertTriangle,
  X,
  Calendar,
  Activity,
  ChevronRight,
  ArrowLeft,
  LineChart,
  BarChart4,
  Layers
} from 'lucide-react';
import { OysterTable } from '../types';
import { HistoryView } from './HistoryView';
import { SamplingView } from './SamplingView';

interface TableOccupationModalProps {
  table: OysterTable;
  onClose: () => void;
}

// Composant pour les jauges
const GaugeBar = ({ 
  value, 
  maxValue = 100, 
  color, 
  showLabels = true,
  labels = ['0%', '50%', '100%']
}: { 
  value: number; 
  maxValue?: number; 
  color: string;
  showLabels?: boolean;
  labels?: string[];
}) => {
  const percent = Math.min(100, Math.round((value / maxValue) * 100));
  return (
    <div className="space-y-1">
      <div className="relative h-3 w-full bg-white/10 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      {showLabels && (
        <div className="mt-1 text-xs text-white/60 flex justify-between">
          {labels.map((label, index) => (
            <div key={index}>{label}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant pour le camembert
const PieChart = ({ percentage, color = '#34d399' }: { percentage: number, color?: string }) => {
  const circumference = 2 * Math.PI * 45; // 45 est le rayon
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      {/* Cercle de fond */}
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />
        {/* Cercle de progression */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Texte du pourcentage */}
      <div className="text-center">
        <span className="text-4xl font-bold text-white">{percentage}%</span>
        <div className="text-sm text-white/70 mt-1">Occupation</div>
      </div>
    </div>
  );
};

// Composant pour la jauge de taille
const SizeGauge = ({ currentSize }: { currentSize: string }) => {
  const sizes = ['T15', 'N°5', 'N°4', 'N°3', 'N°2', 'N°1'];
  const currentIndex = sizes.indexOf(currentSize);
  
  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Calibre</h3>
      <div className="flex justify-between items-center">
        {sizes.map((size, index) => {
          const isActive = size === currentSize;
          const isPassed = index < currentIndex;
          
          return (
            <div 
              key={size} 
              className={`flex flex-col items-center ${isActive ? 'scale-110' : ''} transition-transform`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive 
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300 ring-opacity-50' 
                    : isPassed 
                      ? 'bg-blue-400/30 text-white/80' 
                      : 'bg-white/10 text-white/40'
                }`}
              >
                {index + 1}
              </div>
              <div className={`text-xs mt-1 ${
                isActive 
                  ? 'text-blue-400 font-medium' 
                  : isPassed 
                    ? 'text-white/80'
                    : 'text-white/40'
              }`}>
                {size}
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative h-1.5 w-full bg-white/10 rounded-full mt-2">
        <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ 
          width: `${(currentIndex / (sizes.length - 1)) * 100}%` 
        }} />
      </div>
    </div>
  );
};

export function TableOccupationModalNew({ table, onClose }: TableOccupationModalProps) {
  const modalRef = useClickOutside(onClose);
  const hasAlert = table.alert || (table.value > 90); // Alerte si l'occupation est supérieure à 90%
  
  // État pour gérer les différentes vues de la modale
  const [currentView, setCurrentView] = useState<'main' | 'history' | 'sampling'>('main');

  // Gestionnaires d'événements pour les différentes vues
  const handleHistoryClick = () => {
    setCurrentView('history');
  };

  const handleSamplingClick = () => {
    setCurrentView('sampling');
  };
  
  const handleBackToMain = () => {
    setCurrentView('main');
  };
  
  const handleSamplingSubmit = (data: any) => {
    console.log('Données d\'échantillonnage soumises:', data);
    alert(`Échantillonnage enregistré pour ${table.name}`);
    setCurrentView('main');
  };

  // Informations fictives (à remplacer par des données réelles)
  const mockData = {
    harvestDate: '15/06/2025',
    mortality: '4.2%',
    currentSize: 'N°3',
    timeRemaining: 100,
    startDate: '10/03/2024',
    durationDays: 97
  };

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
              {currentView !== 'main' && (
                <button 
                  onClick={handleBackToMain}
                  className="mr-2 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft size={20} className="text-white" />
                </button>
              )}
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                <Layers size={24} className="text-white relative z-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {currentView === 'main' && `Occupation - ${table.name}`}
                  {currentView === 'history' && `Historique - ${table.name}`}
                  {currentView === 'sampling' && `Échantillonnage - ${table.name}`}
                </h2>
                <p className="text-white/70">{table.type}</p>
                {table.status && currentView === 'main' && (
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
          {currentView === 'main' && (
            <>
              {/* Section principale avec camembert et informations de récolte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, transform: "translateY(20px)" }}
                  animate={{ opacity: 1, transform: "translateY(0)" }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="glass-effect rounded-xl p-6 flex flex-col items-center"
                >
                  <h3 className="text-lg font-medium text-white mb-4 self-start">Taux de remplissage</h3>
                  
                  <PieChart 
                    percentage={table.value} 
                    color={
                      table.value <= 70 ? '#34d399' : // vert
                      table.value <= 90 ? '#fbbf24' : // jaune
                      '#f87171' // rouge
                    } 
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, transform: "translateY(20px)" }}
                  animate={{ opacity: 1, transform: "translateY(0)" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="glass-effect rounded-xl p-6 space-y-6"
                >
                  <h3 className="text-lg font-medium text-white">Données clés</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar size={20} className="text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">Date de récolte estimée</div>
                        <div className="text-white/70 text-sm">
                          {mockData.harvestDate}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <AlertTriangle size={20} className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">Mortalité</div>
                        <div className="text-white/70 text-sm">
                          {mockData.mortality}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {hasAlert && (
                    <div className="glass-effect rounded-lg p-4 bg-red-500/10 mt-4">
                      <div className="flex items-start">
                        <AlertTriangle size={20} className="text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <div className="text-white font-medium mb-1">Alerte de surpopulation</div>
                          <div className="text-white/80 text-sm">
                            La table est proche de sa capacité maximale. Vérifiez la répartition et envisagez une redistribution.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Section Jauge Calibre et Temps Restant */}
              <motion.div 
                initial={{ opacity: 0, transform: "translateY(20px)" }}
                animate={{ opacity: 1, transform: "translateY(0)" }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="glass-effect rounded-xl p-6 space-y-6"
              >
                <div className="space-y-6">
                  {/* Jauge calibre */}
                  <SizeGauge currentSize={mockData.currentSize} />
                  
                  {/* Calibre actuel */}
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="text-white">Calibre actuel:</div>
                    <div className="px-3 py-1 bg-blue-500/30 rounded-full text-blue-200 font-medium">
                      {mockData.currentSize}
                    </div>
                  </div>
                  
                  {/* Jauge temps restant */}
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <div className="text-white">Temps restant (est.)</div>
                      <div className="text-green-400 font-medium">{mockData.timeRemaining}%</div>
                    </div>
                    <GaugeBar 
                      value={mockData.timeRemaining} 
                      color="#34d399" 
                    />
                  </div>
                </div>
              </motion.div>

              {/* Informations complémentaires */}
              <motion.div 
                initial={{ opacity: 0, transform: "translateY(20px)" }}
                animate={{ opacity: 1, transform: "translateY(0)" }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="glass-effect rounded-xl p-6"
              >
                <h3 className="text-lg font-medium text-white mb-4">Informations complémentaires</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <Calendar size={20} className="text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Date de mise en élevage</div>
                      <div className="text-white/70 text-sm">
                        {mockData.startDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock size={20} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">Durée d'élevage</div>
                      <div className="text-white/70 text-sm">
                        {mockData.durationDays} jours
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
          
          {currentView === 'history' && (
            <HistoryView tableName={table.name} />
          )}
          
          {currentView === 'sampling' && (
            <SamplingView 
              tableName={table.name}
              currentSize={table.currentSize || mockData.currentSize}
              onCancel={handleBackToMain}
              onSubmit={handleSamplingSubmit}
            />
          )}
        </div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="flex justify-end space-x-3 p-6 border-t border-white/10"
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors"
          >
            Fermer
          </button>
          {currentView === 'main' && (
            <>
              <button
                onClick={handleHistoryClick}
                className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors"
              >
                Historique
              </button>
              <button
                onClick={handleSamplingClick}
                className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                Échantillonnage
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
