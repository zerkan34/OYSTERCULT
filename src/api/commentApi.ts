/**
 * Service API pour communiquer avec le backend pour la gestion des commentaires de tâches
 */

const API_URL = 'http://localhost:5000/api';

export enum CommentType {
  COMMENT = 'comment',
  DELAY = 'delay',
  STATUS_CHANGE = 'status_change'
}

export enum DelayStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Author {
  id?: string;
  name: string;
  avatar?: string;
}

export interface Attachment {
  id?: string;
  name: string;
  url: string;
  type: 'image' | 'document';
}

export interface DelayReason {
  hours: number;
  reason: string;
  status: DelayStatus;
}

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  author: Author;
  timestamp: string;
  type: CommentType;
  attachments?: Attachment[];
  delayReason?: DelayReason;
}

export interface CommentInput {
  taskId: string;
  content: string;
  authorId?: string;
  type: CommentType;
  attachments?: Omit<Attachment, 'id'>[];
  delayReason?: Omit<DelayReason, 'status'> & { status?: DelayStatus };
}

/**
 * Récupère tous les commentaires d'une tâche
 */
export const fetchCommentsByTaskId = async (taskId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/comments`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des commentaires pour la tâche ${taskId}:`, error);
    return [];
  }
};

/**
 * Ajoute un commentaire à une tâche
 */
export const createComment = async (commentData: CommentInput): Promise<Comment | null> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${commentData.taskId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentData)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);
    return null;
  }
};

/**
 * Met à jour un commentaire existant
 */
export const updateComment = async (
  taskId: string,
  commentId: string, 
  commentData: Partial<CommentInput>
): Promise<Comment | null> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentData)
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du commentaire ${commentId}:`, error);
    return null;
  }
};

/**
 * Supprime un commentaire
 */
export const deleteComment = async (taskId: string, commentId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/comments/${commentId}`, {
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
    console.error(`Erreur lors de la suppression du commentaire ${commentId}:`, error);
    return false;
  }
};

/**
 * Soumet une demande de retard
 */
export const submitDelayRequest = async (
  taskId: string, 
  delayData: { hours: number; reason: string; content: string }
): Promise<Comment | null> => {
  const commentData: CommentInput = {
    taskId,
    content: delayData.content,
    type: CommentType.DELAY,
    delayReason: {
      hours: delayData.hours,
      reason: delayData.reason
    }
  };
  
  return createComment(commentData);
};

/**
 * Approuve ou rejette une demande de retard
 */
export const processDelayRequest = async (
  taskId: string,
  commentId: string,
  approved: boolean,
  responseMessage?: string
): Promise<Comment | null> => {
  // Mettre à jour le statut de la demande de retard
  const updatedComment = await updateComment(taskId, commentId, {
    taskId,
    content: '',
    type: CommentType.DELAY,
    delayReason: {
      hours: 0, // Ces valeurs seront ignorées par le backend, mais nécessaires pour TypeScript
      reason: '',
      status: approved ? DelayStatus.APPROVED : DelayStatus.REJECTED
    }
  });

  // Si un message de réponse est fourni, ajouter un commentaire de suivi
  if (responseMessage && updatedComment) {
    await createComment({
      taskId,
      content: responseMessage,
      type: CommentType.STATUS_CHANGE
    });
  }

  return updatedComment;
};
