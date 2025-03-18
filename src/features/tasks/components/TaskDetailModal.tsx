import React from 'react';
import { X, Star, MessageSquare, Clock, Link2, User, Calendar, MapPin, Flag, ClipboardList, Send } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
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

  return (
    <div className="modal-content">
      {/* En-tête du modal */}
      <div className="relative p-6 border-b border-white/10" 
        style={{ background: 'linear-gradient(to right, rgba(34, 197, 94, 0.1), transparent)' }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <h3 className="text-xl text-white font-semibold">{task.title}</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              <div className={`text-xs px-2.5 py-1 rounded-full ${getPriorityColor(task.priority)} inline-flex items-center gap-1.5`}>
                <Flag className="text-amber-400" size={14} />
                <span>Priorité {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}</span>
              </div>
              <div className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(task.status)} inline-flex items-center gap-1.5`}>
                <Clock className="text-amber-400" size={14} />
                <span>{task.status === 'completed' ? 'Terminée' : task.status === 'in_progress' ? 'En cours' : 'En attente'}</span>
              </div>
              {task.category && (
                <div className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border-indigo-500/30 text-indigo-400 inline-flex items-center gap-1.5">
                  <ClipboardList size={14} />
                  <span>{task.category}</span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {task.description && (
          <p className="text-white/70 text-sm mt-3 leading-relaxed">{task.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {task.dueDate && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Calendar size={16} className="text-indigo-400" />
              <span>Échéance: {format(new Date(task.dueDate), 'd MMMM yyyy', { locale: fr })}</span>
            </div>
          )}
          {task.assignedTo && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <User size={16} className="text-indigo-400" />
              <span>Assignée à: {task.assignedTo}</span>
            </div>
          )}
          {task.location && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <MapPin size={16} className="text-indigo-400" />
              <span>Emplacement: {task.location}</span>
            </div>
          )}
        </div>

        {task.progress !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 bg-gray-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-teal-400 transform-gpu"
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <span className="text-xs text-white/60">{task.progress}%</span>
          </div>
        )}
      </div>

      {/* Section des commentaires */}
      <div className="p-6">
        <div className="flex border-b border-white/10 mb-6">
          <button className="px-4 py-2 font-medium text-sm text-teal-400 border-b-2 border-teal-400">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Commentaires</span>
            </div>
          </button>
          <button className="px-4 py-2 font-medium text-sm text-white/60 hover:text-white/80">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Performance</span>
            </div>
          </button>
        </div>

        {/* Liste des commentaires */}
        <div className="space-y-6">
          {task.comments?.map((comment, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <User size={14} className="text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{comment.author}</div>
                    <div className="text-xs text-white/60">{format(new Date(comment.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400" />
                  <span className="text-xs text-white/60">{comment.rating}/5</span>
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed">{comment.content}</p>

              {comment.attachments && comment.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {comment.attachments.map((attachment, idx) => (
                    <div key={idx} className="text-xs px-2 py-1 rounded bg-white/5 text-white/60 flex items-center gap-1.5">
                      <Link2 size={12} />
                      <span>{attachment}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Zone de commentaire */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <textarea
                  placeholder="Ajouter un commentaire..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
                  rows={3}
                />
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        className="p-1 rounded-full transition-colors text-white/20 hover:text-white/40"
                      >
                        <Star size={16} />
                      </button>
                    ))}
                  </div>
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors bg-white/5 text-white/40 cursor-not-allowed"
                  >
                    <Send size={14} />
                    <span>Envoyer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
