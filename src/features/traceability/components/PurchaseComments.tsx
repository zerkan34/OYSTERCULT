import React, { useState } from 'react';
import { Send, Star, MessageCircle, Image, Smile, User } from 'lucide-react';
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
  type: 'comment' | 'rating';
  attachments?: {
    name: string;
    url: string;
    type: 'image' | 'document';
  }[];
  rating?: {
    overall: number;
    freshness: number;
    quality: number;
    packaging: number;
  };
}

interface PurchaseCommentsProps {
  purchase: any;
  onClose: () => void;
}

const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Produits reçus en excellent état.',
    author: {
      name: 'Jean Dupont'
    },
    timestamp: '2025-02-20T09:00:00',
    type: 'comment'
  },
  {
    id: '2',
    content: 'Évaluation du lot reçu',
    author: {
      name: 'Marie Martin'
    },
    timestamp: '2025-02-20T10:30:00',
    type: 'rating',
    rating: {
      overall: 4.5,
      freshness: 5,
      quality: 4,
      packaging: 4.5
    }
  }
];

export function PurchaseComments({ purchase, onClose }: PurchaseCommentsProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'ratings'>('comments');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState({
    overall: 0,
    freshness: 0,
    quality: 0,
    packaging: 0
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: Implement message sending
    setMessage('');
  };

  const handleRatingChange = (category: keyof typeof rating, value: number) => {
    setRating(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement rating submission
  };

  const renderStars = (value: number, onChange?: (value: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange?.(star)}
            className={`text-lg ${
              star <= value
                ? 'text-yellow-400'
                : 'text-white/20'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="flex space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('comments')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'comments'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <MessageCircle size={16} className="mr-2" />
            Commentaires
          </div>
        </button>
        <button
          onClick={() => setActiveTab('ratings')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'ratings'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Star size={16} className="mr-2" />
            Évaluation
          </div>
        </button>
      </div>

      {activeTab === 'comments' && (
        <>
          {/* Liste des commentaires */}
          <div className="space-y-4">
            {mockComments
              .filter(comment => comment.type === 'comment')
              .map((comment) => (
                <div 
                  key={comment.id}
                  className="p-4 rounded-lg bg-white/5"
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
                      </div>

                      <p className="text-white/80 mt-2">{comment.content}</p>

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
                              <Image size={16} className="mr-2" />
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

          {/* Formulaire de commentaire */}
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 resize-none"
                rows={3}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <button
                  type="button"
                  className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Smile size={20} />
                </button>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </form>
        </>
      )}

      {activeTab === 'ratings' && (
        <div className="space-y-6">
          {/* Évaluations existantes */}
          <div className="space-y-4">
            {mockComments
              .filter(comment => comment.type === 'rating')
              .map((comment) => (
                <div 
                  key={comment.id}
                  className="p-4 rounded-lg bg-white/5"
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
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Note globale</span>
                          {renderStars(comment.rating?.overall || 0)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Fraîcheur</span>
                          {renderStars(comment.rating?.freshness || 0)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Qualité</span>
                          {renderStars(comment.rating?.quality || 0)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Emballage</span>
                          {renderStars(comment.rating?.packaging || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Formulaire d'évaluation */}
          <form onSubmit={handleRatingSubmit} className="bg-white/5 rounded-lg p-4 space-y-4">
            <h4 className="text-white font-medium">Nouvelle évaluation</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Note globale</span>
                {renderStars(rating.overall, (value) => handleRatingChange('overall', value))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Fraîcheur</span>
                {renderStars(rating.freshness, (value) => handleRatingChange('freshness', value))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Qualité</span>
                {renderStars(rating.quality, (value) => handleRatingChange('quality', value))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Emballage</span>
                {renderStars(rating.packaging, (value) => handleRatingChange('packaging', value))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
            >
              Enregistrer l'évaluation
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
