import React, { useState } from 'react';
import { Timer, Tag, Edit2 } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';
import { useStore } from '@/lib/store';
import { Batch } from '../types';
import { EditBatchModal } from './EditBatchModal';

interface BatchListProps {
  searchQuery: string;
}

export function BatchList({ searchQuery }: BatchListProps) {
  const { batches } = useStore();
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  // Filtrer uniquement les lots en trempe
  const trempeBatches = batches.filter(batch => 
    batch.status === 'table1' || 
    batch.status === 'table2' || 
    batch.status === 'table3'
  );

  const getTimeInTrempe = (startDate: string) => {
    const hours = differenceInHours(new Date(), new Date(startDate));
    return hours;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trempeBatches.map((batch) => {
          const timeInTrempe = getTimeInTrempe(batch.startDate);
          const isWarning = timeInTrempe > 24;
          
          return (
            <div 
              key={batch.id} 
              className={`bg-white/5 border ${isWarning ? 'border-red-500/30' : 'border-white/10'} rounded-lg p-4 relative group`}
            >
              <button
                onClick={() => setEditingBatch(batch)}
                className="absolute top-3 right-3 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
              >
                <Edit2 size={16} className="text-white/60" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                  <Tag className="text-brand-blue" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{batch.batchNumber}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60">
                      Table {batch.status.replace('table', '')}
                    </span>
                    <span className="text-white/60">•</span>
                    <span className="text-sm text-white/60">
                      Perche {batch.perchNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-white/60 mb-1">Temps en trempe</div>
                  <div className="flex items-center gap-2">
                    <Timer size={16} className={isWarning ? 'text-red-400' : 'text-white'} />
                    <span className={`text-sm font-medium ${isWarning ? 'text-red-400' : 'text-white'}`}>
                      {timeInTrempe}h
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-white/60 mb-1">Quantité</div>
                  <div className="text-sm font-medium text-white">
                    {batch.quantity} {batch.type}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {trempeBatches.length === 0 && (
          <div className="col-span-full text-center py-8 text-white/60">
            Aucun lot en trempe
          </div>
        )}
      </div>

      {editingBatch && (
        <EditBatchModal
          batch={editingBatch}
          isOpen={true}
          onClose={() => setEditingBatch(null)}
        />
      )}
    </>
  );
}