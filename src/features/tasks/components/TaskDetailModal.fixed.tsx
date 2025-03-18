import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Flag,
  Tag, 
  User, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  ClipboardList,
  MessageSquare,
  Link2,
  Hourglass,
  X,
  Send,
  Star,
  Info
} from 'lucide-react';

// Type de tâche
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

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onEdit?: (task: Task) => void;
}

// Interface pour les réponses
interface Response {
  id: string;
  user: string;
  text: string;
  date: string;
  rating?: number;
  attachments?: string[];
}

// Données fictives pour les réponses
const mockResponses: Response[] = [
  { 
    id: '1', 
    user: 'Jean Dupont', 
    text: 'J\'ai commencé l\'inspection dans la zone nord du parc A. Les huîtres présentent une bonne croissance uniforme.',
    date: '2025-03-13T14:30:00',
    rating: 4
  },
  { 
    id: '2', 
    user: 'Jean Dupont', 
    text: 'J\'ai identifié quelques huîtres sous-dimensionnées dans le secteur est. Besoin d\'une inspection plus approfondie.',
    date: '2025-03-13T15:15:00',
    rating: 3,
    attachments: [
      'Rapport_inspection_parcA_20250313.pdf',
      'Photos_echantillons.jpg'
    ]
  },
  { 
    id: '3', 
    user: 'Marie Martin', 
    text: 'La rotation des poches dans la filière 3 est en cours. Nous avons constaté une amélioration notable de la croissance après le dernier ajustement des densités.',
    date: '2025-03-13T15:45:00',
    rating: 5
  },
  { 
    id: '4', 
    user: 'Sophie Bernard', 
    text: 'Les analyses d\'eau montrent des taux de salinité et d\'oxygène optimaux. Les résultats détaillés sont disponibles dans le rapport joint.',
    date: '2025-03-13T16:20:00',
    rating: 4,
    attachments: [
      'Analyse_eau_20250313.pdf'
    ]
  }
];

// Variants optimisés pour les animations (utilisant transform)
const modalVariants = {
  hidden: { 
    opacity: 0,
    transform: 'scale(0.95) translateY(10px)'
  },
  visible: { 
    opacity: 1,
    transform: 'scale(1) translateY(0)',
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },
  exit: { 
    opacity: 0,
    transform: 'scale(0.95) translateY(10px)',
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] }
  }
};

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
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    color: 'text-green-400',
    icon: <Flag size={14} className="text-green-400" />
  }
};

// Styles pour les statuts
const statusStyles = {
  pending: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    color: 'text-blue-400',
    icon: <Hourglass size={14} className="text-blue-400" />
  },
  in_progress: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    color: 'text-amber-400',
    icon: <Clock size={14} className="text-amber-400" />
  },
  completed: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    color: 'text-emerald-400',
    icon: <CheckCircle size={14} className="text-emerald-400" />
  }
};

