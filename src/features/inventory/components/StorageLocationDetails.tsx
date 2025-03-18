import React, { useState } from 'react';
import { Thermometer, Package, AlertTriangle, History, Edit, Trash2, RefreshCw } from 'lucide-react';
import { StorageLocation, Stock, StorageType, StockStatus } from '@/types/inventory.types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StorageLocationForm } from './StorageLocationForm';
import { StockList } from './StockList';
import { StockMovementList } from './StockMovementList';
import { useInventory } from '../hooks/useInventory';

interface StorageLocationDetailsProps {
  location: StorageLocation;
  onClose: () => void;
  onUpdate: (updatedLocation: StorageLocation) => void;
  onDelete: () => void;
}

export const StorageLocationDetails: React.FC<StorageLocationDetailsProps> = ({
  location,
  onClose,
  onUpdate,
  onDelete
}) => {
  const { loadStocks, stocks, isLoading } = useInventory();
  const [activeTab, setActiveTab] = useState<'info' | 'stocks' | 'movements'>('info');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Charger les stocks pour cet emplacement
  React.useEffect(() => {
    loadStocks(location.id);
  }, [loadStocks, location.id]);

  // Calculer le pourcentage d'utilisation
  const utilizationPercentage = (location.currentCapacity / location.capacity) * 100;
  
  // Déterminer la couleur d'alerte pour l'utilisation
  const getUtilizationColor = () => {
    if (utilizationPercentage >= 90) return 'text-red-500';
    if (utilizationPercentage >= 75) return 'text-amber-500';
    return 'text-emerald-500';
  };

  // Déterminer la couleur d'alerte pour la température
  const getTemperatureColor = () => {
    if (!location.temperature || location.idealMinTemp === undefined || location.idealMaxTemp === undefined) {
      return 'text-white';
    }
    
    if (location.temperature < location.idealMinTemp || location.temperature > location.idealMaxTemp) {
      return 'text-red-500';
    }
    
    // Dans la plage idéale mais proche des limites
    const range = location.idealMaxTemp - location.idealMinTemp;
    const buffer = range * 0.1; // 10% de la plage comme zone tampon
    
    if (location.temperature <= location.idealMinTemp + buffer || 
        location.temperature >= location.idealMaxTemp - buffer) {
      return 'text-amber-500';
    }
    
    return 'text-emerald-500';
  };

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="mr-4 p-3 rounded-lg bg-brand-burgundy/20">
            {location.type === StorageType.REFRIGERATOR || location.type === StorageType.FREEZER ? (
              <Thermometer size={24} className="text-brand-burgundy" />
            ) : (
              <Package size={24} className="text-brand-burgundy" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{location.name}</h2>
            <p className="text-white/60 text-sm">{location.type}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowEditForm(true)}
            className="flex items-center text-white hover:bg-white/5"
          >
            <Edit size={16} className="mr-1" />
            Modifier
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            <Trash2 size={16} className="mr-1" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Onglets de navigation */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'info'
              ? 'text-white border-b-2 border-brand-burgundy'
              : 'text-white/60 hover:text-white'
          }`}
          onClick={() => setActiveTab('info')}
        >
          Informations
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'stocks'
              ? 'text-white border-b-2 border-brand-burgundy'
              : 'text-white/60 hover:text-white'
          }`}
          onClick={() => setActiveTab('stocks')}
        >
          Stocks ({stocks.length})
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'movements'
              ? 'text-white border-b-2 border-brand-burgundy'
              : 'text-white/60 hover:text-white'
          }`}
          onClick={() => setActiveTab('movements')}
        >
          Mouvements
        </button>
      </div>

      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de base */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">Détails</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">ID</span>
                <span className="text-white font-mono text-sm">{location.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-white/60">Capacité</span>
                <span className="text-white">
                  {location.currentCapacity} / {location.capacity} kg
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/60">Utilisation</span>
                <div className="flex items-center">
                  <div className="w-32 bg-white/10 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${getUtilizationColor().replace('text-', 'bg-')}`}
                      style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <span className={`${getUtilizationColor()}`}>{utilizationPercentage.toFixed(1)}%</span>
                </div>
              </div>
              
              {(location.type === StorageType.REFRIGERATOR || location.type === StorageType.FREEZER) && (
                <div className="flex justify-between">
                  <span className="text-white/60">Température</span>
                  <span className={getTemperatureColor()}>
                    {location.temperature}°C 
                    {location.idealMinTemp !== undefined && location.idealMaxTemp !== undefined && (
                      <span className="text-white/40 text-xs ml-1">
                        (Idéal: {location.idealMinTemp}°C - {location.idealMaxTemp}°C)
                      </span>
                    )}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-white/60">Créé le</span>
                <span className="text-white">{formatDate(new Date(location.createdAt))}</span>
              </div>
            </div>
          </div>

          {/* Aperçu des stocks */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Aperçu des stocks</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveTab('stocks')}
                className="text-white/60 hover:text-white"
              >
                Voir tout
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-4">
                <RefreshCw size={24} className="text-white/60 animate-spin" />
              </div>
            ) : stocks.length === 0 ? (
              <p className="text-white/60 text-center py-4">Aucun stock disponible</p>
            ) : (
              <div className="space-y-3">
                {stocks.slice(0, 5).map(stock => (
                  <div key={stock.id} className="flex justify-between py-2 border-b border-white/10 last:border-0">
                    <span className="text-white">{stock.id}</span>
                    <div className="flex items-center">
                      <span className="text-white/40 mr-2">{stock.quantity} {stock.unitType}</span>
                      {stock.status === StockStatus.LOW && (
                        <AlertTriangle size={16} className="text-amber-500" />
                      )}
                      {stock.status === StockStatus.CRITICAL && (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                      {stock.status === StockStatus.EXPIRED && (
                        <AlertTriangle size={16} className="text-purple-500" />
                      )}
                    </div>
                  </div>
                ))}
                
                {stocks.length > 5 && (
                  <p className="text-white/60 text-center text-sm">
                    + {stocks.length - 5} autres stocks
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'stocks' && (
        <StockList locationId={location.id} />
      )}

      {activeTab === 'movements' && (
        <StockMovementList locationId={location.id} />
      )}

      {/* Modal de modification */}
      {showEditForm && (
        <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
          <StorageLocationForm
            initialData={location}
            onSubmit={onUpdate}
            onCancel={() => setShowEditForm(false)}
          />
        </Modal>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Confirmer la suppression</h3>
            <p className="text-white/70 mb-6">
              Êtes-vous sûr de vouloir supprimer cet emplacement ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annuler
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
