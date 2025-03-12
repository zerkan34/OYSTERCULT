import React from 'react';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';
import { useState } from 'react';
import { 
  Clock, 
  Shell, 
  ThermometerSun, 
  Droplets,
  Calendar,
  AlertTriangle,
  X,
  Users,
  LineChart,
  ChevronRight,
  ArrowLeft,
  Activity,
  BarChart4,
  FilePlus,
  Save,
  Waves,
  Layers
} from 'lucide-react';
import { OysterTable } from '../types';
import { HistoryView } from './HistoryView';
import { SamplingView } from './SamplingView';

interface TableOccupationModalProps {
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

export function TableOccupationModal({ table, onClose }: TableOccupationModalProps) {
  const modalRef = useClickOutside(onClose);
  const hasAlert = table.alert || (table.value > 90); // Alerte si l'occupation est supérieure à 90%
  const alertColor = hasAlert ? 'text-red-400' : '';
  
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
                    <Users size={24} className="text-blue-400" />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, transform: "translateY(20px)" }}
                  animate={{ opacity: 1, transform: "translateY(0)" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="glass-effect rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="text-white/60 mb-1 text-sm">Capacité totale</div>
                    <div className="text-2xl font-bold text-white">
                      {table.totalUnits || 'N/A'}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-700/20 flex items-center justify-center">
                    <Layers size={24} className="text-green-400" />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, transform: "translateY(20px)" }}
                  animate={{ opacity: 1, transform: "translateY(0)" }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="glass-effect rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="text-white/60 mb-1 text-sm">Dernière mise à jour</div>
                    <div className="text-2xl font-bold text-white">
                      {table.lastUpdate || 'N/A'}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-700/20 flex items-center justify-center">
                    <Clock size={24} className="text-purple-400" />
                  </div>
                </motion.div>
              </div>

              {/* Visualisation de progression */}
              <motion.div 
                initial={{ opacity: 0, transform: "translateY(20px)" }}
                animate={{ opacity: 1, transform: "translateY(0)" }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="glass-effect rounded-xl p-6 space-y-4"
              >
                <h3 className="text-lg font-medium text-white mb-4">Répartition de l'occupation</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-white">Occupation actuelle</div>
                      <div className={`text-sm font-medium ${
                        table.value <= 70 ? 'text-green-400' :
                        table.value <= 90 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {table.value}%
                      </div>
                    </div>
                    <ProgressBar 
                      value={table.value} 
                      color={
                        table.value <= 70 ? '#34d399' :
                        table.value <= 90 ? '#fbbf24' :
                        '#f87171'
                      } 
                    />
                    <div className="mt-1 text-xs text-white/60 flex justify-between">
                      <div>0%</div>
                      <div>50%</div>
                      <div>100%</div>
                    </div>
                  </div>

                  {/* Répartition par taille si disponible */}
                  {table.currentSize && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-white">Répartition par taille</div>
                        <div className="text-sm font-medium text-white">
                          {table.currentSize}
                        </div>
                      </div>
                      <div className="grid grid-cols-6 gap-1">
                        {['T15', 'N°5', 'N°4', 'N°3', 'N°2', 'N°1'].map((size, i) => (
                          <div key={size} className="flex flex-col items-center">
                            <div className={`w-full h-20 rounded-md ${
                              size === table.currentSize 
                                ? 'bg-blue-500/50' 
                                : 'bg-white/10'
                            } flex items-end justify-center`}>
                              <div 
                                className={`w-full ${
                                  i === 0 ? 'h-1/6' :
                                  i === 1 ? 'h-2/6' :
                                  i === 2 ? 'h-3/6' :
                                  i === 3 ? 'h-4/6' :
                                  i === 4 ? 'h-5/6' :
                                  'h-full'
                                } bg-${
                                  size === table.currentSize 
                                    ? 'blue-400/80' 
                                    : 'white/5'
                                } rounded-b-md`}
                              ></div>
                            </div>
                            <div className={`text-xs mt-1 ${
                              size === table.currentSize 
                                ? 'text-blue-400 font-medium' 
                                : 'text-white/60'
                            }`}>
                              {size}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Informations complémentaires */}
              <motion.div 
                initial={{ opacity: 0, transform: "translateY(20px)" }}
                animate={{ opacity: 1, transform: "translateY(0)" }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="glass-effect rounded-xl p-6"
              >
                <h3 className="text-lg font-medium text-white mb-4">Informations complémentaires</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Layers size={20} className="text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">Nombre de couches</div>
                        <div className="text-white/60 text-sm">
                          {table.layers || '3'} couches
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Shell size={20} className="text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">Densité</div>
                        <div className="text-white/60 text-sm">
                          {table.density || 'Moyenne'} - {table.currentSize || 'N°4'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Clock size={20} className="text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">Date de mise en place</div>
                        <div className="text-white/60 text-sm">
                          {table.startDate || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    {table.alert && (
                      <div className="glass-effect rounded-lg p-4 bg-red-500/10">
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
              currentSize={table.currentSize}
              onCancel={handleBackToMain}
              onSubmit={handleSamplingSubmit}
            />
          )}
        </div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
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
