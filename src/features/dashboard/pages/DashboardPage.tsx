import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ThermometerSun, Droplets, LineChart, Calendar, AlertTriangle, Clock, Shell, Waves } from 'lucide-react';
import { ModernStatCard } from '@/components/ui/ModernStatCard';
import { WeatherWidget } from '../components/WeatherWidget';
import { differenceInDays } from 'date-fns';
import { TableDetailModal } from '../components/TableDetailModal';
import { PoolDetailModal } from '../components/PoolDetailModal';
import { OysterOccupationStats } from '../components/OysterOccupationStats';
import { OysterTable, Pool, WaterQuality, PoolHealth } from '../types';
import { PageTitle } from '@/components/ui/PageTitle';
import { OysterTableCard } from '../components/OysterTableCard';
import { MobileDashboard } from '../components/MobileDashboard';
import './DashboardMobile.css';

// Fonction pour calculer le nombre de jours restants
const getDaysRemaining = (harvestDate: string) => {
  const [day, month, year] = harvestDate.split('/');
  const date = new Date(parseInt(`20${year}`), parseInt(month) - 1, parseInt(day));
  const daysRemaining = differenceInDays(date, new Date());
  return daysRemaining;
};

// Données pour l'occupation des tables
const tableOccupancyData: OysterTable[] = [
  {
    name: 'Table A1',
    value: 72,
    color: '#22c55e',
    type: 'Huîtres creuses',
    plates: 'N°3',
    harvest: 'En cours',
    mortality: 15,
    currentSize: '3.2cm',
    targetSize: '4.5cm',
    timeProgress: 65,
    startDate: '10/01/24',
    status: 'En cours'
  },
  {
    name: 'Table A2',
    value: 100,
    color: '#22c55e',
    type: 'Huîtres plates',
    plates: 'N°4',
    harvest: '01/01/2026',
    mortality: 8,
    currentSize: 'T15',
    targetSize: '4.2cm',
    timeProgress: 0,
    startDate: '01/01/2024',
    status: 'En cours'
  },
  {
    name: 'Table B1',
    value: 100,
    color: '#22c55e',
    type: 'Huîtres plates',
    plates: 'N°2',
    harvest: '01/01/2026',
    mortality: 12,
    currentSize: 'T15',
    targetSize: '4.8cm',
    timeProgress: 0,
    startDate: '01/01/2024',
    status: 'En cours'
  },
  {
    name: 'Table B2',
    value: 0,
    color: '#22c55e',
    type: '',
    plates: '',
    harvest: '',
    mortality: 0,
    currentSize: '',
    targetSize: '',
    timeProgress: 0,
    startDate: '',
    status: 'Vide'
  }
];

// Données pour les bassins
const poolData: PoolHealth[] = [
  { 
    id: 'pool-a1',
    name: 'Bassin A1',
    status: 'Optimal',
    temperature: 12.5,
    oxygen: 95,
    salinity: 32.4,
    ph: 8.1,
    lastCheck: '08:30',
    alert: false
  },
  { 
    id: 'pool-a2',
    name: 'Bassin A2',
    status: 'Bon',
    temperature: 13.2,
    oxygen: 88,
    salinity: 31.9,
    ph: 8.0,
    lastCheck: '08:35',
    alert: false,
    stock: {
      mussels: 500,
      urchins: 100
    }
  }
];

// Données complètes des bassins pour l'affichage
const poolDisplayData: Pool[] = [
  {
    name: 'Bassin A1',
    value: 80,
    color: '#22c55e',
    type: 'Purification',
    capacity: 1000,
    currentLoad: 800,
    products: [
      { name: 'Plates', quantity: 500, unit: 'kg', color: '#22c55e' },
      { name: 'Creuses', quantity: 300, unit: 'kg', color: '#eab308' }
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
      { name: 'Moules', quantity: 500, unit: 'kg', color: '#22c55e' },
      { name: 'Oursins', quantity: 100, unit: 'dz', color: '#eab308' }
    ],
    waterQuality: {
      quality: 92,
      oxygen: 88,
      temperature: 13.2
    }
  }
];

