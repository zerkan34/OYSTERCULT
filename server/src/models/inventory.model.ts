/**
 * Inventaire produits - Modèles de données
 */

/**
 * Types de stockage
 */
export enum StorageType {
  REFRIGERATOR = 'Réfrigérateur',
  FREEZER = 'Congélateur',
  STORAGE = 'Stockage',
  CELLAR = 'Cave',
  POOL = 'Bassin',
  TABLE = 'Table'
}

/**
 * Catégories de produits
 */
export enum ProductCategory {
  OYSTER = 'Huîtres',
  SEAFOOD = 'Fruits de mer',
  PACKAGING = 'Emballage',
  EQUIPMENT = 'Équipement',
  CONSUMABLE = 'Consommable',
  WINE = 'Vin',
  OTHER = 'Autre'
}

/**
 * Unités de mesure
 */
export enum UnitType {
  KG = 'kg',
  UNIT = 'unité',
  BOX = 'boîte',
  BOTTLE = 'bouteille',
  LITER = 'litre',
  DOZEN = 'douzaine'
}

/**
 * Statut de stock
 */
export enum StockStatus {
  AVAILABLE = 'Disponible',
  LOW = 'Faible',
  CRITICAL = 'Critique',
  EXPIRED = 'Expiré'
}

/**
 * Interface d'emplacement de stockage
 */
export interface StorageLocation {
  id: string;
  name: string;
  type: StorageType;
  capacity: number;          // Capacité totale en unités appropriées (kg, litres, etc.)
  currentCapacity: number;   // Capacité actuellement utilisée
  temperature?: number;      // Température actuelle (pour les emplacements refrigérés)
  idealMinTemp?: number;     // Température minimale idéale
  idealMaxTemp?: number;     // Température maximale idéale
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface produit
 */
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description?: string;
  unitType: UnitType;
  alertThreshold?: number;   // Seuil d'alerte pour stock bas
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface de stock (relation entre produit et emplacement de stockage)
 */
export interface Stock {
  id: string;
  productId: string;
  storageLocationId: string;
  quantity: number;
  unitType: UnitType;
  status: StockStatus;
  batchNumber?: string;
  arrivalDate: Date;
  expiryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface pour les mouvements de stock
 */
export interface StockMovement {
  id: string;
  stockId: string;
  productId: string;
  storageLocationId: string;
  type: 'IN' | 'OUT' | 'TRANSFER';  // Type de mouvement
  quantity: number;
  unitType: UnitType;
  fromLocationId?: string;         // Pour les transferts
  toLocationId?: string;           // Pour les transferts
  reason?: string;                 // Raison du mouvement (vente, perte, etc.)
  performedBy: string;             // Utilisateur ayant effectué le mouvement
  performedAt: Date;               // Date du mouvement
  createdAt: Date;
}

/**
 * Interface pour les statistiques d'inventaire
 */
export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  expiringCount: number;
  storageUtilization: {
    [key: string]: {
      total: number;
      used: number;
      utilization: number;
    }
  };
  productDistribution: {
    [key in ProductCategory]: number;
  };
  movementCount: {
    in: number;
    out: number;
    transfer: number;
  };
}
