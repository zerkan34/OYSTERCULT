import React from 'react';
import { motion } from 'framer-motion';
import { Shell, TrendingUp, Filter } from 'lucide-react';

interface TableGroup {
  name: string;
  color: string;
  tables: {
    total: number;
    occupied: number;
  };
  averageOccupation: number;
}

// Données fictives pour l'exemple
const tableGroups: TableGroup[] = [
  {
    name: "Parc Nord",
    color: "#22c55e", // Changé pour le vert uniforme
    tables: { total: 45, occupied: 38 },
    averageOccupation: 70
  },
  {
    name: "Parc Ouest",
    color: "#22c55e", // Changé pour le vert uniforme
    tables: { total: 32, occupied: 25 },
    averageOccupation: 65
  },
  {
    name: "B1",
    color: "#22c55e", // Vert uniforme pour la table B1
    tables: { total: 28, occupied: 20 },
    averageOccupation: 58
  },
  {
    name: "Parc Sud",
    color: "#22c55e", // Changé pour le vert uniforme
    tables: { total: 18, occupied: 15 },
    averageOccupation: 73
  }
];

// Composant de jauge circulaire pour visualiser les données
const CircularGauge = ({ value }: { value: number }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  // Utiliser uniformément la couleur verte
  const color = "#22c55e";
  
  return (
    <div className="relative">
      <svg className="w-full h-48" viewBox="0 0 100 100">
        {/* Cercle de fond */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        
        {/* Cercle d'effet lumineux externe pour styliser */}
        <circle
          cx="50"
          cy="50"
          r={radius + 5}
          fill="none"
          stroke={`${color}33`}
          strokeWidth="2"
        />
        
        {/* Petit point indicateur de début */}
        <circle
          cx="50"
          cy="10"
          r="2"
          fill="white"
        />
        
        {/* Cercle de progression principal */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform="rotate(-90 50 50)"
        />
        
        {/* Cercle interne pour effet 3D */}
        <circle
          cx="50"
          cy="50"
          r={radius - 10}
          fill="none"
          stroke={`${color}33`}
          strokeWidth="1"
        />
        
        {/* Texte au centre - taille réduite pour le pourcentage */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
        >
          {value}%
        </text>
      </svg>
    </div>
  );
};

export const TableOccupationSummary: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
         style={{
           background: 'linear-gradient(to right, #0c1c2c 0%, #192f45 40%, #274060 70%, #2d4a70 100%)',
           boxShadow: '0 15px 30px -12px rgba(0, 0, 0, 0.5), 0 -1px 0 rgba(255, 255, 255, 0.1) inset',
           WebkitBackdropFilter: 'blur(8px)',
           backdropFilter: 'blur(8px)'
         }}>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-400 to-[#0d9488]"
               style={{
                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(13, 148, 136, 0.5)'
               }}></div>
          <h2 className="text-lg font-medium text-white" 
              style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
            Occupation des Tables
          </h2>
        </div>
        
        {/* Statistiques globales */}
        <motion.div 
          className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10"
          whileHover={{ y: -2, boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)' }}
          style={{
            boxShadow: '0 3px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-xs text-white/60 mb-1">Total des tables</p>
              <p className="text-lg font-bold text-white" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                {tableGroups.reduce((sum, group) => sum + group.tables.total, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Tables occupées</p>
              <p className="text-lg font-bold text-white" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                {tableGroups.reduce((sum, group) => sum + group.tables.occupied, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Occupation moyenne</p>
              <p className="text-lg font-bold text-white" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                {Math.round(tableGroups.reduce((sum, group) => sum + group.averageOccupation, 0) / tableGroups.length)}%
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Détails par groupe de tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tableGroups.map((group, index) => (
            <motion.div 
              key={group.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -2, boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)' }}
              className="bg-white/5 rounded-lg p-3 flex items-center border border-white/10"
              style={{
                boxShadow: '0 3px 5px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="w-20 h-20 -webkit-backdrop-filter backdrop-filter backdrop-blur-sm">
                <CircularGauge value={group.averageOccupation} />
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center">
                    <motion.div 
                      className="w-2 h-2 rounded-full mr-1.5" 
                      style={{ backgroundColor: "#22c55e" }}
                      animate={{ 
                        boxShadow: ['0 0 0px #22c55e', '0 0 8px #22c55e', '0 0 0px #22c55e'] 
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    ></motion.div>
                    {group.name}
                  </h3>
                  <motion.div 
                    className="px-1.5 py-0.5 bg-white/10 rounded text-xs text-white/80"
                    whileHover={{ scale: 1.05 }}
                  >
                    {group.tables.occupied}/{group.tables.total}
                  </motion.div>
                </div>
                
                <div className="mt-1.5">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-white/60">Taux d'occupation</span>
                    <span className="text-white font-medium">{group.averageOccupation}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative -webkit-backdrop-filter backdrop-filter backdrop-blur-sm">
                    <motion.div 
                      initial={{ transform: "scaleX(0)" }}
                      animate={{ transform: `scaleX(${group.averageOccupation / 100})` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full origin-left"
                      style={{ 
                        background: 'linear-gradient(to right, #22c55e, #4ade80)', 
                        width: "100%",
                        boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)'
                      }}
                    />
                  </div>
                </div>
                
                <div className="mt-1.5 flex items-center text-xs">
                  <Shell size={12} className="mr-1 text-white/60" />
                  <span className="text-white/60">Calibre moyen: </span>
                  <span className="ml-1 text-white font-medium">N°3</span>
                  
                  <div className="ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-1 text-green-400" />
                    <span className="text-green-400">+5%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
