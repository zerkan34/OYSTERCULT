import { useState, useEffect } from 'react';
import { fetchAllTasks, fetchTaskStats, Task, TaskStats, TaskStatus, updateTask, createTask, deleteTask } from '../../../api/taskApi';

/**
 * Hook personnalisé pour récupérer et gérer les données des tâches
 */
export const useTasksData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les données initiales
  const loadTasksData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer les tâches et les statistiques en parallèle
      const [tasksData, statsData] = await Promise.all([
        fetchAllTasks(),
        fetchTaskStats()
      ]);
      
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.error("Erreur lors du chargement des données des tâches:", err);
      setError("Impossible de charger les données des tâches. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadTasksData();
  }, []);

  // Fonction pour ajouter une nouvelle tâche
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await createTask(taskData);
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        // Recharger les statistiques après l'ajout
        const statsData = await fetchTaskStats();
        setStats(statsData);
      }
      return newTask !== null;
    } catch (err) {
      console.error("Erreur lors de l'ajout d'une tâche:", err);
      return false;
    }
  };

  // Fonction pour mettre à jour une tâche existante
  const updateTaskById = async (taskId: string, taskData: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(taskId, taskData);
      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId ? updatedTask : task
          )
        );
        // Recharger les statistiques après la mise à jour
        const statsData = await fetchTaskStats();
        setStats(statsData);
      }
      return updatedTask !== null;
    } catch (err) {
      console.error(`Erreur lors de la mise à jour de la tâche ${taskId}:`, err);
      return false;
    }
  };

  // Fonction pour supprimer une tâche
  const removeTask = async (taskId: string) => {
    try {
      const success = await deleteTask(taskId);
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        // Recharger les statistiques après la suppression
        const statsData = await fetchTaskStats();
        setStats(statsData);
      }
      return success;
    } catch (err) {
      console.error(`Erreur lors de la suppression de la tâche ${taskId}:`, err);
      return false;
    }
  };

  // Fonction pour filtrer les tâches par statut
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  // Fonction pour recharger les données 
  const refreshData = () => {
    loadTasksData();
  };

  return {
    tasks,
    stats,
    loading,
    error,
    refreshData,
    addTask,
    updateTaskById,
    removeTask,
    getTasksByStatus
  };
};
