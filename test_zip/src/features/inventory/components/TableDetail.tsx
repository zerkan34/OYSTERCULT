import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';
import { 
  Clock, 
  AlertCircle, 
  Tag, 
  Users, 
  Calendar,
  FileText,
  MessageSquare,
  BarChart2,
  X,
  Shell,
  ThermometerSun,
  Droplets,
  Plus,
  Scale,
  Hash,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TableDetailProps {
  table: any;
  onClose: () => void;
}

interface CellModalProps {
  cell: any;
  onClose: () => void;
  onUpdate: (data: any) => void;
}

function CellModal({ cell, onClose, onUpdate }: CellModalProps) {
  const modalRef = useClickOutside(onClose);
  const [type, setType] = useState(cell.type || '');
  const [ropeCount, setRopeCount] = useState(cell.ropeCount || 0);
  const [size, setSize] = useState(cell.size || '');
  const [harvestedRopes, setHarvestedRopes] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = cell.filled
      ? {
          harvestedRopes,
          batchNumber: `LOT-${new Date().getTime()}`
        }
      : {
          type,
          ropeCount,
          size,
          filled: true
        };
    onUpdate(data);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {cell.filled ? 'Récolte' : 'Nouvelle production'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!cell.filled ? (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Type de production
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'triplo', label: 'Triploïde', color: 'bg-brand-burgundy' },
                    { value: 'diplo', label: 'Diploïde', color: 'bg-brand-primary' },
                    { value: 'naturelle', label: 'Naturelle', color: 'bg-brand-tertiary' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setType(option.value)}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                        type === option.value 
                          ? `${option.color} shadow-neon` 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-sm ${option.color} mb-2`} />
                      <span className="text-sm text-white">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre de cordes par perche
                </label>
                <div className="relative">
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                    <button
                      type="button"
                      onClick={() => setRopeCount(Math.max(0, ropeCount - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-white">{ropeCount}</span>
                    <button
                      type="button"
                      onClick={() => setRopeCount(ropeCount + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Taille des huîtres
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['T5', 'T10', 'T15', 'T20', 'T30'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSize(num)}
                      className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                        size === num
                          ? 'bg-brand-burgundy shadow-neon'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-white font-medium">{num}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre de cordes récoltées
                </label>
                <div className="relative">
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                    <button
                      type="button"
                      onClick={() => setHarvestedRopes(Math.max(0, harvestedRopes - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-white">{harvestedRopes}</span>
                    <button
                      type="button"
                      onClick={() => setHarvestedRopes(Math.min(cell.ropeCount, harvestedRopes + 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-white/60 text-center">
                    sur {cell.ropeCount} cordes au total
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-burgundy/20 rounded-lg">
                <div className="flex items-center text-brand-burgundy mb-2">
                  <Tag size={20} className="mr-2" />
                  <span className="font-medium">Numéro de lot</span>
                </div>
                <div className="text-white font-mono">
                  LOT-{new Date().getTime()}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
            >
              {cell.filled ? 'Valider la récolte' : 'Ajouter la production'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

import TableDetailComponent from './TableDetailComponent';

interface TableDetailProps {
  table: any;
  onClose: () => void;
}

export function TableDetail({ table, onClose }: TableDetailProps) {
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la propagation du clic
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [selectedCell, setSelectedCell] = useState<any | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  const handleCellUpdate = (cellId: string, data: any) => {
    // TODO: Implement cell update logic
    console.log('Updating cell:', cellId, data);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-2xl"
        onClick={handleModalClick}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{table?.name || 'Détails de la table'}</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-effect rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <ThermometerSun size={20} className="mr-2 text-brand-burgundy" />
                Température
              </div>
              <div className="text-2xl font-bold text-white">
                {table?.temperature}°C
              </div>
            </div>

            <div className="glass-effect rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Droplets size={20} className="mr-2 text-brand-primary" />
                Salinité
              </div>
              <div className="text-2xl font-bold text-white">
                {table?.salinity}g/L
              </div>
            </div>

            <div className="glass-effect rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <AlertCircle size={20} className="mr-2 text-brand-tertiary" />
                Mortalité
              </div>
              <div className="text-2xl font-bold text-white">
                {table?.mortalityRate}%
              </div>
            </div>
          </div>

          {/* Détails du lot */}
          {table?.currentBatch && (
            <div className="glass-effect rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-4">
                <Shell size={20} className="mr-2 text-brand-burgundy" />
                Lot en cours
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Calibre</span>
                  <span className="text-white font-medium">N°{table.currentBatch.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Quantité</span>
                  <span className="text-white font-medium">{table.currentBatch.quantity} unités</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Date de récolte estimée</span>
                  <span className="text-white font-medium">
                    {new Date(table.currentBatch.estimatedHarvestDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Échantillonnage */}
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center text-white/80 mb-4">
              <Calendar size={20} className="mr-2 text-brand-tertiary" />
              Échantillonnage
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Dernier échantillonnage</span>
                <span className="text-white font-medium">
                  {new Date(table?.lastCheck || '').toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Prochain échantillonnage</span>
                <span className="text-white font-medium">
                  {new Date(table?.nextCheck || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Gérer la sauvegarde ici
              }}
              className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </motion.div>

      {/* Légende des types d'huîtres */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-80 glass-effect rounded-lg p-4 self-start mt-8"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium flex items-center">
            <Info size={16} className="mr-2 text-brand-burgundy" />
            Types d'huîtres
          </h4>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {showLegend ? 'Réduire' : 'Voir'}
          </button>
        </div>
        
        <AnimatePresence>
          {showLegend && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {[
                { 
                  type: 'triplo', 
                  label: 'Triploïdes', 
                  color: 'bg-brand-burgundy',
                  description: 'Huîtres stériles à croissance rapide'
                },
                { 
                  type: 'diplo', 
                  label: 'Diploïdes', 
                  color: 'bg-brand-primary',
                  description: 'Huîtres naturelles améliorées'
                },
                { 
                  type: 'naturelle', 
                  label: 'Naturelles', 
                  color: 'bg-brand-tertiary',
                  description: 'Huîtres sauvages traditionnelles'
                }
              ].map((type) => (
                <div key={type.type} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-lg ${type.color} shadow-neon flex-shrink-0`} />
                  <div>
                    <div className="text-white font-medium">{type.label}</div>
                    <div className="text-sm text-white/60">{type.description}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Vue principale de la table en portrait */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-[400px] h-[800px] bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 rounded-lg overflow-hidden border border-white/10"
      >
        <div className="relative h-full grid grid-cols-2 grid-rows-10 gap-1 p-8 transform rotate-0">
          {table.cells.map((cell: any, index: number) => (
            <motion.button
              key={cell.id}
              onClick={() => setSelectedCell(cell)}
              className={`relative rounded-md transition-all duration-300 group ${
                cell.filled
                  ? `${
                      cell.type === 'triplo' ? 'bg-brand-burgundy shadow-neon' :
                      cell.type === 'diplo' ? 'bg-brand-primary shadow-neon' :
                      'bg-brand-tertiary shadow-neon'
                    }`
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              variants={{
                initial: { opacity: 0.6, scale: 0.95 },
                animate: (custom: number) => ({
                  opacity: [0.6, 1, 0.6],
                  scale: [0.95, 1, 0.95],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    delay: custom * 0.1,
                    ease: "easeInOut"
                  }
                })
              }}
              initial="initial"
              animate="animate"
              custom={index}
            >
              {/* Overlay d'action */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-md">
                <Plus size={20} className="text-white" />
              </div>

              {/* Informations de la cellule */}
              {cell.filled && (
                <div className="absolute bottom-1 right-1 text-[8px] text-white/60">
                  {cell.ropeCount}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Panneau latéral d'informations */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-96 bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 h-full border-l border-white/10 overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{table.name}</h2>
              <p className="text-white/60">{table.tableNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={24} className="text-white/60" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <ThermometerSun size={20} className="mr-2 text-brand-burgundy" />
                Température
              </div>
              <div className="text-2xl font-bold text-white">
                {table.temperature}°C
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Droplets size={20} className="mr-2 text-brand-primary" />
                Salinité
              </div>
              <div className="text-2xl font-bold text-white">
                {table.salinity}g/L
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center text-white/80 mb-4">
              <Clock size={20} className="mr-2 text-brand-tertiary" />
              Échantillonnage
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Dernier échantillonnage</span>
                <span className="text-white">
                  {format(new Date(table.lastCheck), 'PP', { locale: fr })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Prochain échantillonnage</span>
                <span className="text-white">
                  {format(new Date(table.nextCheck), 'PP', { locale: fr })}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Taux de mortalité estimé</span>
                  <span className={`text-lg font-medium ${
                    table.mortalityRate > 3
                      ? 'text-red-400'
                      : table.mortalityRate > 2
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}>
                    {table.mortalityRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {table.currentBatch && (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-4">
                <Shell size={20} className="mr-2 text-brand-burgundy" />
                Lot en cours
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Calibre</span>
                  <span className="text-white font-medium">
                    N°{table.currentBatch.size}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Quantité</span>
                  <span className="text-white font-medium">
                    {table.currentBatch.quantity} unités
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Récolte prévue</span>
                  <span className="text-white font-medium">
                    {format(new Date(table.currentBatch.estimatedHarvestDate), 'PP', { locale: fr })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de gestion des cellules */}
      <AnimatePresence>
        {selectedCell && (
          <CellModal
            cell={selectedCell}
            onClose={() => setSelectedCell(null)}
            onUpdate={(data) => handleCellUpdate(selectedCell.id, data)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}