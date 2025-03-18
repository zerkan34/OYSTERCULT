/**
 * Types pour le tableau de bord
 */

// Type pour les tables d'huîtres
export interface OysterTable {
  name: string;
  value: number; // Taux de remplissage
  color: string;
  type: string;
  plates: string;
  currentSize: string;
  targetSize: string;
  timeProgress: number;
  startDate: string;
  harvest: string;
  mortality: number;
  alert?: string;
  status?: string;
  // Propriétés additionnelles pour le détail
  occupiedUnits?: number;
  totalUnits?: number;
  location?: string;
  area?: number;
  waterHeight?: number;
  lastInspection?: string;
  currentConditions?: string;
  lastUpdate?: string; // Date de dernière mise à jour
}

// Type pour les produits dans un bassin
export interface PoolProduct {
  name: string;
  quantity: number;
  unit: string;
  color: string;
}

// Type pour les données de qualité d'eau
export interface WaterQuality {
  quality: number;
  oxygen: number;
  temperature: number;
}

// Type pour les données du bassin
export interface Pool {
  name: string;
  value: number;
  color: string;
  type: string;
  capacity: number;
  currentLoad: number;
  products: PoolProduct[];
  waterQuality: WaterQuality;
}

// Type pour les données de santé des bassins
export interface PoolHealth {
  id: string;
  name: string;
  status: 'Optimal' | 'Bon' | 'Attention' | 'Critique';
  temperature: number;
  oxygen: number;
  salinity: number;
  ph: number;
  lastCheck: string;
  alert: boolean;
  stock?: {
    mussels: number;
    urchins: number;
  };
}
