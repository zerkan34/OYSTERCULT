import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp,
  MoreVertical, 
  Edit, 
  Trash2, 
  Tag,
  Hourglass,
  X,
  Star,
  MessageSquare,
  AlertCircle,
  Clock as ClockIcon,
  User,
  MapPin,
  Flag,
  CheckCircle,
  CircleDashed,
  CircleEllipsis,
  PlusCircle,
  Info
} from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskDetailModal } from './TaskDetailModal';
import { AnimatePresence, motion } from 'framer-motion';
import './TaskList.css';
import './TaskCard.css';
import './modals.css';

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
  comments?: {
    author: string;
    content: string;
    date: string;
    rating: number;
    attachments?: string[];
  }[];
  delay?: number;
  performance?: {
    efficiency: number; // pourcentage d'efficacité (temps estimé vs réel)
    quality: number;    // pourcentage de qualité 
    timeliness: number // respect des délais
  }
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
  low: {
    badgeClass: "text-green-300 bg-green-500/20 border-green-500/30",
    iconColor: "text-green-400", 
    gradientClass: "from-green-500/10 to-transparent"
  },
  medium: {
    badgeClass: "text-amber-300 bg-amber-500/20 border-amber-500/30",
    iconColor: "text-amber-400",
    gradientClass: "from-amber-500/10 to-transparent"
  },
  high: {
    badgeClass: "text-red-300 bg-red-500/20 border-red-500/30",
    iconColor: "text-red-400",
    gradientClass: "from-red-500/10 to-transparent"
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/20 text-red-400';
    case 'medium':
      return 'bg-amber-500/20 text-amber-400';
    case 'low':
      return 'bg-green-500/20 text-green-400';
    default:
      return '';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-blue-500/20 text-blue-400';
    case 'in_progress':
      return 'bg-amber-500/20 text-amber-400';
    case 'completed':
      return 'bg-green-500/20 text-green-400';
    default:
      return '';
  }
};

export const exampleTasks: Task[] = [
  {
    id: '1',
    title: 'Nettoyage des poches d\'huîtres',
    description: 'Nettoyer les poches d\'huîtres dans la zone A pour éliminer les algues et sédiments. Vérifier l\'état des attaches.',
    status: 'completed',
    priority: 'medium',
    dueDate: '2023-09-15',
    assignedTo: 'Thomas Moreau',
    category: 'Entretien',
    location: 'Zone A - Parc 3',
    tags: ['Nettoyage', 'Poches'],
    estimatedTime: 6,
    actualTime: 5,
    comments: [
      { author: 'Jean Dupont', content: 'J\'ai remarqué que les attaches des poches 45 à 52 sont usées et devront être remplacées prochainement.', date: '2023-09-10T14:30:00', rating: 4, attachments: [] },
      { author: 'Thomas Moreau', content: 'Nettoyage terminé avec efficacité. J\'ai également remplacé quelques attaches qui étaient trop abîmées.', date: '2023-09-12T09:45:00', rating: 5, attachments: ['rapport-entretien.pdf'] }
    ],
    delay: 0,
    performance: {
      efficiency: 100,
      quality: 92,    
      timeliness: 100
    }
  },
  {
    id: '2',
    title: 'Retournement des poches d\'huîtres',
    description: 'Retourner les poches dans les parcs 5 à 8 pour assurer une croissance uniforme des huîtres et réduire les déformations.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2023-09-25',
    assignedTo: 'Marie Lefèvre',
    category: 'Manipulation',
    location: 'Zone B - Parcs 5-8',
    tags: ['Retournement', 'Croissance'],
    estimatedTime: 10,
    actualTime: 8,
    comments: [
      { author: 'Marie Lefèvre', content: 'Les parcs 5 et 6 sont terminés. J\'ai remarqué une forte présence de naissain naturel sur certaines poches.', date: '2023-09-18T10:15:00', rating: 3, attachments: ['observations.jpg'] }
    ],
    delay: 0,
    performance: {
      efficiency: 70,
      quality: 85,
      timeliness: 90
    }
  },
  {
    id: '3',
    title: 'Tri et calibrage des huîtres',
    description: 'Trier et calibrer les huîtres du lot 2023-B pour séparer les différentes tailles et déterminer celles prêtes pour la vente.',
    status: 'pending',
    priority: 'medium',
    dueDate: '2023-09-30',
    assignedTo: 'Pierre Dubois',
    category: 'Tri',
    location: 'Atelier principal',
    tags: ['Calibrage', 'Tri', 'Vente'],
    estimatedTime: 8,
    actualTime: 0,
    comments: [
      { author: 'Pierre Dubois', content: 'J\'ai préparé la zone de tri et vérifié l\'état de la calibreuse automatique.', date: '2023-09-17T11:00:00', rating: 0, attachments: ['vérification-machine.pdf'] }
    ],
    delay: 0
  },
  {
    id: '4',
    title: 'Mise en claire des huîtres spéciales',
    description: 'Transférer les huîtres spéciales sélectionnées vers les claires pour l\'affinage avant la période de fêtes. Vérifier la salinité et le phytoplancton.',
    status: 'pending',
    priority: 'low',
    dueDate: '2023-10-05',
    assignedTo: 'Sophie Martin',
    category: 'Affinage',
    location: 'Claires - Marais Est',
    tags: ['Affinage', 'Spéciales', 'Préparation fêtes'],
    estimatedTime: 5,
    actualTime: 0,
    comments: []
  }
];

