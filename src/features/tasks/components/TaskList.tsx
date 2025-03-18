import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { 
  Calendar, 
  MapPin, 
  User, 
  Tag, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  PlusCircle,
  Flag,
  MoreHorizontal,
  Hourglass
} from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskDetailModal } from './TaskDetailModal';
import { exampleTasks } from './TaskBlock';
import { AnimatePresence, motion } from 'framer-motion';
import './TaskList.css';
import './TaskCard.css';

// Définition du type Task (à placer dans un fichier types plus tard)
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo?: string;
  category: string;
  location?: string;
  tags?: string[];
  estimatedTime?: number;
  actualTime?: number;
}

interface TaskFormProps {
  onClose: () => void;
  task?: Task;
}

interface TaskListProps {
  searchQuery: string;
  onTaskSelect?: (task: Task) => void;
}

// Styles de priorité avec dégradés
const priorityStyles = {
  high: {
    badgeClass: "text-red-300 bg-red-500/20 border-red-500/30",
    iconColor: "text-red-400",
    gradientClass: "from-red-500/10 to-transparent"
  },
  medium: {
    badgeClass: "text-amber-300 bg-amber-500/20 border-amber-500/30",
    iconColor: "text-amber-400",
    gradientClass: "from-amber-500/10 to-transparent"
  },
  low: {
    badgeClass: "text-green-300 bg-green-500/20 border-green-500/30",
    iconColor: "text-green-400", 
    gradientClass: "from-green-500/10 to-transparent"
  }
};

// Styles de statut avec dégradés
const statusStyles = {
  pending: {
    badgeClass: "text-blue-300 bg-blue-500/20 border-blue-500/30",
    iconColor: "text-blue-400"
  },
  inProgress: {
    badgeClass: "text-amber-300 bg-amber-500/20 border-amber-500/30",
    iconColor: "text-amber-400"
  },
  completed: {
    badgeClass: "text-green-300 bg-green-500/20 border-green-500/30",
    iconColor: "text-green-400"
  },
  cancelled: {
    badgeClass: "text-gray-300 bg-gray-500/20 border-gray-500/30",
    iconColor: "text-gray-400"
  }
};

const modalVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

export function TaskList({ searchQuery, onTaskSelect }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Utilisation des tâches d'exemple au lieu du store
  // const { tasks } = useStore();
  const tasks = exampleTasks;
  
  // Filtrage des tâches basé sur la recherche
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteClick = (taskId: string) => {
    // Logique de suppression à implémenter
    console.log(`Delete task: ${taskId}`);
  };

  const handleStatusUpdate = (taskId: string, newStatus: string) => {
    // Logique de mise à jour du statut à implémenter
    console.log(`Update task ${taskId} status to ${newStatus}`);
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
  };

  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="task-list">
      {filteredTasks.length === 0 ? (
        <div 
          className="empty-task-state"
        >
          <div className="empty-task-icon">
            <PlusCircle size={40} />
          </div>
          <h3 className="empty-task-title">Aucune tâche trouvée</h3>
          <p className="empty-task-text">
            Commencez à ajouter de nouvelles tâches ou modifiez vos critères de recherche.
          </p>
        </div>
      ) : (
        <div 
          className="task-grid"
        >
          {filteredTasks.map(task => {
            const priority = task.priority;
            const status = task.status;
            const isExpanded = expandedTask === task.id;
            
            // Mappage des statuts pour les icônes et styles
            const statusIcon = 
              status === 'completed' ? <CheckCircle size={14} /> : 
              status === 'in_progress' ? <Clock size={14} /> : 
              <Hourglass size={14} />;
            
            const statusText = 
              status === 'completed' ? 'Terminée' : 
              status === 'in_progress' ? 'En cours' : 
              'En attente';
            
            const statusStyleKey = 
              status === 'completed' ? 'completed' : 
              status === 'in_progress' ? 'inProgress' : 
              'pending';
            
            return (
              <div
                key={task.id}
                className="task-card-wrapper"
                onClick={() => openTaskDetails(task)}
              >
                <div className="task-card">
                  {/* En-tête de la carte avec icône de priorité */}
                  <div className={`task-card-header ${priorityStyles[priority].gradientClass}`}>
                    <div className="task-header-content">
                      <div className={`priority-badge ${priorityStyles[priority].badgeClass}`}>
                        <Flag size={14} />
                        <span>
                          {priority === 'high' ? 'Haute' : priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                      </div>
                      
                      <div className="task-status">
                        <div className={`status-badge ${statusStyles[statusStyleKey as keyof typeof statusStyles].badgeClass}`}>
                          {statusIcon}
                          <span>{statusText}</span>
                        </div>
                      </div>
                      
                      <button 
                        className="expand-task-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskExpansion(task.id);
                        }}
                      >
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        />
                      </button>
                    </div>
                  </div>
                  
                  {/* Corps de la carte */}
                  <div className="task-card-body">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                    
                    {/* Métadonnées de la tâche */}
                    <div className="task-metadata">
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
                    
                    {/* Expanded content with actions */}
                    <div className={`expanded-content ${isExpanded ? 'expanded' : ''}`}>
                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="task-tags">
                          {task.tags.map((tag, idx) => (
                            <div key={idx} className="task-tag">
                              <Tag size={12} />
                              <span>{tag}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="task-actions">
                        <button 
                          className="task-action-btn edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(task);
                          }}
                        >
                          <Edit size={14} />
                          <span>Modifier</span>
                        </button>
                        
                        <button 
                          className="task-action-btn delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(task.id);
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Modal de détails de tâche */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTask(null)}
          >
            <motion.div 
              className="modal-content"
              onClick={e => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TaskDetailModal
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Formulaire d'édition */}
      {editingTask && (
        <TaskForm 
          onClose={() => setEditingTask(null)} 
          task={editingTask}
        />
      )}
    </div>
  );
}