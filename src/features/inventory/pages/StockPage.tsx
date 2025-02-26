import React, { useState } from 'react';
import { Package, Search, Filter, Eye } from 'lucide-react';
import { ModernCardBase } from '@/components/ui/ModernCardBase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OysterTableMap } from '../components/OysterTableMap';
import { TableDetail } from '../components/TableDetail';
import { TrempeView } from '../components/TrempeView';
import { PurchaseConfiguration } from '@/features/purchases/components/PurchaseConfiguration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export function StockPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [hoveredTable, setHoveredTable] = useState(null);
  const [activeTab, setActiveTab] = useState('bassins');

  // Gestionnaire pour fermer le catalogue si on clique ailleurs
  const handlePageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Si le clic n'est pas sur le catalogue ou le bouton de catalogue
    if (!target.closest('.catalog-content') && !target.closest('.catalog-button')) {
      setShowCatalog(false);
    }
  };

  return (
    <div onClick={handlePageClick} className="h-full">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Stock</h1>
            <p className="text-sm text-white/60 mt-1">Visualisez et gérez votre inventaire</p>
          </div>
          <Button 
            className="catalog-button bg-blue-600 hover:bg-blue-700 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setShowCatalog(!showCatalog);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showCatalog ? 'Masquer le catalogue' : 'Voir le catalogue'}
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="Rechercher dans le stock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative">
        {/* Table des stocks */}
        <div className={`transition-all duration-300 ${showCatalog ? 'mr-80' : ''}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="bassins">Bassins</TabsTrigger>
              <TabsTrigger value="trempes">Trempes</TabsTrigger>
              <TabsTrigger value="achats">Achats</TabsTrigger>
            </TabsList>

            <TabsContent value="bassins">
              <ModernCardBase>
                <div className="p-6">
                  <OysterTableMap
                    onTableSelect={setSelectedTable}
                    onTableHover={setHoveredTable}
                    hoveredTable={hoveredTable}
                    selectedTable={selectedTable}
                  />
                </div>
              </ModernCardBase>
            </TabsContent>

            <TabsContent value="trempes">
              <TrempeView />
            </TabsContent>

            <TabsContent value="achats">
              <PurchaseConfiguration />
            </TabsContent>
          </Tabs>
        </div>

        {/* Catalogue */}
        <div 
          className={`catalog-content fixed top-0 right-0 h-full w-80 bg-brand-dark border-l border-white/10 transform transition-transform duration-300 ${
            showCatalog ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Catalogue</h2>
            <div className="space-y-4">
              {/* Contenu du catalogue */}
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-white font-medium">Huîtres Spéciales</h3>
                <p className="text-sm text-white/60 mt-1">Calibre 2</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-white font-medium">Huîtres Fines</h3>
                <p className="text-sm text-white/60 mt-1">Calibre 3</p>
              </div>
              {/* Ajoutez d'autres éléments du catalogue ici */}
            </div>
          </div>
        </div>
      </div>

      {selectedTable && (
        <TableDetail
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  );
}
