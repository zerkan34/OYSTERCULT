import React, { useState } from 'react';
import { 
  BarChart2, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  CreditCard,
  Wallet,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { ModernChart } from '@/components/ui/ModernChart';
import { ModernStatCard } from '@/components/ui/ModernStatCard';

const mockRevenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Fév', revenue: 52000, expenses: 35000 },
  { month: 'Mar', revenue: 48000, expenses: 33000 },
  { month: 'Avr', revenue: 51000, expenses: 36000 },
  { month: 'Mai', revenue: 58000, expenses: 38000 },
  { month: 'Juin', revenue: 53000, expenses: 34000 }
];

const mockCashFlow = [
  { month: 'Jan', inflow: 55000, outflow: 42000 },
  { month: 'Fév', inflow: 62000, outflow: 45000 },
  { month: 'Mar', inflow: 58000, outflow: 43000 },
  { month: 'Avr', inflow: 61000, outflow: 46000 },
  { month: 'Mai', inflow: 68000, outflow: 48000 },
  { month: 'Juin', inflow: 63000, outflow: 44000 }
];

// Formater les données pour ModernChart
const formatChartData = (data: any[], key: string) => ({
  data: data.map(item => ({
    name: item.month,
    value: item[key]
  }))
});

const revenueChartSeries = [
  { 
    name: 'Revenus',
    color: '#00D1FF',
    ...formatChartData(mockRevenueData, 'revenue')
  },
  { 
    name: 'Dépenses',
    color: '#FF3366',
    ...formatChartData(mockRevenueData, 'expenses')
  }
];

const cashflowChartSeries = [
  { 
    name: 'Entrées',
    color: '#00D1FF',
    ...formatChartData(mockCashFlow, 'inflow')
  },
  { 
    name: 'Sorties',
    color: '#FF3366',
    ...formatChartData(mockCashFlow, 'outflow')
  }
];

export function AccountingPage() {
  const [showStats, setShowStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Comptabilité</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <BarChart2 size={20} className="mr-2" />
            Statistiques
          </button>
          <button
            className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <Receipt size={20} className="mr-2" />
            Nouvelle Facture
          </button>
        </div>
      </div>

      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-effect p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-6">Revenus et Dépenses</h3>
            <ModernChart series={revenueChartSeries} height={300} />
          </div>
          <div className="glass-effect p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-6">Flux de Trésorerie</h3>
            <ModernChart series={cashflowChartSeries} height={300} />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des transactions..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
          <Filter size={20} className="mr-2" />
          Filtres
        </button>
        <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
          <Calendar size={20} className="mr-2" />
          Période
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernStatCard
          title="Chiffre d'affaires"
          value="58,000 €"
          change="+12%"
          trend="up"
          icon={<DollarSign />}
        />
        <ModernStatCard
          title="Bénéfice net"
          value="24,500 €"
          change="+8%"
          trend="up"
          icon={<TrendingUp />}
        />
        <ModernStatCard
          title="Dépenses"
          value="33,500 €"
          change="-5%"
          trend="down"
          icon={<CreditCard />}
        />
        <ModernStatCard
          title="Trésorerie"
          value="125,000 €"
          change="+15%"
          trend="up"
          icon={<Wallet />}
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-4">Date</th>
              <th className="pb-4">Description</th>
              <th className="pb-4">Type</th>
              <th className="pb-4 text-right">Montant</th>
              <th className="pb-4">Statut</th>
            </tr>
          </thead>
          <tbody className="text-white">
            <tr className="border-t border-gray-700">
              <td className="py-4">15/06/2023</td>
              <td>Facture #2023-156</td>
              <td>Vente</td>
              <td className="text-right text-green-400">+3,500€</td>
              <td><span className="px-2 py-1 rounded-full bg-green-900 text-green-300 text-sm">Payée</span></td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="py-4">14/06/2023</td>
              <td>Fournitures bureau</td>
              <td>Dépense</td>
              <td className="text-right text-red-400">-250€</td>
              <td><span className="px-2 py-1 rounded-full bg-blue-900 text-blue-300 text-sm">Traitée</span></td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="py-4">12/06/2023</td>
              <td>Facture #2023-155</td>
              <td>Vente</td>
              <td className="text-right text-green-400">+2,800€</td>
              <td><span className="px-2 py-1 rounded-full bg-yellow-900 text-yellow-300 text-sm">En attente</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}