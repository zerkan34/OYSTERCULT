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

const revenueChartSeries = [
  { key: 'revenue', name: 'Revenus', color: '#00D1FF' },
  { key: 'expenses', name: 'Dépenses', color: '#FF3366' }
];

const cashflowChartSeries = [
  { key: 'inflow', name: 'Entrées', color: '#00D1FF' },
  { key: 'outflow', name: 'Sorties', color: '#FF3366' }
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
            className="btn-secondary"
          >
            <BarChart2 size={20} className="mr-2" />
            Statistiques
          </button>
          <button
            className="btn-primary"
          >
            <Receipt size={20} className="mr-2" />
            Nouvelle Facture
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
              icon={<Wallet size={24} />}
              label="Dépenses"
              value="228,000€"
              trend={{ value: 8.3, positive: false }}
              color="secondary"
            />
            <ModernStatCard
              icon={<Receipt size={24} />}
              label="Factures en attente"
              value="24"
              color="tertiary"
            />
            <ModernStatCard
              icon={<CreditCard size={24} />}
              label="Paiements reçus"
              value="52,800€"
              color="primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <ModernChart
              title="Revenus vs Dépenses"
              type="bar"
              data={mockRevenueData}
              series={revenueChartSeries}
              height={320}
            />

            <ModernChart
              title="Flux de trésorerie"
              type="line"
              data={mockCashFlow}
              series={cashflowChartSeries}
              height={320}
            />
          </div>
        </>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher des transactions..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={20} className="mr-2" />
          Filtres
        </button>
        <button className="btn-secondary">
          <Calendar size={20} className="mr-2" />
          Période
        </button>
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