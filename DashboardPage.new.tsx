import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ThermometerSun, Droplets, LineChart, Calendar, AlertTriangle, Clock, Shell, Waves, AlertCircle } from 'lucide-react';
import { ModernStatCard } from '@/components/ui/ModernStatCard';
import { WeatherWidget } from '../components/WeatherWidget';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { TableDetailModal } from '../components/TableDetailModal';
import { PoolDetailModal } from '../components/PoolDetailModal';

// Fonction pour calculer le nombre de jours restants
const getDaysRemaining = (harvestDate: string) => {
  const [day, month, year] = harvestDate.split('/');
  const date = new Date(parseInt(`20${year}`), parseInt(month) - 1, parseInt(day));
  const daysRemaining = differenceInDays(date, new Date());
  return daysRemaining;
};

// Calcul du pourcentage de progression de la taille des huîtres
// T15 (0%) -> N°5 (25%) -> N°4 (50%) -> N°3 (75%) -> N°2 (85%) -> N°1 (100%)
const getOysterSizeProgress = (currentSize: string): number => {
  switch (currentSize) {
    case 'T15': return 0;
    case 'N°5': return 25;
    case 'N°4': return 50;
    case 'N°3': return 75;
    case 'N°2': return 85;
    case 'N°1': return 100;
    default: return 0;
  }
};

// Données pour l'occupation des tables
const tableOccupancyData = [
  { 
    name: 'Table A1',
    value: 70, // Taux de remplissage à 70%
    color: '#22c55e',
    type: 'Huîtres sur cordes',
    currentSize: 'N°3', // Qualibré en cours: N°3
    targetSize: 'N°3', // Qualibré souhaité: N°3
    timeProgress: 100, // 100% du temps d'élevage écoulé
    startDate: '15/04/24', // Date de mise en eau
    harvest: '15/06/25', // Date de récolte prévue
    mortality: 17.5 // Taux de mortalité entre 15-25%
  },
  { 
    name: 'Table A2',
    value: 20, // Taux de remplissage à 20%
    color: '#ef4444', // Rouge pour alerter
    type: 'Huîtres sur cordes',
    currentSize: 'N°1', // Qualibré en cours: N°1 (dépassé)
    targetSize: 'N°2', // Qualibré souhaité: N°2
    timeProgress: 120, // 120% du temps écoulé (dépassé)
    startDate: '10/01/24',
    harvest: '20/03/25',
    mortality: 23.8, // Proche de la limite haute
    alert: 'Calibre dépassé' // Alerte spécifique
  },
  { 
    name: 'Table B1',
    value: 100, // Taux de remplissage à 100%
    color: '#eab308', // Jaune pour attirer l'attention
    type: 'Huîtres sur cordes',
    currentSize: 'N°5', // Qualibré en cours: N°5 (début)
    targetSize: 'N°3', // Qualibré souhaité: N°3
    timeProgress: 30, // 30% du temps écoulé
    startDate: '01/01/25',
    harvest: '01/03/26',
    mortality: 15.2 // Proche de la limite basse
  },
  { 
    name: 'Table B2',
    value: 0, // Table vide
    color: '#94a3b8', // Gris pour indiquer une table inactive
    type: 'Huîtres sur cordes',
    currentSize: 'N/A', // Pas de calibre en cours
    targetSize: 'N°3', // Calibre cible pour la prochaine utilisation
    timeProgress: 0, // 0% du temps écoulé
    startDate: 'N/A',
    harvest: 'N/A',
    mortality: 0,
    status: 'Vide' // Statut spécial
  }
];

