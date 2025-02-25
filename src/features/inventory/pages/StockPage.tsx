import React, { useState } from 'react';
import { OysterTableMap } from '../components/OysterTableMap';
import { TableDetail } from '../components/TableDetail';
import { TrempeView } from '../components/TrempeView';
import { PurchaseConfiguration } from '@/features/purchases/components/PurchaseConfiguration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export function StockPage() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [hoveredTable, setHoveredTable] = useState(null);
  const [activeTab, setActiveTab] = useState('bassins');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gestion des Stocks</h1>
        <p className="text-white/60">Vue d'ensemble des stocks</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="bassins">Bassins</TabsTrigger>
          <TabsTrigger value="trempes">Trempes</TabsTrigger>
          <TabsTrigger value="achats">Achats</TabsTrigger>
        </TabsList>

        <TabsContent value="bassins">
          <OysterTableMap
            onTableSelect={setSelectedTable}
            onTableHover={setHoveredTable}
            hoveredTable={hoveredTable}
            selectedTable={selectedTable}
          />
        </TabsContent>

        <TabsContent value="trempes">
          <TrempeView />
        </TabsContent>

        <TabsContent value="achats">
          <PurchaseConfiguration />
        </TabsContent>
      </Tabs>

      {selectedTable && (
        <TableDetail
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  );
}
