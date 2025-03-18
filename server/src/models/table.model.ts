/**
 * Interface représentant une table d'huîtres
 */
export interface Table {
  id: string;
  name: string;
  location: string;
  calibre: string;
  occupation: number;
  mortality: number;
  harvest: string;
  growthRate: number;
  waterQuality: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface pour les statistiques globales du dashboard
 */
export interface DashboardStats {
  totalTables: number;
  occupationAverage: number;
  mortalityAverage: number;
  tablesReadyForHarvest: number;
  waterQualityAverage: number;
}
