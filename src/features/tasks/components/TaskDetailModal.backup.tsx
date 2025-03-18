import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    color: 'text-blue-400',
    icon: <Flag size={14} className="text-blue-400" />
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

// Composant principal du modal
export function TaskDetailModal({ task, onClose, onEdit }: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'commentaires' | 'performance'>('commentaires');
  const [responseText, setResponseText] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [responses, setResponses] = useState(mockResponses);
  const modalRef = React.useRef(null);
  
  // Utiliser useClickOutside de manière conditionnelle pour éviter des erreurs
  React.useEffect(() => {
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
    <AnimatePresence mode="wait">
      <motion.div
        key="modal-overlay"
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
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{task.title}</h3>
                <div className="flex flex-wrap gap-2 items-center text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Info size={14} className="text-white/40" />
                    {task.category}
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-white/40" />
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white/60 hover:text-white/90 transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Badges */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs ${priorityStyles[task.priority].bg} ${priorityStyles[task.priority].border}`}>
                {priorityStyles[task.priority].icon}
                <span className={priorityStyles[task.priority].color}>
                  {task.priority === 'high' ? 'Priorité haute' : task.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                </span>
              </div>
              
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs ${statusStyles[task.status].bg} ${statusStyles[task.status].border}`}>
                {statusStyles[task.status].icon}
                <span className={statusStyles[task.status].color}>
                  {task.status === 'pending' ? 'En attente' : task.status === 'in_progress' ? 'En cours' : 'Terminé'}
                </span>
              </div>
              
              {task.assignedTo && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-blue-500/10 border-blue-500/30">
                  <User size={14} className="text-blue-400" />
                  <span className="text-blue-400">{task.assignedTo}</span>
                </div>
              )}
              
              {task.location && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-purple-500/10 border-purple-500/30">
                  <MapPin size={14} className="text-purple-400" />
                  <span className="text-purple-400">{task.location}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="p-6 border-b border-white/10">
            <h4 className="text-sm font-medium text-white/80 mb-3">Description</h4>
            <p className="text-sm text-white/70 leading-relaxed">{task.description || 'Aucune description disponible.'}</p>
            
            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <div key={index} className="bg-white/5 text-white/60 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      <Tag size={10} />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Informations supplémentaires */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {task.estimatedTime && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock size={16} className="text-white/40" />
                  <span>Temps estimé: <span className="text-white/90">{task.estimatedTime}h</span></span>
                </div>
              )}
              
              {task.actualTime && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock size={16} className="text-white/40" />
                  <span>Temps réel: <span className="text-white/90">{task.actualTime}h</span></span>
                </div>
              )}
              
              {task.assignedTo && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <User size={16} className="text-white/40" />
                  <span>Assigné à: <span className="text-white/90">{task.assignedTo}</span></span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Calendar size={16} className="text-white/40" />
                <span>Échéance: <span className="text-white/90">{formatDate(task.dueDate)}</span></span>
              </div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="p-6 pb-0">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-white/80">Progression</h4>
              <span className="text-sm text-white/60">{completionPercentage}%</span>
            </div>
            <div className="bg-white/5 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${completionPercentage}%`,
                  background: 'linear-gradient(to right, rgba(34, 197, 94, 0.7), rgb(34, 197, 94))'
                }}
              ></div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="p-6">
            <div className="flex border-b border-white/10">
              <button
                className={`pb-2 px-3 text-sm font-medium ${activeTab === 'commentaires' ? 'text-green-500 border-b-2 border-green-500' : 'text-white/60 hover:text-white/80'}`}
                onClick={() => setActiveTab('commentaires')}
              >
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={16} />
                  Commentaires
                </div>
              </button>
              <button
                className={`pb-2 px-3 text-sm font-medium ${activeTab === 'performance' ? 'text-green-500 border-b-2 border-green-500' : 'text-white/60 hover:text-white/80'}`}
                onClick={() => setActiveTab('performance')}
              >
                <div className="flex items-center gap-1.5">
                  <ClipboardList size={16} />
                  Performance
                </div>
              </button>
            </div>
            
            {/* Contenu des tabs */}
            <div className="mt-4">
              {activeTab === 'commentaires' && (
                <div className="space-y-4">
                  {/* Liste des commentaires */}
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {responses.map((response) => (
                      <motion.div 
                        key={response.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white/5 rounded-lg p-3"
                      >
                        <div className="flex justify-between">
                          <h5 className="text-sm font-medium text-white/90">{response.user}</h5>
                          <span className="text-xs text-white/40">{formatTime(response.date)}</span>
                        </div>
                        <p className="text-sm text-white/70 mt-1">{response.text}</p>
                        
                        {response.attachments && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {response.attachments.map((attachment, index) => (
                              <div key={index} className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded flex items-center gap-1.5">
                                <Link2 size={12} />
                                {attachment}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {response.rating > 0 && (
                          <div className="mt-2 flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                size={14}
                                className={star <= response.rating ? "text-amber-400 fill-amber-400" : "text-white/20"}
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Formulaire de réponse */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="mb-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            size={16}
                            className={star <= (selectedRating || 0) ? "text-amber-400 fill-amber-400 cursor-pointer" : "text-white/20 cursor-pointer hover:text-white/40"}
                            onClick={() => setSelectedRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Ajouter un commentaire..."
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
              )}
              
              {activeTab === 'performance' && (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-white/90 mb-3">Évaluation de la tâche</h5>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>Efficacité</span>
                          <span>85%</span>
                        </div>
                        <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>Qualité</span>
                          <span>92%</span>
                        </div>
                        <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>Respect des délais</span>
                          <span>78%</span>
                        </div>
                        <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/70">Score automatique</span>
                        <div className="flex">
                          {[1, 2, 3, 4].map((star) => (
                            <Star 
                              key={star}
                              size={18}
                              className="text-amber-400 fill-amber-400"
                            />
                          ))}
                          <Star size={18} className="text-white/20" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-white/90 mb-3">Historique d'activité</h5>
                    
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