export function TaskList({ searchQuery, onTaskSelect }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isResponsive, setIsResponsive] = useState(false);
  const [taskCardRefs, setTaskCardRefs] = useState<{ [key: string]: React.RefObject<HTMLDivElement> }>({});
  const [delayReason, setDelayReason] = useState('');
  const [delayDuration, setDelayDuration] = useState('');
  const [showPerformanceIndicator, setShowPerformanceIndicator] = useState(true);
  const [taskPosition, setTaskPosition] = useState({ top: 0, left: 0 });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  // Utilisation des tâches d'exemple au lieu du store
  // const { tasks } = useStore();
  const [tasks, setTasks] = useState<Task[]>(exampleTasks);
  
  // Filtrer les tâches en fonction de la recherche
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [tasks, searchQuery]);
  
  // Générer un pourcentage de rendement basé sur le temps prévu vs réel
  const getTimeEfficiency = (taskId: string) => {
    // Récupérer la tâche
    const task = filteredTasks.find(t => t.id === taskId);
    if (!task) return 0;
    
    const estimatedHours = task.estimatedTime || 8;
    const completedHours = task.actualTime || (Math.random() * estimatedHours * 1.5);
    
    // Calcul du pourcentage de rendement
    // Si complété en avance: > 100%
    // Si complété dans les temps: 100%
    // Si retard: diminution progressive selon l'ampleur du retard
    let efficiency = 0;
    
    if (completedHours < estimatedHours) {
      // Terminé en avance - calculer le % d'efficacité (par exemple, 5h au lieu de 6h = 120%)
      efficiency = Math.round((estimatedHours / completedHours) * 100);
    } else if (completedHours === estimatedHours) {
      // Terminé exactement dans les temps
      efficiency = 100;
    } else {
      // Terminé en retard
      // 2 heures de retard = mauvais rendement
      const delayRatio = completedHours / estimatedHours;
      if (delayRatio <= 1.1) {
        // Retard jusqu'à 10% du temps estimé (acceptable)
        efficiency = 90;
      } else if (delayRatio <= 1.25) {
        // Retard jusqu'à 25% du temps estimé
        efficiency = 75;
      } else if (delayRatio <= 1.5) {
        // Retard jusqu'à 50% du temps estimé
        efficiency = 60;
      } else if (delayRatio <= 2) {
        // Retard jusqu'à 100% du temps estimé (double du temps)
        efficiency = 40;
      } else {
        // Retard supérieur au double du temps estimé
        efficiency = 20;
      }
    }
    
    // Arrondir à l'entier le plus proche
    return Math.round(efficiency);
  };
  
  // Obtenir la couleur pour le pourcentage de rendement
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 100) return 'text-green-500';
    if (efficiency >= 90) return 'text-green-500';
    if (efficiency >= 75) return 'text-green-400';
    if (efficiency >= 60) return 'text-yellow-400';
    if (efficiency >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prevExpandedTasks => {
      // Si la tâche est déjà développée, la retirer du tableau
      if (prevExpandedTasks.includes(taskId)) {
        return prevExpandedTasks.filter(id => id !== taskId);
      } 
      // Sinon, l'ajouter au tableau
      else {
        return [...prevExpandedTasks, taskId];
      }
    });
  };

  // Fonction pour gérer le clic sur le bouton d'édition
  const handleEditClick = (task: Task, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    // Définir immédiatement la tâche en cours d'édition pour ouvrir la modale
    setEditingTask(task);
    
    // Capture de la position du bouton Modifier pour positionner la modale
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTaskPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      });
    } else if (taskCardRefs[task.id] && taskCardRefs[task.id].current) {
      // Fallback si l'événement n'est pas disponible
      const rect = taskCardRefs[task.id].current!.getBoundingClientRect();
      setTaskPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  };

  const handleDeleteClick = (taskId: string) => {
    // Afficher la confirmation avant de supprimer
    setTaskToDelete(taskId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      // Supprimer la tâche de la liste des tâches
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
      
      // Si la tâche supprimée était sélectionnée, réinitialiser la sélection
      if (selectedTask && selectedTask.id === taskToDelete) {
        setSelectedTask(null);
      }
      
      // Si la tâche supprimée était en cours d'édition, fermer la modale d'édition
      if (editingTask && editingTask.id === taskToDelete) {
        setEditingTask(null);
      }
      
      console.log(`Task deleted: ${taskToDelete}`);
      
      // Réinitialiser l'état de confirmation
      setShowDeleteConfirmation(false);
      setTaskToDelete(null);
    }
  };

  const cancelDeleteTask = () => {
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  const handleStatusUpdate = (taskId: string, newStatus: string) => {
    // Logique de mise à jour du statut à implémenter
    console.log(`Update task ${taskId} status to ${newStatus}`);
  };

  const handleTaskClick = (task: Task) => {
    if (isResponsive) {
      setCurrentTaskId(task.id);
    }
    // setSelectedTask(task);
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

  // Gestionnaires pour commentaires et retards
  const handleOpenCommentModal = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTaskId(taskId);
    setCommentModalOpen(true);
  };

  const handleOpenDelayModal = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTaskId(taskId);
    setDelayModalOpen(true);
  };

  const handleCloseModal = (e: React.MouseEvent | null, setter: React.Dispatch<React.SetStateAction<boolean>> | React.Dispatch<React.SetStateAction<Task | null>>) => {
    if (e) e.stopPropagation();
    if (typeof setter === 'function') {
      if (setter === setSelectedTask || setter === setEditingTask) {
        setter(null);
      } else {
        setter(false as never);
      }
    }
  };

  const handleCloseEditModal = (e: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setEditingTask(null);
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSubmitComment = () => {
    if (currentTaskId && currentComment) {
      console.log(`Commentaire ajouté pour la tâche ${currentTaskId}:`, currentComment);
      // Logique pour sauvegarder le commentaire
      setCurrentComment('');
      setCommentModalOpen(false);
    }
  };

  const handleSubmitDelay = () => {
    if (currentTaskId && delayReason) {
      console.log(`Retard signalé pour la tâche ${currentTaskId}:`, {
        raison: delayReason,
        durée: delayDuration
      });
      // Logique pour sauvegarder l'information sur le retard
      setDelayReason('');
      setDelayDuration('');
      setDelayModalOpen(false);
    }
  };

  // Initialiser les refs pour chaque carte de tâche
  useEffect(() => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement> } = {};
    filteredTasks.forEach(task => {
      refs[task.id] = React.createRef<HTMLDivElement>();
    });
    setTaskCardRefs(refs);
  }, [filteredTasks]);

  // Détecter si l'écran est en mode responsive
  useEffect(() => {
    const checkResponsive = () => {
      setIsResponsive(window.innerWidth <= 768);
    };
    
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    
    return () => {
      window.removeEventListener('resize', checkResponsive);
    };
  }, []);

  // Condition pour afficher les modales normales ou responsives
  const shouldShowNormalModals = !isResponsive;

  // Fonction pour calculer la position optimale de la modale
  const calculateModalPosition = (position: { top: number, left: number }) => {
    // Dans notre cas, les positions sont maintenant gérées par CSS
    // Cette fonction est maintenue pour la compatibilité avec le code existant
    return { top: 0, left: 0 };
  };

  return (
    <div className={`task-list ${isResponsive ? 'isResponsive' : ''}`}>
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
        <div className="task-grid">
          {filteredTasks.map(task => {
            const priority = task.priority;
            const status = task.status;
            const isExpanded = expandedTasks.includes(task.id);
            
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
                ref={taskCardRefs[task.id]}
              >
                {/* Modales responsives à l'intérieur des cartes */}
                {isResponsive && currentTaskId === task.id && (
                  <>
                    {/* Modale de commentaire en responsive */}
                    {commentModalOpen && (
                      <div 
                        className="modal-responsive-container"
                        onClick={(e) => handleCloseModal(e, setCommentModalOpen)}
                      >
                        <div 
                          className="modal-responsive-content"
                          onClick={handleModalContentClick}
                        >
                          <div className="modal-responsive-header">
                            <h3>Ajouter un commentaire</h3>
                            <button 
                              onClick={(e) => handleCloseModal(e, setCommentModalOpen)} 
                              className="modal-responsive-close"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          
                          <div className="p-4">
                            <textarea
                              value={currentComment}
                              onChange={(e) => setCurrentComment(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white resize-none h-32"
                              placeholder="Écrivez votre commentaire ici..."
                            />
                            
                            <div className="flex justify-end mt-4">
                              <button 
                                onClick={(e) => handleCloseModal(e, setCommentModalOpen)} 
                                className="px-4 py-2 text-white/80 hover:text-white mr-2"
                              >
                                Annuler
                              </button>
                              <button 
                                onClick={handleSubmitComment} 
                                className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 disabled:opacity-50"
                                disabled={!currentComment.trim()}
                              >
                                Envoyer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Modale de retard en responsive */}
                    {delayModalOpen && (
                      <div 
                        className="modal-responsive-container"
                        onClick={(e) => handleCloseModal(e, setDelayModalOpen)}
                      >
                        <div 
                          className="modal-responsive-content"
                          onClick={handleModalContentClick}
                        >
                          <div className="modal-responsive-header">
                            <h3>Signaler un retard</h3>
                            <button 
                              onClick={(e) => handleCloseModal(e, setDelayModalOpen)} 
                              className="modal-responsive-close"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          
                          <div className="p-4">
                            <div className="mb-4">
                              <label className="block text-white mb-2">Raison du retard</label>
                              <textarea
                                value={delayReason}
                                onChange={(e) => setDelayReason(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white resize-none h-20"
                                placeholder="Expliquez la raison du retard..."
                              />
                            </div>
                            
                            <div className="mb-4">
                              <label className="block text-white mb-2">Durée estimée du retard</label>
                              <input
                                type="text"
                                value={delayDuration}
                                onChange={(e) => setDelayDuration(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                                placeholder="Exemple: 3 jours, 2 semaines, etc."
                              />
                            </div>
                            
                            <div className="flex justify-end mt-4">
                              <button 
                                onClick={(e) => handleCloseModal(e, setDelayModalOpen)} 
                                className="px-4 py-2 text-white/80 hover:text-white mr-2"
                              >
                                Annuler
                              </button>
                              <button 
                                onClick={handleSubmitDelay} 
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                                disabled={!delayReason.trim()}
                              >
                                Signaler
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Modale de détail de tâche en responsive */}
                    {/* Commenté temporairement
                    {selectedTask && selectedTask.id === task.id && (
                      <div 
                        className="modal-responsive-container"
                        onClick={(e) => handleCloseModal(e, setSelectedTask)}
                      >
                        <div 
                          className="modal-responsive-content"
                          onClick={handleModalContentClick}
                        >
                          <div className="modal-responsive-header">
                            <h3>Détails de la tâche</h3>
                            <button 
                              onClick={(e) => handleCloseModal(e, setSelectedTask)} 
                              className="modal-responsive-close"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          
                          <div className="p-4">
                            <TaskDetailModal 
                              task={selectedTask}
                              onClose={() => handleCloseModal(null, setSelectedTask)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    */}
                    
                    <AnimatePresence>
                      {editingTask && editingTask.id === task.id && (
                        <motion.div 
                          className="modal-responsive-container edit-modal-responsive"
                          onClick={handleCloseEditModal}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.div 
                            className="modal-responsive-content edit-modal-responsive-content"
                            onClick={handleModalContentClick}
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <div className="modal-responsive-header">
                              <h3>Modifier la tâche</h3>
                              <button 
                                onClick={handleCloseEditModal} 
                                className="modal-responsive-close"
                              >
                                <X size={20} />
                              </button>
                            </div>
                            
                            <div className="p-4">
                              <TaskForm 
                                onClose={handleCloseEditModal} 
                                task={editingTask}
                              />
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
                
                <div className="task-card" onClick={() => handleTaskClick(task)}>
                  {/* En-tête de la carte avec icône de priorité */}
                  <div className={`task-card-header ${priorityStyles[priority].gradientClass}`}>
                    <div className="task-header-content">
                      {task.status === 'completed' && (
                        <div className="ml-2 flex items-center">
                          <div className="efficiency-indicator flex items-center" title="Pourcentage de rendement basé sur le temps">
                            <span className="text-xs text-white/60 mr-1">Rendement:</span>
                            <span className={`text-sm font-medium ${getEfficiencyColor(getTimeEfficiency(task.id))}`}>
                              {getTimeEfficiency(task.id)}%
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="status-container">
                        <div className={`status-badge ${statusStyles[statusStyleKey as keyof typeof statusStyles].badgeClass}`}>
                          <span>{statusText}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          className="comment-btn p-1.5 rounded-full hover:bg-white/10 transition-colors"
                          onClick={(e) => handleOpenCommentModal(task.id, e)}
                          aria-label="Ajouter un commentaire"
                          title="Ajouter un commentaire"
                        >
                          <MessageSquare 
                            size={16} 
                            className="text-blue-400" 
                          />
                        </button>
                        
                        <button 
                          className="delay-btn icon-only p-1.5 rounded-full hover:bg-white/10 transition-colors flex items-center mr-1"
                          onClick={(e) => handleOpenDelayModal(task.id, e)}
                          aria-label="Signaler un retard"
                          title="Signaler un retard"
                        >
                          <AlertCircle 
                            size={16} 
                            className="text-amber-400" 
                          />
                        </button>
                        
                        <button 
                          className="expand-task-btn p-1.5 rounded-full hover:bg-white/10 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskExpansion(task.id);
                          }}
                          aria-label={isExpanded ? "Réduire" : "Développer"}
                        >
                          {isExpanded ? (
                            <ChevronUp 
                              className="transition-transform duration-200" 
                              size={16} 
                            />
                          ) : (
                            <ChevronDown 
                              className="transition-transform duration-200" 
                              size={16} 
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Corps de la carte */}
                  <div className={`task-card-body ${isExpanded ? 'expanded' : ''}`}>
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                    
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

                    {/* Contenu étendu (tags et actions) */}
                    <div className={`expanded-content ${isExpanded ? 'expanded' : ''}`}>
                      <div className="task-tags">
                        {task.category && (
                          <div className="task-tag">
                            <Tag size={12} />
                            <span>{task.category}</span>
                          </div>
                        )}
                        {task.title.toLowerCase().includes('inspection') && (
                          <div className="task-tag">
                            <Tag size={12} />
                            <span>inspection</span>
                          </div>
                        )}
                        {task.title.toLowerCase().includes('qualité') || task.description?.toLowerCase().includes('qualité') && (
                          <div className="task-tag">
                            <Tag size={12} />
                            <span>qualité</span>
                          </div>
                        )}
                        {task.title.toLowerCase().includes('huître') || task.description?.toLowerCase().includes('huître') && (
                          <div className="task-tag">
                            <Tag size={12} />
                            <span>huîtres</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="task-actions flex flex-col gap-2 w-full">
                        <div className="flex justify-between w-full gap-2">
                          <button 
                            className="delay-btn comment-btn p-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center w-1/2"
                            onClick={(e) => handleOpenCommentModal(task.id, e)}
                            aria-label="Commenter"
                            title="Commenter"
                          >
                            <MessageSquare 
                              size={16} 
                              className="text-blue-400 mr-2" 
                            />
                            <span className="text-s">Commenter</span>
                          </button>
                          <button 
                            className="delay-btn p-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center w-1/2"
                            onClick={(e) => handleOpenDelayModal(task.id, e)}
                            aria-label="Signaler un retard"
                            title="Signaler un retard"
                          >
                            <AlertCircle 
                              size={16} 
                              className="text-amber-400 mr-2" 
                            />
                            <span className="text-s">Signaler un retard</span>
                          </button>
                        </div>
                        <div className="flex justify-between w-full gap-2">
                          <button 
                            className="task-action-btn edit w-1/2" 
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleEditClick(task, e);
                            }}
                          >
                            <Edit size={14} />
                            <span>Modifier</span>
                          </button>
                          <button 
                            className="task-action-btn delete w-1/2" 
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
                    
                    <div className="performance-details">
                      {isExpanded && task.status === 'completed' && (
                        <div className="bg-white/5 mt-3 p-3 rounded-lg border border-white/10">
                          <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                            <ClockIcon size={14} className="mr-1.5 text-yellow-400" />
                            Évaluation du temps de réalisation
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-white/60 mb-1">Temps prévu</div>
                              <div className="text-sm text-white">{task.estimatedTime || 8} heures</div>
                            </div>
                            
                            <div>
                              <div className="text-xs text-white/60 mb-1">Temps réel</div>
                              <div className="text-sm text-white">{task.actualTime || Math.round((Math.random() * 0.5 + 0.75) * (task.estimatedTime || 8) * 10) / 10} heures</div>
                            </div>
                            
                            <div className="sm:col-span-2">
                              <div className="text-xs text-white/60 mb-1">Rendement</div>
                              <div className="flex items-center">
                                <div className="w-full bg-white/10 h-2 rounded-full">
                                  <div 
                                    className="h-full rounded-full bg-green-500"
                                    style={{ width: `${Math.min(100, getTimeEfficiency(task.id))}%` }}
                                  ></div>
                                </div>
                                <span className={`ml-2 text-sm font-medium ${getEfficiencyColor(getTimeEfficiency(task.id))}`}>
                                  {getTimeEfficiency(task.id)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
        {/* Commenté temporairement
        {selectedTask && shouldShowNormalModals && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 motion-div-overlay task-list-container-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => handleCloseModal(e, setSelectedTask)}
          >
            <motion.div 
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TaskDetailModal
                task={selectedTask}
                onClose={() => handleCloseModal(null, setSelectedTask)}
              />
            </motion.div>
          </motion.div>
        )}
        */}
      </AnimatePresence>
      
      {/* Formulaire d'édition */}
      <AnimatePresence>
        {editingTask && shouldShowNormalModals && (
          <motion.div 
            className="fixed inset-0 bg-black/70 z-50 motion-div-overlay task-list-container-modal edit-task-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => handleCloseModal(e, setEditingTask)}
          >
            <motion.div 
              className="p-4 sm:p-6 rounded-lg max-w-2xl w-full mx-2 sm:mx-4 overflow-hidden border border-white/10 border-t-white/20 border-l-white/20 edit-modal-content task-list-container-modal-content"
              style={{
                background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
                backdropFilter: "blur(10px)",
                boxShadow: "rgba(0, 0, 0, 0.45) 10px 0px 30px -5px, rgba(0, 150, 255, 0.1) 5px 5px 20px -5px, rgba(255, 255, 255, 0.15) 0px -1px 5px 0px inset, rgba(0, 210, 200, 0.25) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset",
              }}
              onClick={handleModalContentClick}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Effet de contour lumineux */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur-lg opacity-70 pointer-events-none"></div>
              
              <div className="relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-medium">Modifier la tâche</h3>
                  <button onClick={() => handleCloseModal(null, setEditingTask)} className="text-white/60 hover:text-white min-w-[44px] min-h-[44px] p-2 flex items-center justify-center">
                    <X size={20} />
                  </button>
                </div>
                <TaskForm 
                  onClose={() => handleCloseModal(null, setEditingTask)} 
                  task={editingTask}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modal pour ajouter un commentaire */}
      {commentModalOpen && shouldShowNormalModals && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 motion-div-overlay task-list-container-modal" onClick={() => handleCloseModal(null, setCommentModalOpen)}>
          <div 
            className="border border-white/10 rounded-lg p-4 w-full max-w-md mx-4"
            style={{ 
              background: "linear-gradient(135deg, rgb(0, 10, 40) 0%, rgb(0, 128, 128) 100%)",
              boxShadow: "rgba(0, 0, 0, 0.45) 10px 0px 30px -5px, rgba(0, 0, 0, 0.3) 5px 5px 20px -5px, rgba(255, 255, 255, 0.15) 0px -1px 5px 0px inset, rgba(0, 210, 200, 0.25) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-medium">Ajouter un commentaire</h3>
              <button onClick={() => handleCloseModal(null, setCommentModalOpen)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <textarea
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white resize-none h-32"
              placeholder="Écrivez votre commentaire ici..."
            />
            
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => handleCloseModal(null, setCommentModalOpen)} 
                className="px-4 py-2 text-white/80 hover:text-white mr-2"
              >
                Annuler
              </button>
              <button 
                onClick={handleSubmitComment} 
                className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 disabled:opacity-50"
                disabled={!currentComment.trim()}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal pour signaler un retard */}
      {delayModalOpen && shouldShowNormalModals && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 motion-div-overlay task-list-container-modal" onClick={() => handleCloseModal(null, setDelayModalOpen)}>
          <div 
            className="border border-white/10 rounded-lg p-4 w-full max-w-md mx-4"
            style={{ 
              background: "linear-gradient(135deg, rgb(0, 10, 40) 0%, rgb(0, 128, 128) 100%)",
              boxShadow: "rgba(0, 0, 0, 0.45) 10px 0px 30px -5px, rgba(0, 0, 0, 0.3) 5px 5px 20px -5px, rgba(255, 255, 255, 0.15) 0px -1px 5px 0px inset, rgba(0, 210, 200, 0.25) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-medium">Signaler un retard</h3>
              <button onClick={() => handleCloseModal(null, setDelayModalOpen)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-white mb-2">Raison du retard</label>
              <textarea
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white resize-none h-20"
                placeholder="Expliquez la raison du retard..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-white mb-2">Durée estimée du retard</label>
              <input
                type="text"
                value={delayDuration}
                onChange={(e) => setDelayDuration(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                placeholder="Exemple: 3 jours, 2 semaines, etc."
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => handleCloseModal(null, setDelayModalOpen)} 
                className="px-4 py-2 text-white/80 hover:text-white mr-2"
              >
                Annuler
              </button>
              <button 
                onClick={handleSubmitDelay} 
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                disabled={!delayReason.trim()}
              >
                Signaler
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 motion-div-overlay task-list-container-modal" onClick={cancelDeleteTask}>
          <div 
            className="border border-white/10 rounded-lg p-4 w-full max-w-md mx-4"
            style={{ 
              background: "linear-gradient(135deg, rgb(0, 10, 40) 0%, rgb(0, 128, 128) 100%)",
              boxShadow: "rgba(0, 0, 0, 0.45) 10px 0px 30px -5px, rgba(0, 0, 0, 0.3) 5px 5px 20px -5px, rgba(255, 255, 255, 0.15) 0px -1px 5px 0px inset, rgba(0, 210, 200, 0.25) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-medium">Confirmer la suppression</h3>
              <button onClick={cancelDeleteTask} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4 text-white">
              Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
            </div>
            
            <div className="flex justify-end mt-4">
              <button 
                onClick={cancelDeleteTask} 
                className="px-4 py-2 text-white/80 hover:text-white mr-2"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDeleteTask} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}