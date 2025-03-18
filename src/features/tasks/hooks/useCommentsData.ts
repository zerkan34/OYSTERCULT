import { useState, useEffect } from 'react';
import { 
  fetchCommentsByTaskId,
  createComment, 
  updateComment, 
  deleteComment, 
  submitDelayRequest,
  processDelayRequest,
  Comment, 
  CommentInput,
  CommentType
} from '../../../api/commentApi';

/**
 * Hook personnalisé pour récupérer et gérer les commentaires d'une tâche
 */
export const useCommentsData = (taskId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les commentaires
  const loadComments = async () => {
    if (!taskId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const commentsData = await fetchCommentsByTaskId(taskId);
      setComments(commentsData);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires:", err);
      setError("Impossible de charger les commentaires. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les commentaires au montage du composant et quand taskId change
  useEffect(() => {
    loadComments();
  }, [taskId]);

  // Fonction pour ajouter un nouveau commentaire
  const addComment = async (content: string): Promise<boolean> => {
    if (!taskId || !content.trim()) return false;

    try {
      const commentData: CommentInput = {
        taskId,
        content,
        type: CommentType.COMMENT
      };
      
      const newComment = await createComment(commentData);
      
      if (newComment) {
        setComments(prevComments => [...prevComments, newComment]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erreur lors de l'ajout d'un commentaire:", err);
      return false;
    }
  };

  // Fonction pour soumettre une demande de retard
  const submitDelay = async (hours: number, reason: string, content: string): Promise<boolean> => {
    if (!taskId) return false;

    try {
      const newComment = await submitDelayRequest(taskId, { hours, reason, content });
      
      if (newComment) {
        setComments(prevComments => [...prevComments, newComment]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erreur lors de la soumission de la demande de retard:", err);
      return false;
    }
  };

  // Fonction pour traiter une demande de retard (approuver/rejeter)
  const handleDelayRequest = async (
    commentId: string, 
    approved: boolean, 
    responseMessage?: string
  ): Promise<boolean> => {
    if (!taskId || !commentId) return false;

    try {
      const updatedComment = await processDelayRequest(taskId, commentId, approved, responseMessage);
      
      if (updatedComment) {
        // Recharger tous les commentaires pour obtenir également le commentaire de suivi
        await loadComments();
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Erreur lors du traitement de la demande de retard ${commentId}:`, err);
      return false;
    }
  };

  // Fonction pour supprimer un commentaire
  const removeComment = async (commentId: string): Promise<boolean> => {
    if (!taskId || !commentId) return false;

    try {
      const success = await deleteComment(taskId, commentId);
      
      if (success) {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Erreur lors de la suppression du commentaire ${commentId}:`, err);
      return false;
    }
  };

  return {
    comments,
    loading,
    error,
    refreshComments: loadComments,
    addComment,
    submitDelay,
    handleDelayRequest,
    removeComment
  };
};
