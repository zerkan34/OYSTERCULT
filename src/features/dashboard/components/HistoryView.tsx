import React from 'react';
import { motion } from 'framer-motion';
import { Activity, FilePlus } from 'lucide-react';

interface HistoryViewProps {
  tableName: string;
}

export function HistoryView({ tableName }: HistoryViewProps) {
  // Données factices pour l'historique
  const historyData = [
    { date: '10/03/25', action: 'Mesure', value: 'N°3', note: 'Croissance normale' },
    { date: '25/02/25', action: 'Traitement', value: 'Antibiotique B12', note: 'Prévention maladie' },
    { date: '15/02/25', action: 'Mesure', value: 'N°4', note: 'Croissance lente' },
    { date: '01/02/25', action: 'Déplacement', value: 'Bassin A3 → A1', note: 'Optimisation espace' },
    { date: '15/01/25', action: 'Mesure', value: 'N°4', note: 'Démarrage' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <Activity size={20} className="text-blue-400 mr-2" />
        <h3 className="text-lg font-medium text-white">Historique des événements</h3>
      </div>
      
      <div className="overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Valeur</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Commentaire</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/10">
              {historyData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white/5' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          className="flex items-center px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
        >
          <FilePlus size={16} className="mr-2" />
          Nouvel événement
        </button>
      </div>
    </motion.div>
  );
}