/**
 * Types pour le tableau de bord
 */

// Type pour les tables d'huîtres
export interface OysterTable {
  name: string;
  value: number; // Taux de remplissage
  color: string;
  type: string;
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
