import React from 'react';
import { ModernCardBase } from '@/components/ui/ModernCardBase';
import { OysterTableMap } from '@/features/inventory/components/OysterTableMap';
import { TableDetail } from '@/features/inventory/components/TableDetail';

export function TableConfiguration() {
  const [selectedTable, setSelectedTable] = React.useState(null);
  const [hoveredTable, setHoveredTable] = React.useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Configuration des Tables</h2>
        <p className="text-sm text-white/60 mt-1">Gérez l'emplacement et les paramètres de vos tables</p>
      </div>

      <ModernCardBase>
        <div className="p-6">
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <h2 className="text-lg font-medium text-white p-4 border-b border-white/10">Vue satellite - Lagune de Thau</h2>
            <div className="p-4">
              <OysterTableMap
                onTableSelect={setSelectedTable}
                onTableHover={setHoveredTable}
                hoveredTable={hoveredTable}
                selectedTable={selectedTable}
                isConfigMode={true}
              />
            </div>
          </div>
        </div>
      </ModernCardBase>

      {selectedTable && (
        <TableDetail
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          isConfigMode={true}
        />
      )}
    </div>
  );
}
