import React from 'react';
import { motion } from 'framer-motion';
import { TableOccupationDashboard } from '../components/TableOccupationDashboard';
import { Shell } from 'lucide-react';

// Animation optimisée utilisant transform au lieu de propriétés modifiant le layout
const pageAnimation = {
  initial: { opacity: 0, transform: 'translateY(10px)' },
  animate: { opacity: 1, transform: 'translateY(0)' },
  exit: { opacity: 0, transform: 'translateY(10px)' },
  transition: { duration: 0.4 }
};

export function TableOccupationPage() {
  return (
    <motion.div 
      {...pageAnimation} 
      className="container mx-auto py-8 transform-gpu"
    >
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <Shell size={24} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des tables</h1>
          <p className="text-white/70">Suivez l'occupation et les performances de vos tables d'huîtres</p>
        </div>
      </div>
      
      <TableOccupationDashboard />
    </motion.div>
  );
}
