import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { CommentController } from '../controllers/comment.controller';

const router = Router();
const taskController = new TaskController();
const commentController = new CommentController();

// Route pour obtenir toutes les tâches
router.get('/', taskController.getAllTasks);

// Route pour obtenir les statistiques des tâches
router.get('/stats', taskController.getTaskStats);

// Route pour obtenir les tâches par statut
router.get('/status/:status', taskController.getTasksByStatus);

// Route pour obtenir une tâche spécifique par son ID
router.get('/:taskId', taskController.getTaskById);

// Route pour créer une nouvelle tâche
router.post('/', taskController.createTask);

// Route pour mettre à jour une tâche existante
router.put('/:taskId', taskController.updateTask);

// Route pour supprimer une tâche
router.delete('/:taskId', taskController.deleteTask);

// Routes pour les commentaires
// Récupérer tous les commentaires d'une tâche
router.get('/:taskId/comments', commentController.getAllCommentsByTaskId);

// Créer un nouveau commentaire pour une tâche
router.post('/:taskId/comments', commentController.createComment);

// Mettre à jour un commentaire existant
router.put('/:taskId/comments/:commentId', commentController.updateComment);

// Supprimer un commentaire
router.delete('/:taskId/comments/:commentId', commentController.deleteComment);

export default router;
