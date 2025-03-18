import React, { useState } from 'react';
import { OysterTable } from '../types';
import { TableOccupationDashboard } from './TableOccupationDashboard';

// Exemple d'utilisation du modal d'occupation des tables
export function TableOccupationExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Exemple de données pour le test
  const sampleTable: OysterTable & { tableId: string } = {
    tableId: 'table-123',
    name: 'Table A-12',
    type: 'Stockage principal',
    status: 'En croissance',
    value: 85, // Pourcentage d'occupation
    totalUnits: 5000, // Capacité totale
    occupiedUnits: 4250, // Unités occupées
    currentSize: 'N°4',
    targetSize: 'N°3',
    startDate: '15/01/2025',
    lastUpdate: '02/03/2025',
    timeProgress: 65,
    mortality: 2.1,
    harvest: '15/06/2025',
    color: '#4B9CD3',
    alert: 'none'
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Exemple de modal d'occupation des tables</h2>
      <p className="mb-4">Utilisez le tableau de bord ci-dessous pour voir le nouveau modal. Cliquez sur "Voir les détails" pour n'importe quelle table.</p>
      
      {/* Le nouveau modal est désormais intégré dans le tableau de bord */}
      <TableOccupationDashboard />
    </div>
  );
}