// Données pour les bassins
const poolData = [
  { 
    name: 'Bassin A1',
    value: 55, // Capacité utilisée combinée
    color: '#22c55e',
    type: 'Purification',
    capacity: 1000,
    currentLoad: 550,
    products: [
      { name: 'Moules', quantity: 500, unit: 'kg', color: '#3b82f6' }, // Bleu pour les moules
      { name: 'Palourdes', quantity: 6, unit: 'kg', color: '#ec4899' }  // Rose pour les palourdes
    ],
    waterQuality: {
      quality: 98,
      oxygen: 95,
      temperature: 12.5
    }
  },
  { 
    name: 'Bassin A2',
    value: 65,
    color: '#eab308',
    type: 'Purification',
    capacity: 1000,
    currentLoad: 650,
    products: [
      { name: 'Huîtres creuses', quantity: 600, unit: 'kg', color: '#84cc16' },
      { name: 'Coques', quantity: 50, unit: 'kg', color: '#f97316' }
    ],
    waterQuality: {
      quality: 92,
      oxygen: 88,
      temperature: 13.2
    }
  },
  { 
    name: 'Bassin B1',
    value: 90,
    color: '#ef4444', // Rouge car presque plein
    type: 'Stockage',
    capacity: 1500,
    currentLoad: 1350,
    products: [
      { name: 'Huîtres plates', quantity: 1200, unit: 'kg', color: '#8b5cf6' },
      { name: 'Bulots', quantity: 150, unit: 'kg', color: '#f59e0b' }
    ],
    waterQuality: {
      quality: 96,
      oxygen: 92,
      temperature: 12.8
    }
  }
];

