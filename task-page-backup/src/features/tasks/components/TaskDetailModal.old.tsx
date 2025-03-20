import React from 'react';
import { X, Star, MessageSquare, Clock, Link2, User, Calendar, MapPin, Flag, ClipboardList, Send } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

const modalVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <motion.div 
        className="w-full max-w-2xl mx-4"
        onClick={e => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
          WebkitBackdropFilter: "blur(16px)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "1rem",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "all 0.2s ease",
          willChange: "transform"
        }}
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/10 rounded-t-2xl backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            {task.title}
          </h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <div className={`text-xs px-2.5 py-1 rounded-full ${getPriorityColor(task.priority)} inline-flex items-center gap-1.5`}>
              <Flag size={14} />
              <span>Priorité {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}</span>
            </div>
            <div className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(task.status)} inline-flex items-center gap-1.5`}>
              <Clock size={14} />
              <span>{task.status === 'completed' ? 'Terminée' : task.status === 'in_progress' ? 'En cours' : 'En attente'}</span>
            </div>
            {task.category && (
              <div className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border-indigo-500/30 text-indigo-400 inline-flex items-center gap-1.5">
                <ClipboardList size={14} />
                <span>{task.category}</span>
              </div>
            )}
          </div>

          {task.description && (
            <p className="text-white/70 text-sm mt-3 leading-relaxed">{task.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="flex border-b border-white/10 mb-6">
            <button className="px-4 py-2 font-medium text-sm text-teal-400 border-b-2 border-teal-400">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Commentaires</span>
              </div>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <textarea 
                  placeholder="Ajouter un commentaire..." 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
                  rows={3}
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button key={rating} className="p-1 rounded-full transition-colors text-white/20 hover:text-white/40">
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
      </motion.div>
    </div>
  );
};
