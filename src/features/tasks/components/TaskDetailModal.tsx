import React, { useState } from 'react';
import { X, Star, MessageSquare, Clock, Link2, User, Calendar, MapPin, Flag, ClipboardList, Send, Edit, Trash2, Tag } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/lib/hooks';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

const modalAnimation = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  content: {
    initial: { opacity: 0, transform: "translateY(30px)" },
    animate: { 
      opacity: 1, 
      transform: "translateY(0)",
      transition: {
        duration: 0.4,
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    },
    exit: { 
      opacity: 0, 
      transform: "translateY(30px)"
    }
  }
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(task.comments || []);
  
  const modalRef = useClickOutside(onClose);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'in_progress':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'pending':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'medium':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'low':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'd MMMM yyyy', { locale: fr });
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      author: 'Utilisateur actuel',  // Normalement, cela viendrait de l'authentification
      content: newComment,
      date: new Date().toISOString(),
      rating: 0
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  return (
    <motion.div
      {...modalAnimation.overlay}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        background: "rgba(0, 0, 0, 0.75)",
        WebkitBackdropFilter: "blur(8px)",
        backdropFilter: "blur(8px)",
        opacity: 1
      }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        {...modalAnimation.content}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl shadow-2xl border border-white/10"
        style={{
          background: "rgba(var(--color-brand-dark), 0.3)",
          WebkitBackdropFilter: "blur(16px)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "border-color 0.2s",
          willChange: "transform, border-color",
          zIndex: 101,
          opacity: 1,
          transform: "translateY(0px)"
        }}
      >
        {/* En-tête avec titre et bouton de fermeture */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">{task.title}</h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Task card body - styled like the example */}
        <div className="p-6 bg-gradient-to-b from-[rgba(0,40,80,0.4)] to-[rgba(0,20,40,0.3)]">
          <div className="task-card-body">
            <h3 className="task-title text-xl font-semibold text-white mb-3">{task.title}</h3>
            
            <p className="task-description text-white/80 text-sm mb-4 leading-relaxed">{task.description}</p>
            
            <div className="task-metadata mb-4">
              {task.dueDate && (
                <div className="metadata-item">
                  <Calendar size={14} className="metadata-icon" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
              
              {task.assignedTo && (
                <div className="metadata-item">
                  <User size={14} className="metadata-icon" />
                  <span>{task.assignedTo}</span>
                </div>
              )}
              
              {task.location && (
                <div className="metadata-item">
                  <MapPin size={14} className="metadata-icon" />
                  <span>{task.location}</span>
                </div>
              )}
            </div>

            <div className="expanded-content expanded">
              {/* Tags section */}
              {(task.category || task.status || task.priority) && (
                <div className="task-tags mb-4">
                  {task.category && (
                    <div className="task-tag">
                      <Tag size={12} />
                      <span>{task.category}</span>
                    </div>
                  )}
                  {task.status && (
                    <div className="task-tag">
                      <Tag size={12} />
                      <span>{task.status === 'completed' ? 'terminé' : task.status === 'in_progress' ? 'en cours' : 'en attente'}</span>
                    </div>
                  )}
                  {task.priority && (
                    <div className="task-tag">
                      <Tag size={12} />
                      <span>{task.priority === 'high' ? 'priorité haute' : task.priority === 'medium' ? 'priorité moyenne' : 'priorité basse'}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="task-actions">
                <button className="task-action-btn edit">
                  <Edit size={14} />
                  <span>Modifier</span>
                </button>
                <button className="task-action-btn delete">
                  <Trash2 size={14} />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="p-6 border-t border-white/10 bg-gradient-to-b from-[rgba(0,40,80,0.2)] to-[rgba(0,20,40,0.1)]">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <MessageSquare size={16} />
            Commentaires
          </h3>
          
          {comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                        {typeof comment.author === 'string' 
                          ? comment.author.substring(0, 1) 
                          : typeof comment.author === 'object' && comment.author !== null && comment.author.name 
                            ? comment.author.name.substring(0, 1) 
                            : '?'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">
                          {typeof comment.author === 'string' 
                            ? comment.author 
                            : typeof comment.author === 'object' && comment.author !== null && comment.author.name
                              ? comment.author.name
                              : 'Utilisateur'}
                        </p>
                        <p className="text-xs text-white/40">
                          {comment.date ? format(new Date(comment.date), 'dd MMM yyyy à HH:mm', { locale: fr }) : ''}
                        </p>
                      </div>
                      <div className="prose prose-sm prose-invert mt-1">
                        <p className="text-white/70 text-sm leading-relaxed">
                          {typeof comment.content === 'string' 
                            ? comment.content 
                            : typeof comment.content === 'object' && comment.content !== null
                              ? JSON.stringify(comment.content)
                              : ''}
                        </p>
                      </div>
                      {/* Évaluation du commentaire */}
                      {comment.rating > 0 && (
                        <div className="mt-2 flex items-center">
                          {[1, 2, 3, 4, 5].map((star, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < comment.rating ? "text-amber-400 fill-amber-400" : "text-white/20"} 
                            />
                          ))}
                        </div>
                      )}
                      {/* Pièces jointes */}
                      {comment.attachments && comment.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {comment.attachments.map((attachment, attachIndex) => (
                            <div key={attachIndex} className="flex items-center text-xs text-blue-400 hover:text-blue-300">
                              <Link2 size={12} className="mr-1" />
                              <a href="#" className="truncate">{attachment}</a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <MessageSquare size={24} className="mx-auto text-white/30 mb-2" />
              <p className="text-white/50 text-sm">Aucun commentaire pour cette tâche</p>
            </div>
          )}
          
          {/* Formulaire d'ajout de commentaire */}
          <div className="mt-4">
            <div className="relative">
              <textarea 
                placeholder="Ajouter un commentaire..." 
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow resize-y min-h-[80px]"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                aria-label="Champ de commentaire"
              />
              <button 
                className="absolute bottom-3 right-3 p-1.5 rounded-full bg-brand-burgundy hover:bg-brand-burgundy/90 text-white transition-colors"
                aria-label="Envoyer le commentaire"
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Performance section - visible only for completed tasks */}
        {task.status === 'completed' && task.performance && (
          <div className="p-6 border-t border-white/10 bg-gradient-to-b from-[rgba(0,40,80,0.2)] to-[rgba(0,20,40,0.1)]">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Star size={16} />
              Évaluation de performance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white/90 mb-3">Performance globale</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Efficacité (Temps estimé vs temps réel)</span>
                      <span>{task.performance.efficiency}%</span>
                    </div>
                    <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${task.performance.efficiency > 80 ? 'bg-green-500' : task.performance.efficiency > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                        style={{ width: `${task.performance.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Qualité</span>
                      <span>{task.performance.quality}%</span>
                    </div>
                    <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${task.performance.quality > 80 ? 'bg-green-500' : task.performance.quality > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${task.performance.quality}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Respect des délais</span>
                      <span>{task.performance.timeliness}%</span>
                    </div>
                    <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${task.performance.timeliness > 80 ? 'bg-green-500' : task.performance.timeliness > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${task.performance.timeliness}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white/90 mb-3">Évaluation</h4>
                
                <div className="flex justify-center items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star 
                      key={rating} 
                      size={28} 
                      className={`${rating <= Math.round((task.performance.efficiency + task.performance.quality + task.performance.timeliness) / 3 / 20) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} 
                    />
                  ))}
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-white/60 mb-1">Score global</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round((task.performance.efficiency + task.performance.quality + task.performance.timeliness) / 3)}%
                  </p>
                  <p className="text-xs mt-1 text-white/60">
                    {task.delay === 0 ? 
                      'Tâche terminée dans les délais' : 
                      `Tâche terminée avec ${task.delay} jour${task.delay > 1 ? 's' : ''} de retard`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
