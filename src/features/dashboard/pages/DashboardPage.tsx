import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ThermometerSun, Droplets, LineChart, Calendar, AlertTriangle, Clock, Shell, Waves } from 'lucide-react';
import { ModernStatCard } from '@/components/ui/ModernStatCard';
import { WeatherWidget } from '../components/WeatherWidget';
import { differenceInDays } from 'date-fns';
import { TableDetailModal } from '../components/TableDetailModal';
import { PoolDetailModal } from '../components/PoolDetailModal';

// Fonction pour calculer le nombre de jours restants
const getDaysRemaining = (harvestDate: string) => {
  const [day, month, year] = harvestDate.split('/');
  const date = new Date(parseInt(`20${year}`), parseInt(month) - 1, parseInt(day));
  const daysRemaining = differenceInDays(date, new Date());
  return daysRemaining;
};

// Données pour l'occupation des tables
const tableOccupancyData = [
  { 
    name: 'Table A1',
    value: 85,
    color: '#22c55e',
    type: 'Plates N°3',
    harvest: '15/06/25',
    mortality: 2.1
  },
  { 
    name: 'Table A2',
    value: 75,
    color: '#eab308',
    type: 'Creuses N°2',
    harvest: '20/06/25',
    mortality: 2.8
  },
  { 
    name: 'Table B1',
    value: 90,
    color: '#22c55e',
    type: 'Plates N°4',
    harvest: '01/07/25',
    mortality: 1.9
  },
  { 
    name: 'Table B2',
    value: 65,
    color: '#ef4444',
    type: 'Creuses N°3',
    harvest: '05/07/25',
    mortality: 3.2
  }
];

