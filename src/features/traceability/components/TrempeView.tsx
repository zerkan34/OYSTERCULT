import React from 'react';
import { useStore } from '@/lib/store';
import { Droplets } from 'lucide-react';

export function TrempeView() {
  const { batches } = useStore();

  // Filtrer les lots par table
  const table1Batches = batches.filter(batch => batch.status === 'table1');
  const table2Batches = batches.filter(batch => batch.status === 'table2');
  const table3Batches = batches.filter(batch => batch.status === 'table3');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-white">Vue des tables de trempe</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Table 1 */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Droplets className="text-blue-300" size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Table de trempe 1</h3>
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 30 }).map((_, index) => {
              const batch = table1Batches.find(b => b.perchNumber === index + 1);
              return (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                    batch
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Table 2 */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Droplets className="text-purple-300" size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Table de trempe 2</h3>
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 30 }).map((_, index) => {
              const batch = table2Batches.find(b => b.perchNumber === index + 1);
              return (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                    batch
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Table 3 */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <Droplets className="text-teal-300" size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Table de trempe 3</h3>
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 30 }).map((_, index) => {
              const batch = table3Batches.find(b => b.perchNumber === index + 1);
              return (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                    batch
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
