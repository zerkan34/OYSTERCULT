import { Request, Response } from 'express';
import { CommentModel, CommentType, DelayStatus } from '../models/comment.model';

export class CommentController {
  // Récupère tous les commentaires d'une tâche
  public getAllCommentsByTaskId = (req: Request, res: Response): void => {
    try {
      const { taskId } = req.params;
      const comments = CommentModel.getAllByTaskId(taskId);
      
      res.status(200).json(comments);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des commentaires' });
    }
  };

  // Crée un nouveau commentaire
  public createComment = (req: Request, res: Response): void => {
    try {
      const { taskId } = req.params;
      const { content, type, authorId, author, attachments, delayReason } = req.body;
      
      // Validation des données
      if (!content || !type) {
        res.status(400).json({ message: 'Le contenu et le type sont requis' });
        return;
      }
      
      // Préparer les données du commentaire
      const commentData = {
        taskId,
        content,
        type: type as CommentType,
        author: author || { name: 'Utilisateur' }, // Utilisateur par défaut si non spécifié
        attachments,
        delayReason: delayReason ? {
          ...delayReason,
          status: DelayStatus.PENDING // Toujours en attente pour les nouvelles demandes
        } : undefined
      };
      
      // Créer le commentaire
      const newComment = CommentModel.create(commentData);
      
      res.status(201).json(newComment);
    } catch (error) {
      console.error('Erreur lors de la création du commentaire:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la création du commentaire' });
    }
  };

  // Met à jour un commentaire existant
  public updateComment = (req: Request, res: Response): void => {
    try {
      const { taskId, commentId } = req.params;
      const updateData = req.body;
      
      // Validation des données
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: 'Aucune donnée fournie pour la mise à jour' });
        return;
      }
      
      // Mettre à jour le commentaire
      const updatedComment = CommentModel.update(taskId, commentId, updateData);
      
      if (!updatedComment) {
        res.status(404).json({ message: 'Commentaire non trouvé' });
        return;
      }
      
      res.status(200).json(updatedComment);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du commentaire' });
    }
  };

  // Supprime un commentaire
  public deleteComment = (req: Request, res: Response): void => {
    try {
      const { taskId, commentId } = req.params;
      
      // Supprimer le commentaire
      const success = CommentModel.delete(taskId, commentId);
      
      if (!success) {
        res.status(404).json({ message: 'Commentaire non trouvé' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la suppression du commentaire' });
    }
  };
}
