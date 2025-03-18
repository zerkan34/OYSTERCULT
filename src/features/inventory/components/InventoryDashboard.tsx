import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import { Stock, Product } from '@/types/inventory.types';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { InventoryStats } from './InventoryStats';

export const InventoryDashboard: React.FC = () => {
  const {
    loadStocks,
    loadProducts,
    loadStorageLocations,
    loadInventoryStats,
    products,
    stocks,
    storageLocations,
    isLoading,
    getLowStockProducts
  } = useInventory();

  const [expiringStocks, setExpiringStocks] = useState<(Stock & { product?: Product })[]>([]);
  const [lowStocks, setLowStocks] = useState<{ productId: string; totalQuantity: number, product?: Product }[]>([]);

  // Charger toutes les données nécessaires
  useEffect(() => {
    loadProducts();
    loadStocks();
    loadStorageLocations();
    loadInventoryStats();
  }, [loadProducts, loadStocks, loadStorageLocations, loadInventoryStats]);

  // Calculer les stocks à faible niveau
  useEffect(() => {
    if (products.length && stocks.length) {
      const lowStockItems = getLowStockProducts().map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId)
      }));
      setLowStocks(lowStockItems);

      // Trouver les stocks qui expirent dans les 7 prochains jours
      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + 7);
      
      const expiringItems = stocks
        .filter(stock => stock.expiryDate && new Date(stock.expiryDate) <= nextWeek && new Date(stock.expiryDate) >= now)
        .map(stock => ({
          ...stock,
          product: products.find(p => p.id === stock.productId)
        }))
        .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime());
      
      setExpiringStocks(expiringItems);
    }
  }, [products, stocks, getLowStockProducts]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Tableau de bord d'inventaire</h2>
        
        {/* Statistiques d'inventaire */}
        <InventoryStats />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Produits à faible niveau de stock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className="text-yellow-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-white">Stocks faibles</h3>
            </div>
            <Link to="/inventory/products">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                Voir tout
                <ArrowRight className="ml-1" size={16} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : lowStocks.length > 0 ? (
            <div className="divide-y divide-white/10">
              {lowStocks.slice(0, 5).map((item) => (
                <div key={item.productId} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{item.product?.name || 'Produit inconnu'}</div>
                    <div className="text-sm text-white/60">Quantité: {item.totalQuantity} {item.product?.unitType}</div>
                  </div>
                  <Badge variant="warning">Faible</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              Aucun produit en stock faible
            </div>
          )}
        </motion.div>

        {/* Produits qui expirent bientôt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calendar className="text-red-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-white">Expirations proches</h3>
            </div>
            <Link to="/inventory/stocks">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                Voir tout
                <ArrowRight className="ml-1" size={16} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : expiringStocks.length > 0 ? (
            <div className="divide-y divide-white/10">
              {expiringStocks.slice(0, 5).map((stock) => (
                <div key={stock.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{stock.product?.name || 'Produit inconnu'}</div>
                    <div className="text-sm text-white/60">
                      Expire le: {stock.expiryDate ? formatDate(new Date(stock.expiryDate)) : 'N/A'}
                    </div>
                  </div>
                  <Badge variant="error">
                    J-{Math.ceil((new Date(stock.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              Aucun produit n'expire prochainement
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