export function DashboardPage() {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [hoveredPool, setHoveredPool] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<typeof tableOccupancyData[0] | null>(null);
  const [selectedPool, setSelectedPool] = useState<typeof poolData[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-burgundy/20 blur-xl rounded-full" />
          <LineChart size={24} className="text-brand-burgundy relative z-10" />
        </div>
        <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
      </div>

      {/* Météo */}
      <WeatherWidget />

      {/* Bloc unifié des statistiques */}
      <div className="glass-effect rounded-xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Colonne de gauche: Tables */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-medium text-white">Occupation des tables</h3>
              <div className="text-xs md:text-sm text-white/60">4 tables actives</div>
            </div>
            <div className="space-y-3">
              {tableOccupancyData.map((table, index) => {
                const sizeProgress = getOysterSizeProgress(table.currentSize);
                const hasAlert = table.alert || (table.timeProgress > 100);
                
                return (
                  <motion.div 
                    key={index} 
                    className={`relative bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer overflow-hidden ${
                      hoveredTable === table.name ? 'ring-2 ring-brand-burgundy shadow-neon' : ''
                    } ${table.value === 0 ? 'opacity-60' : ''}`}
                    onHoverStart={() => setHoveredTable(table.name)}
                    onHoverEnd={() => setHoveredTable(null)}
                    onClick={() => setSelectedTable(table)}
                    whileHover={{ y: -4 }}
                  >
                    {/* Effet de surbrillance */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/5 to-transparent pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredTable === table.name ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: table.color }} />
                          <div>
                            <div className="text-sm md:text-base text-white">{table.name}</div>
                            <div className="text-xs text-white/70">{table.type}</div>
                            {table.status && (
                              <div className="text-xs text-white/50 mt-1">{table.status}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm md:text-base font-semibold text-white">{table.value}%</div>
                          <div className="text-xs text-white/70">occupée</div>
                        </div>
                      </div>

                      {/* Jauge de taux de remplissage */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                          <span>Remplissage</span>
                          <span>{table.value}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${table.value}%`, 
                              backgroundColor: table.color
                            }} 
                          />
                        </div>
                      </div>

                      {/* Jauge temporelle / calibre */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                          <span>Progression T15 → {table.targetSize}</span>
                          <span className={hasAlert ? 'text-red-400' : ''}>{table.timeProgress}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${hasAlert ? 'bg-red-500' : ''}`} 
                            style={{ 
                              width: `${Math.min(table.timeProgress, 100)}%`, 
                              backgroundColor: hasAlert ? undefined : (table.value === 0 ? '#94a3b8' : '#3b82f6')
                            }} 
                          />
                        </div>
                      </div>

                      {/* Calibre actuel */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-white/70 text-sm">
                          <Shell className="w-4 h-4 mr-1" />
                          Calibre actuel: <span className="ml-1 font-semibold text-white">{table.currentSize}</span>
                        </div>
                        {table.alert && (
                          <div className="flex items-center text-red-400 text-xs">
                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                            {table.alert}
                          </div>
                        )}
                      </div>

                      {/* Informations de date et mortalité */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-white/60">
                          {table.harvest !== 'N/A' && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Récolte: {table.harvest}
                            </div>
                          )}
                        </div>
                        {table.mortality > 0 && (
                          <div className={`flex items-center ${
                            table.mortality <= 15 ? 'text-green-400' :
                            table.mortality <= 20 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            {table.mortality}% mortalité
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Colonne de droite: Bassins */}
          <div className="space-y-4 md:space-y-6 mt-6 md:mt-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-medium text-white">Santé des bassins</h3>
              <div className="text-xs md:text-sm text-white/60">3 bassins actifs</div>
            </div>
            <div className="space-y-3">
              {poolData.map((pool, index) => (
                <motion.div 
                  key={index}
                  className={`relative bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer overflow-hidden ${
                    hoveredPool === pool.name ? 'ring-2 ring-brand-burgundy shadow-neon' : ''
                  }`}
                  onHoverStart={() => setHoveredPool(pool.name)}
                  onHoverEnd={() => setHoveredPool(null)}
                  onClick={() => setSelectedPool(pool)}
                  whileHover={{ y: -4 }}
                >
                  {/* Effet de surbrillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/5 to-transparent pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredPool === pool.name ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pool.color }} />
                        <div>
                          <div className="text-sm md:text-base text-white">{pool.name}</div>
                          <div className="text-xs text-white/70">{pool.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm md:text-base font-semibold text-white">{pool.value}%</div>
                        <div className="text-xs text-white/70">occupé</div>
                      </div>
                    </div>

                    {/* Jauge de capacité avec produits différenciés */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                        <span>Capacité</span>
                        <span>{pool.currentLoad}/{pool.capacity} kg</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                        {pool.products.map((product, productIndex) => {
                          const productPercentage = (product.quantity / pool.capacity) * 100;
                          
                          return (
                            <div 
                              key={productIndex}
                              className="h-full" 
                              style={{ 
                                width: `${productPercentage}%`, 
                                backgroundColor: product.color,
                                marginLeft: productIndex === 0 ? 0 : '-1px', // Éviter les écarts entre segments
                              }} 
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Liste des produits */}
                    <div className="mb-3">
                      <div className="text-xs font-medium text-white/80 mb-1">Produits:</div>
                      <div className="flex flex-wrap gap-2">
                        {pool.products.map((product, productIndex) => (
                          <div key={productIndex} className="flex items-center text-xs">
                            <div 
                              className="w-2 h-2 rounded-full mr-1" 
                              style={{ backgroundColor: product.color }} 
                            />
                            <span className="text-white/70">{product.name}:</span>
                            <span className="ml-1 text-white font-medium">{product.quantity} {product.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Qualité de l'eau */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-white/60">
                        <Droplets className="w-4 h-4 mr-1" />
                        Qualité eau: 
                        <span className={`ml-1 ${
                          pool.waterQuality.quality >= 95 ? 'text-green-400' :
                          pool.waterQuality.quality >= 90 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {pool.waterQuality.quality}%
                        </span>
                      </div>
                      <div className="flex items-center text-white/60">
                        <ThermometerSun className="w-4 h-4 mr-1" />
                        {pool.waterQuality.temperature}°C
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de détail de table */}
      <AnimatePresence>
        {selectedTable && (
          <TableDetailModal table={selectedTable} onClose={() => setSelectedTable(null)} />
        )}
      </AnimatePresence>

      {/* Modal de détail de bassin */}
      <AnimatePresence>
        {selectedPool && (
          <PoolDetailModal pool={selectedPool} onClose={() => setSelectedPool(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