// Données pour les bassins
const poolData = [
  { 
    name: 'Bassin A1',
    value: 80,
    color: '#22c55e',
    type: 'Purification',
    capacity: 1000,
    currentLoad: 800,
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
    waterQuality: {
      quality: 92,
      oxygen: 88,
      temperature: 13.2
    }
  },
  { 
    name: 'Bassin B1',
    value: 90,
    color: '#22c55e',
    type: 'Stockage',
    capacity: 1500,
    currentLoad: 1350,
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
    <div className="space-y-6" role="main" aria-label="Tableau de bord d'exploitation ostréicole">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-burgundy/20 blur-xl rounded-full" aria-hidden="true" />
          <LineChart size={24} className="text-brand-burgundy relative z-10" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
      </div>

      {/* Météo */}
      <WeatherWidget />

      {/* Bloc unifié des statistiques */}
      <div className="glass-effect rounded-xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Colonne de gauche: Tables */}
          <div className="space-y-4 md:space-y-6" role="region" aria-labelledby="tables-heading">
            <div className="flex items-center justify-between">
              <h3 id="tables-heading" className="text-base md:text-lg font-medium text-white">Occupation des tables</h3>
              <div className="text-xs md:text-sm text-white/60">4 tables actives</div>
            </div>
            <div className="space-y-3">
              {tableOccupancyData.map((table, index) => {
                const daysRemaining = getDaysRemaining(table.harvest);
                return (
                  <motion.div 
                    key={index} 
                    className={`relative bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer overflow-hidden ${
                      hoveredTable === table.name ? 'ring-2 ring-brand-burgundy shadow-neon' : ''
                    }`}
                    onHoverStart={() => setHoveredTable(table.name)}
                    onHoverEnd={() => setHoveredTable(null)}
                    onClick={() => setSelectedTable(table)}
                    whileHover={{ y: -4 }}
                    role="button"
                    aria-label={`Détails de ${table.name}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedTable(table);
                        e.preventDefault();
                      }
                    }}
                  >
                    {/* Effet de surbrillance */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/5 to-transparent pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredTable === table.name ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      aria-hidden="true"
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: table.color }} role="presentation" />
                          <div>
                            <div className="text-sm md:text-base text-white">{table.name}</div>
                            <div className="text-xs text-white/70">{table.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm md:text-base font-semibold text-white">{table.value}%</div>
                          <div className="text-xs text-white/70">occupée</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-white/60">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" aria-hidden="true" />
                            <span>Récolte: {table.harvest}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" aria-hidden="true" />
                            <span>{daysRemaining}j</span>
                          </div>
                        </div>
                        <div className={`flex items-center ${
                          table.mortality <= 2 ? 'text-green-400' :
                          table.mortality <= 3 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          <AlertTriangle className="w-4 h-4 mr-1" aria-hidden="true" />
                          <span>{table.mortality}% mortalité</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Colonne de droite: Bassins */}
          <div className="space-y-4 md:space-y-6 mt-6 md:mt-0" role="region" aria-labelledby="pools-heading">
            <div className="flex items-center justify-between">
              <h3 id="pools-heading" className="text-base md:text-lg font-medium text-white">Santé des bassins</h3>
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
                  role="button"
                  aria-label={`Détails de ${pool.name}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedPool(pool);
                      e.preventDefault();
                    }
                  }}
                >
                  {/* Effet de surbrillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/5 to-transparent pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredPool === pool.name ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  />

                  {/* Effet d'eau */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-blue-500/10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredPool === pool.name ? 1 : 0.5 }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pool.color }} role="presentation" />
                        <div>
                          <div className="text-sm md:text-base text-white">{pool.name}</div>
                          <div className="text-xs text-white/70">{pool.type}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        pool.value >= 85 ? 'bg-green-500/20 text-green-300' :
                        pool.value >= 70 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {pool.value}% occupé
                      </div>
                    </div>
                    
                    {/* Qualité de l'eau */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className={`px-2 py-1 rounded-lg text-sm ${
                        pool.waterQuality.quality >= 95 ? 'bg-green-500/20 text-green-300' :
                        pool.waterQuality.quality >= 90 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`} role="status" aria-label={`Qualité de l'eau: ${pool.waterQuality.quality}%`}>
                        <div className="flex items-center">
                          <Droplets className="w-3 h-3 mr-1" aria-hidden="true" />
                          {pool.waterQuality.quality}%
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-sm ${
                        pool.waterQuality.oxygen >= 90 ? 'bg-green-500/20 text-green-300' :
                        pool.waterQuality.oxygen >= 85 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`} role="status" aria-label={`Oxygène: ${pool.waterQuality.oxygen}%`}>
                        <div className="flex items-center">
                          <Shell className="w-3 h-3 mr-1" aria-hidden="true" />
                          {pool.waterQuality.oxygen}%
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-sm ${
                        pool.waterQuality.temperature <= 13 ? 'bg-green-500/20 text-green-300' :
                        pool.waterQuality.temperature <= 14 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`} role="status" aria-label={`Température: ${pool.waterQuality.temperature}°C`}>
                        <div className="flex items-center">
                          <ThermometerSun className="w-3 h-3 mr-1" aria-hidden="true" />
                          {pool.waterQuality.temperature}°C
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-white/60">
                        <Shell className="w-4 h-4 mr-1" aria-hidden="true" />
                        <span>{pool.currentLoad} / {pool.capacity} kg</span>
                      </div>
                      <div className="flex items-center text-white/60">
                        <Waves className="w-4 h-4 mr-1" aria-hidden="true" />
                        <span>{pool.type === 'Purification' ? '24h restantes' : 'Stockage long terme'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="group" aria-label="Statistiques principales">
        <ModernStatCard
          icon={<Package size={24} className="text-brand-accent" aria-hidden="true" />}
          label="Stock total"
          value="156,000"
          unit="kg"
          trend={{ value: 12, positive: true }}
          color="primary"
        />
        <ModernStatCard
          icon={<Calendar size={24} className="text-brand-accent" aria-hidden="true" />}
          label="Récoltes prévues"
          value="15/06"
          unit="Table A1, A2"
          color="secondary"
        />
        <ModernStatCard
          icon={<Clock size={24} className="text-brand-accent" aria-hidden="true" />}
          label="Dernier échantillonnage"
          value="19/02"
          unit="Table B1, B2"
          color="tertiary"
        />
        <ModernStatCard
          icon={<AlertTriangle size={24} className="text-brand-accent" aria-hidden="true" />}
          label="Taux mortalité moyen"
          value="2.4"
          unit="%"
          trend={{ value: 0.3, positive: false }}
          color="primary"
        />
      </div>

      {/* Alertes */}
      <div className="glass-effect rounded-xl p-4 md:p-6" role="region" aria-labelledby="alerts-heading">
        <div className="flex items-center justify-between mb-4">
          <h3 id="alerts-heading" className="text-base md:text-lg font-medium text-white">Alertes récentes</h3>
          <div className="text-xs md:text-sm text-white/60">3 nouvelles alertes</div>
        </div>
        {/* ... */}
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="group" aria-label="Statistiques supplémentaires">
        {/* ... */}
      </div>

      {/* Modales */}
      <AnimatePresence>
        {selectedTable && (
          <TableDetailModal 
            table={selectedTable} 
            onClose={() => setSelectedTable(null)} 
          />
        )}
        {selectedPool && (
          <PoolDetailModal 
            pool={selectedPool} 
            onClose={() => setSelectedPool(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}