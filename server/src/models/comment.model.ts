import { v4 as uuidv4 } from 'uuid';

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
  id: string;
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

// Commentaires mockés pour tester
const mockComments: Record<string, Comment[]> = {};

export const CommentModel = {
  // Récupère tous les commentaires d'une tâche
  getAllByTaskId: (taskId: string): Comment[] => {
    return mockComments[taskId] || [];
  },

  // Ajoute un commentaire
  create: (comment: Omit<Comment, 'id' | 'timestamp'>): Comment => {
    const newComment: Comment = {
      ...comment,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };

    if (!mockComments[comment.taskId]) {
      mockComments[comment.taskId] = [];
    }
    
    mockComments[comment.taskId].push(newComment);
    return newComment;
  },

  // Met à jour un commentaire
  update: (taskId: string, commentId: string, updateData: Partial<Comment>): Comment | null => {
    const comments = mockComments[taskId];
    if (!comments) return null;

    const index = comments.findIndex(c => c.id === commentId);
    if (index === -1) return null;

    const updatedComment = { ...comments[index], ...updateData };
    comments[index] = updatedComment;
    
    return updatedComment;
  },

  // Supprime un commentaire
  delete: (taskId: string, commentId: string): boolean => {
    const comments = mockComments[taskId];
    if (!comments) return false;

    const initialLength = comments.length;
    mockComments[taskId] = comments.filter(c => c.id !== commentId);
    
    return mockComments[taskId].length < initialLength;
  }
};
