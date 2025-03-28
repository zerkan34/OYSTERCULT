import React, { useState } from 'react';
import { Send, Paperclip, Image, Smile, Clock, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './TaskComments.css';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  type: 'comment' | 'delay' | 'status_change';
  attachments?: {
    name: string;
    url: string;
    type: 'image' | 'document';
  }[];
  delayReason?: {
    hours: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
  };
}

interface TaskCommentsProps {
  task: any;
}

const mockComments: Comment[] = [
  {
    id: '1',
    content: 'J\'ai commencé l\'inspection des tables 1 à 3.',
    author: {
      name: 'Jean Dupont'
    },
    timestamp: '2025-02-20T09:00:00',
    type: 'comment'
  },
  {
    id: '2',
    content: 'Je vais avoir du retard à cause d\'un problème technique sur la table 2.',
    author: {
      name: 'Jean Dupont'
    },
    timestamp: '2025-02-20T10:30:00',
    type: 'delay',
    delayReason: {
      hours: 2,
      reason: 'Problème technique sur la table 2 nécessitant une intervention maintenance.',
      status: 'approved'
    }
  },
  {
    id: '3',
    content: 'Retard approuvé. Merci pour la notification rapide.',
    author: {
      name: 'Marie Martin'
    },
    timestamp: '2025-02-20T10:45:00',
    type: 'status_change'
  }
];

export function TaskComments({ task }: TaskCommentsProps) {
  const [message, setMessage] = useState('');
  const [showDelayForm, setShowDelayForm] = useState(false);
  const [delayHours, setDelayHours] = useState('');
  const [delayReason, setDelayReason] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: Implement message sending
    setMessage('');
  };

  const handleDelaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement delay submission
    setShowDelayForm(false);
    setDelayHours('');
    setDelayReason('');
  };

  const taskComments: Comment[] = task.comments ? task.comments.map((comment: any, index: number) => {
    // Vérifier si comment est un objet avec les propriétés attendues
    if (typeof comment === 'object' && comment !== null) {
      return {
        id: index.toString(),
        content: typeof comment.content === 'string' ? comment.content : JSON.stringify(comment.content),
        author: {
          name: typeof comment.author === 'string' ? comment.author : 'Utilisateur'
        },
        timestamp: typeof comment.date === 'string' ? comment.date : new Date().toISOString(),
        type: 'comment',
        attachments: Array.isArray(comment.attachments) ? comment.attachments.map((attachment: string) => ({
          name: attachment,
          url: '#',
          type: 'document'
        })) : []
      };
    } else {
      // Fallback si le commentaire n'est pas un objet valide
      return {
        id: index.toString(),
        content: typeof comment === 'string' ? comment : JSON.stringify(comment),
        author: {
          name: 'Utilisateur'
        },
        timestamp: new Date().toISOString(),
        type: 'comment',
        attachments: []
      };
    }
  }) : [];

  const displayComments = taskComments.length > 0 ? taskComments : mockComments;

  return (
    <div className="task-comments-container mobile-card">
      {/* Liste des commentaires */}
      <div className="space-y-4">
        {displayComments.map((comment) => (
          <div 
            key={comment.id}
            className={`comment-item mobile-fade-in ${
              comment.type === 'delay' 
                ? 'delay' 
                : comment.type === 'status_change'
                ? 'status-change'
                : 'default'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="comment-avatar">
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {comment.author.name.charAt(0)}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="comment-header flex items-center justify-between">
                  <div className="comment-metadata">
                    <span className="font-medium text-white">
                      {comment.author.name}
                    </span>
                    <span className="comment-time text-white/60 text-sm ml-2">
                      {format(new Date(comment.timestamp), 'PPp', { locale: fr })}
                    </span>
                  </div>
                  {comment.type === 'delay' && (
                    <span className={`delay-status ${
                      comment.delayReason?.status === 'approved'
                        ? 'approved'
                        : comment.delayReason?.status === 'rejected'
                        ? 'rejected'
                        : 'pending'
                    }`}>
                      {comment.delayReason?.status === 'approved'
                        ? 'Retard approuvé'
                        : comment.delayReason?.status === 'rejected'
                        ? 'Retard refusé'
                        : 'En attente'}
                    </span>
                  )}
                </div>

                <p className="comment-content">
                  {typeof comment.content === 'string' ? comment.content : JSON.stringify(comment.content)}
                </p>

                {comment.type === 'delay' && comment.delayReason && (
                  <div className="delay-info">
                    <div className="flex items-center text-white/60">
                      <Clock size={16} className="mr-2" />
                      Retard estimé: {comment.delayReason.hours} heures
                    </div>
                    <div className="flex items-center text-white/60">
                      <AlertCircle size={16} className="mr-2" />
                      Raison: {comment.delayReason.reason}
                    </div>
                  </div>
                )}

                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="comment-attachments flex flex-wrap gap-2 mt-3">
                    {comment.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="attachment-item flex items-center px-3 py-1 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {attachment.type === 'image' ? (
                          <Image size={16} className="mr-2" />
                        ) : (
                          <Paperclip size={16} className="mr-2" />
                        )}
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire de retard */}
      {showDelayForm && (
        <form onSubmit={handleDelaySubmit} className="delay-form">
          <h4 className="text-white font-medium mb-4">Signaler un retard</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1" htmlFor="delayHours">
                Retard estimé (heures)
              </label>
              <input
                id="delayHours"
                type="number"
                value={delayHours}
                onChange={(e) => setDelayHours(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                min="0"
                step="0.5"
                aria-label="Retard estimé en heures"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1" htmlFor="delayReason">
                Raison du retard
              </label>
              <textarea
                id="delayReason"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Expliquez la raison du retard..."
                aria-label="Raison du retard"
              />
            </div>
            <div className="delay-form-actions flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDelayForm(false)}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                aria-label="Annuler le signalement de retard"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors"
                aria-label="Confirmer le signalement de retard"
              >
                Signaler le retard
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Zone de saisie */}
      <div className="comment-input-container">
        {!showDelayForm && (
          <button
            onClick={() => setShowDelayForm(true)}
            className="mb-4 px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors"
            aria-label="Signaler un retard"
          >
            Signaler un retard
          </button>
        )}
        
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez un commentaire..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 resize-none"
              rows={3}
              aria-label="Zone de commentaire"
            />
            <div className="input-tools absolute bottom-3 right-3 flex items-center space-x-2">
              <button
                type="button"
                className="p-1 text-white/40 hover:text-white transition-colors"
                aria-label="Joindre un fichier"
              >
                <Paperclip size={20} />
              </button>
              <button
                type="button"
                className="p-1 text-white/40 hover:text-white transition-colors"
                aria-label="Joindre une image"
              >
                <Image size={20} />
              </button>
              <button
                type="button"
                className="p-1 text-white/40 hover:text-white transition-colors"
                aria-label="Insérer un emoji"
              >
                <Smile size={20} />
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!message.trim()}
              className="flex items-center px-4 py-2 bg-gradient-to-br from-rose-600 to-red-800 rounded-lg text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Envoyer le commentaire"
            >
              <Send size={16} className="mr-2" />
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}