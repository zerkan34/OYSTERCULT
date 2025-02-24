import React, { useState } from 'react';
import { Plus, Filter, Search, BarChart2, Package, AlertTriangle, Droplets } from 'lucide-react';
import { OysterTableMap } from '../components/OysterTableMap';
import { PurificationPools } from '../components/PurificationPools';
import { TrempeView } from '../components/TrempeView';
import { useStore } from '@/lib/store';
import { TableDetail } from '../components/TableDetail';
import { InventoryForm } from '../components/InventoryForm';
import { InventoryFilters } from '../components/InventoryFilters';
import { useTouchGestures } from '@/lib/hooks';

type TabType = 'tables' | 'pools' | 'trempes' | 'history';

export function InventoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('tables');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [hoveredTable, setHoveredTable] = useState(null);
  const [showNewItem, setShowNewItem] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const pageRef = React.useRef<HTMLDivElement>(null);

  // Touch gesture handling
  const { handlers, isRefreshing } = useTouchGestures(
    async () => {
      // Refresh data
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  );

  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
  };

  const handleTableHover = (table: any) => {
    setHoveredTable(table);
  };

  const handleCloseTableDetail = () => {
    setSelectedTable(null);
    setHoveredTable(null);
  };

  return (
    <div 
      ref={pageRef} 
      className="space-y-6"
      {...handlers}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Stock</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewItem(true)}
            className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nouveau Lot
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('tables')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'tables'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Package size={16} className="mr-2" />
            Tables
          </div>
        </button>
        <button
          onClick={() => setActiveTab('trempes')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'trempes'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Droplets size={16} className="mr-2" />
            Trempes
          </div>
        </button>
        <button
          onClick={() => setActiveTab('pools')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pools'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Droplets size={16} className="mr-2" />
            Bassins
          </div>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <BarChart2 size={16} className="mr-2" />
            Historique des alertes
          </div>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
          />
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
        >
          <Filter size={20} className="mr-2" />
          Filtres
        </button>
      </div>

      {/* Alertes Critiques */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <div className="flex items-center space-x-3 text-red-400">
          <AlertTriangle size={24} />
          <div>
            <div className="font-medium">3 alertes actives</div>
            <div className="text-sm">
              Qualité dégradée • Position incorrecte • Maintenance bassin requise
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'tables' && (
        <div className="space-y-6">
          <OysterTableMap
            onTableSelect={handleTableSelect}
            onTableHover={handleTableHover}
          />
        </div>
      )}
      {activeTab === 'pools' && <PurificationPools />}
      {activeTab === 'trempes' && <TrempeView />}
      {activeTab === 'history' && (
        <div>Historique des alertes</div>
      )}

      {selectedTable && (
        <TableDetail 
          table={selectedTable} 
          onClose={handleCloseTableDetail} 
        />
      )}

      {showNewItem && (
        <InventoryForm 
          isOpen={showNewItem} 
          onClose={() => setShowNewItem(false)} 
        />
      )}

      {showFilters && (
        <InventoryFilters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApplyFilters={() => {}}
        />
      )}

      {/* Loading overlay for refresh */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/5 rounded-full p-4">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}