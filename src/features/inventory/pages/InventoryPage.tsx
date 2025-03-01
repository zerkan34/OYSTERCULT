import React, { useState } from 'react';
import { Plus, Filter, Search, BarChart2, Package, AlertTriangle, Droplets, ShoppingCart } from 'lucide-react';
import { OysterTableMap, Table } from '../components/OysterTableMap';
import { PurificationPools } from '../components/PurificationPools';
import { TrempeView } from '../components/TrempeView';
import { useStore } from '@/lib/store';
import { TableDetail } from '../components/TableDetail';
import { InventoryForm } from '../components/InventoryForm';
import { InventoryFilters } from '../components/InventoryFilters';
import { useTouchGestures } from '@/lib/hooks';
import { PurchaseConfiguration } from '@/features/purchases/components/PurchaseConfiguration';
import { PurchaseForm } from '@/features/purchases/components/PurchaseForm';

type TabType = 'tables' | 'pools' | 'trempes' | 'achats';

export function InventoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('tables');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [hoveredTable, setHoveredTable] = useState<Table | null>(null);
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
            {activeTab === 'achats' ? 'Nouvel achat' : 'Nouveau Lot'}
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
          onClick={() => setActiveTab('achats')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'achats'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <ShoppingCart size={16} className="mr-2" />
            Achats
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

      {activeTab === 'tables' && (
        <OysterTableMap
          onTableSelect={setSelectedTable}
          onTableHover={setHoveredTable}
          hoveredTable={hoveredTable}
          selectedTable={selectedTable}
        />
      )}
      {activeTab === 'pools' && <PurificationPools />}
      {activeTab === 'trempes' && <TrempeView />}
      {activeTab === 'achats' && <PurchaseConfiguration />}

      {selectedTable && (
        <TableDetail
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}

      {showNewItem && activeTab !== 'achats' && (
        <InventoryForm
          isOpen={showNewItem}
          onClose={() => setShowNewItem(false)}
        />
      )}

      {showNewItem && activeTab === 'achats' && (
        <PurchaseForm
          isOpen={showNewItem}
          onClose={() => setShowNewItem(false)}
        />
      )}

      {showFilters && (
        <InventoryFilters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
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