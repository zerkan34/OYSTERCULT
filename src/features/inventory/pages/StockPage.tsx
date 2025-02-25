import React, { useState } from 'react';
import { OysterTableMap } from '../components/OysterTableMap';
import { TableDetail } from '../components/TableDetail';

export function StockPage() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [hoveredTable, setHoveredTable] = useState(null);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gestion des Stocks</h1>
        <p className="text-white/60">Vue d'ensemble des tables de production</p>
      </div>

      <OysterTableMap
        onTableSelect={setSelectedTable}
        onTableHover={setHoveredTable}
        hoveredTable={hoveredTable}
        selectedTable={selectedTable}
      />
    </div>
  );
}
