import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { useMutation } from '@convex/react'; // Cette importation n'est pas disponible
import { User, Calendar, ClipboardList, Clock, MessageSquare, AlertCircle, Star, RefreshCcw } from 'lucide-react';
import './TaskForm.css';

// Types
export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  estimatedHours: number;
  delay?: number;  // Ajout du champ pour le retard
  comments?: string; // Ajout du champ pour les commentaires
  status?: 'pending' | 'in_progress' | 'completed'; // Pour vérifier si la tâche est terminée
}

interface TaskFormProps {
  onClose: () => void;
  task?: any;  // Rendre la propriété task optionnelle
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, task }) => {
  // Commentons cette ligne car nous n'avons pas accès à l'API Convex
  // const createTask = useMutation(api.tasks.createTask);
  
  // Préparer les commentaires pour l'affichage dans le formulaire
  const formatCommentsForDisplay = (comments: any[] | undefined): string => {
    if (!comments || !Array.isArray(comments)) return '';
    
    return comments.map(comment => {
      if (typeof comment === 'object' && comment !== null) {
        const author = typeof comment.author === 'string' 
          ? comment.author 
          : (comment.author && typeof comment.author === 'object' && comment.author.name)
            ? comment.author.name
            : 'Utilisateur';
            
        const content = typeof comment.content === 'string'
          ? comment.content
          : JSON.stringify(comment.content);
          
        return `${author}: ${content}`;
      }
      return typeof comment === 'string' ? comment : JSON.stringify(comment);
    }).join('\n\n');
  };
  
  const initialComments = formatCommentsForDisplay(task?.comments);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<TaskFormData>({
    defaultValues: {
      ...task || {},
      comments: initialComments
    }
  });
  
  const [activeTab, setActiveTab] = useState<'details' | 'performance'>('details');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const status = watch('status');
  const isShowingPerformanceTab = status === 'completed';

  const onSubmit = async (data: TaskFormData) => {
    try {
      // Préserver les commentaires originaux si disponibles
      const formattedData = {
        ...data,
        // Conserver les commentaires originaux pour éviter de perdre la structure
        comments: task?.comments || data.comments
      };
      
      // Comme nous n'avons pas accès à Convex, simulons la création
      console.log('Mise à jour de tâche:', formattedData);
      // await createTask({
      //   ...data,
      //   estimatedHours: Number(data.estimatedHours),
      //   priority: 'medium',
      //   status: 'pending'
      // });
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="modal-container">
      {/* Header et bouton fermer supprimés pour éviter le doublon */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tabs pour naviger entre les détails et la performance (visible uniquement pour les tâches terminées) */}
        {isShowingPerformanceTab && (
          <div className="flex border-b border-white/10 mb-4">
            <button
              type="button"
              className={`px-4 py-2 mr-2 transition-all ${activeTab === 'details' 
                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]' 
                : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              onClick={() => setActiveTab('details')}
              aria-label="Afficher les détails de la tâche"
            >
              <div className="flex items-center">
                Détails
              </div>
            </button>
            <button
              type="button"
              className={`px-4 py-2 transition-all ${activeTab === 'performance' 
                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]' 
                : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              onClick={() => setActiveTab('performance')}
              aria-label="Afficher la performance de la tâche"
            >
              <div className="flex items-center">
                Performance
              </div>
            </button>
          </div>
        )}

        {activeTab === 'details' && (
          <>
            <div className="space-y-2">
              <label className="block text-white mb-1" htmlFor="title">Titre de la tâche</label>
              <div className="relative">
                <input 
                  type="text"
                  {...register('title', { required: 'Le titre est requis' })} 
                  id="title" 
                  className="w-full px-4 py-3 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 transition-all text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  placeholder="Entrez le titre de la tâche" 
                  aria-required="true" 
                />
              </div>
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-white mb-1" htmlFor="description">Description</label>
              <textarea 
                {...register('description')} 
                id="description" 
                className="w-full px-4 py-3 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 transition-all text-white resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                placeholder="Décrivez la tâche en détail" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-white mb-1" htmlFor="dueDate">Date</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                    <Calendar size={16} />
                  </div>
                  <input 
                    type="date" 
                    {...register('dueDate', { required: 'La date est requise' })} 
                    id="dueDate"
                    className="w-full px-4 py-3 pl-10 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 transition-all text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    aria-required="true"
                  />
                </div>
                {errors.dueDate && <p className="text-red-400 text-sm mt-1">{errors.dueDate.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-white mb-1" htmlFor="assignedTo">Assigné à</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                    <User size={16} />
                  </div>
                  <select 
                    {...register('assignedTo')} 
                    id="assignedTo"
                    className="w-full px-4 py-3 pl-10 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 transition-all text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="">Sélectionner un utilisateur</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Alex Johnson">Alex Johnson</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-white mb-1" htmlFor="estimatedHours">Heures estimées</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <Clock size={16} />
                </div>
                <input 
                  type="number" 
                  step="0.5"
                  {...register('estimatedHours', { 
                    required: 'Ce champ est requis',
                    min: { value: 0.5, message: 'Minimum 0.5 heure' },
                    max: { value: 100, message: 'Maximum 100 heures' }
                  })} 
                  id="estimatedHours"
                  className="w-full px-4 py-3 pl-10 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 transition-all text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  placeholder="Heures"
                  aria-required="true"
                />
              </div>
              {errors.estimatedHours && <p className="text-red-400 text-sm mt-1">{errors.estimatedHours.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-white mb-1" htmlFor="comments">Commentaires</label>
              <div className="relative">
                <div className="absolute left-3 top-4 text-white/40">
                  <MessageSquare size={16} />
                </div>
                <textarea 
                  {...register('comments')} 
                  id="comments" 
                  className="w-full px-4 py-3 pl-10 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 transition-all text-white resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  placeholder="Ajoutez vos commentaires ici..." 
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-4 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Évaluation de la tâche</h3>
              <div className="flex flex-wrap justify-center sm:justify-start space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSelectedRating(rating)}
                    className={`p-1 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-md transition-colors ${
                      selectedRating && selectedRating >= rating ? 'text-yellow-400' : 'text-white/30 hover:text-white/50'
                    }`}
                    aria-label={`Évaluer ${rating} sur 5`}
                  >
                    <Star className="w-5 h-5 sm:w-6 sm:h-6" fill={selectedRating && selectedRating >= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-white mb-1" htmlFor="delay">Retard (en jours)</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <AlertCircle size={16} />
                </div>
                <input 
                  type="number" 
                  step="1"
                  {...register('delay')} 
                  id="delay"
                  className="w-full px-4 py-3 pl-10 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 transition-all text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};