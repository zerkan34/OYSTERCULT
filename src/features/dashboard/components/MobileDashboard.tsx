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
  DropletIcon,
  Star,
  AlertCircle,
  Info,
  Phone,
  AlertOctagon
} from 'lucide-react';
import MobileWeatherWidget from './NewMobileWeather';
import './mobile-weather.css';
import { OysterTableCard } from './OysterTableCard';
import { TableDetailModal } from './TableDetailModal';
import { PoolDetailModal } from './PoolDetailModal';
import { OysterTable, Pool, PoolHealth } from '../types';
import '../pages/DashboardMobile.css'; // Import CSS pour le dashboard mobile
import './MobileNavigation.css'; // Import du CSS spécifique pour la navigation

// Types locaux pour les fonctionnalités ajoutées
interface ExtendedOysterTable extends OysterTable {
  id: string;
  occupancyRate: number;
  lastUpdated: string;
  oysterType: string;
  lastHarvest: string;
  quality: number;
  avgSize: number;
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

// Composant MobileDashboard
export const MobileDashboard: React.FC = () => {
  // États
  const [activeSection, setActiveSection] = useState<SectionType>('overview');
  const [selectedTable, setSelectedTable] = useState<ExtendedOysterTable | null>(null);
  const [selectedPool, setSelectedPool] = useState<ExtendedPoolHealth | null>(null);
  const [visibleTableIndex, setVisibleTableIndex] = useState(0);
  const [visiblePoolIndex, setVisiblePoolIndex] = useState(0);

  // Références pour le composant
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Effet pour animer les éléments lors du chargement
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, index * 100);
    });
  }, []);

  // Effet pour remonter au haut lors du changement de section
  useEffect(() => {
    // Retourner au haut de la page lors du changement de section
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeSection]);

  // Fonction pour gérer le changement de section
  const setActiveSectionWithScroll = (section: SectionType) => {
    // Définir la section active
    setActiveSection(section);
    
    // Faire défiler vers le haut
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  // Données pour les tables
  const tableOccupancyData: ExtendedOysterTable[] = [
    {
      id: 'table1',
      name: 'Table Nord-Est',
      value: 78,
      color: '#38bdf8',
      type: 'Spéciale de Claire',
      plates: '45/60',
      currentSize: '6.5 cm',
      targetSize: '9 cm',
      timeProgress: 65,
      startDate: '10/01/2023',
      harvest: '30/06/2023',
      mortality: 8.5,
      alert: null,
      status: 'active',
      occupiedUnits: 45,
      totalUnits: 60,
      location: 'Secteur Nord-Est',
      area: 120,
      waterHeight: 1.2,
      lastInspection: '15/05/2023',
      currentConditions: 'Optimales',
      lastUpdate: 'Il y a 2h',
      // Extensions pour l'affichage mobile
      occupancyRate: 78,
      lastUpdated: 'Il y a 2h',
      oysterType: 'Spéciale de Claire',
      lastHarvest: '12/05/2023',
      quality: 4.2,
      avgSize: 7.8
    },
    {
      id: 'table2',
      name: 'Table Centrale',
      value: 45,
      color: '#22c55e',
      type: 'Fine de Claire',
      plates: '30/60',
      currentSize: '5.8 cm',
      targetSize: '8 cm',
      timeProgress: 50,
      startDate: '15/01/2023',
      harvest: '15/07/2023',
      mortality: 6.2,
      status: 'active',
      occupiedUnits: 30,
      totalUnits: 60,
      location: 'Secteur Central',
      area: 110,
      waterHeight: 1.1,
      lastInspection: '12/05/2023',
      currentConditions: 'Bonnes',
      lastUpdate: 'Il y a 1h',
      // Extensions pour l'affichage mobile
      occupancyRate: 45,
      lastUpdated: 'Il y a 1h',
      oysterType: 'Fine de Claire',
      lastHarvest: '15/05/2023',
      quality: 3.8,
      avgSize: 6.5
    },
    {
      id: 'table3',
      name: 'Table Ouest',
      value: 92,
      color: '#ef4444',
      type: 'Spéciale de Claire',
      plates: '55/60',
      currentSize: '7.2 cm',
      targetSize: '9 cm',
      timeProgress: 80,
      startDate: '05/01/2023',
      harvest: '20/06/2023',
      mortality: 9.8,
      alert: 'Forte densité',
      status: 'active',
      occupiedUnits: 55,
      totalUnits: 60,
      location: 'Secteur Ouest',
      area: 130,
      waterHeight: 1.3,
      lastInspection: '10/05/2023',
      currentConditions: 'Densité élevée',
      lastUpdate: 'Il y a 3h',
      // Extensions pour l'affichage mobile
      occupancyRate: 92,
      lastUpdated: 'Il y a 3h',
      oysterType: 'Spéciale de Claire',
      lastHarvest: '10/05/2023',
      quality: 4.5,
      avgSize: 8.2
    }
  ];

  // Données pour les bassins
  const poolData: ExtendedPoolHealth[] = [
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
                          key={table.id}
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
                <OysterTableCard key={table.id} table={table} />
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
                    <li key={table.id}>{table.name}: {table.alert}</li>
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
          <div className="fixed-bottom-nav">
            <div className="mobile-bottom-nav">
              <button
                className={`mobile-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveSectionWithScroll('overview')}
                aria-label="Vue d'ensemble"
              >
                <Home size={22} />
                <span>Accueil</span>
              </button>
              <button
                className={`mobile-nav-item ${activeSection === 'tables' ? 'active' : ''}`}
                onClick={() => setActiveSectionWithScroll('tables')}
                aria-label="Tables"
              >
                <Package size={22} />
                <span>Tables</span>
              </button>
              <button
                className={`mobile-nav-item ${activeSection === 'pools' ? 'active' : ''}`}
                onClick={() => setActiveSectionWithScroll('pools')}
                aria-label="Bassins"
              >
                <DropletIcon size={22} />
                <span>Bassins</span>
              </button>
              <button
                className={`mobile-nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveSectionWithScroll('notifications')}
                aria-label="Alertes"
              >
                <AlertTriangle size={22} />
                <span>Alertes</span>
              </button>
              <button
                className={`mobile-nav-item emergency ${activeSection === 'emergency' ? 'active' : ''}`}
                onClick={() => setActiveSectionWithScroll('emergency')}
                aria-label="Urgence"
              >
                <AlertOctagon size={22} />
                <span>Urgence</span>
              </button>
            </div>
          </div>

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
