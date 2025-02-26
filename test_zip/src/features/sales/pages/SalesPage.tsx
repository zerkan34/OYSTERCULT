import React, { useState } from 'react';
import { Plus, Filter, Search, BarChart2, DollarSign, TrendingUp, Users, Package } from 'lucide-react';
import { ModernChart } from '@/components/ui/ModernChart';
import { ModernStatCard } from '@/components/ui/ModernStatCard';

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

const salesChartSeries = [
  { key: 'ventes', name: 'Ventes', color: '#00D1FF' },
  { key: 'objectif', name: 'Objectif', color: '#7000FF' }
];

const productSalesChartSeries = [
  { key: 'value', name: 'Répartition', color: '#00D1FF' }
];

export function SalesPage() {
  const [showStats, setShowStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Ventes</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="btn-secondary"
          >
            <BarChart2 size={20} className="mr-2" />
            Statistiques
          </button>
          <button className="btn-primary">
            <Plus size={20} className="mr-2" />
            Nouvelle Vente
          </button>
        </div>
      </div>

      {showStats && (
        <>
          <div className="grid grid-cols-4 gap-6">
            <ModernStatCard
              icon={<DollarSign size={24} />}
              label="Chiffre d'affaires"
              value="307,500€"
              trend={{ value: 12.5, positive: true }}
              color="primary"
            />
            <ModernStatCard
              icon={<Package size={24} />}
              label="Commandes"
              value="156"
              color="secondary"
            />
            <ModernStatCard
              icon={<TrendingUp size={24} />}
              label="Panier moyen"
              value="1,972€"
              trend={{ value: 8.3, positive: true }}
              color="tertiary"
            />
            <ModernStatCard
              icon={<Users size={24} />}
              label="Clients actifs"
              value="89"
              color="primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <ModernChart
              title="Évolution des ventes"
              type="bar"
              data={mockSalesData}
              series={salesChartSeries}
              height={320}
            />

            <ModernChart
              title="Répartition des ventes"
              type="pie"
              data={mockProductSales}
              series={productSalesChartSeries}
              height={320}
            />
          </div>
        </>
      )}

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une vente..."
            className="input-modern w-full pl-10"
          />
        </div>
        <button className="btn-secondary">
          <Filter size={20} className="mr-2" />
          Filtres
        </button>
      </div>

      {/* Liste des ventes */}
      <div className="glass-effect rounded-xl">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Historique des ventes</h3>
        </div>
        <div className="divide-y divide-white/10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                    <Package size={20} className="text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Commande #00{i}</h4>
                    <p className="text-sm text-white/60 mt-1">Restaurant La Marée</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-white/60">
                      <span>15/02/2025</span>
                      <span>•</span>
                      <span>1,500€</span>
                      <span>•</span>
                      <span className="px-2 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-xs">
                        Payée
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}