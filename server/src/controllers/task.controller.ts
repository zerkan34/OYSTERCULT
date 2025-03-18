import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { TaskStatus } from '../models/task.model';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * Récupère toutes les tâches
   */
  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error });
    }
  };

  /**
   * Récupère les tâches filtrées par statut
   */
  getTasksByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.params;
      
      // Vérifier si le statut est valide
      if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
        res.status(400).json({ message: 'Statut de tâche invalide' });
        return;
      }
      
      const tasks = await this.taskService.getTasksByStatus(status as TaskStatus);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error });
    }
  };

  /**
   * Récupère une tâche spécifique par son ID
   */
  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;
      const task = await this.taskService.getTaskById(taskId);
      
      if (!task) {
        res.status(404).json({ message: 'Tâche non trouvée' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de la tâche', error });
    }
  };

  /**
   * Crée une nouvelle tâche
   */
  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskData = req.body;
      
      if (!taskData.title || !taskData.status || !taskData.priority || !taskData.dueDate || !taskData.assignedTo) {
        res.status(400).json({ message: 'Données de tâche incomplètes' });
        return;
      }
      
      const newTask = await this.taskService.createTask(taskData);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de la tâche', error });
    }
  };

  /**
   * Met à jour une tâche existante
   */
  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;
      const taskData = req.body;
      
      const updatedTask = await this.taskService.updateTask(taskId, taskData);
      
      if (!updatedTask) {
        res.status(404).json({ message: 'Tâche non trouvée' });
        return;
      }
      
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche', error });
    }
  };

  /**
   * Supprime une tâche
   */
  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;
      const result = await this.taskService.deleteTask(taskId);
      
      if (!result) {
        res.status(404).json({ message: 'Tâche non trouvée' });
        return;
      }
      
      res.status(200).json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de la tâche', error });
    }
  };

  /**
   * Récupère les statistiques des tâches
   */
  getTaskStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.taskService.getTaskStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques des tâches', error });
    }
  };
}
