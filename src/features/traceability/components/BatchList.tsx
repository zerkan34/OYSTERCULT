import React, { useState } from 'react';
import { Tag, MapPin, Calendar, AlertTriangle, MoreVertical, Edit2, Trash2, FileText, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Batch {
  id: string;
  batchNumber: string;
  type: string;
  quantity: number;
  location: string;
  status: 'growing' | 'ready' | 'alert';
  startDate: string;
  harvestDate: string;
  supplier: string;
  qualityScore: number;
  lastCheck: string;
}

const mockBatches: Batch[] = [
  {
    id: '1',
    batchNumber: 'LOT-2025-001',
    type: 'Huîtres Plates N°3',
    quantity: 5000,
    location: 'Zone Nord - Table A1',
    status: 'growing',
    startDate: '2025-01-15',
    harvestDate: '2025-06-15',
    supplier: 'Naissain Express',
    qualityScore: 92,
    lastCheck: '2025-02-19'
  },
  {
    id: '2',
    batchNumber: 'LOT-2025-002',
    type: 'Huîtres Creuses N°2',
    quantity: 8000,
    location: 'Zone Sud - Table B3',
    status: 'alert',
    startDate: '2025-01-20',
    harvestDate: '2025-06-20',
    supplier: 'Naissain Express',
    qualityScore: 78,
    lastCheck: '2025-02-19'
  }
];

const statusColors = {
  growing: 'bg-green-500/20 text-green-300',
  ready: 'bg-blue-500/20 text-blue-300',
  alert: 'bg-red-500/20 text-red-300'
};

interface BatchListProps {
  searchQuery: string;
}

export function BatchList({ searchQuery }: BatchListProps) {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const filteredBatches = mockBatches.filter(batch =>
    batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredBatches.map((batch) => (
        <div
          key={batch.id}
          className="bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-brand-burgundy/20 flex items-center justify-center">
                  <Tag size={20} className="text-brand-burgundy" />
                </div>
                
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-white">{batch.batchNumber}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[batch.status]}`}>
                      {batch.status === 'growing' ? 'En croissance' : batch.status === 'ready' ? 'Prêt' : 'Alerte'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-white/60 mt-1">{batch.type}</p>
                  
                  <div className="mt-4 grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-white/60">Quantité</div>
                      <div className="text-white">{batch.quantity} unités</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Emplacement</div>
                      <div className="flex items-center text-white">
                        <MapPin size={16} className="mr-1 text-white/60" />
                        {batch.location}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Date de récolte</div>
                      <div className="flex items-center text-white">
                        <Calendar size={16} className="mr-1 text-white/60" />
                        {format(new Date(batch.harvestDate), 'PP', { locale: fr })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-6">
                    <div>
                      <div className="text-sm text-white/60">Fournisseur</div>
                      <div className="text-white">{batch.supplier}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Score qualité</div>
                      <div className={`text-lg font-medium ${
                        batch.qualityScore >= 90 ? 'text-green-400' :
                        batch.qualityScore >= 80 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {batch.qualityScore}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Dernier contrôle</div>
                      <div className="text-white">
                        {format(new Date(batch.lastCheck), 'PP', { locale: fr })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setSelectedBatch(selectedBatch === batch.id ? null : batch.id)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <MoreVertical size={20} className="text-white/60" />
                </button>
                
                {selectedBatch === batch.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg py-1 z-10">
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center">
                      <FileText size={16} className="mr-2" />
                      Détails
                    </button>
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center">
                      <QrCode size={16} className="mr-2" />
                      QR Code
                    </button>
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center">
                      <Edit2 size={16} className="mr-2" />
                      Modifier
                    </button>
                    <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5 flex items-center">
                      <Trash2 size={16} className="mr-2" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}