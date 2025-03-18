/**
 * Service API pour communiquer avec le backend pour la gestion des tâches
 */

const API_URL = 'http://localhost:5000/api';

// Types des données retournées par l'API
export enum TaskStatus {
  TODO = 'À faire',
  IN_PROGRESS = 'En cours',
  DONE = 'Terminée',
  DELAYED = 'Reportée'
}

export enum TaskPriority {
  LOW = 'Faible',
  MEDIUM = 'Moyenne',
  HIGH = 'Haute',
  URGENT = 'Urgente'
}

export enum TaskPerformance {
  BELOW_EXPECTATION = 'En dessous des attentes',
  MEETS_EXPECTATION = 'Conforme aux attentes',
  EXCEEDS_EXPECTATION = 'Dépasse les attentes'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo: string;
  tableId?: string;
  poolId?: string;
  estimatedHours?: number; // Nombre d'heures estimées pour accomplir la tâche
  actualHours?: number; // Nombre d'heures réellement passées sur la tâche
  performance?: TaskPerformance; // Évaluation de la performance sur la tâche
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  delayedTasks: number;
  urgentTasks: number;
}

/**
 * Récupère toutes les tâches
 */
export const fetchAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    return [];
  }
};

/**
 * Récupère les tâches par statut
 */
export const fetchTasksByStatus = async (status: TaskStatus): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_URL}/tasks/status/${status}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des tâches avec statut ${status}:`, error);
    return [];
  }
};

/**
 * Récupère une tâche spécifique par son ID
 */
export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération de la tâche ${taskId}:`, error);
    return null;
  }
};

/**
 * Crée une nouvelle tâche
 */
export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task | null> => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error);
    return null;
  }
};

/**
 * Met à jour une tâche existante
 */
export const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task | null> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la tâche ${taskId}:`, error);
    return null;
  }
};

/**
 * Supprime une tâche
 */
export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la tâche ${taskId}:`, error);
    return false;
  }
};

/**
 * Récupère les statistiques des tâches
 */
export const fetchTaskStats = async (): Promise<TaskStats | null> => {
  try {
    const response = await fetch(`${API_URL}/tasks/stats`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques des tâches:", error);
    return null;
  }
};

/**
 * Met à jour les heures réelles et la performance d'une tâche
 */
export const updateTaskPerformance = async (
  taskId: string, 
  actualHours: number, 
  performance: TaskPerformance
): Promise<Task | null> => {
  return updateTask(taskId, { actualHours, performance });
};
