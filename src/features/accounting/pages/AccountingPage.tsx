  import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  Receipt,
  CreditCard,
  FileText,
  DollarSign,
  Users,
  Calendar,
  Filter,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Download,
  ArrowUp,
  ArrowDown,
  Wallet
} from 'lucide-react';
import { ModernChart } from '@/components/ui/ModernChart';
import { ModernStatCard } from '@/components/ui/ModernStatCard';
import { InvoiceForm } from '../components/InvoiceForm';
import { PageTitle } from '@/components/ui/PageTitle';
import type { InvoiceWithItems } from '@/types/accounting';

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export function AccountingPage() {
  const [showStats, setShowStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const handleCreateInvoice = (data: InvoiceWithItems) => {
    console.log('Creating invoice:', data);
    setShowNewInvoice(false);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      <PageTitle 
        icon={<DollarSign size={28} className="text-white" />}
        title="Comptabilité"
      />
      {/* En-tête avec titre et boutons */}
      <motion.div 
        variants={itemVariants}
        className="md:col-span-3 lg:col-span-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
          padding: "1.5rem",
          borderRadius: "1rem",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "rgba(0, 0, 0, 0.3) 0px 10px 25px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset"
        }}
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent" 
          style={{ backgroundImage: "linear-gradient(90deg, #ffffff, #a5f3fc)" }}>
          Comptabilité
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 rounded-lg text-white text-sm transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.07) 100%)",
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 6px 0px, rgba(255, 255, 255, 0.1) 0px 1px 2px 0px inset",
            }}
          >
            <BarChart2 size={20} className="mr-2 inline-block" />
            Statistiques
          </button>
          <button
            onClick={() => setShowNewInvoice(true)}
            className="px-4 py-2 rounded-lg text-white text-sm transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.07) 100%)",
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 6px 0px, rgba(255, 255, 255, 0.1) 0px 1px 2px 0px inset",
            }}
          >
            <Receipt size={20} className="mr-2 inline-block" />
            Nouvelle Facture
          </button>
        </div>
      </motion.div>

      {/* Graphiques */}
      {showStats && (
        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="rounded-xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
            }}
          >
            <h3 className="text-lg font-medium text-white mb-6">Revenus et Dépenses</h3>
            <ModernChart series={revenueChartSeries} height={300} />
          </div>
          <div className="rounded-xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
            }}
          >
            <h3 className="text-lg font-medium text-white mb-6">Flux de Trésorerie</h3>
            <ModernChart series={cashflowChartSeries} height={300} />
          </div>
        </motion.div>
      )}

      {/* Barre de recherche et filtres */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center space-x-4 mb-6"
      >
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des transactions..."
            className="w-full pl-10 pr-4 py-2 rounded-lg text-white placeholder-white/40"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          />
        </div>
        <button className="px-4 py-2 rounded-lg text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.07) 100%)",
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 6px 0px, rgba(255, 255, 255, 0.1) 0px 1px 2px 0px inset",
          }}
        >
          <Filter size={20} className="mr-2 inline-block" />
          Filtres
        </button>
        <button className="px-4 py-2 rounded-lg text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.07) 100%)",
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 6px 0px, rgba(255, 255, 255, 0.1) 0px 1px 2px 0px inset",
          }}
        >
          <Calendar size={20} className="mr-2 inline-block" />
          Période
        </button>
      </motion.div>

      {/* Cartes statistiques */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <ModernStatCard
          icon={<Plus />}
          label="Chiffre d'affaires"
          value="58,000 €"
          trend={{ value: 12, positive: true }}
        />
        <ModernStatCard
          icon={<ArrowUp />}
          label="Bénéfice net"
          value="12,500 €"
          trend={{ value: 8, positive: true }}
        />
        <ModernStatCard
          icon={<ArrowDown />}
          label="Dépenses"
          value="45,500 €"
          trend={{ value: 5, positive: false }}
        />
        <ModernStatCard
          icon={<Wallet />}
          label="Trésorerie"
          value="25,800 €"
          trend={{ value: 3, positive: true }}
        />
      </motion.div>

      {/* Tableau des transactions */}
      <motion.div 
        variants={itemVariants}
        className="rounded-xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(0, 10, 40, 0.85) 0%, rgba(0, 100, 120, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
        }}
      >
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
      </motion.div>

      {showNewInvoice && (
        <InvoiceForm onSubmit={handleCreateInvoice} onClose={() => setShowNewInvoice(false)} />
      )}
    </motion.div>
  );
}