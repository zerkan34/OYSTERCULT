import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle2, MoreVertical, Edit2, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface QualityCheck {
  id: string;
  batchNumber: string;
  date: string;
  inspector: string;
  score: number;
  parameters: {
    size: number;
    weight: number;
    mortality: number;
    appearance: number;
  };
  notes?: string;
  status: 'passed' | 'warning' | 'failed';
}

const mockChecks: QualityCheck[] = [
  {
    id: '1',
    batchNumber: 'LOT-2025-001',
    date: '2025-02-19',
    inspector: 'Marie Martin',
    score: 92,
    parameters: {
      size: 95,
      weight: 90,
      mortality: 95,
      appearance: 88
    },
    status: 'passed'
  },
  {
    id: '2',
    batchNumber: 'LOT-2025-002',
    date: '2025-02-19',
    inspector: 'Jean Dupont',
    score: 78,
    parameters: {
      size: 85,
      weight: 80,
      mortality: 70,
      appearance: 75
    },
    notes: 'Taux de mortalité plus élevé que la normale',
    status: 'warning'
  }
];

const statusColors = {
  passed: 'bg-green-500/20 text-green-300',
  warning: 'bg-yellow-500/20 text-yellow-300',
  failed: 'bg-blue-500/20 text-blue-300'
};

interface QualityChecksProps {
  searchQuery: string;
}

export function QualityChecks({ searchQuery }: QualityChecksProps) {
  const [selectedCheck, setSelectedCheck] = useState<string | null>(null);

  const filteredChecks = mockChecks.filter(check =>
    check.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    check.inspector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredChecks.map((check) => (
        <div
          key={check.id}
          className="bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-brand-burgundy/20 flex items-center justify-center">
                  <FileText size={20} className="text-brand-burgundy" />
                </div>
                
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-white">{check.batchNumber}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[check.status]}`}>
                      {check.status === 'passed' ? 'Conforme' :
                       check.status === 'warning' ? 'Attention' : 'Non conforme'}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-5 gap-6">
                    <div>
                      <div className="text-sm text-white/60">Score global</div>
                      <div className={`text-lg font-medium ${
                        check.score >= 90 ? 'text-green-400' :
                        check.score >= 80 ? 'text-yellow-400' : 'text-blue-400'
                      }`}>
                        {check.score}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Taille</div>
                      <div className="text-white">{check.parameters.size}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Poids</div>
                      <div className="text-white">{check.parameters.weight}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Mortalité</div>
                      <div className="text-white">{check.parameters.mortality}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Aspect</div>
                      <div className="text-white">{check.parameters.appearance}%</div>
                    </div>
                  </div>

                  {check.notes && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle size={16} className="text-yellow-400 mt-0.5" />
                        <p className="text-sm text-yellow-400">{check.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center space-x-4 text-sm text-white/60">
                    <div>Date: {format(new Date(check.date), 'PP', { locale: fr })}</div>
                    <div>•</div>
                    <div>Inspecteur: {check.inspector}</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setSelectedCheck(selectedCheck === check.id ? null : check.id)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <MoreVertical size={20} className="text-white/60" />
                </button>
                
                {selectedCheck === check.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg py-1 z-10">
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center">
                      <Download size={16} className="mr-2" />
                      Rapport PDF
                    </button>
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center">
                      <Edit2 size={16} className="mr-2" />
                      Modifier
                    </button>
                    <button className="w-full px-4 py-2 text-left text-blue-400 hover:bg-white/5 flex items-center">
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