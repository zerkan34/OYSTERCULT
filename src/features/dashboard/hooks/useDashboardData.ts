import { useState, useEffect } from 'react';
import { fetchAllTables, fetchDashboardStats, Table, DashboardStats } from '../../../api/dashboardApi';

/**
 * Hook personnalisé pour récupérer et gérer les données du dashboard
 */
export const useDashboardData = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les données initiales
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer les tables et les statistiques en parallèle
      const [tablesData, statsData] = await Promise.all([
        fetchAllTables(),
        fetchDashboardStats()
      ]);
      
      setTables(tablesData);
      setStats(statsData);
    } catch (err) {
      console.error("Erreur lors du chargement des données du dashboard:", err);
      setError("Impossible de charger les données du dashboard. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fonction pour recharger les données 
  const refreshData = () => {
    loadDashboardData();
  };

  return {
    tables,
    stats,
    loading,
    error,
    refreshData
  };
};
