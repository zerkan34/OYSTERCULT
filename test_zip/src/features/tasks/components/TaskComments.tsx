import React, { useState } from 'react';
import { Send, Paperclip, Image, Smile, Clock, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

  return (
    <div className="space-y-6">
      {/* Liste des commentaires */}
      <div className="space-y-4">
        {mockComments.map((comment) => (
          <div 
            key={comment.id}
            className={`p-4 rounded-lg ${
              comment.type === 'delay' 
                ? 'bg-yellow-500/10 border border-yellow-500/20' 
                : comment.type === 'status_change'
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-white/5'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-brand-burgundy rounded-full flex items-center justify-center">
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
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white">
                      {comment.author.name}
                    </span>
                    <span className="text-white/60 text-sm ml-2">
                      {format(new Date(comment.timestamp), 'PPp', { locale: fr })}
                    </span>
                  </div>
                  {comment.type === 'delay' && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      comment.delayReason?.status === 'approved'
                        ? 'bg-green-500/20 text-green-300'
                        : comment.delayReason?.status === 'rejected'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {comment.delayReason?.status === 'approved'
                        ? 'Retard approuvé'
                        : comment.delayReason?.status === 'rejected'
                        ? 'Retard refusé'
                        : 'En attente'}
                    </span>
                  )}
                </div>

                <p className="text-white/80 mt-2">{comment.content}</p>

                {comment.type === 'delay' && comment.delayReason && (
                  <div className="mt-3 space-y-2">
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
                  <div className="flex flex-wrap gap-2 mt-3">
                    {comment.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-1 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
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
        <form onSubmit={handleDelaySubmit} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h4 className="text-white font-medium mb-4">Signaler un retard</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">
                Retard estimé (heures)
              </label>
              <input
                type="number"
                value={delayHours}
                onChange={(e) => setDelayHours(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">
                Raison du retard
              </label>
              <textarea
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Expliquez la raison du retard..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDelayForm(false)}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors"
              >
                Signaler le retard
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Zone de saisie */}
      <div className="border-t border-white/10 pt-4">
        {!showDelayForm && (
          <button
            onClick={() => setShowDelayForm(true)}
            className="mb-4 px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors"
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
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <button
                type="button"
                className="p-1 text-white/40 hover:text-white transition-colors"
              >
                <Paperclip size={20} />
              </button>
              <button
                type="button"
                className="p-1 text-white/40 hover:text-white transition-colors"
              >
                <Image size={20} />
              </button>
              <button
                type="button"
                className="p-1 text-white/40 hover:text-white transition-colors"
              >
                <Smile size={20} />
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!message.trim()}
              className="flex items-center px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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