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
  rating?: {
    overall: number;
    details: {
      quality: number;
      delivery: number;
      communication: number;
    };
  };
  attachments?: Array<{
    name: string;
    url?: string;
  }>;
}

interface PurchaseCommentsProps {
  orderId: string;
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
      details: {
        quality: 5,
        delivery: 4,
        communication: 4.5
      }
    }
  }
];

export function PurchaseComments({ orderId }: PurchaseCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<{
    overall: number;
    quality: number;
    delivery: number;
    communication: number;
  }>({
    overall: 0,
    quality: 0,
    delivery: 0,
    communication: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        name: 'Utilisateur',
        avatar: 'https://i.pravatar.cc/40?img=3'
      },
      timestamp: new Date().toISOString(),
      type: 'comment'
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleRatingSubmit = () => {
    const ratingComment: Comment = {
      id: Date.now().toString(),
      content: 'Note ajoutée',
      author: {
        name: 'Utilisateur',
        avatar: 'https://i.pravatar.cc/40?img=3'
      },
      timestamp: new Date().toISOString(),
      type: 'rating',
      rating: {
        overall: rating.overall,
        details: {
          quality: rating.quality,
          delivery: rating.delivery,
          communication: rating.communication
        }
      }
    };

    setComments([...comments, ratingComment]);
    setShowRating(false);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Commentaires</h3>
        <button
          onClick={() => setShowRating(!showRating)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-colors"
          aria-label="Ajouter une note"
        >
          <Star className="w-4 h-4" />
          <span className="text-sm">Noter</span>
        </button>
      </div>

      {showRating && (
        <div className="bg-white/5 rounded-lg p-4 mb-4 space-y-4">
          <div>
            <label className="text-sm text-white/60 block mb-2">Note globale</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating({ ...rating, overall: star })}
                  className={`text-xl ${
                    star <= rating.overall ? 'text-yellow-400' : 'text-gray-400'
                  } hover:text-yellow-400 transition-colors`}
                  aria-label={`Note de ${star} étoiles`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-white/60 block mb-1">Qualité</label>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating({ ...rating, quality: star })}
                    className={`text-sm ${
                      star <= rating.quality ? 'text-yellow-400' : 'text-gray-400'
                    } hover:text-yellow-400 transition-colors`}
                    aria-label={`Note de qualité: ${star} étoiles`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-white/60 block mb-1">Livraison</label>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating({ ...rating, delivery: star })}
                    className={`text-sm ${
                      star <= rating.delivery ? 'text-yellow-400' : 'text-gray-400'
                    } hover:text-yellow-400 transition-colors`}
                    aria-label={`Note de livraison: ${star} étoiles`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-white/60 block mb-1">Communication</label>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating({ ...rating, communication: star })}
                    className={`text-sm ${
                      star <= rating.communication ? 'text-yellow-400' : 'text-gray-400'
                    } hover:text-yellow-400 transition-colors`}
                    aria-label={`Note de communication: ${star} étoiles`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleRatingSubmit}
            className="w-full px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm"
            disabled={rating.overall === 0}
          >
            Enregistrer la note
          </button>
        </div>
      )}

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white/5 rounded-lg p-3"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-white/60" />
                  </div>
                )}
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white text-sm">{comment.author.name}</span>
                  <span className="text-xs text-white/60">
                    {format(new Date(comment.timestamp), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                  </span>
                </div>

                {comment.type === 'rating' && comment.rating && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= comment.rating.overall ? 'text-yellow-400' : 'text-gray-400'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {comment.rating.details && (
                      <div className="grid grid-cols-3 gap-2 mt-1 text-xs text-white/60">
                        <div>Qualité: {comment.rating.details.quality}/5</div>
                        <div>Livraison: {comment.rating.details.delivery}/5</div>
                        <div>Communication: {comment.rating.details.communication}/5</div>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-white/90 text-sm break-words">{comment.content}</p>

                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {comment.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-white/10 rounded px-2 py-0.5 text-xs"
                      >
                        <Image className="w-3 h-3" />
                        <span>{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <div className="flex-grow">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/40 text-white text-sm placeholder-white/40"
            aria-label="Nouveau commentaire"
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          aria-label="Envoyer le commentaire"
        >
          <Send className="w-4 h-4" />
          <span>Envoyer</span>
        </button>
      </form>
    </div>
  );
}

export default PurchaseComments;
