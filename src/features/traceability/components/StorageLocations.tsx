import React, { useState } from 'react';
import { 
  Droplets, 
  Thermometer, 
  Package, 
  Map, 
  Plus, 
  X,
} from 'lucide-react';

export function StorageLocations() {
  const [selectedStorageLocation, setSelectedStorageLocation] = useState<string | null>(null);
  
  // Données de simulation pour les produits stockés
  const productList = {
    'Frigo 1': [
      { id: 'F1-01', name: 'Huîtres Fines de Claire', quantity: '50kg', arrivalDate: '2025-02-25', expiryDate: '2025-03-10' },
      { id: 'F1-02', name: 'Moules de Bouchot', quantity: '25kg', arrivalDate: '2025-03-01', expiryDate: '2025-03-08' },
      { id: 'F1-03', name: 'Palourdes', quantity: '15kg', arrivalDate: '2025-02-28', expiryDate: '2025-03-07' }
    ],
    'Frigo 2': [
      { id: 'F2-01', name: 'Huîtres Spéciales', quantity: '30kg', arrivalDate: '2025-02-27', expiryDate: '2025-03-12' },
      { id: 'F2-02', name: 'Crevettes Royales', quantity: '10kg', arrivalDate: '2025-03-01', expiryDate: '2025-03-05' }
    ],
    'Congélateur 1': [
      { id: 'C1-01', name: 'Saumon Frais', quantity: '40kg', arrivalDate: '2025-01-15', expiryDate: '2025-04-15' },
      { id: 'C1-02', name: 'Huîtres Surgelées', quantity: '60kg', arrivalDate: '2025-02-10', expiryDate: '2025-08-10' },
      { id: 'C1-03', name: 'Coquilles St-Jacques', quantity: '35kg', arrivalDate: '2025-02-20', expiryDate: '2025-05-20' }
    ],
    'Congélateur 2': [
      { id: 'C2-01', name: 'Filets de Poisson', quantity: '25kg', arrivalDate: '2025-02-15', expiryDate: '2025-06-15' },
      { id: 'C2-02', name: 'Fruits de Mer', quantity: '20kg', arrivalDate: '2025-02-25', expiryDate: '2025-05-25' }
    ],
    'Remise': [
      { id: 'R-01', name: 'Matériel d\'emballage', quantity: '200 unités', arrivalDate: '2025-01-10', expiryDate: 'N/A' },
      { id: 'R-02', name: 'Sachets biodégradables', quantity: '500 unités', arrivalDate: '2025-02-01', expiryDate: 'N/A' }
    ],
    'Cave': [
      { id: 'CA-01', name: 'Vin blanc', quantity: '50 bouteilles', arrivalDate: '2024-10-15', expiryDate: '2026-10-15' },
      { id: 'CA-02', name: 'Huîtres affinées', quantity: '100kg', arrivalDate: '2025-02-20', expiryDate: '2025-04-20' }
    ]
  };

  // Fonction pour extraire l'unité d'une chaîne de quantité (ex: "50kg" -> "kg")
  const extractUnit = (quantityString: string) => {
    const match = quantityString.match(/[a-zA-Z]+|unités|bouteilles/);
    return match ? match[0] : '';
  };

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Frigo 1 */}
          <div 
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
            onClick={() => setSelectedStorageLocation('Frigo 1')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
                  <Droplets size={18} className="text-blue-400" />
                </div>
                <h3 className="text-white font-medium">Frigo 1</h3>
              </div>
              <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                Frigo
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Capacité</span>
                <span className="text-white">500 kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Occupation</span>
                <span className="text-white">65%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="hidden group-hover:block mt-3">
                <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
              </div>
            </div>
          </div>

          {/* Frigo 2 */}
          <div 
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
            onClick={() => setSelectedStorageLocation('Frigo 2')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
                  <Droplets size={18} className="text-blue-400" />
                </div>
                <h3 className="text-white font-medium">Frigo 2</h3>
              </div>
              <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                Frigo
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Capacité</span>
                <span className="text-white">300 kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Occupation</span>
                <span className="text-white">30%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: '30%' }}></div>
              </div>
              <div className="hidden group-hover:block mt-3">
                <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
              </div>
            </div>
          </div>

          {/* Congélateur 1 */}
          <div 
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
            onClick={() => setSelectedStorageLocation('Congélateur 1')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-cyan-500/20 flex items-center justify-center mr-3">
                  <Thermometer size={18} className="text-cyan-400" />
                </div>
                <h3 className="text-white font-medium">Congélateur 1</h3>
              </div>
              <div className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
                Congélateur
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Capacité</span>
                <span className="text-white">200 kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Occupation</span>
                <span className="text-white">85%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="hidden group-hover:block mt-3">
                <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
              </div>
            </div>
          </div>

          {/* Congélateur 2 */}
          <div 
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
            onClick={() => setSelectedStorageLocation('Congélateur 2')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-cyan-500/20 flex items-center justify-center mr-3">
                  <Thermometer size={18} className="text-cyan-400" />
                </div>
                <h3 className="text-white font-medium">Congélateur 2</h3>
              </div>
              <div className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
                Congélateur
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Capacité</span>
                <span className="text-white">150 kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Occupation</span>
                <span className="text-white">40%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '40%' }}></div>
              </div>
              <div className="hidden group-hover:block mt-3">
                <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
              </div>
            </div>
          </div>

          {/* Remise */}
          <div 
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
            onClick={() => setSelectedStorageLocation('Remise')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-amber-500/20 flex items-center justify-center mr-3">
                  <Package size={18} className="text-amber-400" />
                </div>
                <h3 className="text-white font-medium">Remise</h3>
              </div>
              <div className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full">
                Remise
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Capacité</span>
                <span className="text-white">1000 kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Occupation</span>
                <span className="text-white">55%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '55%' }}></div>
              </div>
              <div className="hidden group-hover:block mt-3">
                <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
              </div>
            </div>
          </div>

          {/* Cave */}
          <div 
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
            onClick={() => setSelectedStorageLocation('Cave')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center mr-3">
                  <Map size={18} className="text-purple-400" />
                </div>
                <h3 className="text-white font-medium">Cave</h3>
              </div>
              <div className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                Remise
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Capacité</span>
                <span className="text-white">800 kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Occupation</span>
                <span className="text-white">25%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="hidden group-hover:block mt-3">
                <p className="text-xs text-white/70 italic">Cliquez pour voir les produits stockés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour afficher les produits d'un lieu de stockage */}
      {selectedStorageLocation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${
                  selectedStorageLocation.includes('Frigo') ? 'bg-blue-500/20' :
                  selectedStorageLocation.includes('Congélateur') ? 'bg-cyan-500/20' :
                  selectedStorageLocation === 'Remise' ? 'bg-amber-500/20' : 'bg-purple-500/20'
                }`}>
                  {selectedStorageLocation.includes('Frigo') ? <Droplets size={20} className="text-blue-400" /> :
                   selectedStorageLocation.includes('Congélateur') ? <Thermometer size={20} className="text-cyan-400" /> :
                   selectedStorageLocation === 'Remise' ? <Package size={20} className="text-amber-400" /> : 
                   <Map size={20} className="text-purple-400" />}
                </div>
                <h3 className="text-xl font-bold text-white">{selectedStorageLocation}</h3>
              </div>
              <button
                onClick={() => setSelectedStorageLocation(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-white/70">
                  {productList[selectedStorageLocation]?.length} produits stockés
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* En-tête du tableau */}
              <div className="grid grid-cols-4 gap-4 p-3 bg-white/5 rounded-lg text-white/70 text-sm font-medium">
                <div>Produit</div>
                <div>Quantité</div>
                <div>Date d'arrivée</div>
                <div>DLC</div>
              </div>

              {/* Corps du tableau */}
              {productList[selectedStorageLocation]?.length > 0 ? (
                productList[selectedStorageLocation]?.map((product) => (
                  <div key={product.id} className="grid grid-cols-4 gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm transition-colors">
                    <div className="font-medium">{product.name}</div>
                    <div>{product.quantity}</div>
                    <div>{product.arrivalDate}</div>
                    <div>
                      {product.expiryDate === 'N/A' ? 
                        <span className="text-white/50">N/A</span> : 
                        <span className={`${
                          new Date(product.expiryDate) < new Date() ? 'text-red-400' :
                          new Date(product.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'text-amber-400' : 'text-green-400'
                        }`}>
                          {product.expiryDate}
                        </span>
                      }
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-white/60">
                  Aucun produit stocké dans cet emplacement
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
