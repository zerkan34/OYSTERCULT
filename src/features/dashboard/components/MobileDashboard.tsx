import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ThermometerSun, 
  Droplets, 
  LineChart, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Shell, 
  Waves,
  BarChart,
  Home,
  Settings,
  Map,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Database,
  Star,
  AlertCircle,
  Info,
  Phone,
  AlertOctagon,
  Droplet
} from 'lucide-react';
import MobileWeatherWidget from './NewMobileWeather';
import './mobile-weather.css';
import { OysterTableCard } from './OysterTableCard';
import { TableDetailModal } from './TableDetailModal';
import { PoolDetailModal } from './PoolDetailModal';
import { OysterTable, Pool, PoolHealth } from '../types';
import '../pages/DashboardMobile.css'; // Import CSS pour le dashboard mobile
import './MobileNavigation.css'; // Import du CSS spécifique pour la navigation
import { MobileNavigation } from './MobileNavigation';

// Types locaux pour les fonctionnalités ajoutées
interface ExtendedOysterTable extends OysterTable {
  occupancyRate: number; // Alias pour value
  lastUpdated: string; // Alias pour lastUpdate
  oysterType: string; // Alias pour type
  lastHarvest: string; // Alias pour harvest
  quality: number; // Nouvelle propriété
  avgSize: number; // Calculé à partir de currentSize
}

interface ExtendedPoolHealth extends Omit<PoolHealth, 'status'> {
  id: string;
  status: 'Optimal' | 'Bon' | 'Attention' | 'Critique';
  healthIndex: number;
  lastUpdated: string;
  waterLevel: number;
  waterChangeRate: number;
}

// Types
type SectionType = 'overview' | 'tables' | 'pools' | 'notifications' | 'emergency';

// Animation variants
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

interface MobileDashboardProps {
  tableOccupancyData: OysterTable[];
  poolData: PoolHealth[];
  poolDisplayData: Pool[];
}

