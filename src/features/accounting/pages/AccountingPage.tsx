  import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, Receipt, CreditCard, FileText, DollarSign,
  Users, Calendar, Filter, ChevronDown, ChevronRight,
  Plus, Search, Download, ArrowUp, ArrowDown, Wallet,
  TrendingUp, Banknote, CircleDollarSign, PiggyBank, X
} from 'lucide-react';
import {
  ModernChart
} from '@/components/ui/ModernChart';
import {
  PageTitle
} from '@/components/ui/PageTitle';
import {
  InvoiceForm
} from '../components/InvoiceForm';
import type {
  InvoiceWithItems
} from '@/types/accounting';

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

const formatChartData = (data: any[], key: string) => ({
  data: data.map(item => ({
    name: item.month,
    value: item[key]
  }))
});

const revenueChartSeries = [
  { 
    name: 'Revenus',
    color: '#22d3ee',
    ...formatChartData(mockRevenueData, 'revenue')
  },
  { 
    name: 'Dépenses',
    color: '#fb7185',
    ...formatChartData(mockRevenueData, 'expenses')
  }
];

const cashflowChartSeries = [
  { 
    name: 'Entrées',
    color: '#22d3ee',
    ...formatChartData(mockCashFlow, 'inflow')
  },
  { 
    name: 'Sorties',
    color: '#fb7185',
    ...formatChartData(mockCashFlow, 'outflow')
  }
];

export function AccountingPage() {
  const [showStats, setShowStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const handleCreateInvoice = (data: InvoiceWithItems) => {
    console.log('Creating invoice:', data);
    setShowNewInvoice(false);
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <CircleDollarSign size={32} className="text-cyan-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Comptabilité
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowNewInvoice(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus size={20} aria-hidden="true" />
            Nouvelle Facture
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            <BarChart2 size={20} aria-hidden="true" />
            Statistiques
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
              <p className="text-white/70">Chiffre d'affaires</p>
              <p className="text-2xl font-semibold text-white">58,000 €</p>
              <p className="text-sm text-emerald-400">+12% ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-cyan-500/20">
              <Banknote size={24} className="text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/70">Bénéfice net</p>
              <p className="text-2xl font-semibold text-white">12,500 €</p>
              <p className="text-sm text-emerald-400">+8% ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-cyan-500/20">
              <CircleDollarSign size={24} className="text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/70">Dépenses</p>
              <p className="text-2xl font-semibold text-white">45,500 €</p>
              <p className="text-sm text-rose-400">+5% ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-cyan-500/20">
              <PiggyBank size={24} className="text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/70">Trésorerie</p>
              <p className="text-2xl font-semibold text-white">25,800 €</p>
              <p className="text-sm text-emerald-400">+3% ce mois</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      {showStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Revenus et Dépenses</h3>
              <div className="flex gap-2">
                <button className="text-white/60 hover:text-white px-3 py-1 rounded-md hover:bg-white/5 transition-colors">M</button>
                <button className="text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-md">T</button>
                <button className="text-white/60 hover:text-white px-3 py-1 rounded-md hover:bg-white/5 transition-colors">A</button>
              </div>
            </div>
            <ModernChart series={revenueChartSeries} height={300} />
          </div>
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Flux de Trésorerie</h3>
              <div className="flex gap-2">
                <button className="text-white/60 hover:text-white px-3 py-1 rounded-md hover:bg-white/5 transition-colors">M</button>
                <button className="text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-md">T</button>
                <button className="text-white/60 hover:text-white px-3 py-1 rounded-md hover:bg-white/5 transition-colors">A</button>
              </div>
            </div>
            <ModernChart series={cashflowChartSeries} height={300} />
          </div>
        </div>
      )}

      {/* Tableau des transactions */}
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Transactions récentes</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 w-64 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <th className="pb-4">Description</th>
              <th className="pb-4">Type</th>
              <th className="pb-4 text-right">Montant</th>
              <th className="pb-4">Statut</th>
            </tr>
          </thead>
          <tbody className="text-white">
            <tr className="border-t border-white/10">
              <td className="py-4">15/06/2023</td>
              <td>Facture #2023-156</td>
              <td>Vente</td>
              <td className="text-right text-cyan-400">+3,500€</td>
              <td>
                <span className="px-2 py-1 rounded-full text-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)",
                    color: "#4ade80"
                  }}
                >
                  Payée
                </span>
              </td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="py-4">14/06/2023</td>
              <td>Fournitures bureau</td>
              <td>Dépense</td>
              <td className="text-right text-red-400">-250€</td>
              <td>
                <span className="px-2 py-1 rounded-full text-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)",
                    color: "#60a5fa"
                  }}
                >
                  Traitée
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showNewInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.95)] to-[rgba(20,100,100,0.95)] p-6 rounded-lg shadow-2xl max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Nouvelle Facture</h2>
              <button 
                onClick={() => setShowNewInvoice(false)}
                className="text-white/60 hover:text-white"
                aria-label="Fermer"
              >
                <X size={24} />
              </button>
            </div>
            <InvoiceForm 
              type="sale"
              onSubmit={handleCreateInvoice}
              onCancel={() => setShowNewInvoice(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}