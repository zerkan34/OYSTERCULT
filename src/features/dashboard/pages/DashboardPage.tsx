import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ThermometerSun, Droplets, LineChart, Calendar, AlertTriangle, Clock, Shell, Waves } from 'lucide-react';
import { ModernStatCard } from '@/components/ui/ModernStatCard';
import { WeatherWidget } from '../components/WeatherWidget';
import { differenceInDays } from 'date-fns';
import { TableDetailModal } from '../components/TableDetailModal';
import { PoolDetailModal } from '../components/PoolDetailModal';
import './DashboardMobile.css';

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
    <div className="space-y-6 dashboard-container">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-burgundy/20 blur-xl rounded-full" />
          <LineChart size={24} className="text-brand-burgundy relative z-10" />
        </div>
        <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
      </div>

      {/* Météo */}
      <div className="weather-widget-container">
        <WeatherWidget />
      </div>

      {/* Section Tables avec en-tête distinctif */}
      <div className="glass-effect rounded-xl p-4 md:p-6 border-l-4 border-brand-burgundy">
        <div className="flex items-center mb-4">
          <div className="mr-3 p-2 rounded-lg bg-brand-burgundy/20">
            <Shell size={20} className="text-brand-burgundy" />
          </div>
          <h3 className="text-base md:text-lg font-medium text-white">Occupation des tables</h3>
          <div className="ml-auto text-xs md:text-sm text-white/60 md:mt-0 mt-1 bg-white/10 px-2 py-1 rounded-full">4 tables actives</div>
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
              >
                {/* En-tête moderne avec nom et type */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-12 rounded-sm" style={{ backgroundColor: table.color }} />
                    <div>
                      <div className="text-sm font-semibold text-white">{table.name}</div>
                      <div className="text-xs px-2 py-0.5 bg-white/10 rounded-md inline-block mt-1">{table.type}</div>
                    </div>
                  </div>
                  
                  {/* Indicateur jours restants */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center bg-white/10 rounded-lg px-2 py-1 text-xs font-medium text-white/90">
                      <Calendar className="w-3 h-3 mr-1 text-brand-burgundy" />
                      <span>{table.harvest}</span>
                    </div>
                    <div className="text-xs mt-1 text-white/70">
                      <span className="font-medium">{daysRemaining}j</span> restants
                    </div>
                  </div>
                </div>
                
                {/* Jauge d'occupation avec texte */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs text-white/80">Occupation</div>
                    <div className="text-xs font-semibold text-white">{table.value}%</div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        table.value >= 85 ? 'bg-green-500' : 
                        table.value >= 70 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${table.value}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Pied de carte avec mortalité */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {/* Petite jauge de mortalité */}
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-8 h-8">
                        <path 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#444"
                          strokeWidth="3"
                          strokeDasharray="100, 100"
                          className="stroke-white/10"
                        />
                        <path 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          strokeWidth="4"
                          strokeDasharray={`${Math.min(table.mortality, 30)}, 100`}
                          className={`${
                            table.mortality <= 10 ? 'stroke-green-400' : 
                            table.mortality <= 20 ? 'stroke-yellow-400' : 
                            'stroke-red-400'
                          }`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        <span className={`${
                          table.mortality <= 10 ? 'text-green-400' : 
                          table.mortality <= 20 ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>{Math.min(table.mortality, 30)}%</span>
                      </div>
                    </div>
                    <div className="text-xs text-white/80">Mortalité</div>
                  </div>
                  
                  {/* Badges d'informations */}
                  <div className="flex gap-2">
                    <div className="flex items-center bg-white/10 rounded-lg px-2 py-1 text-xs text-white/80">
                      <Clock className="w-3 h-3 mr-1" />
                      {daysRemaining}j
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Section Bassins avec en-tête distinctif */}
      <div className="glass-effect rounded-xl p-4 md:p-6 border-l-4 border-blue-500">
        <div className="flex items-center mb-4">
          <div className="mr-3 p-2 rounded-lg bg-blue-500/20">
            <Waves size={20} className="text-blue-400" />
          </div>
          <h3 className="text-base md:text-lg font-medium text-white">Santé des bassins</h3>
          <div className="ml-auto text-xs md:text-sm text-white/60 md:mt-0 mt-1 bg-white/10 px-2 py-1 rounded-full">3 bassins actifs</div>
        </div>
        
        <div className="space-y-3">
          {poolData.map((pool, index) => (
            <motion.div 
              key={index}
              className={`relative bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer overflow-hidden ${
                hoveredPool === pool.name ? 'ring-2 ring-blue-500 shadow-neon-blue' : ''
              }`}
              onHoverStart={() => setHoveredPool(pool.name)}
              onHoverEnd={() => setHoveredPool(null)}
              onClick={() => setSelectedPool(pool)}
              whileHover={{ y: -4 }}
            >
              {/* Effet de surbrillance */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredPool === pool.name ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />

              {/* Design moderne et compact pour mobile */}
              <div className="relative z-10">
                {/* En-tête avec badge mobile-friendly */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Remplacer la barre par un badge hexagonal */}
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <svg width="36" height="36" viewBox="0 0 36 36">
                          <polygon 
                            points="18,2 33,10 33,26 18,34 3,26 3,10" 
                            fill={pool.color === '#22c55e' ? 'rgba(34, 197, 94, 0.2)' : 
                                  pool.color === '#eab308' ? 'rgba(234, 179, 8, 0.2)' : 
                                  'rgba(239, 68, 68, 0.2)'}
                            stroke={pool.color}
                            strokeWidth="1.5"
                          />
                          <text 
                            x="18" 
                            y="22" 
                            textAnchor="middle" 
                            fontSize="14" 
                            fontWeight="bold" 
                            fill="white"
                            style={{ textShadow: '0px 0px 2px rgba(0,0,0,0.5)' }}
                          >
                            {pool.value}%
                          </text>
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2">
                      <div className="text-sm font-semibold text-white">{pool.name}</div>
                      <div className="text-xs bg-white/10 px-2 py-0.5 rounded-md text-white/80 inline-block">{pool.type}</div>
                    </div>
                  </div>
                  
                  {/* Badge d'occupation avec couleur conditionnelle */}
                  <div className={`h-8 w-8 flex items-center justify-center rounded-full ${
                    pool.value >= 85 ? 'bg-green-500/30 text-green-200' :
                    pool.value >= 70 ? 'bg-yellow-500/30 text-yellow-200' :
                    'bg-red-500/30 text-red-200'
                  }`}>
                    <Shell className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Indicateurs en format compacte en ligne - mobile friendly */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                    pool.waterQuality.quality >= 95 ? 'bg-green-500/20 text-green-300' :
                    pool.waterQuality.quality >= 90 ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    <Droplets className="w-3 h-3 mr-1" />
                    <span className="whitespace-nowrap">{pool.waterQuality.quality}%</span>
                  </div>
                  
                  <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                    pool.waterQuality.oxygen >= 90 ? 'bg-green-500/20 text-green-300' :
                    pool.waterQuality.oxygen >= 85 ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    <Shell className="w-3 h-3 mr-1" />
                    <span className="whitespace-nowrap">{pool.waterQuality.oxygen}%</span>
                  </div>
                  
                  <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                    pool.waterQuality.temperature <= 13 ? 'bg-green-500/20 text-green-300' :
                    pool.waterQuality.temperature <= 14 ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    <ThermometerSun className="w-3 h-3 mr-1" />
                    <span className="whitespace-nowrap">{pool.waterQuality.temperature}°C</span>
                  </div>
                </div>

                {/* Pied avec capacité et statut */}
                <div className="flex items-center justify-between text-xs">
                  <div className="inline-flex items-center bg-white/10 px-2 py-1 rounded-md text-white/80">
                    <Shell className="w-3 h-3 mr-1" />
                    {pool.currentLoad} / {pool.capacity} kg
                  </div>
                  {pool.type === 'Purification' ? (
                    <div className="inline-flex items-center bg-blue-500/20 text-blue-200 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3 mr-1" />
                      24h restantes
                    </div>
                  ) : (
                    <div className="inline-flex items-center bg-indigo-500/20 text-indigo-200 px-2 py-1 rounded-md">
                      <Waves className="w-3 h-3 mr-1" />
                      Stockage
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernStatCard
          icon={<Package size={24} className="text-brand-accent" />}
          label="Stock total"
          value="156,000"
          trend={{ value: 12, positive: true }}
          color="primary"
        />
        <ModernStatCard
          icon={<Calendar size={24} className="text-brand-accent" />}
          label="Récoltes prévues"
          value="15/06"
          unit="Table A1, A2"
          color="secondary"
        />
        <ModernStatCard
          icon={<Clock size={24} className="text-brand-accent" />}
          label="Dernier échantillonnage"
          value="19/02"
          unit="Table B1, B2"
          color="tertiary"
        />
        <ModernStatCard
          icon={<AlertTriangle size={24} className="text-brand-accent" />}
          label="Taux mortalité moyen"
          value="2.4"
          unit="%"
          trend={{ value: 0.3, positive: false }}
          color="primary"
        />
      </div>

      {/* Alertes */}
      <div className="glass-effect rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-medium text-white">Alertes récentes</h3>
          <div className="flex items-center">
            <div className="px-2 py-1 rounded-full bg-blue-400/30 text-blue-100 text-xs font-medium">
              3
            </div>
          </div>
        </div>
        {/* ... */}
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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