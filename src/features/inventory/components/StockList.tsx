import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, RefreshCw, AlertTriangle, Info, MoreHorizontal, ArrowRightLeft } from 'lucide-react';
import { Stock, StockStatus, Product } from '@/types/inventory.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Modal } from '@/components/ui/Modal';
import { IconButton } from '@/components/ui/IconButton';
import { Image } from '@/components/ui/Image';
import { formatDate } from '@/lib/utils';
import { useInventory } from '../hooks/useInventory';
import { StockForm } from './StockForm';
import { StockTransferForm } from './StockTransferForm';
import '../pages/StockPage.css';

interface StockListProps {
  locationId?: string;
  productId?: string;
}

export const StockList: React.FC<StockListProps> = ({ locationId, productId }) => {
  const { 
    stocks, 
    products, 
    storageLocations,
    isLoading,
    error,
    addNewStock,
    updateExistingStock,
    deleteStock,
    transferStock,
    loadInitialData
  } = useInventory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  // Créer une map des produits pour un accès facile
  useEffect(() => {
    const map: Record<string, Product> = {};
    products.forEach(product => {
      map[product.id] = product;
    });
    setProductMap(map);
  }, [products]);
  
  // Filtrer les stocks par terme de recherche
  const filteredStocks = stocks.filter(stock => {
    const product = productMap[stock.productId];
    if (!product) return false;
    
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Gestionnaires d'événements
  const handleEdit = async (stock: Stock) => {
    if (!updateExistingStock) return;
    setSelectedStock(stock);
    setShowEditForm(true);
  };
  
  const handleTransfer = async (stock: Stock) => {
    if (!transferStock) return;
    setSelectedStock(stock);
    setShowTransferForm(true);
  };
  
  const handleDelete = async () => {
    if (!selectedStock) return;
    
    try {
      await deleteStock(selectedStock.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du stock:', error);
    }
  };
  
  const handleUpdateStock = async (id: string, data: Partial<Stock>) => {
    try {
      await updateExistingStock(id, data);
      setShowEditForm(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
    }
  };
  
  const handleRemoveStock = async () => {
    if (!selectedStock) return;
    
    try {
      await deleteStock(selectedStock.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du stock:', error);
    }
  };
  
  const handleTransferStock = async (targetLocationId: string, quantity: number) => {
    if (!selectedStock) return;
    
    try {
      await transferStock(selectedStock.id, targetLocationId, quantity);
      setShowTransferForm(false);
    } catch (error) {
      console.error('Erreur lors du transfert de stock:', error);
    }
  };
  
  // Fonction pour déterminer la couleur du badge de statut
  const getStatusBadgeColor = (status: StockStatus) => {
    switch (status) {
      case StockStatus.AVAILABLE:
        return "success";
      case StockStatus.LOW:
        return "warning";
      case StockStatus.CRITICAL:
        return "error";
      case StockStatus.EXPIRED:
        return "default";
      default:
        return "default";
    }
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status: StockStatus) => {
    const color = getStatusBadgeColor(status);
    switch (status) {
      case StockStatus.AVAILABLE:
        return <Badge variant={color}>Disponible</Badge>;
      case StockStatus.LOW:
        return <Badge variant={color}>Faible</Badge>;
      case StockStatus.CRITICAL:
        return <Badge variant={color}>Critique</Badge>;
      case StockStatus.EXPIRED:
        return <Badge variant={color}>Expiré</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div aria-live="polite" aria-busy={isLoading ? "true" : "false"}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white" id="stock-list-title">
          {locationId ? 'Stocks dans cet emplacement' : 'Tous les stocks'}
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center"
          aria-label="Ajouter du stock"
        >
          <PlusCircle size={16} className="mr-2" aria-hidden="true" />
          Ajouter du stock
        </Button>
      </div>
      
      <div className="relative mb-6">
        <div className="flex flex-col md:flex-row gap-2 mb-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Input
              id="search-stock"
              placeholder="Rechercher par nom, lot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 w-full"
              aria-label="Rechercher un stock"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10" role="status" aria-live="polite">
          <RefreshCw size={32} className="text-slate-400 animate-spin" aria-hidden="true" />
          <span className="sr-only">Chargement des données</span>
        </div>
      ) : filteredStocks.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700" role="alert">
          <Info size={48} className="mx-auto text-slate-500 mb-4" aria-hidden="true" />
          <h3 className="text-xl font-medium text-white mb-2">Aucun stock trouvé</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            {searchTerm 
              ? 'Aucun résultat pour votre recherche. Essayez avec des termes différents.'
              : 'Il n\'y a pas de stock dans cet emplacement. Ajoutez-en un pour commencer.'}
          </p>
        </div>
      ) : (
        <div className="stock-card">
          <div className="stock-table-container stock-scrollbar">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Statut</th>
                  <th>Lot</th>
                  <th>Date d'arrivée</th>
                  <th>Date d'expiration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => {
                  const product = productMap[stock.productId];
                  const productName = product ? product.name : 'Produit inconnu';
                  return (
                    <tr 
                      key={stock.id} 
                      className="bg-slate-900 border-t border-slate-700 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {productName}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {stock.quantity} {stock.unitType}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(stock.status)}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {stock.batchNumber || '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {formatDate(new Date(stock.arrivalDate))}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {stock.expiryDate ? formatDate(new Date(stock.expiryDate)) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <IconButton
                              label={`Options pour le stock ${productName} (${stock.batchNumber || 'sans lot'})`}
                              icon={<MoreHorizontal size={16} />}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem 
                              className="text-white hover:bg-slate-700 cursor-pointer"
                              onClick={() => handleEdit(stock)}
                            >
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-white hover:bg-slate-700 cursor-pointer"
                              onClick={() => handleTransfer(stock)}
                            >
                              <ArrowRightLeft size={14} className="mr-2" aria-hidden="true" />
                              Transférer
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-400 hover:bg-red-900/30 hover:text-red-300 cursor-pointer"
                              onClick={() => handleDelete()}
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Modal d'ajout de stock */}
      {showAddForm && (
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Ajouter du stock"
          aria-label="Formulaire d'ajout de stock"
        >
          <StockForm
            locationId={locationId}
            onCancel={() => setShowAddForm(false)}
          />
        </Modal>
      )}
      
      {/* Modal de modification de stock */}
      {showEditForm && selectedStock && (
        <Modal
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          title="Modifier le stock"
          aria-label="Formulaire de modification de stock"
        >
          <StockForm
            initialData={selectedStock}
            onSubmit={(data) => handleUpdateStock(selectedStock.id, data)}
            onCancel={() => setShowEditForm(false)}
          />
        </Modal>
      )}
      
      {/* Modal de transfert de stock */}
      {showTransferForm && selectedStock && (
        <Modal
          isOpen={showTransferForm}
          onClose={() => setShowTransferForm(false)}
          title="Transférer du stock"
          aria-label="Formulaire de transfert de stock"
        >
          <StockTransferForm
            stock={selectedStock}
            onSubmit={handleTransferStock}
            onCancel={() => setShowTransferForm(false)}
          />
        </Modal>
      )}
      
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && selectedStock && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Confirmer la suppression"
          aria-label="Confirmation de suppression de stock"
        >
          <div className="p-6">
            <div className="flex items-center mb-4" role="alert" aria-live="assertive">
              <AlertTriangle size={24} className="text-red-500 mr-2" aria-hidden="true" />
              <p className="text-white">
                Êtes-vous sûr de vouloir supprimer ce stock ? 
                Cette action est irréversible.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                className="border-slate-600 text-white hover:bg-slate-700"
                aria-label="Annuler la suppression"
              >
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleRemoveStock();
                }}
                variant="outline"
                className="bg-red-500 hover:bg-red-600 text-white"
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
