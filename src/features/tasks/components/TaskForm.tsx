import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { useMutation } from '@convex/react'; // Cette importation n'est pas disponible
import { X, User, Calendar, ClipboardList, Clock, MessageSquare, AlertCircle, Star, RefreshCcw } from 'lucide-react';
import './TaskForm.css';

// Types
export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  estimatedHours: number;
  isRecurring: boolean;
  recurringPattern?: string;
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
  const { register, handleSubmit, formState: { errors }, watch } = useForm<TaskFormData>({
    defaultValues: task || {}
  });
  
  const [activeTab, setActiveTab] = useState<'details' | 'performance'>('details');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const status = watch('status');
  const isShowingPerformanceTab = status === 'completed';

  const onSubmit = async (data: TaskFormData) => {
    try {
      // Comme nous n'avons pas accès à Convex, simulons la création
      console.log('Création de tâche:', data);
      // await createTask({
      //   ...data,
      //   estimatedHours: Number(data.estimatedHours),
      //   priority: 'medium',
      //   status: 'pending'
      // });
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="modal-container mobile-card">
      <div className="modal-header">
        <h2 className="text-xl font-semibold text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Nouvelle tâche</h2>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white/90 transition-colors p-1 rounded-lg hover:bg-white/5"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-section mobile-fade-in">
        <div className="space-y-6">
          {/* Tabs pour naviger entre les détails et la performance (visible uniquement pour les tâches terminées) */}
          {isShowingPerformanceTab && (
            <div className="flex border-b border-white/10 mb-4">
              <button
                type="button"
                className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
                aria-label="Afficher les détails de la tâche"
              >
                <div className="flex items-center gap-1.5">
                  <ClipboardList size={16} />
                  Détails
                </div>
              </button>
              <button
                type="button"
                className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
                onClick={() => setActiveTab('performance')}
                aria-label="Afficher la performance de la tâche"
              >
                <div className="flex items-center gap-1.5">
                  <ClipboardList size={16} />
                  Performance
                </div>
              </button>
            </div>
          )}

          {activeTab === 'details' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="title">Titre de la tâche</label>
                <input {...register('title', { required: 'Le titre est requis' })} id="title" className="form-field" placeholder="Entrez le titre de la tâche" aria-required="true" />
                {errors.title && <p className="form-field-error">{errors.title.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea {...register('description')} id="description" className="form-field resize-y min-h-[100px]" placeholder="Décrivez la tâche en détail" />
              </div>

              <div className="form-grid two-columns grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="dueDate">Date</label>
                  <div className="relative">
                    <div className="form-field-icon">
                      <Calendar size={16} className="text-white/40" />
                    </div>
                    <input 
                      type="date" 
                      {...register('dueDate', { required: 'La date est requise' })} 
                      id="dueDate"
                      className="form-field pl-10" 
                      aria-required="true"
                    />
                  </div>
                  {errors.dueDate && <p className="form-field-error">{errors.dueDate.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="assignedTo">Assigné à</label>
                  <div className="relative">
                    <div className="form-field-icon">
                      <User size={16} className="text-white/40" />
                    </div>
                    <select 
                      {...register('assignedTo')} 
                      id="assignedTo"
                      className="form-field pl-10 appearance-none"
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                      <option value="Alex Johnson">Alex Johnson</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-grid two-columns grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="estimatedHours">Heures estimées</label>
                  <div className="relative">
                    <div className="form-field-icon">
                      <Clock size={16} className="text-white/40" />
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
                      className="form-field pl-10" 
                      placeholder="Heures"
                      aria-required="true"
                    />
                  </div>
                  {errors.estimatedHours && <p className="form-field-error">{errors.estimatedHours.message}</p>}
                </div>

                <div className="flex items-center space-x-2 pt-7">
                  <input 
                    type="checkbox" 
                    id="isRecurring" 
                    {...register('isRecurring')} 
                    className="w-4 h-4 rounded border-white/30 bg-white/5 text-rose-600 focus:ring-rose-600/40"
                  />
                  <label htmlFor="isRecurring" className="text-sm text-white/70">Tâche récurrente</label>
                </div>
              </div>

              {watch('isRecurring') && (
                <div className="form-group">
                  <label className="form-label" htmlFor="recurringPattern">Fréquence</label>
                  <div className="relative">
                    <div className="form-field-icon">
                      <RefreshCcw size={16} className="text-white/40" />
                    </div>
                    <select 
                      {...register('recurringPattern')} 
                      id="recurringPattern"
                      className="form-field pl-10 appearance-none"
                    >
                      <option value="daily">Quotidien</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="biweekly">Bi-hebdomadaire</option>
                      <option value="monthly">Mensuel</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Sections retard et commentaires supprimées */}
            </>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h5 className="text-sm font-medium text-white/90 mb-3">Évaluation de la performance</h5>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Efficacité (Temps estimé vs temps réel)</span>
                      <span>85%</span>
                    </div>
                    <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-600 to-red-800 h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Respect des délais</span>
                      <span>92%</span>
                    </div>
                    <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-600 to-red-800 h-full rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="rating-container flex justify-between items-center">
                    <span className="text-sm text-white/70">Score automatique</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSelectedRating(star)}
                          className="rating-star-button focus:outline-none"
                          aria-label={`Noter ${star} étoiles sur 5`}
                        >
                          <Star 
                            size={18}
                            className={star <= (selectedRating || 4) ? "text-amber-400 fill-amber-400" : "text-white/20"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button"
            onClick={onClose}
            className="btn-cancel"
            aria-label="Annuler la création de tâche"
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="btn-submit"
            aria-label="Créer la tâche"
          >
            Créer la tâche
          </button>
        </div>
      </form>
    </div>
  );
};