/**
 * Service API pour communiquer avec le backend pour les fonctionnalités du dashboard
 */

const API_URL = 'http://localhost:5000/api';

// Types des données retournées par l'API
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

export interface DashboardStats {
  totalTables: number;
  occupationAverage: number;
  mortalityAverage: number;
  tablesReadyForHarvest: number;
  waterQualityAverage: number;
}

/**
 * Récupère toutes les tables d'huîtres
 */
export const fetchAllTables = async (): Promise<Table[]> => {
  try {
    const response = await fetch(`${API_URL}/dashboard/tables`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des tables:", error);
    // En cas d'erreur, on retourne un tableau vide pour éviter de casser l'UI
    return [];
  }
};

/**
 * Récupère les détails d'une table spécifique par son ID
 */
export const fetchTableById = async (tableId: string): Promise<Table | null> => {
  try {
    const response = await fetch(`${API_URL}/dashboard/tables/${tableId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération de la table ${tableId}:`, error);
    return null;
  }
};

/**
 * Récupère les statistiques globales du dashboard
 */
export const fetchDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    const response = await fetch(`${API_URL}/dashboard/stats`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return null;
  }
};
