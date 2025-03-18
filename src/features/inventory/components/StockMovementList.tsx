import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Calendar, ArrowDown, ArrowUp, ArrowLeftRight, Info } from 'lucide-react';
import { StockMovement } from '@/types/inventory.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatTime } from '@/lib/utils';
import { useInventory } from '../hooks/useInventory';

interface StockMovementListProps {
  locationId?: string;
  productId?: string;
}

export const StockMovementList: React.FC<StockMovementListProps> = ({ locationId, productId }) => {
  const { 
    stockMovements, 
    products, 
    storageLocations, 
    isLoading, 
    loadStockMovements 
  } = useInventory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [movementType, setMovementType] = useState<'ALL' | 'IN' | 'OUT' | 'TRANSFER'>('ALL');
  
  // Charger les mouvements de stock au montage et lorsque les filtres changent
  useEffect(() => {
    const filters: {
      productId?: string;
      storageLocationId?: string;
      startDate?: Date;
      endDate?: Date;
      type?: 'IN' | 'OUT' | 'TRANSFER';
    } = {};
    
    if (productId) filters.productId = productId;
    if (locationId) filters.storageLocationId = locationId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (movementType !== 'ALL') filters.type = movementType;
    
    loadStockMovements(Object.keys(filters).length > 0 ? filters : undefined);
  }, [loadStockMovements, locationId, productId, startDate, endDate, movementType]);
  
  // Filtrer les mouvements par terme de recherche
  const filteredMovements = stockMovements.filter(movement => {
    const product = products.find(p => p.id === movement.productId);
    const location = storageLocations.find(l => l.id === movement.storageLocationId);
    const fromLocation = movement.fromLocationId 
      ? storageLocations.find(l => l.id === movement.fromLocationId) 
      : null;
    const toLocation = movement.toLocationId 
      ? storageLocations.find(l => l.id === movement.toLocationId) 
      : null;
    
    if (!product || !location) return false;
    
    const searchString = `
      ${product.name.toLowerCase()}
      ${location.name.toLowerCase()}
      ${fromLocation ? fromLocation.name.toLowerCase() : ''}
      ${toLocation ? toLocation.name.toLowerCase() : ''}
      ${movement.reason ? movement.reason.toLowerCase() : ''}
      ${movement.performedBy.toLowerCase()}
    `;
    
    return searchString.includes(searchTerm.toLowerCase());
  });
  
  // Obtenir l'icône du type de mouvement
  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'IN':
        return <ArrowDown size={16} className="text-emerald-500" />;
      case 'OUT':
        return <ArrowUp size={16} className="text-red-500" />;
      case 'TRANSFER':
        return <ArrowLeftRight size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };
  
  // Obtenir la description du type de mouvement
  const getMovementDescription = (movement: StockMovement) => {
    const product = products.find(p => p.id === movement.productId);
    const locationFrom = movement.fromLocationId 
      ? storageLocations.find(l => l.id === movement.fromLocationId) 
      : null;
    const locationTo = movement.toLocationId 
      ? storageLocations.find(l => l.id === movement.toLocationId) 
      : null;
    
    if (!product) return 'Mouvement inconnu';
    
    switch (movement.type) {
      case 'IN':
        return `Ajout de ${movement.quantity} ${movement.unitType} de ${product.name}`;
      case 'OUT':
        return `Retrait de ${movement.quantity} ${movement.unitType} de ${product.name}`;
      case 'TRANSFER':
        return `Transfert de ${movement.quantity} ${movement.unitType} de ${product.name} 
                ${locationFrom ? `depuis ${locationFrom.name}` : ''} 
                ${locationTo ? `vers ${locationTo.name}` : ''}`;
      default:
        return 'Type de mouvement inconnu';
    }
  };
  
  // Obtenir le badge du type de mouvement
  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'IN':
        return <Badge variant="success">Entrée</Badge>;
      case 'OUT':
        return <Badge variant="danger">Sortie</Badge>;
      case 'TRANSFER':
        return <Badge variant="info">Transfert</Badge>;
      default:
        return null;
    }
  };
  
  // Filtrer par type de mouvement
  const handleTypeFilter = (type: 'ALL' | 'IN' | 'OUT' | 'TRANSFER') => {
    setMovementType(type);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          {locationId ? 'Mouvements dans cet emplacement' : 'Tous les mouvements de stock'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2 items-center">
          <Calendar size={18} className="text-slate-400" />
          <Input
            type="date"
            placeholder="Date de début"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="flex-1"
          />
          <span className="text-slate-400">à</span>
          <Input
            type="date"
            placeholder="Date de fin"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={movementType === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeFilter('ALL')}
          >
            Tous
          </Button>
          <Button
            variant={movementType === 'IN' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeFilter('IN')}
            className="flex items-center space-x-1"
          >
            <ArrowDown size={14} /> <span>Entrées</span>
          </Button>
          <Button
            variant={movementType === 'OUT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeFilter('OUT')}
            className="flex items-center space-x-1"
          >
            <ArrowUp size={14} /> <span>Sorties</span>
          </Button>
          <Button
            variant={movementType === 'TRANSFER' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeFilter('TRANSFER')}
            className="flex items-center space-x-1"
          >
            <ArrowLeftRight size={14} /> <span>Transferts</span>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <RefreshCw size={32} className="text-slate-400 animate-spin" />
        </div>
      ) : filteredMovements.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700">
          <Info size={48} className="mx-auto text-slate-500 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Aucun mouvement trouvé</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            {searchTerm || startDate || endDate || movementType !== 'ALL'
              ? 'Aucun résultat pour vos critères de recherche. Essayez avec des filtres différents.'
              : 'Il n\'y a pas encore de mouvements de stock enregistrés.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMovements.map((movement) => {
            const product = products.find(p => p.id === movement.productId);
            const location = storageLocations.find(l => l.id === movement.storageLocationId);
            
            return (
              <div 
                key={movement.id} 
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 rounded-lg bg-slate-700">
                      {getMovementIcon(movement.type)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{getMovementDescription(movement)}</h3>
                      <p className="text-slate-400 text-sm">
                        {formatDate(new Date(movement.performedAt))} à {formatTime(new Date(movement.performedAt))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getMovementBadge(movement.type)}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Produit</p>
                    <p className="text-white">{product?.name || 'Inconnu'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Emplacement</p>
                    <p className="text-white">{location?.name || 'Inconnu'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Quantité</p>
                    <p className="text-white">{movement.quantity} {movement.unitType}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Effectué par</p>
                    <p className="text-white">{movement.performedBy}</p>
                  </div>
                  {movement.reason && (
                    <div className="col-span-2 md:col-span-4">
                      <p className="text-slate-400">Raison</p>
                      <p className="text-white">{movement.reason}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