// Composant principal du modal
export function TaskDetailModal({ task, onClose, onEdit }: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'commentaires' | 'performance'>('commentaires');
  const [responseText, setResponseText] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [responses, setResponses] = useState(mockResponses);
  const modalRef = React.useRef(null);
  
  // Utiliser useEffect pour gérer le clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !(modalRef.current as any).contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Format de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Format du temps (HH:MM)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcul du pourcentage de complétion (fictif pour cet exemple)
  const completionPercentage = task.status === 'completed' ? 100 : task.status === 'in_progress' ? 65 : 0;

  // Fonction pour ajouter une réponse
  const handleAddResponse = () => {
    if (responseText.trim() === '') return;
    
    const newResponse: Response = {
      id: (responses.length + 1).toString(),
      user: 'Utilisateur Actuel',
      text: responseText,
      date: new Date().toISOString(),
      rating: selectedRating || 0
    };
    
    setResponses([...responses, newResponse]);
    setResponseText('');
    setSelectedRating(null);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        WebkitBackdropFilter: 'blur(5px)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <motion.div
        ref={modalRef}
        className="bg-gray-900/95 rounded-xl relative overflow-hidden w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          background: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6))'
        }}
      >
        {/* En-tête */}
        <div 
          className="relative p-6 border-b border-white/10"
          style={{
            background: 'linear-gradient(to right, rgba(34, 197, 94, 0.1), transparent)'
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
              <h3 className="text-xl text-white font-semibold">{task.title}</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                <div className={`text-xs px-2.5 py-1 rounded-full ${priorityStyles[task.priority].bg} ${priorityStyles[task.priority].border} ${priorityStyles[task.priority].color} inline-flex items-center gap-1.5`}>
                  {priorityStyles[task.priority].icon}
                  <span>
                    {task.priority === 'high' ? 'Priorité Haute' : 
                     task.priority === 'medium' ? 'Priorité Moyenne' : 
                     'Priorité Basse'}
                  </span>
                </div>
                
                <div className={`text-xs px-2.5 py-1 rounded-full ${statusStyles[task.status].bg} ${statusStyles[task.status].border} ${statusStyles[task.status].color} inline-flex items-center gap-1.5`}>
                  {statusStyles[task.status].icon}
                  <span>
                    {task.status === 'completed' ? 'Terminée' : 
                     task.status === 'in_progress' ? 'En cours' : 
                     'En attente'}
                  </span>
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
            <p className="text-white/70 text-sm mt-3 leading-relaxed">
              {task.description}
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {task.dueDate && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Calendar size={16} className="text-indigo-400" />
                <span>Échéance: {formatDate(task.dueDate)}</span>
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
          
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 bg-gray-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-teal-400"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-white/60">{completionPercentage}%</span>
          </div>
        </div>
        
        {/* Corps du modal avec onglets */}
        <div className="p-6">
          <div className="flex border-b border-white/10 mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'commentaires' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => setActiveTab('commentaires')}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Commentaires</span>
              </div>
            </button>
            
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'performance' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => setActiveTab('performance')}
            >
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Performance</span>
              </div>
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Contenu des onglets */}
            <div className="min-h-[300px]">
              {activeTab === 'commentaires' && (
                <div className="space-y-6">
                  {/* Section des commentaires */}
                  <div className="space-y-4">
                    {responses.map((response) => (
                      <div key={response.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-medium">
                              {response.user.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-white/90">{response.user}</div>
                              <div className="text-xs text-white/60">
                                {formatDate(response.date)} à {formatTime(response.date)}
                              </div>
                            </div>
                          </div>
                          
                          {response.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={14} 
                                  className={i < response.rating! ? "text-amber-400 fill-amber-400" : "text-white/20"} 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <p className="mt-3 text-sm text-white/80 leading-relaxed">
                          {response.text}
                        </p>
                        
                        {response.attachments && response.attachments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <div className="text-xs text-white/60 font-medium">Pièces jointes</div>
                            {response.attachments.map((attachment, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-white/10 p-2 rounded text-sm text-white/70">
                                <Link2 size={14} />
                                <span>{attachment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Formulaire de réponse */}
                  <div className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-white/90">Ajouter un commentaire</h5>
                        
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSelectedRating(i + 1)}
                              className="focus:outline-none"
                            >
                              <Star 
                                size={16} 
                                className={selectedRating && i < selectedRating ? "text-amber-400 fill-amber-400" : "text-white/20 hover:text-white/40"} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Entrez votre commentaire..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          onClick={handleAddResponse}
                          disabled={responseText.trim() === ''}
                          className="bg-green-600/20 border border-green-600/30 hover:bg-green-600/30 text-green-500 rounded-lg px-3 py-2 flex items-center gap-1 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'performance' && (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-white/90 mb-3">Évaluation de la tâche</h5>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-white/70">Progression</span>
                          <span className="text-white/90">{completionPercentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-teal-400"
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-white/70">Temps estimé</span>
                          <span className="text-white/90">{task.estimatedTime || 0} heures</span>
                        </div>
                        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500"
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-white/70">Temps passé</span>
                          <span className="text-white/90">{task.actualTime || 0} heures</span>
                        </div>
                        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-violet-500"
                            style={{ width: `${task.actualTime ? (task.actualTime / (task.estimatedTime || 1)) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {task.autoScore !== undefined && (
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="text-white/70">Score auto</span>
                            <span className="text-white/90">{task.autoScore}/10</span>
                          </div>
                          <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500"
                              style={{ width: `${(task.autoScore / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Historique de l'activité */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-white/90 mb-3">Historique de l'activité</h5>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-1 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white/80">Tâche créée</span>
                            <span className="text-xs text-white/40">il y a 3 jours</span>
                          </div>
                          <p className="text-xs text-white/50 mt-0.5">Assignée à {task.assignedTo}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-1 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white/80">Changement de statut</span>
                            <span className="text-xs text-white/40">il y a 2 jours</span>
                          </div>
                          <p className="text-xs text-white/50 mt-0.5">Statut changé à "En cours"</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-1 bg-amber-500 rounded-full"></div>
                        <div>
                          <div className="flex justify-between">
                            <span className="text-sm text-white/80">Rapport ajouté</span>
                            <span className="text-xs text-white/40">il y a 1 jour</span>
                          </div>
                          <p className="text-xs text-white/50 mt-0.5">Premier rapport d'avancement ajouté</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