// Styles avancés pour l'effet glassmorphique identique à la sidebar
const glassCardStyles = {
  container: `
    relative overflow-hidden rounded-xl
    bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)]
    -webkit-backdrop-filter: blur(20px)
    backdrop-filter: blur(20px)
    shadow-[rgba(0,0,0,0.2)_0px_5px_20px_-5px,rgba(0,200,200,0.1)_0px_5px_12px_-5px,rgba(255,255,255,0.07)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.05)_0px_0px_12px_inset,rgba(0,0,0,0.1)_0px_0px_8px_inset]
    border-0
  `,
  heading: `
    text-lg font-medium 
    bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent
  `,
  subheading: `
    text-sm text-white/70
  `,
  hoverEffect: `
    transition-all duration-200
    hover:shadow-[rgba(0,0,0,0.25)_0px_8px_25px_-5px,rgba(0,200,200,0.1)_0px_0px_15px_inset,rgba(255,255,255,0.1)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.1)_0px_0px_15px_inset,rgba(0,0,0,0.15)_0px_0px_8px_inset]
  `,
  // Optimisations de performance: utiliser transform au lieu de width/height
  progressBar: `
    relative h-2 rounded-full overflow-hidden
    bg-[rgba(0,20,40,0.3)] mt-2 mb-3
  `
};

// Variants d'animation optimisés
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

const slideInVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

