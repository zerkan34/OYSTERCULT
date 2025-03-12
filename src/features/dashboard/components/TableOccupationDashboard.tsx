import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TableOccupationModal } from './TableOccupationModal';
import { OysterTable } from '../types';
import { Layers, ArrowUpRight } from 'lucide-react';

// Fausses données pour la démonstration
const demoTables: OysterTable[] = [
  {
    id: 'table-001',
    name: 'Table A-12',
    type: 'Stockage principal',
    status: 'En croissance',
    value: 85, // pourcentage d'occupation
    totalUnits: 5000,
    currentSize: 'N°4',
    targetSize: 'N°3',
    startDate: '15/01/2025',
    lastUpdate: '12/03/2025',
    timeProgress: 65,
    sizeProgress: 40,
    layers: 3,
    density: 'Élevée',
    alert: false
  },
  {
    id: 'table-002',
    name: 'Table B-07',
    type: 'Stockage secondaire',
    status: 'Maintenance',
    value: 92, // pourcentage d'occupation
    totalUnits: 4000,
    currentSize: 'N°3',
    targetSize: 'N°2',
    startDate: '03/12/2024',
    lastUpdate: '10/03/2025',
    timeProgress: 75,
    sizeProgress: 60,
    layers: 4,
    density: 'Très élevée',
    alert: true
  },
  {
    id: 'table-003',
    name: 'Table C-04',
    type: 'Évolution rapide',
    status: 'Normale',
    value: 65, // pourcentage d'occupation
    totalUnits: 3500,
    currentSize: 'N°5',
    targetSize: 'N°4',
    startDate: '20/02/2025',
    lastUpdate: '09/03/2025',
    timeProgress: 30,
    sizeProgress: 25,
    layers: 2,
    density: 'Moyenne',
    alert: false
  }
];

// Animation optimisée utilisant transform
const fadeInUp = {
  initial: { opacity: 0, transform: 'translateY(20px)' },
  animate: { opacity: 1, transform: 'translateY(0)' },
  transition: { 
    duration: 0.5,
    ease: [0.19, 1.0, 0.22, 1.0] // Expo ease out
  }
};

export function TableOccupationDashboard() {
  const [selectedTable, setSelectedTable] = useState<OysterTable | null>(null);
  
  const handleCloseModal = () => {
    setSelectedTable(null);
  };

  const handleTableSelect = (table: OysterTable) => {
    setSelectedTable(table);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Occupation des tables</h2>
      <p className="text-white/70">Visualisez et gérez l'occupation des tables d'huîtres</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {demoTables.map((table, index) => (
          <motion.div
            key={table.id}
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
            className="glass-effect rounded-xl overflow-hidden transform-gpu hover:translate-y-[-4px] transition-transform"
          >
            <div className={`p-4 ${
              table.value > 90 ? 'bg-red-900/30' : 
              table.value > 80 ? 'bg-amber-900/30' : 
              'bg-emerald-900/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Layers className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{table.name}</h3>
                    <p className="text-sm text-white/70">{table.type}</p>
                  </div>
                </div>
                {table.alert && (
                  <div className="px-2 py-1 bg-red-500/20 rounded-md">
                    <span className="text-xs font-medium text-red-300">Alerte</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-white/70">Occupation</span>
                  <span className={`text-sm font-medium ${
                    table.value > 90 ? 'text-red-400' :
                    table.value > 80 ? 'text-amber-400' :
                    'text-emerald-400'
                  }`}>{table.value}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out transform-gpu"
                    style={{ 
                      width: `${table.value}%`,
                      backgroundColor: table.value > 90 ? '#f87171' : table.value > 80 ? '#fbbf24' : '#34d399'
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="text-white/60">Taille actuelle</div>
                  <div className="text-white font-medium">{table.currentSize}</div>
                </div>
                <div>
                  <div className="text-white/60">Mise à jour</div>
                  <div className="text-white font-medium">{table.lastUpdate}</div>
                </div>
              </div>
              
              <button
                onClick={() => handleTableSelect(table)}
                className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors flex items-center justify-center space-x-2"
              >
                <span>Voir les détails</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {selectedTable && (
        <TableOccupationModal
          table={selectedTable}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
