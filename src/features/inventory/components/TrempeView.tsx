import React, { useState } from 'react';
import { Settings, Plus, Minus, Trash2, Edit2, Package, Calendar, MapPin } from 'lucide-react';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TrempeConfig {
  squares: number;
  perches: number;
}

interface TrempeSquare {
  id: string;
  number: number;
  status: 'empty' | 'partial' | 'full';
  lastCheck: string;
  nextCheck: string;
  batches: {
    id: string;
    name: string;
    quantity: number;
    perchNumber: number;
    startDate: string;
  }[];
}

export function TrempeView() {
  const [config, setConfig] = useState<TrempeConfig>({
    squares: 4,
    perches: 10
  });
  const [showConfig, setShowConfig] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<TrempeSquare | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Données de test pour les carrés
  const mockSquares: TrempeSquare[] = Array.from({ length: config.squares }, (_, i) => ({
    id: `square-${i + 1}`,
    number: i + 1,
    status: Math.random() > 0.5 ? 'partial' : 'full',
    lastCheck: '2025-02-20',
    nextCheck: '2025-03-20',
    batches: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
      id: `batch-${i}-${j}`,
      name: `Lot ${j + 1}`,
      quantity: Math.floor(Math.random() * 1000) + 500,
      perchNumber: Math.floor(Math.random() * config.perches) + 1,
      startDate: '2025-02-01'
    }))
  }));

  const handleSquareClick = (square: TrempeSquare) => {
    setSelectedSquare(square);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Vue des trempes</h2>
        <button
          onClick={() => setShowConfig(true)}
          className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Vue satellite */}
      <div className="relative bg-[#1a1a1a] rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-[url('/satellite-bg.jpg')] opacity-50 bg-cover bg-center" />
        
        <div className="relative p-8">
          <div className="grid gap-2" style={{ 
            gridTemplateColumns: `repeat(${config.squares}, minmax(0, 1fr))` 
          }}>
            {mockSquares.map((square) => (
              <button
                key={square.id}
                onClick={() => handleSquareClick(square)}
                className={`aspect-square border rounded-lg p-2 transition-colors ${
                  square.status === 'full' 
                    ? 'bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30' 
                    : square.status === 'partial'
                    ? 'bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="text-xs text-white/60">Carré {square.number}</div>
                  <div className="text-xs text-white/60">{square.batches.length} lots</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de configuration */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Configuration des trempes</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre de carrés
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setConfig(c => ({ ...c, squares: Math.max(1, c.squares - 1) }))}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-white text-lg font-medium">{config.squares}</span>
                  <button
                    onClick={() => setConfig(c => ({ ...c, squares: Math.min(6, c.squares + 1) }))}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre de perches par carré
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setConfig(c => ({ ...c, perches: Math.max(1, c.perches - 1) }))}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-white text-lg font-medium">{config.perches}</span>
                  <button
                    onClick={() => setConfig(c => ({ ...c, perches: Math.min(30, c.perches + 1) }))}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails et modification du carré */}
      {showEditModal && selectedSquare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border border-white/10 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Carré {selectedSquare.number}
                </h3>
                <p className="text-white/60 mt-1">
                  {selectedSquare.batches.length} lots en trempage
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-white/60 mb-2">Dernier contrôle</div>
                <div className="text-white">
                  {format(new Date(selectedSquare.lastCheck), 'PP', { locale: fr })}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-white/60 mb-2">Prochain contrôle</div>
                <div className="text-white">
                  {format(new Date(selectedSquare.nextCheck), 'PP', { locale: fr })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-white">Lots en trempage</h4>
                <button className="px-3 py-1.5 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30 transition-colors text-sm">
                  Ajouter un lot
                </button>
              </div>

              <div className="space-y-2">
                {selectedSquare.batches.map((batch) => (
                  <div 
                    key={batch.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white font-medium">{batch.name}</div>
                        <div className="text-white/60 text-sm mt-1">
                          {batch.quantity} unités
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white">
                        <Edit2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MapPin size={14} />
                        Perche {batch.perchNumber}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar size={14} />
                        {format(new Date(batch.startDate), 'PP', { locale: fr })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30 transition-colors">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
