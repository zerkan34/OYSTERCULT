import React, { useState } from 'react';
import { Scale, Plus, Edit2, Trash2 } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  symbol: string;
  type: 'weight' | 'volume' | 'quantity' | 'dimension';
  baseUnit?: string;
  conversionFactor?: number;
  description?: string;
}

const mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Douzaine',
    symbol: 'dz',
    type: 'quantity',
    description: 'Unité de base pour les huîtres'
  },
  {
    id: '2',
    name: 'Kilogramme',
    symbol: 'kg',
    type: 'weight',
    description: 'Unité de poids standard'
  },
  {
    id: '3',
    name: 'Poche',
    symbol: 'pc',
    type: 'quantity',
    baseUnit: 'douzaine',
    conversionFactor: 12,
    description: 'Contenant standard pour l\'élevage'
  }
];

export function UnitConfig() {
  const [showNewUnit, setShowNewUnit] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Unités & Mesures</h2>
        <button
          onClick={() => setShowNewUnit(true)}
          className="flex items-center px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nouvelle unité
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockUnits.map((unit) => (
          <div
            key={unit.id}
            className="bg-white/5 border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-brand-burgundy/20 flex items-center justify-center">
                  <Scale size={20} className="text-brand-burgundy" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-white">{unit.name}</h3>
                    <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/70">
                      {unit.symbol}
                    </span>
                    <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/70">
                      {unit.type}
                    </span>
                  </div>
                  
                  {unit.description && (
                    <p className="text-sm text-white/60 mt-1">{unit.description}</p>
                  )}
                  
                  {unit.baseUnit && (
                    <div className="mt-2 text-sm text-white/60">
                      1 {unit.symbol} = {unit.conversionFactor} {unit.baseUnit}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Edit2 size={20} className="text-white/60" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Trash2 size={20} className="text-white/60" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewUnit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">Nouvelle unité</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nom de l'unité
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="Ex: Douzaine"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Symbole
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="Ex: dz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Type
                </label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                  <option value="weight">Poids</option>
                  <option value="volume">Volume</option>
                  <option value="quantity">Quantité</option>
                  <option value="dimension">Dimension</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="Description de l'unité..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Unité de base
                  </label>
                  <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                    <option value="">Aucune</option>
                    {mockUnits.map((unit) => (
                      <option key={unit.id} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Facteur de conversion
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewUnit(false)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
                >
                  Créer l'unité
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}