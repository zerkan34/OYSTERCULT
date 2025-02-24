import React, { useState } from 'react';
import { Plus, Filter, Search, BarChart2, ShoppingCart, Package, TrendingUp, Users } from 'lucide-react';
import { ModernChart } from '@/components/ui/ModernChart';
import { ModernStatCard } from '@/components/ui/ModernStatCard';

const mockPurchasesData = [
  { month: 'Jan', achats: 32000, budget: 35000 },
  { month: 'Fév', achats: 35000, budget: 35000 },
  { month: 'Mar', achats: 33000, budget: 35000 },
  { month: 'Avr', achats: 36000, budget: 35000 },
  { month: 'Mai', achats: 38000, budget: 35000 },
  { month: 'Juin', achats: 34000, budget: 35000 }
];

const mockSupplierShare = [
  { name: 'Naissain Express', value: 45 },
  { name: 'Emballages Océan', value: 30 },
  { name: 'Matériel Pro', value: 25 }
];

const purchasesChartSeries = [
  { key: 'achats', name: 'Achats', color: '#00D1FF' },
  { key: 'budget', name: 'Budget', color: '#7000FF' }
];

const supplierShareChartSeries = [
  { key: 'value', name: 'Répartition', color: '#00D1FF' }
];

export function PurchasesPage() {
  const [showStats, setShowStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Achats</h1>
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
            Nouvel Achat
          </button>
        </div>
      </div>

      {showStats && (
        <>
          <div className="grid grid-cols-4 gap-6">
            <ModernStatCard
              icon={<ShoppingCart size={24} />}
              label="Total des achats"
              value="208,000€"
              color="primary"
            />
            <ModernStatCard
              icon={<TrendingUp size={24} />}
              label="Budget restant"
              value="42,000€"
              color="secondary"
            />
            <ModernStatCard
              icon={<Package size={24} />}
              label="Commandes en cours"
              value="12"
              color="tertiary"
            />
            <ModernStatCard
              icon={<Users size={24} />}
              label="Fournisseurs actifs"
              value="8"
              color="primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <ModernChart
              title="Évolution des achats"
              type="bar"
              data={mockPurchasesData}
              series={purchasesChartSeries}
              height={320}
            />

            <ModernChart
              title="Répartition par fournisseur"
              type="pie"
              data={mockSupplierShare}
              series={supplierShareChartSeries}
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
            placeholder="Rechercher un achat..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
          />
        </div>
        <button className="btn-secondary">
          <Filter size={20} className="mr-2" />
          Filtres
        </button>
      </div>

      {/* Liste des achats */}
      <div className="glass-effect rounded-lg">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Historique des achats</h3>
        </div>
        <div className="divide-y divide-white/10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                    <Package size={20} className="text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Commande #00{i}</h4>
                    <p className="text-sm text-white/60 mt-1">Naissain Express</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-white/60">
                      <span>15/02/2025</span>
                      <span>•</span>
                      <span>1,500€</span>
                      <span>•</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
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