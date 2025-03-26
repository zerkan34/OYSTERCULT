import React, { useState } from 'react';
import {
  ShoppingCart, Search, Filter, Plus, ChevronDown,
  TrendingUp, Users, ShoppingBag, Package, X,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { ModernChart } from '@/components/ui/ModernChart';
import { SaleForm } from '../components';

const mockSalesData = [
  { month: 'Jan', sales: 42000, orders: 156 },
  { month: 'Fév', sales: 48000, orders: 172 },
  { month: 'Mar', sales: 45000, orders: 168 },
  { month: 'Avr', sales: 52000, orders: 189 },
  { month: 'Mai', sales: 49000, orders: 175 },
  { month: 'Juin', sales: 55000, orders: 198 }
];

const formatChartData = (data: any[], key: string) => ({
  data: data.map(item => ({
    name: item.month,
    value: item[key]
  }))
});

const salesChartSeries = [
  { 
    name: 'Ventes',
    color: '#22d3ee',
    ...formatChartData(mockSalesData, 'sales')
  }
];

const ordersChartSeries = [
  { 
    name: 'Commandes',
    color: '#22d3ee',
    ...formatChartData(mockSalesData, 'orders')
  }
];

export function SalesPage() {
  const [showNewSale, setShowNewSale] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const handleCreateSale = (data: any) => {
    console.log('Creating sale:', data);
    setShowNewSale(false);
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <ShoppingCart size={32} className="text-cyan-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Ventes
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowNewSale(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus size={20} aria-hidden="true" />
            Nouvelle Vente
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-cyan-500/20">
              <TrendingUp size={24} className="text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/70">Ventes totales</p>
              <p className="text-2xl font-semibold text-white">55,000 €</p>
              <p className="text-sm text-emerald-400">+12% ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-cyan-500/20">
              <Users size={24} className="text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/70">Nouveaux clients</p>
              <p className="text-2xl font-semibold text-white">24</p>
              <p className="text-sm text-emerald-400">+8% ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-cyan-500/20">
              <ShoppingBag size={24} className="text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/70">Commandes</p>
              <p className="text-2xl font-semibold text-white">198</p>
              <p className="text-sm text-emerald-400">+15% ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-cyan-500/20">
              <Package size={24} className="text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/70">Produits vendus</p>
              <p className="text-2xl font-semibold text-white">856</p>
              <p className="text-sm text-emerald-400">+5% ce mois</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Évolution des ventes</h3>
            <div className="flex gap-2">
              <button 
                className="text-white/60 hover:text-white px-3 py-1 rounded-md hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label="Voir les données mensuelles"
              >
                M
              </button>
              <button 
                className="text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-md min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label="Voir les données trimestrielles"
                aria-current="true"
              >
                T
              </button>
              <button 
                className="text-white/60 hover:text-white px-3 py-1 rounded-md hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label="Voir les données annuelles"
              >
                A
              </button>
            </div>
          </div>
          <ModernChart series={salesChartSeries} height={300} />
        </div>
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Nombre de commandes</h3>
            <div className="flex gap-2">
              <button 
                className="text-white/60 hover:text-white px-3 py-1 rounded-md hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label="Voir les données mensuelles"
              >
                M
              </button>
              <button 
                className="text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-md min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label="Voir les données trimestrielles"
                aria-current="true"
              >
                T
              </button>
              <button 
                className="text-white/60 hover:text-white px-3 py-1 rounded-md hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label="Voir les données annuelles"
              >
                A
              </button>
            </div>
          </div>
          <ModernChart series={ordersChartSeries} height={300} />
        </div>
      </div>

      {/* Liste des ventes */}
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Dernières ventes</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1">
              <Filter size={20} aria-hidden="true" />
              Filtres
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-white/60">
              <th className="pb-4">Date</th>
              <th className="pb-4">Client</th>
              <th className="pb-4">Produits</th>
              <th className="pb-4 text-right">Montant</th>
              <th className="pb-4">Statut</th>
            </tr>
          </thead>
          <tbody className="text-white">
            <tr className="border-t border-white/10">
              <td className="py-4">26/03/2025</td>
              <td>Martin Dubois</td>
              <td>Huîtres Spéciales N°2 (3 dz)</td>
              <td className="text-right text-cyan-400">89.70 €</td>
              <td>
                <span className="px-2 py-1 rounded-full text-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)",
                    color: "#4ade80"
                  }}
                >
                  Livrée
                </span>
              </td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="py-4">26/03/2025</td>
              <td>Sophie Martin</td>
              <td>Huîtres Fines N°3 (4 dz)</td>
              <td className="text-right text-cyan-400">95.60 €</td>
              <td>
                <span className="px-2 py-1 rounded-full text-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)",
                    color: "#60a5fa"
                  }}
                >
                  En cours
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal nouvelle vente */}
      {showNewSale && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] p-6 rounded-lg shadow-2xl max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Nouvelle Vente</h2>
              <button 
                onClick={() => setShowNewSale(false)}
                className="text-white/60 hover:text-white"
                aria-label="Fermer"
              >
                <X size={24} />
              </button>
            </div>
            <SaleForm 
              onSubmit={handleCreateSale}
              onCancel={() => setShowNewSale(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}