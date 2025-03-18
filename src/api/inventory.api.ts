import { api } from './api';
import { 
  StorageLocation, 
  Product, 
  Stock, 
  StockMovement, 
  InventoryStats,
  StockStatus,
  ProductCategory,
  StorageType,
  UnitType
} from '@/types/inventory.types';

const BASE_URL = '/inventory';

/**
 * API pour la gestion des emplacements de stockage
 */
export const storageLocationApi = {
  /**
   * Récupère tous les emplacements de stockage
   */
  getAll: async (): Promise<StorageLocation[]> => {
    const response = await api.get(`${BASE_URL}/storage-locations`);
    return response.data.data;
  },

  /**
   * Récupère un emplacement de stockage par son ID
   */
  getById: async (id: string): Promise<StorageLocation> => {
    const response = await api.get(`${BASE_URL}/storage-locations/${id}`);
    return response.data.data;
  },

  /**
   * Crée un nouvel emplacement de stockage
   */
  create: async (data: Omit<StorageLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<StorageLocation> => {
    const response = await api.post(`${BASE_URL}/storage-locations`, data);
    return response.data.data;
  },

  /**
   * Met à jour un emplacement de stockage existant
   */
  update: async (id: string, data: Partial<Omit<StorageLocation, 'id' | 'createdAt' | 'updatedAt'>>): Promise<StorageLocation> => {
    const response = await api.put(`${BASE_URL}/storage-locations/${id}`, data);
    return response.data.data;
  },

  /**
   * Supprime un emplacement de stockage
   */
  delete: async (id: string): Promise<boolean> => {
    const response = await api.delete(`${BASE_URL}/storage-locations/${id}`);
    return response.data.success;
  },
};

/**
 * API pour la gestion des produits
 */
export const productApi = {
  /**
   * Récupère tous les produits
   */
  getAll: async (): Promise<Product[]> => {
    const response = await api.get(`${BASE_URL}/products`);
    return response.data.data;
  },

  /**
   * Récupère un produit par son ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`${BASE_URL}/products/${id}`);
    return response.data.data;
  },

  /**
   * Crée un nouveau produit
   */
  create: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await api.post(`${BASE_URL}/products`, data);
    return response.data.data;
  },

  /**
   * Met à jour un produit existant
   */
  update: async (id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> => {
    const response = await api.put(`${BASE_URL}/products/${id}`, data);
    return response.data.data;
  },

  /**
   * Supprime un produit
   */
  delete: async (id: string): Promise<boolean> => {
    const response = await api.delete(`${BASE_URL}/products/${id}`);
    return response.data.success;
  },
};

/**
 * API pour la gestion des stocks
 */
export const stockApi = {
  /**
   * Récupère tous les stocks
   */
  getAll: async (): Promise<Stock[]> => {
    const response = await api.get(`${BASE_URL}/stocks`);
    return response.data.data;
  },

  /**
   * Récupère un stock par son ID
   */
  getById: async (id: string): Promise<Stock> => {
    const response = await api.get(`${BASE_URL}/stocks/${id}`);
    return response.data.data;
  },

  /**
   * Récupère les stocks par emplacement
   */
  getByLocation: async (locationId: string): Promise<Stock[]> => {
    const response = await api.get(`${BASE_URL}/stocks/location/${locationId}`);
    return response.data.data;
  },

  /**
   * Récupère les stocks par produit
   */
  getByProduct: async (productId: string): Promise<Stock[]> => {
    const response = await api.get(`${BASE_URL}/stocks/product/${productId}`);
    return response.data.data;
  },

  /**
   * Ajoute un nouveau stock
   */
  add: async (data: Omit<Stock, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Stock> => {
    const response = await api.post(`${BASE_URL}/stocks`, data);
    return response.data.data;
  },

  /**
   * Met à jour un stock existant
   */
  update: async (id: string, data: Partial<Omit<Stock, 'id' | 'productId' | 'storageLocationId' | 'createdAt' | 'updatedAt'>>): Promise<Stock> => {
    const response = await api.put(`${BASE_URL}/stocks/${id}`, data);
    return response.data.data;
  },

  /**
   * Supprime un stock
   */
  remove: async (id: string): Promise<boolean> => {
    const response = await api.delete(`${BASE_URL}/stocks/${id}`);
    return response.data.success;
  },

  /**
   * Transfère du stock entre deux emplacements
   */
  transfer: async (stockId: string, targetLocationId: string, quantity: number): Promise<{ sourceStock: Stock; targetStock: Stock }> => {
    const response = await api.post(`${BASE_URL}/stocks/${stockId}/transfer`, { targetLocationId, quantity });
    return response.data.data;
  },
};

/**
 * API pour la gestion des mouvements de stock
 */
export const stockMovementApi = {
  /**
   * Récupère tous les mouvements de stock
   */
  getAll: async (): Promise<StockMovement[]> => {
    const response = await api.get(`${BASE_URL}/stock-movements`);
    return response.data.data;
  },

  /**
   * Récupère les mouvements de stock filtrés
   */
  getFiltered: async (filters: {
    productId?: string;
    storageLocationId?: string;
    startDate?: Date;
    endDate?: Date;
    type?: 'IN' | 'OUT' | 'TRANSFER';
  }): Promise<StockMovement[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters.productId) queryParams.append('productId', filters.productId);
    if (filters.storageLocationId) queryParams.append('storageLocationId', filters.storageLocationId);
    if (filters.startDate) queryParams.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) queryParams.append('endDate', filters.endDate.toISOString());
    if (filters.type) queryParams.append('type', filters.type);
    
    const response = await api.get(`${BASE_URL}/stock-movements/filter?${queryParams.toString()}`);
    return response.data.data;
  },
};

/**
 * API pour les statistiques d'inventaire
 */
export const inventoryStatsApi = {
  /**
   * Récupère les statistiques d'inventaire
   */
  get: async (): Promise<InventoryStats> => {
    const response = await api.get(`${BASE_URL}/stats`);
    return response.data.data;
  },
};
