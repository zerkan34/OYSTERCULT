import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Clock, CheckCircle, ChevronDown, Tag, User, Calendar, MapPin, SquarePen, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed';
    date: string;
    assignee: string;
    location: string;
    tags: string[];
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const priorityConfig = {
    high: {
      color: 'text-red-300',
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      gradient: 'from-red-500/10',
    },
    medium: {
      color: 'text-amber-300',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30',
      gradient: 'from-amber-500/10',
    },
    low: {
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      gradient: 'from-emerald-500/10',
    },
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-blue-300',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
      text: 'En attente',
    },
    in_progress: {
      icon: Clock,
      color: 'text-amber-300',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30',
      text: 'En cours',
    },
    completed: {
      icon: CheckCircle,
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'Terminée',
    },
  };

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;

  return (
    <motion.div 
      className="relative overflow-hidden rounded-xl"
      style={{
        background: "linear-gradient(135deg, rgba(10,30,50,0.65) 0%, rgba(20,100,100,0.45) 100%)",
        backdropFilter: "blur(20px)",
        boxShadow: "rgba(0,0,0,0.2) 0px 5px 20px -5px, rgba(0,200,200,0.1) 0px 5px 12px -5px, rgba(255,255,255,0.07) 0px -1px 3px 0px inset, rgba(0,200,200,0.05) 0px 0px 12px inset, rgba(0,0,0,0.1) 0px 0px 8px inset"
      }}
    >
      <div className={`task-card-header bg-gradient-to-r ${priority.gradient} to-transparent`}>
        <div className="flex items-center justify-between p-4">
          <div className={`inline-flex items-center px-2 py-1 rounded-md ${priority.bg} ${priority.border} ${priority.color}`}>
            <Flag className="w-3.5 h-3.5 mr-1" />
            <span className="text-sm font-medium">
              {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center px-2 py-1 rounded-md ${status.bg} ${status.border} ${status.color}`}>
              <StatusIcon className="w-3.5 h-3.5 mr-1" />
              <span className="text-sm font-medium">{status.text}</span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 text-white/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-2">{task.title}</h3>
        <p className="text-white/60 text-sm mb-4">{task.description}</p>

        <div className="flex flex-wrap gap-3 text-sm text-white/60">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            <span>{task.date}</span>
          </div>
          <div className="flex items-center">
            <User className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            <span>{task.assignee}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            <span>{task.location}</span>
          </div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {task.tags.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-white/60 text-sm"
                >
                  <Tag className="w-3 h-3 mr-1.5" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(task.id)}
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-white/5 text-white/80 hover:bg-white/10 transition-colors"
              >
                <SquarePen className="w-3.5 h-3.5 mr-1.5" />
                <span>Modifier</span>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-white/5 text-white/80 hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                <span>Supprimer</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