// Composant MobileDashboard
export const MobileDashboard: React.FC<MobileDashboardProps> = ({ 
  tableOccupancyData,
  poolData,
  poolDisplayData
}) => {
  // États
  const [activeSection, setActiveSection] = useState<SectionType>('overview');
  const [selectedTable, setSelectedTable] = useState<OysterTable | null>(null);
  const [selectedPool, setSelectedPool] = useState<ExtendedPoolHealth | null>(null);
  const [visibleTableIndex, setVisibleTableIndex] = useState(0);
  const [visiblePoolIndex, setVisiblePoolIndex] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Références pour le composant
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Effet pour animer les éléments lors du chargement
  useEffect(() => {
    setMounted(true);
    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, index * 100);
    });

    return () => {
      setMounted(false);
    };
  }, []);

  // Fonction pour gérer le changement de section avec scroll
  const setActiveSectionWithScroll = useCallback((section: SectionType) => {
    setActiveSection(section);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [containerRef]);

  // Effet pour détecter l'orientation et mettre à jour l'état
  useEffect(() => {
    // Fonction pour détecter l'orientation
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsLandscape(isLandscape);
    };

    // Vérifier l'orientation au chargement
    checkOrientation();

    // Ajouter un écouteur d'événement pour les changements d'orientation
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkOrientation, 100);
    });

    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Fonction pour déterminer la classe de couleur en fonction du taux d'occupation
  const getOccupancyColorClass = (rate: number) => {
    if (rate < 30) return 'text-blue-400';
    if (rate < 60) return 'text-green-400';
    if (rate < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Fonction pour déterminer la classe de couleur en fonction de l'indice de santé
  const getHealthColorClass = (health: number) => {
    if (health < 30) return 'text-red-400';
    if (health < 60) return 'text-yellow-400';
    if (health < 80) return 'text-green-400';
    return 'text-cyan-400';
  };

  // Transformation des données de tables pour le format mobile
  const extendedTables: ExtendedOysterTable[] = tableOccupancyData.map(table => ({
    ...table,
    occupancyRate: table.value,
    lastUpdated: table.lastUpdate || '',
    oysterType: table.type,
    lastHarvest: table.harvest,
    quality: 4.0, // Valeur par défaut
    avgSize: parseFloat(table.currentSize) || 0
  }));

  // Données pour les bassins
  const extendedPoolData: ExtendedPoolHealth[] = [
    {
      id: 'pool1',
      name: 'Bassin Principal',
      status: 'Optimal',
      temperature: 14.7,
      oxygen: 95,
      salinity: 33.5,
      ph: 8.1,
      lastCheck: 'Il y a 30 min',
      alert: false,
      stock: {
        mussels: 120,
        urchins: 45
      },
      // Extensions pour l'affichage mobile
      healthIndex: 87,
      lastUpdated: 'Il y a 30 min',
      waterLevel: 1.45,
      waterChangeRate: 12
    },
    {
      id: 'pool2',
      name: 'Bassin de Purification',
      status: 'Optimal',
      temperature: 15.2,
      oxygen: 97,
      salinity: 32.8,
      ph: 8.0,
      lastCheck: 'Il y a 1h',
      alert: false,
      stock: {
        mussels: 85,
        urchins: 30
      },
      // Extensions pour l'affichage mobile
      healthIndex: 92,
      lastUpdated: 'Il y a 1h',
      waterLevel: 1.22,
      waterChangeRate: 18
    },
    {
      id: 'pool3',
      name: 'Bassin d\'Élevage',
      status: 'Attention',
      temperature: 14.3,
      oxygen: 82,
      salinity: 34.1,
      ph: 7.8,
      lastCheck: 'Il y a 2h',
      alert: true,
      stock: {
        mussels: 150,
        urchins: 0
      },
      // Extensions pour l'affichage mobile
      healthIndex: 65,
      lastUpdated: 'Il y a 2h',
      waterLevel: 0.87,
      waterChangeRate: 8
    }
  ];

  // Rendu du composant
  return (
    <div className="mobile-dashboard">
      <div className="mobile-dashboard-wrapper" ref={containerRef}>
        <div className="mobile-dashboard-content">
          {/* Section Vue d'ensemble */}
          {activeSection === 'overview' && (
            <motion.div 
              className="dashboard-page p-4"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <div className="dashboard-sections space-y-5">
                <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
                
                {/* Widget Météo */}
                <div className="animate-fade-in">
                  <MobileWeatherWidget />
                </div>
                
                {/* Aperçu des tables */}
                <section className="animate-fade-in mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white">Tables ostréicoles</h2>
                    <button 
                      className="text-cyan-400 text-sm flex items-center gap-1"
                      onClick={() => setActiveSectionWithScroll('tables')}
                      aria-label="Voir toutes les tables"
                    >
                      Tout voir <ChevronRight size={16} />
                    </button>
                  </div>
                
                  {/* Carousel horizontal */}
                  <div className="relative">
                    <div className="mobile-carousel">
                      {tableOccupancyData.map((table, index) => (
                        <div
                          key={table.name}
                          className={`mobile-carousel-item ${index === visibleTableIndex ? 'active' : ''}`}
                          onClick={() => setSelectedTable(table)}
                        >
                          <OysterTableCard 
                            table={table} 
                            compact={true} 
                            onClick={() => setSelectedTable(table)} 
                          />
                        </div>
                      ))}
                    </div>

                    {/* Indicateurs de position carousel */}
                    <div className="mobile-carousel-indicators mt-2">
                      {tableOccupancyData.map((_, index) => (
                        <button
                          key={index}
                          className={`mobile-carousel-indicator ${
                            index === visibleTableIndex ? 'active' : ''
                          }`}
                          onClick={() => setVisibleTableIndex(index)}
                          aria-label={`Voir table ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {/* Section Tables */}
          {activeSection === 'tables' && (
            <motion.div 
              className="dashboard-page p-4"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <h1 className="text-2xl font-bold text-white mb-6">Tables ostréicoles</h1>
              {/* Contenu de la section tables */}
              {tableOccupancyData.map((table) => (
                <OysterTableCard key={table.name} table={table} />
              ))}
            </motion.div>
          )}

          {/* Section Bassins */}
          {activeSection === 'pools' && (
            <motion.div 
              className="dashboard-page p-4"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <h1 className="text-2xl font-bold text-white mb-6">Bassins</h1>
              {/* Contenu de la section bassins */}
              {poolData.map((pool) => (
                <div key={pool.id}>
                  <h2 className="text-lg font-semibold text-white mb-2">{pool.name}</h2>
                  <p>Status: {pool.status}</p>
                  <p>Température: {pool.temperature}°C</p>
                  <p>Oxygène: {pool.oxygen}%</p>
                  <p>Salinité: {pool.salinity}‰</p>
                  <p>pH: {pool.ph}</p>
                  <p>Dernière vérification: {pool.lastCheck}</p>
                  <p>Alerte: {pool.alert ? 'Oui' : 'Non'}</p>
                  <p>Stock: {pool.stock.mussels} moules, {pool.stock.urchins} oursins</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Section Notifications */}
          {activeSection === 'notifications' && (
            <motion.div 
              className="dashboard-page p-4"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <h1 className="text-2xl font-bold text-white mb-6">Alertes</h1>
              {/* Contenu de la section notifications */}
              <ul>
                {tableOccupancyData.map((table) => (
                  table.alert && (
                    <li key={table.name}>{table.name}: {table.alert}</li>
                  )
                ))}
                {poolData.map((pool) => (
                  pool.alert && (
                    <li key={pool.id}>{pool.name}: {pool.alert}</li>
                  )
                ))}
              </ul>
            </motion.div>
          )}

          {/* Section Urgence */}
          {activeSection === 'emergency' && (
            <motion.div 
              className="dashboard-page p-4"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <h1 className="text-2xl font-bold text-white mb-6 text-red-400">Urgence</h1>
              {/* Contenu de la section urgence */}
              <p>Contenu de la section urgence</p>
            </motion.div>
          )}

          {/* Barre de navigation fixe en bas */}
          <MobileNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSectionWithScroll}
            isLandscape={isLandscape}
          />

          {/* Modales */}
          <AnimatePresence>
            {selectedTable && (
              <TableDetailModal table={selectedTable} onClose={() => setSelectedTable(null)} />
            )}
            {selectedPool && (
              <PoolDetailModal pool={selectedPool} onClose={() => setSelectedPool(null)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
