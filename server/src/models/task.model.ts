/**
 * Interface représentant une tâche
 */
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
  performance?: TaskPerformance; // Performance relative à la réalisation de la tâche
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Statut d'une tâche
 */
export enum TaskStatus {
  TODO = 'À faire',
  IN_PROGRESS = 'En cours',
  DONE = 'Terminée',
  DELAYED = 'Reportée'
}

/**
 * Priorité d'une tâche
 */
export enum TaskPriority {
  LOW = 'Faible',
  MEDIUM = 'Moyenne',
  HIGH = 'Haute',
  URGENT = 'Urgente'
}

/**
 * Performance d'une tâche
 */
export enum TaskPerformance {
  BELOW_EXPECTATION = 'En dessous des attentes',
  MEETS_EXPECTATION = 'Conforme aux attentes',
  EXCEEDS_EXPECTATION = 'Dépasse les attentes'
}

/**
 * Interface pour les statistiques des tâches
 */
export interface TaskStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  delayedTasks: number;
  urgentTasks: number;
}
