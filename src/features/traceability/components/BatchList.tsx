import React, { useState } from 'react';
import { Tag, MapPin, Calendar, MoreVertical, Edit2, Trash2, FileText, QrCode, Anchor } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStore } from '@/lib/store';
import { Batch } from '../types';

interface BatchListProps {
  searchQuery: string;
}

const statusColors = {
  table1: 'bg-blue-500/20 text-blue-300',
  table2: 'bg-purple-500/20 text-purple-300',
  table3: 'bg-teal-500/20 text-teal-300'
};

export function BatchList({ searchQuery }: BatchListProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const { batches, updateBatch } = useStore();

  const handleEdit = (batch: Batch) => {
    console.log('Edit clicked', batch);
    setEditingBatch(batch);
    setShowEditModal(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedBatch = {
      ...editingBatch,
      type: formData.get('type') as string,
      quantity: Number(formData.get('quantity')),
      location: formData.get('location') as string,
      status: formData.get('status') as string,
      perchNumber: Number(formData.get('perchNumber')),
    };
    updateBatch(updatedBatch.id, updatedBatch);
    setShowEditModal(false);
  };

  return (
    <div className="space-y-4">
      {batches.map((batch) => (
        <div key={batch.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                <Tag className="text-brand-blue" size={20} />
              </div>
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-white">{batch.batchNumber}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[batch.status]}`}>
                    Table de trempe {batch.status.replace('table', '')}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-white/10 text-white">
                    <Anchor size={12} />
                    Perche {batch.perchNumber}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleEdit(batch)}
              className="p-2 hover:bg-white/5 rounded-lg"
            >
              <Edit2 className="text-white/60" size={20} />
            </button>
          </div>
        </div>
      ))}

      {showEditModal && editingBatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Modifier le lot {editingBatch.batchNumber}
            </h2>
            
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Type
                    </label>
                    <input
                      name="type"
                      defaultValue={editingBatch.type}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Quantité
                    </label>
                    <input
                      name="quantity"
                      type="number"
                      defaultValue={editingBatch.quantity}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Table de trempe
                    </label>
                    <select
                      name="status"
                      defaultValue={editingBatch.status}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      required
                    >
                      <option value="table1">Table 1</option>
                      <option value="table2">Table 2</option>
                      <option value="table3">Table 3</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Numéro de perche
                    </label>
                    <input
                      name="perchNumber"
                      type="number"
                      min="1"
                      max="30"
                      defaultValue={editingBatch.perchNumber}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Emplacement
                  </label>
                  <input
                    name="location"
                    defaultValue={editingBatch.location}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Score de qualité
                  </label>
                  <div className={`text-lg font-medium ${
                    editingBatch.qualityScore >= 90 ? 'text-green-400' :
                    editingBatch.qualityScore >= 80 ? 'text-blue-400' : 'text-blue-300'
                  }`}>
                    {editingBatch.qualityScore}%
                  </div>
                  {editingBatch.qualityScore < 80 && (
                    <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                      Attention requise
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}