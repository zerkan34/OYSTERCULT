import { Task, TaskStatus, TaskPriority, TaskStats, TaskPerformance } from '../models/task.model';

export class TaskService {
  // Données simulées pour les tâches
  // Dans un environnement de production, ces données viendraient d'une base de données
  private tasks: Task[] = [
    {
      id: 'task-001',
      title: 'Inspection des tables A-01 et B-02',
      description: 'Vérifier l\'état général des huîtres et la propreté des tables',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: '2025-03-15',
      assignedTo: 'Thomas Lefèvre',
      tableId: 'A-01',
      createdAt: new Date('2025-03-08'),
      updatedAt: new Date('2025-03-08'),
      estimatedHours: 3,
      actualHours: undefined,
      performance: undefined
    },
    {
      id: 'task-002',
      title: 'Entretien des poches',
      description: 'Nettoyer les poches et enlever les algues accumulées',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      dueDate: '2025-03-12',
      assignedTo: 'Marie Dubois',
      tableId: 'C-03',
      createdAt: new Date('2025-03-05'),
      updatedAt: new Date('2025-03-10'),
      estimatedHours: 5,
      actualHours: undefined,
      performance: undefined
    },
    {
      id: 'task-003',
      title: 'Calibrage des huîtres Table D-04',
      description: 'Trier les huîtres par taille et recalibrer les poches',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      dueDate: '2025-03-09',
      assignedTo: 'Philippe Martin',
      tableId: 'D-04',
      createdAt: new Date('2025-03-03'),
      updatedAt: new Date('2025-03-09'),
      estimatedHours: 4,
      actualHours: 3.5,
      performance: TaskPerformance.EXCEEDS_EXPECTATION
    },
    {
      id: 'task-004',
      title: 'Réparation des équipements du bassin 2',
      description: 'Remplacer la pompe défectueuse et vérifier le système de filtration',
      status: TaskStatus.DELAYED,
      priority: TaskPriority.URGENT,
      dueDate: '2025-03-07',
      assignedTo: 'Jean Mercier',
      poolId: 'pool-2',
      createdAt: new Date('2025-03-02'),
      updatedAt: new Date('2025-03-07'),
      estimatedHours: 2,
      actualHours: undefined,
      performance: undefined
    },
    {
      id: 'task-005',
      title: 'Contrôle sanitaire mensuel',
      description: 'Prélever des échantillons d\'eau et d\'huîtres pour analyse en laboratoire',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: '2025-03-20',
      assignedTo: 'Claire Dupont',
      createdAt: new Date('2025-03-10'),
      updatedAt: new Date('2025-03-10'),
      estimatedHours: 6,
      actualHours: undefined,
      performance: undefined
    },
    {
      id: 'task-006',
      title: 'Inventaire des stocks',
      description: 'Mettre à jour l\'inventaire des stocks d\'huîtres par calibre',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.LOW,
      dueDate: '2025-03-18',
      assignedTo: 'Sophie Lambert',
      createdAt: new Date('2025-03-11'),
      updatedAt: new Date('2025-03-11'),
      estimatedHours: 8,
      actualHours: undefined,
      performance: undefined
    },
    {
      id: 'task-007',
      title: 'Nettoyage des bassins de purification',
      description: 'Vider et nettoyer les bassins de purification, vérifier les filtres',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: '2025-03-05',
      assignedTo: 'Thomas Lefèvre',
      poolId: 'pool-1',
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-05'),
      estimatedHours: 5,
      actualHours: 6.5,
      performance: TaskPerformance.MEETS_EXPECTATION
    },
    {
      id: 'task-008',
      title: 'Maintenance du système d\'oxygénation',
      description: 'Vérifier et entretenir les diffuseurs d\'oxygène dans tous les bassins',
      status: TaskStatus.DONE,
      priority: TaskPriority.URGENT,
      dueDate: '2025-02-28',
      assignedTo: 'Jean Mercier',
      poolId: 'pool-all',
      createdAt: new Date('2025-02-25'),
      updatedAt: new Date('2025-02-28'),
      estimatedHours: 4,
      actualHours: 7,
      performance: TaskPerformance.BELOW_EXPECTATION
    },
    {
      id: 'task-009',
      title: 'Préparation des commandes hebdomadaires',
      description: 'Préparer et emballer les commandes clients pour livraison',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: '2025-03-01',
      assignedTo: 'Marie Dubois',
      createdAt: new Date('2025-02-27'),
      updatedAt: new Date('2025-03-01'),
      estimatedHours: 8,
      actualHours: 7,
      performance: TaskPerformance.EXCEEDS_EXPECTATION
    },
    {
      id: 'task-010',
      title: 'Formation nouvelles techniques de tri',
      description: 'Former l\'équipe aux nouvelles méthodes de tri automatisé',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      dueDate: '2025-02-20',
      assignedTo: 'Claire Dupont',
      createdAt: new Date('2025-02-15'),
      updatedAt: new Date('2025-02-20'),
      estimatedHours: 3,
      actualHours: 3,
      performance: TaskPerformance.MEETS_EXPECTATION
    },
    {
      id: 'task-011',
      title: 'Analyse de la qualité de l\'eau',
      description: 'Effectuer des tests complets sur la qualité de l\'eau dans tous les bassins',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: '2025-02-25',
      assignedTo: 'Sophie Lambert',
      poolId: 'pool-all',
      createdAt: new Date('2025-02-22'),
      updatedAt: new Date('2025-02-25'),
      estimatedHours: 4,
      actualHours: 3.5,
      performance: TaskPerformance.EXCEEDS_EXPECTATION
    }
  ];

