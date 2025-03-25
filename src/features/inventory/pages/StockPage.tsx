import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Boxes, Plus, Search, Filter, Package, History, BarChart3, ArrowLeftRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { OtherLocations } from '../components/OtherLocations';
import { useNavigate } from 'react-router-dom';
import './StockPage.css';

interface Stock {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  lastUpdate: Date;
}

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    transform: 'translateY(20px)'
  },
  visible: { 
    opacity: 1,
    transform: 'translateY(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.25, 0, 1]
    }
  }
};

const mockStocks: Stock[] = [
  { id: '1', name: 'Huîtres N°3', quantity: 1000, unit: 'pièces', location: 'Bassin A', lastUpdate: new Date() },
  { id: '2', name: 'Huîtres N°2', quantity: 500, unit: 'pièces', location: 'Bassin B', lastUpdate: new Date() },
  { id: '3', name: 'Huîtres N°1', quantity: 300, unit: 'pièces', location: 'Bassin C', lastUpdate: new Date() }
];

export const StockPage: React.FC = () => {
  const [stocks, setStocks] = React.useState<Stock[]>(mockStocks);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = useState<string>('current');
  const navigate = useNavigate();

  const handleViewDetails = (stockId: string) => {
    navigate(`/tables/${stockId}`);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const tabs: TabData[] = [
    {
      id: 'current',
      label: 'Stock actuel',
      icon: <Package size={20} className="text-cyan-400" />,
      count: 3
    },
    {
      id: 'movements',
      label: 'Mouvements',
      icon: <ArrowLeftRight size={20} className="text-cyan-400" />,
    },
    {
      id: 'history',
      label: 'Historique',
      icon: <History size={20} className="text-cyan-400" />,
    },
    {
      id: 'analytics',
      label: 'Statistiques',
      icon: <BarChart3 size={20} className="text-cyan-400" />,
    }
  ];

  useEffect(() => {
    // Force un rendu explicite
  }, [activeTab]);

  return (
    <div className="w-full p-6 min-h-screen animate-fadeIn">
      {/* En-tête principal avec titre et contrôles */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Gestion des Stocks
        </h1>
        <p className="text-white/70 mt-2">
          Gestion centralisée des stocks pour tous vos produits.
        </p>
      </header>

      {/* Barre d'actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-white/50" size={18} aria-hidden="true" />
          <input 
            type="text" 
            placeholder="Rechercher un stock..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-auto min-w-[280px] rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white shadow-[0_4px_10px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            aria-label="Rechercher un stock"
          />
          <Filter className="absolute right-3 text-white/50" size={18} aria-hidden="true" />
        </div>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          aria-label="Ajouter un nouveau stock"
        >
          <Plus size={18} aria-hidden="true" />
          <span>Nouveau stock</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          aria-label="Filtrer les stocks"
        >
          <Filter size={18} aria-hidden="true" />
          <span>Filtres</span>
        </button>
      </div>

      {/* Navigation par onglets */}
      <div className="relative mb-6 mt-4">
        <div id="stock-page-tabs" className="w-full overflow-x-auto hide-scrollbar">
          <div 
            className="flex gap-4" 
            role="tablist"
            style={{
              padding: '4px',
              borderRadius: '12px'
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  minWidth: '44px',
                  minHeight: '44px',
                  backgroundColor: activeTab === tab.id ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  color: activeTab === tab.id ? '#22d3ee' : 'rgba(255, 255, 255, 0.6)',
                  boxShadow: activeTab === tab.id ? '0 4px 10px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 210, 200, 0.2)' : 'none',
                  border: activeTab === tab.id ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
                className={`stockpage-tab ${activeTab === tab.id ? 'stockpage-tab-active' : 'stockpage-tab-inactive'}`}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: activeTab === tab.id ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '9999px',
                      padding: '2px 8px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {tab.count}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        role="tabpanel" 
        id={`tab-panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'current' && (
          <div className="glass p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Package size={20} className="text-cyan-400" aria-hidden="true" />
                Inventaire actuel
              </h2>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Exporter l'inventaire"
                >
                  <Filter size={18} aria-hidden="true" />
                  <span>Exporter</span>
                </button>
              </div>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {stocks.map((stock) => (
                <motion.div
                  key={stock.id}
                  variants={itemVariants}
                  className="glass p-4 rounded-lg border border-white/10 hover:border-white/20 transition-duration-300 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-white">{stock.name}</h3>
                    <span className="text-white/60 text-sm">
                      {stock.lastUpdate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-white/60">Quantité</span>
                      <span className="font-medium text-white">
                        {stock.quantity} {stock.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Emplacement</span>
                      <span className="font-medium text-white">{stock.location}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleViewDetails(stock.id)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      aria-label={`Voir les détails de ${stock.name}`}
                    >
                      Voir détails
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {activeTab === 'movements' && (
          <div className="glass p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <ArrowLeftRight size={20} className="text-cyan-400" aria-hidden="true" />
                Mouvements de stock
              </h2>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Nouveau mouvement"
                >
                  <Plus size={18} aria-hidden="true" />
                  <span>Nouveau mouvement</span>
                </button>
              </div>
            </div>
            
            <div className="text-center py-10 text-white/60">
              Aucun mouvement récent. Utilisez le bouton "Nouveau mouvement" pour en créer un.
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="glass p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <History size={20} className="text-cyan-400" aria-hidden="true" />
                Historique des stocks
              </h2>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Exporter l'historique"
                >
                  <Filter size={18} aria-hidden="true" />
                  <span>Exporter</span>
                </button>
              </div>
            </div>
            
            <div className="text-center py-10 text-white/60">
              L'historique des mouvements de stock sera affiché ici.
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="glass p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <BarChart3 size={20} className="text-cyan-400" aria-hidden="true" />
                Statistiques des stocks
              </h2>
            </div>
            
            <div className="text-center py-10 text-white/60">
              Les statistiques et graphiques de performance des stocks seront affichés ici.
            </div>
          </div>
        )}
      </div>

      {/* Section des stocks dans d'autres emplacements */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-white/90">Autres emplacements</h2>
        <OtherLocations />
      </div>
    </div>
  );
};
