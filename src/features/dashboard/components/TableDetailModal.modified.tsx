import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Filter, Tag, AlertTriangle, Calendar, Waves } from 'lucide-react';
import { Table } from '../types';

interface TableDetailModalProps {
  table: Table;
  onClose: () => void;
}

// Composant de barre de progression
const ProgressBar = ({ value, maxValue = 100, color = '#3b82f6' }: { value: number; maxValue?: number; color?: string }) => {
  const percent = (value / maxValue) * 100;
  
  return (
    <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ 
          width: `${percent}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
};

export const TableDetailModal: React.FC<TableDetailModalProps> = ({ table, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative bg-gray-900 w-[95%] max-w-5xl h-[90vh] rounded-xl border border-white/10 overflow-hidden shadow-2xl"
      >
        {/* En-tête du modal */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-500/20 text-green-400">
              <Filter size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Détails de la table {table.name}</h2>
              <p className="text-sm text-white/60">Informations complètes et historique</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Contenu principal */}
        <div className="h-[calc(90vh-5rem)] overflow-y-auto p-5 custom-scrollbar">
          {/* Informations générales sur la table */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Carte d'occupation */}
            <div className="col-span-1 md:col-span-1 bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Occupation</h3>
              
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Cercle de fond */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    {/* Cercle de progression */}
                    <motion.circle
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: table.value / 100 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={Math.PI * 2 * 45}
                      strokeDashoffset={Math.PI * 2 * 45 * (1 - table.value / 100)}
                      transform="rotate(-90 50 50)"
                    />
                    {/* Pourcentage au centre */}
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      {table.value}%
                    </text>
                  </svg>
                </div>
                
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{table.occupiedUnits}/{table.totalUnits}</div>
                  <div className="text-white/60 text-sm">Huîtres en pousse</div>
                </div>
              </div>
            </div>
            
            {/* Informations clés */}
            <div className="col-span-1 md:col-span-2 bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Caractéristiques</h3>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <div className="text-white/60 text-sm mb-1">Localisation</div>
                  <div className="text-white text-lg font-semibold">{table.location}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-1">Surface</div>
                  <div className="text-white text-lg font-semibold">{table.area} m²</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-1">Hauteur d'eau</div>
                  <div className="text-white text-lg font-semibold">{table.waterHeight} m</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-1">Dernière inspection</div>
                  <div className="text-white text-lg font-semibold">{table.lastInspection}</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 text-blue-300 text-sm flex items-start">
                <Waves size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Conditions actuelles</p>
                  <p>{table.currentConditions}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Informations supplémentaires */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Détails de production</h3>
            
            <div className="bg-white/5 rounded-xl p-5">
              {/* Graphique de croissance - exemple simple */}
              <div className="mb-6">
                <h4 className="text-white/80 text-md font-medium mb-3">Croissance des huîtres</h4>
                <div className="h-32 bg-gradient-to-b from-transparent to-gray-800/30 rounded-lg flex items-end p-2">
                  {[10, 25, 40, 30, 45, 55, 70, 60, 75, 80, 90].map((height, index) => (
                    <div key={index} className="flex-1 mx-0.5">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className="bg-gradient-to-t from-green-500 to-green-300 rounded-t-sm"
                      ></motion.div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/40">
                  <span>Jan</span>
                  <span>Fév</span>
                  <span>Mar</span>
                  <span>Avr</span>
                  <span>Mai</span>
                  <span>Juin</span>
                  <span>Juil</span>
                  <span>Aoû</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                </div>
              </div>
              
              {/* Informations sur les huîtres */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <div className="text-white/60 text-sm mb-1">Type d'huîtres</div>
                    <div className="text-white text-lg font-semibold">{table.type}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-white/60 text-sm mb-1">Calibre actuel</div>
                    <div className="text-white text-lg font-semibold">{table.currentSize}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-white/60 text-sm mb-1">Calibre cible</div>
                    <div className="text-white text-lg font-semibold">{table.targetSize}</div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <div className="text-white/60 text-sm mb-1">Statut</div>
                    <div className="flex items-center">
                      <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg">
                        {table.status || "Récolte en cours"}
                      </div>
                      {table.alert && (
                        <div className="ml-3 flex items-center text-yellow-400 text-sm">
                          <AlertTriangle size={14} className="mr-1" />
                          {table.alert}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Liste des lots présents sur cette table */}
          <div className="bg-white/5 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Lots présents sur cette table</h3>
            
            <div className="space-y-4">
              {[1, 2, 3].map((lot) => (
                <div key={lot} className="p-3 border border-white/5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">Lot #{lot}00{lot}</div>
                      <div className="text-white/60 text-sm">Placé le 12/0{lot}/2023</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{lot * 1000} huîtres</div>
                      <div className="text-white/60 text-sm">Calibre N°{lot}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-white/60 text-xs mb-1">Progression</div>
                    <ProgressBar value={lot * 20} color="#22c55e" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Historique d'activité */}
          <div className="mt-8 bg-white/5 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Historique d'activité</h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-white/10">
              {[
                { date: '15/11/2023', action: 'Maintenance effectuée', details: 'Nettoyage et réparation des structures' },
                { date: '02/10/2023', action: 'Tri réalisé', details: 'Séparation des huîtres par taille' },
                { date: '18/09/2023', action: 'Inspection sanitaire', details: 'Résultats conformes aux normes' },
                { date: '05/08/2023', action: 'Retournement des poches', details: 'Pour favoriser la croissance' },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-blue-500"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 p-3 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{item.action}</div>
                      <div className="text-white/60 text-sm">{item.details}</div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-white/40 text-sm">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Pied de page avec actions */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="text-white/60 text-sm">
            Dernière mise à jour: {new Date().toLocaleDateString()}
          </div>
          
          <div className="flex space-x-3">
            <button className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5">
              Exporter les données
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Planifier une action
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