  /**
   * Récupère toutes les tâches
   */
  async getAllTasks(): Promise<Task[]> {
    // Simulation d'un délai d'accès à la base de données
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.tasks;
  }

  /**
   * Récupère les tâches filtrées par statut
   */
  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    // Simulation d'un délai d'accès à la base de données
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.tasks.filter(task => task.status === status);
  }

  /**
   * Récupère une tâche spécifique par son ID
   */
  async getTaskById(taskId: string): Promise<Task | undefined> {
    // Simulation d'un délai d'accès à la base de données
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.tasks.find(task => task.id === taskId);
  }

  /**
   * Crée une nouvelle tâche
   */
  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    // Simulation d'un délai d'accès à la base de données
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const now = new Date();
    
    const newTask: Task = {
      id: `task-${(this.tasks.length + 1).toString().padStart(3, '0')}`,
      ...taskData,
      createdAt: now,
      updatedAt: now
    };
    
    this.tasks.push(newTask);
    
    return newTask;
  }

  /**
   * Met à jour une tâche existante
   */
  async updateTask(taskId: string, taskData: Partial<Task>): Promise<Task | undefined> {
    // Simulation d'un délai d'accès à la base de données
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return undefined;
    }
    
    // Mettre à jour la tâche
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...taskData,
      updatedAt: new Date()
    };
    
    return this.tasks[taskIndex];
  }

  /**
   * Supprime une tâche
   */
  async deleteTask(taskId: string): Promise<boolean> {
    // Simulation d'un délai d'accès à la base de données
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return false;
    }
    
    this.tasks.splice(taskIndex, 1);
    
    return true;
  }

  /**
   * Calcule les statistiques des tâches
   */
  async getTaskStats(): Promise<TaskStats> {
    // Simulation d'un délai d'accès à la base de données
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const totalTasks = this.tasks.length;
    const todoTasks = this.tasks.filter(task => task.status === TaskStatus.TODO).length;
    const inProgressTasks = this.tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
    const doneTasks = this.tasks.filter(task => task.status === TaskStatus.DONE).length;
    const delayedTasks = this.tasks.filter(task => task.status === TaskStatus.DELAYED).length;
    const urgentTasks = this.tasks.filter(task => task.priority === TaskPriority.URGENT).length;
    
    return {
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      delayedTasks,
      urgentTasks
    };
  }
}
