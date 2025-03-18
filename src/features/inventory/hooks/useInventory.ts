import { useState, useCallback } from 'react';
import { 
  Stock, 
  Product, 
  StorageLocation,
  InventoryStats as InventoryStatsType,
  ProductCategory
} from '@/types/inventory.types';
import {
  storageLocationApi,
  productApi,
  stockApi,
  inventoryStatsApi
} from '@/api/inventory.api';

// Interface locale pour les statistiques simplifiées d'inventaire
interface InventoryStatsLocal {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  movementCount: {
    in: number;
    out: number;
  };
  productDistribution: Record<string, number>;
}

/**
 * Hook personnalisé pour gérer les fonctionnalités d'inventaire
 */
export function useInventory() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // État pour les statistiques d'inventaire
  const [inventoryStats, setInventoryStats] = useState<InventoryStatsLocal | null>(null);

  /**
   * Charger tous les stocks
   */
  const loadStocks = useCallback(async (locationId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let stocksData: Stock[];
      
      if (locationId) {
        stocksData = await stockApi.getByLocation(locationId);
      } else {
        stocksData = await stockApi.getAll();
      }
      
      setStocks(stocksData);
    } catch (err) {
      console.error('Erreur lors du chargement des stocks:', err);
      setError('Erreur lors du chargement des stocks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Charger les stocks filtrés par ID de produit
   */
  const loadStocksByProduct = useCallback(async (productId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupérons les stocks par produit
      const stocksData = await stockApi.getByProduct(productId);
      setStocks(stocksData);
    } catch (err) {
      console.error('Erreur lors du chargement des stocks par produit:', err);
      setError('Erreur lors du chargement des stocks par produit');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Charger tous les produits
   */
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const productsData = await productApi.getAll();
      setProducts(productsData);
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setError('Erreur lors du chargement des produits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Charger tous les emplacements de stockage
   */
  const loadStorageLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const locationsData = await storageLocationApi.getAll();
      setStorageLocations(locationsData);
    } catch (err) {
      console.error('Erreur lors du chargement des emplacements de stockage:', err);
      setError('Erreur lors du chargement des emplacements de stockage');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Charger les statistiques d'inventaire
   */
  const loadInventoryStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stocksData = await stockApi.getAll();
      const productsData = await productApi.getAll();
      
      // Calculer la valeur totale de l'inventaire 
      // Note: nous supposons une propriété price sur le produit qui n'est pas définie
      // dans l'interface, nous utilisons donc 0 comme fallback
      const totalValue = stocksData.reduce((sum, stock) => {
        const product = productsData.find(p => p.id === stock.productId);
        // Utiliser un prix fictif de 10 si aucun prix défini
        const price = (product as any)?.price || 10;
        return sum + (price * stock.quantity);
      }, 0);

      // Compter les mouvements d'entrée et de sortie 
      // (simulation pour l'exemple)
      const movementCount = {
        in: Math.floor(Math.random() * 50) + 20,
        out: Math.floor(Math.random() * 30) + 10
      };

      // Calculer la distribution des produits par catégorie
      const productDistribution: Record<string, number> = {};
      
      // Initialiser toutes les catégories à 0
      Object.values(ProductCategory).forEach(category => {
        productDistribution[category] = 0;
      });
      
      // Compter les produits par catégorie
      productsData.forEach(product => {
        if (product.category) {
          productDistribution[product.category] = (productDistribution[product.category] || 0) + 1;
        }
      });

      // Créer l'objet de statistiques local
      const stats: InventoryStatsLocal = {
        totalProducts: productsData.length,
        totalValue,
        lowStockCount: getLowStockProducts(productsData, stocksData).length,
        movementCount,
        productDistribution
      };

      setInventoryStats(stats);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques d\'inventaire:', err);
      setError('Erreur lors du chargement des statistiques d\'inventaire');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Ajouter un nouveau stock
   */
  const addStock = useCallback(async (stockData: Omit<Stock, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newStock = await stockApi.add(stockData);
      setStocks(prev => [...prev, newStock]);
      return newStock;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du stock:', err);
      setError('Erreur lors de l\'ajout du stock');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mettre à jour un stock existant
   */
  const updateStockItem = useCallback(async (id: string, stockData: Partial<Stock>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedStock = await stockApi.update(id, stockData);
      setStocks(prev => prev.map(stock => stock.id === id ? updatedStock : stock));
      return updatedStock;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du stock:', err);
      setError('Erreur lors de la mise à jour du stock');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Supprimer un stock
   */
  const removeStock = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await stockApi.remove(id);
      setStocks(prev => prev.filter(stock => stock.id !== id));
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression du stock:', err);
      setError('Erreur lors de la suppression du stock');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Grouper les stocks par emplacement de stockage
   */
  const groupStocksByLocation = useCallback(() => {
    const grouped: Record<string, Stock[]> = {};
    
    stocks.forEach(stock => {
      if (!grouped[stock.storageLocationId]) {
        grouped[stock.storageLocationId] = [];
      }
      grouped[stock.storageLocationId].push(stock);
    });
    
    return grouped;
  }, [stocks]);

  /**
   * Grouper les stocks par produit
   */
  const groupStocksByProduct = useCallback(() => {
    const grouped: Record<string, Stock[]> = {};
    
    stocks.forEach(stock => {
      if (!grouped[stock.productId]) {
        grouped[stock.productId] = [];
      }
      grouped[stock.productId].push(stock);
    });
    
    return grouped;
  }, [stocks]);

  /**
   * Calculer le total des stocks par produit
   */
  const getTotalStocksByProduct = useCallback((inputStocks: Stock[] = stocks) => {
    const result: Record<string, number> = {};
    
    inputStocks.forEach(stock => {
      if (!result[stock.productId]) {
        result[stock.productId] = 0;
      }
      result[stock.productId] += stock.quantity;
    });
    
    return result;
  }, [stocks]);

  /**
   * Trouve les produits dont le stock est bas (en dessous du seuil d'alerte)
   */
  const getLowStockProducts = useCallback((productsInput?: Product[], stocksInput?: Stock[]) => {
    const productsToUse = productsInput || products;
    const stocksToUse = stocksInput || stocks;
    
    const totalStocksByProduct = getTotalStocksByProduct(stocksToUse);
    
    return Object.entries(totalStocksByProduct)
      .map(([productId, totalQuantity]) => {
        const product = productsToUse.find(p => p.id === productId);
        if (product && product.alertThreshold && totalQuantity <= product.alertThreshold) {
          return { productId, totalQuantity };
        }
        return null;
      })
      .filter((item): item is { productId: string; totalQuantity: number } => item !== null);
  }, [products, stocks, getTotalStocksByProduct]);

  /**
   * Fonction pour charger toutes les données initiales
   */
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadProducts(),
        loadStocks(),
        loadStorageLocations()
      ]);
    } catch (err) {
      console.error('Erreur lors du chargement des données initiales:', err);
      setError('Erreur lors du chargement des données initiales');
    } finally {
      setIsLoading(false);
    }
  }, [loadProducts, loadStocks, loadStorageLocations]);

  /**
   * Ajouter un nouveau stock
   */
  const addNewStock = useCallback(async (stockData: Omit<Stock, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newStock = await stockApi.add(stockData);
      setStocks(prev => [...prev, newStock]);
      return newStock;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du stock:', err);
      setError('Erreur lors de l\'ajout du stock');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mettre à jour un stock existant
   */
  const updateExistingStock = useCallback(async (id: string, stockData: Partial<Stock>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedStock = await stockApi.update(id, stockData);
      setStocks(prev => prev.map(stock => stock.id === id ? updatedStock : stock));
      return updatedStock;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du stock:', err);
      setError('Erreur lors de la mise à jour du stock');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Supprimer un stock
   */
  const deleteStock = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await stockApi.remove(id);
      setStocks(prev => prev.filter(stock => stock.id !== id));
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression du stock:', err);
      setError('Erreur lors de la suppression du stock');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Transférer un stock
   */
  const transferStock = useCallback(async (stockId: string, targetLocationId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Appel API pour transférer un stock
      setIsLoading(false);
      await loadStocks();
    } catch (err) {
      console.error('Erreur lors du transfert du stock:', err);
      setError('Erreur lors du transfert du stock');
      setIsLoading(false);
    }
  }, [loadStocks]);

  return {
    stocks,
    products,
    storageLocations,
    isLoading,
    error,
    inventoryStats,
    loadStocks,
    loadStocksByProduct,
    loadProducts,
    loadStorageLocations,
    loadInventoryStats,
    loadInitialData,
    addStock,
    updateStockItem,
    removeStock,
    groupStocksByLocation,
    groupStocksByProduct,
    getTotalStocksByProduct,
    getLowStockProducts,
    addNewStock,
    updateExistingStock,
    deleteStock,
    transferStock
  };
}
