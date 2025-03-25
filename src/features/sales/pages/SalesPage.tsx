import React, { useState } from 'react';
import { Plus, Filter, Search, BarChart2, DollarSign, TrendingUp, Users, Package, ShoppingCart, Calendar, CreditCard } from 'lucide-react';
import { ModernChart } from '@/components/ui/ModernChart';
import { ModernStatCard } from '@/components/ui/ModernStatCard';
import { motion } from 'framer-motion';

// Import du fichier CSS pour les animations et styles
import './sales.css';

const mockSalesData = [
  { month: 'Jan', ventes: 45000, objectif: 50000 },
  { month: 'Fév', ventes: 52000, objectif: 50000 },
  { month: 'Mar', ventes: 48000, objectif: 50000 },
  { month: 'Avr', ventes: 51000, objectif: 50000 },
  { month: 'Mai', ventes: 58000, objectif: 50000 },
  { month: 'Juin', ventes: 53000, objectif: 50000 }
];

const mockProductSales = [
  { name: 'Huîtres Plates', value: 40 },
  { name: 'Huîtres Creuses', value: 45 },
  { name: 'Huîtres Spéciales', value: 15 }
];

// Données pour les graphiques
const salesChartSeries = [
  {
    name: 'Ventes',
    color: '#22d3ee',
    data: mockSalesData.map(item => ({
      name: item.month,
      value: item.ventes
    }))
  },
  {
    name: 'Objectif',
    color: '#60a5fa',
    data: mockSalesData.map(item => ({
      name: item.month,
      value: item.objectif
    }))
  }
];

const productSalesChartSeries = [
  {
    name: 'Produits',
    color: '#22d3ee',
    data: mockProductSales.map(item => ({
      name: item.name,
      value: item.value
    }))
  }
];

export function SalesPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <BarChart2 size={20} aria-hidden="true" /> },
    { id: 'sales', label: 'Ventes', icon: <ShoppingCart size={20} aria-hidden="true" /> },
    { id: 'invoices', label: 'Factures', icon: <CreditCard size={20} aria-hidden="true" /> },
    { id: 'history', label: 'Historique', icon: <Calendar size={20} aria-hidden="true" /> },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="w-full p-6 min-h-screen animate-fadeIn">
      {/* En-tête avec dégradé */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Gestion des Ventes
        </h1>
        <p className="text-white/70 mt-2">
          Suivez vos ventes et analysez les performances commerciales.
        </p>
      </header>

      {/* Barre d'actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-white/50" size={18} aria-hidden="true" />
          <input 
            type="text" 
            placeholder="Rechercher une vente..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-auto min-w-[280px] rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white shadow-[0_4px_10px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            aria-label="Rechercher une vente"
          />
          <Filter className="absolute right-3 text-white/50" size={18} aria-hidden="true" />
        </div>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          aria-label="Ajouter une nouvelle vente"
        >
          <Plus size={18} aria-hidden="true" />
          <span>Nouvelle Vente</span>
        </button>
      </div>

      {/* Navigation par onglets */}
      <div className="mb-6">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div
        role="tabpanel" 
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white/70 text-sm">Chiffre d'affaires</h3>
                    <p className="text-2xl font-bold text-white mt-1">307,500€</p>
                  </div>
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <DollarSign size={24} className="text-cyan-400" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="text-green-400 text-sm font-medium flex items-center">
                    <TrendingUp size={16} className="mr-1" aria-hidden="true" />
                    +12.5%
                  </div>
                  <span className="text-white/50 text-sm ml-2">vs mois dernier</span>
                </div>
              </div>

              <div className="glass p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white/70 text-sm">Commandes</h3>
                    <p className="text-2xl font-bold text-white mt-1">156</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Package size={24} className="text-purple-400" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="text-green-400 text-sm font-medium flex items-center">
                    <TrendingUp size={16} className="mr-1" aria-hidden="true" />
                    +5.2%
                  </div>
                  <span className="text-white/50 text-sm ml-2">vs mois dernier</span>
                </div>
              </div>

              <div className="glass p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white/70 text-sm">Panier moyen</h3>
                    <p className="text-2xl font-bold text-white mt-1">1,972€</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <ShoppingCart size={24} className="text-blue-400" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="text-green-400 text-sm font-medium flex items-center">
                    <TrendingUp size={16} className="mr-1" aria-hidden="true" />
                    +8.3%
                  </div>
                  <span className="text-white/50 text-sm ml-2">vs mois dernier</span>
                </div>
              </div>

              <div className="glass p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white/70 text-sm">Clients actifs</h3>
                    <p className="text-2xl font-bold text-white mt-1">89</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Users size={24} className="text-green-400" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="text-green-400 text-sm font-medium flex items-center">
                    <TrendingUp size={16} className="mr-1" aria-hidden="true" />
                    +3.7%
                  </div>
                  <span className="text-white/50 text-sm ml-2">vs mois dernier</span>
                </div>
              </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4">Évolution des ventes</h3>
                <ModernChart
                  series={salesChartSeries}
                  height={320}
                  showGrid={true}
                  showLegend={true}
                />
              </div>

              <div className="glass p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4">Répartition des ventes</h3>
                <ModernChart
                  series={productSalesChartSeries}
                  height={320}
                  showGrid={true}
                  showLegend={true}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="glass p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-6">Historique des ventes</h2>
            <div className="divide-y divide-white/10">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Package size={20} className="text-cyan-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Commande #00{i}</h4>
                        <p className="text-sm text-white/60 mt-1">Restaurant La Marée</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-white/60">
                          <span>15/02/2025</span>
                          <span>•</span>
                          <span>1,500€</span>
                          <span>•</span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Payée
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                      aria-label="Voir les détails de la commande"
                    >
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="glass p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-6">Factures</h2>
            <p className="text-white/70">Consultez et générez les factures pour vos clients.</p>
            <div className="mt-4 divide-y divide-white/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <CreditCard size={20} className="text-blue-400" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Facture #00{i}</h4>
                        <p className="text-sm text-white/60 mt-1">Restaurant La Marée</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-white/60">
                          <span>15/02/2025</span>
                          <span>•</span>
                          <span>1,500€</span>
                          <span>•</span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Payée
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                      aria-label="Télécharger la facture"
                    >
                      Télécharger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="glass p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-6">Historique des opérations</h2>
            <p className="text-white/70">Consultez l'historique de toutes les opérations de vente.</p>
            <div className="mt-4 divide-y divide-white/10">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Calendar size={20} className="text-purple-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">Opération #{i}</h4>
                      <p className="text-sm text-white/60 mt-1">Marie Dupont</p>
                      <div className="mt-2 text-sm text-white/60">
                        <span>15/02/2025 à 14:30</span>
                        <p className="mt-1">Création d'une nouvelle vente pour Restaurant La Marée</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}