export function DashboardPage() {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [hoveredPool, setHoveredPool] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<OysterTable | null>(null);
  const [selectedPool, setSelectedPool] = useState<PoolHealth | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Effet pour ajouter/supprimer une classe CSS sur le body
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('has-fixed-nav');
    } else {
      document.body.classList.remove('has-fixed-nav');
    }
    
    return () => {
      document.body.classList.remove('has-fixed-nav');
    };
  }, [isMobile]);

  // Rendu conditionnel basé sur la taille de l'écran
  if (isMobile) {
    return (
      <div className="dashboard-page">
        <MobileDashboard 
          tableOccupancyData={tableOccupancyData}
          poolData={poolData}
          poolDisplayData={poolDisplayData}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      className="space-y-6"
    >
      {/* En-tête avec effet de dégradé */}
      <PageTitle 
        icon={<LineChart size={28} className="text-white" />}
        title="Tableau de bord"
      />
      
      {/* Widget météo en format paysage au-dessus de la grille */}
      <motion.div 
        variants={slideInVariants}
        className="mb-6 w-full"
      >
        <WeatherWidget />
      </motion.div>

      {/* Section principale avec 3 colonnes en grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        {/* Colonne 1: Statistiques */}
        <motion.div 
          variants={slideInVariants}
          className={`${glassCardStyles.container} ${glassCardStyles.hoverEffect} p-5 space-y-4`}
        >
          <h2 className={glassCardStyles.heading}>Statistiques globales</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[rgba(0,40,80,0.2)] rounded-lg p-3 shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset]">
              <div className="flex items-center justify-between">
                <div className={glassCardStyles.subheading}>Taux production</div>
                <div className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                  +4.2%
                </div>
              </div>
              <div className="text-2xl font-bold text-white mt-2">97.8%</div>
              <div className={glassCardStyles.progressBar}>
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: '97.8%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div className="bg-[rgba(0,40,80,0.2)] rounded-lg p-3 shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset]">
              <div className="flex items-center justify-between">
                <div className={glassCardStyles.subheading}>Santé moyenne</div>
                <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                  Stable
                </div>
              </div>
              <div className="text-2xl font-bold text-white mt-2">92.3%</div>
              <div className={glassCardStyles.progressBar}>
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400"
                  initial={{ width: 0 }}
                  animate={{ width: '92.3%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div className="bg-[rgba(0,40,80,0.2)] rounded-lg p-3 shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset]">
              <div className="flex items-center justify-between">
                <div className={glassCardStyles.subheading}>Taux mortalité</div>
                <div className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full">
                  -0.5%
                </div>
              </div>
              <div className="text-2xl font-bold text-white mt-2">2.5%</div>
              <div className={glassCardStyles.progressBar}>
                <motion.div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-400"
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div className="bg-[rgba(0,40,80,0.2)] rounded-lg p-3 shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset]">
              <div className="flex items-center justify-between">
                <div className={glassCardStyles.subheading}>Récolte prévue</div>
                <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                  15 jours
                </div>
              </div>
              <div className="text-2xl font-bold text-white mt-2">4.8t</div>
              <div className={glassCardStyles.progressBar}>
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-400"
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Colonne 2: Occupation des tables */}
        <motion.div 
          variants={slideInVariants}
          className={`${glassCardStyles.container} ${glassCardStyles.hoverEffect} p-5`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className={glassCardStyles.heading}>Occupation des tables</h2>
            <div className="text-sm text-white/60">3 tables actives</div>
          </div>
          
          <div className="space-y-4">
            {tableOccupancyData.map((table, index) => (
              <OysterTableCard
                key={index}
                table={table}
                isHovered={hoveredTable === table.name}
                onHoverStart={() => setHoveredTable(table.name)}
                onHoverEnd={() => setHoveredTable(null)}
                onClick={() => setSelectedTable(table)}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Colonne 3: Santé des bassins */}
        <motion.div 
          variants={slideInVariants}
          className={`${glassCardStyles.container} ${glassCardStyles.hoverEffect} p-5`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className={glassCardStyles.heading}>Santé des bassins</h2>
            <div className="text-sm text-white/60">2 bassins actifs</div>
          </div>
          
          <div className="space-y-4">
            {poolData.map((pool, index) => (
              <motion.div 
                key={index}
                className={`
                  relative rounded-lg p-4 overflow-hidden
                  bg-[rgba(0,40,80,0.2)]
                  shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset]
                  cursor-pointer transition-all duration-200
                  ${hoveredPool === pool.name ? 'shadow-[rgba(0,0,0,0.25)_0px_8px_20px,rgba(0,210,200,0.15)_0px_0px_10px_inset]' : ''}
                `}
                onHoverStart={() => setHoveredPool(pool.name)}
                onHoverEnd={() => setHoveredPool(null)}
                onClick={() => setSelectedPool(pool)}
                whileHover={{ 
                  y: -4,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Effet de surbrillance au survol */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[rgba(0,128,128,0.1)] to-transparent pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredPool === pool.name ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: poolDisplayData.find(p => p.name === pool.name)?.color }} />
                      <div>
                        <div className="text-white font-medium">{pool.name}</div>
                        <div className="text-xs text-white/70">{pool.status}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">{poolDisplayData.find(p => p.name === pool.name)?.value}%</div>
                      <div className="text-xs text-white/70">qualité</div>
                    </div>
                  </div>
                  
                  {/* Barre de progression stylisée */}
                  <div className={glassCardStyles.progressBar}>
                    <motion.div 
                      className="h-full rounded-full"
                      style={{ 
                        background: `linear-gradient(to right, ${poolDisplayData.find(p => p.name === pool.name)?.color}, ${poolDisplayData.find(p => p.name === pool.name)?.color}80)`,
                        boxShadow: `0 0 10px ${poolDisplayData.find(p => p.name === pool.name)?.color}40`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${poolDisplayData.find(p => p.name === pool.name)?.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-xs text-white/70">
                      <div className="flex items-center">
                        <ThermometerSun className="w-3 h-3 mr-1 text-cyan-400" />
                        <span>Température</span>
                      </div>
                      <span className="text-white">{pool.temperature}°C</span>
                    </div>
                    <div className="text-xs text-white/70">
                      <div className="flex items-center">
                        <Droplets className="w-3 h-3 mr-1 text-cyan-400" />
                        <span>Oxygène</span>
                      </div>
                      <span className="text-white">{pool.oxygen}%</span>
                    </div>
                    <div className="text-xs text-white/70">
                      <div className="flex items-center">
                        <Waves className="w-3 h-3 mr-1 text-cyan-400" />
                        <span>Capacité</span>
                      </div>
                      <span className="text-white">{(poolDisplayData.find(p => p.name === pool.name)?.currentLoad/poolDisplayData.find(p => p.name === pool.name)?.capacity*100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modaux avec design moderne */}
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
    </motion.div>
  );
}