import React, { useState } from 'react';
import { differenceInHours } from 'date-fns';
import { Edit2, X, Save } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Input } from '@/components/ui/Input';
import type { Batch } from '@/types/batch';

interface BatchListProps {
  searchQuery?: string;
}

export const BatchList: React.FC<BatchListProps> = ({ searchQuery = '' }) => {
  const [batches, setBatches] = useState<Batch[]>([
    {
      id: '1',
      batchNumber: 'Lot HF-2025-001',
      type: 'Huîtres Fines de Claire',
      quantity: '200',
      status: 'purification',
      startDate: '2025-03-10',
      location: 'Bassin A1',
      expiryDate: '2025-03-24',
      notes: 'Lot en cours de purification'
    },
    // ... autres lots
  ]);

  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedBatch, setEditedBatch] = useState<Batch | null>(null);

  const handleEdit = (batch: Batch) => {
    setEditedBatch({ ...batch });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editedBatch) {
      const updatedBatches = batches.map(batch => 
        batch.id === editedBatch.id ? editedBatch : batch
      );
      setBatches(updatedBatches);
      setIsEditModalOpen(false);
      setEditedBatch(null);
    }
  };

  // Filtrer uniquement les quatre premiers lots en trempe
  const trempeBatches = batches
    .filter(batch => 
      batch.status === 'table1' || 
      batch.status === 'table2' || 
      batch.status === 'table3'
    )
    .slice(0, 4); // Prendre seulement les 4 premiers lots

  const getTimeInTrempe = (startDate: string) => {
    const hours = differenceInHours(new Date(), new Date(startDate));
    return hours;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trempeBatches.map((batch) => (
          <AnimatedCard
            key={batch.id}
            onClick={() => setSelectedBatch(batch)}
            className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-4 cursor-pointer hover:shadow-lg transition-all rounded-xl hover:bg-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{batch.batchNumber}</h3>
                <p className="text-sm text-white/60">{batch.type}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(batch);
                }}
                className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white/80 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Quantité</span>
                  <span className="text-sm font-medium text-white">{batch.quantity}</span>
                </div>
              </div>

              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Emplacement</span>
                  <span className="text-sm font-medium text-white">{batch.location}</span>
                </div>
              </div>

              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Date d'expiration</span>
                  <span className="text-sm font-medium text-white">
                    {new Date(batch.expiryDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Temps en trempe</span>
                  <span className="text-sm font-medium text-white">
                    {getTimeInTrempe(batch.startDate)}h
                  </span>
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {isEditModalOpen && editedBatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl p-6 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Modifier le lot</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Numéro du lot
                </label>
                <Input
                  value={editedBatch.batchNumber}
                  onChange={(e) => setEditedBatch({ ...editedBatch, batchNumber: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Type
                </label>
                <Input
                  value={editedBatch.type}
                  onChange={(e) => setEditedBatch({ ...editedBatch, type: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Quantité
                </label>
                <Input
                  value={editedBatch.quantity}
                  onChange={(e) => setEditedBatch({ ...editedBatch, quantity: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Emplacement
                </label>
                <Input
                  value={editedBatch.location}
                  onChange={(e) => setEditedBatch({ ...editedBatch, location: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Date d'expiration
                </label>
                <Input
                  type="date"
                  value={editedBatch.expiryDate}
                  onChange={(e) => setEditedBatch({ ...editedBatch, expiryDate: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg"
                >
                  <Save className="w-4 h-4 inline-block mr-2" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};