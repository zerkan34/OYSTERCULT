import React, { useState } from 'react';
import { 
  ListTodo, 
  Calendar, 
  Flag, 
  Clock, 
  User, 
  Info, 
  ArrowUpRight,
  ChevronRight, 
  CheckCircle,
  Hourglass,
  AlertCircle,
  Tag,
  Plus,
  MapPin
} from 'lucide-react';
import { TaskDetailModal } from './TaskDetailModal';
import './TaskBlock.css';

// Interface pour le type Task
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  category: string;
  assignedTo?: string;
  estimatedTime?: number;
  actualTime?: number;
  dependencies?: string[];
  tags?: string[];
  autoScore?: number;
  lastActivity?: string;
  location?: string;
}

interface TaskBlockProps {
  title?: string;
  tasks: Task[];
  limit?: number;
  showAddButton?: boolean;
  onAddTask?: () => void;
}

// Données d'exemple pour les tâches
export const exampleTasks: Task[] = [
  {
    id: '1',
    title: 'Inspection des huîtres',
    description: 'Vérification de la qualité et de la taille des huîtres dans le parc A.',
    priority: 'high',
    status: 'pending',
    dueDate: '2025-03-15',
    category: 'Qualité',
    assignedTo: 'Jean Dupont',
    estimatedTime: 3,
    location: 'Parc A - Zone Nord',
    tags: ['inspection', 'qualité', 'huîtres']
  },
  {
    id: '2',
    title: 'Maintenance des poches',
    description: 'Entretien et rotation des poches d\'huîtres pour optimiser la croissance.',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2025-03-14',
    category: 'Maintenance',
    assignedTo: 'Marie Martin',
    estimatedTime: 5,
    location: 'Parc B - Filière 3',
    tags: ['maintenance', 'poches', 'rotation']
  },
  {
    id: '3',
    title: 'Analyse de l\'eau',
    description: 'Prélèvement et analyse des échantillons d\'eau pour surveiller la qualité du milieu.',
    priority: 'medium',
    status: 'completed',
    dueDate: '2025-03-10',
    category: 'Environnement',
    assignedTo: 'Sophie Bernard',
    estimatedTime: 2,
    actualTime: 1.5,
    location: 'Laboratoire',
    tags: ['analyse', 'eau', 'qualité']
  },
  {
    id: '4',
    title: 'Préparation commandes',
    description: 'Préparation des commandes pour livraison aux restaurants locaux.',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2025-03-13',
    category: 'Logistique',
    assignedTo: 'Thomas Leroy',
    estimatedTime: 4,
    location: 'Zone de conditionnement',
    tags: ['commandes', 'livraison', 'restaurants']
  },
  {
    id: '5',
    title: 'Contrôle des naissains',
    description: 'Vérification de la croissance des naissains et ajustement des conditions.',
    priority: 'low',
    status: 'pending',
    dueDate: '2025-03-18',
    category: 'Production',
    assignedTo: 'Julie Moreau',
    estimatedTime: 3,
    location: 'Écloserie',
    tags: ['naissains', 'croissance', 'surveillance']
  }
];

// Styles pour les priorités
const priorityStyles = {
  high: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    color: 'text-red-400',
    icon: <Flag size={14} className="text-red-400" />
  },
  medium: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    color: 'text-amber-400',
    icon: <Flag size={14} className="text-amber-400" />
  },
  low: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    color: 'text-emerald-400',
    icon: <Flag size={14} className="text-emerald-400" />
  }
};

// Styles pour les statuts
const statusStyles = {
  pending: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    color: 'text-slate-400',
    icon: <Hourglass size={14} className="text-slate-400" />
  },
  in_progress: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    color: 'text-blue-400',
    icon: <AlertCircle size={14} className="text-blue-400" />
  },
  completed: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    color: 'text-emerald-400',
    icon: <CheckCircle size={14} className="text-emerald-400" />
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  }
};

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short'
  }).format(date);
};

export function TaskBlock({ title = "Tâches récentes", tasks, limit = 3, showAddButton = true, onAddTask }: TaskBlockProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const displayTasks = tasks.slice(0, limit);

  return (
    <>
      <div
        className="task-block"
        style={{
          opacity: 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        {/* En-tête avec titre */}
        <div className="task-block-header">
          <div className="header-content">
            <h2 className="block-title">
              {title}
            </h2>
            {showAddButton && (
              <button
                className="add-button"
                style={{
                  transform: 'translateY(0)',
                  transition: 'transform 0.2s ease-in-out'
                }}
                onClick={onAddTask}
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="task-block-content">
          {/* Liste des tâches */}
          <div className="task-list-container">
            {displayTasks.length === 0 ? (
              <div className="empty-state">
                <p>Aucune tâche trouvée</p>
              </div>
            ) : (
              displayTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="task-item"
                  style={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
                  }}
                  onClick={() => setSelectedTask(task)}
                >
                  {/* Contenu principal de la tâche */}
                  <div className="task-content">
                    <div className="task-header">
                      <span className={`category-badge ${task.priority === 'high' ? 'bg-red-500/10' : task.priority === 'medium' ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                        {task.category}
                      </span>
                      
                      <span className={`status-badge ${task.status === 'pending' ? 'status-pending' : task.status === 'in_progress' ? 'status-progress' : 'status-completed'}`}>
                        {task.status === 'pending' ? 'À faire' : task.status === 'in_progress' ? 'En cours' : 'Terminé'}
                      </span>
                    </div>
                    
                    <h3 className="task-title">{task.title}</h3>
                    
                    <div className="task-info-container">
                      <div className="task-info">
                        <div className="info-item">
                          <User size={14} className="info-icon" />
                          <span>{task.assignedTo}</span>
                        </div>
                        
                        <div className="info-item">
                          <Calendar size={14} className="info-icon" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                        
                        {task.location && (
                          <div className="info-item">
                            <MapPin size={14} className="info-icon" />
                            <span>{task.location}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Flèche d'action */}
                      <div className="action-arrow">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pied de page avec lien "Voir tout" */}
          {tasks.length > limit && (
            <div 
              className="view-all-button"
              style={{
                transform: 'translateX(0)',
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              <span>Voir toutes les tâches</span>
              <ArrowUpRight size={14} />
            </div>
          )}
        </div>
      </div>

      {/* Modal de détail de tâche */}
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={(task) => console.log('Éditer la tâche:', task)}
        />
      )}
    </>
  );
}
