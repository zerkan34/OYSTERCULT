import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { useMutation } from '@convex/react'; // Cette importation n'est pas disponible
import { X, User, Calendar, ClipboardList, Clock, MessageSquare, AlertCircle, Star, RefreshCcw } from 'lucide-react';

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
    <div className="modal-container">
      <div className="modal-header px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/10 rounded-2xl backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Nouvelle tâche</h2>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white/90 transition-colors p-1 rounded-lg hover:bg-white/5"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <div className="space-y-6">
          {/* Tabs pour naviger entre les détails et la performance (visible uniquement pour les tâches terminées) */}
          {isShowingPerformanceTab && (
            <div className="flex border-b border-white/10 mb-4">
              <button
                type="button"
                className={`pb-2 px-3 text-sm font-medium ${activeTab === 'details' ? 'text-brand-burgundy border-b-2 border-brand-burgundy' : 'text-white/60 hover:text-white/80'}`}
                onClick={() => setActiveTab('details')}
              >
                <div className="flex items-center gap-1.5">
                  <ClipboardList size={16} />
                  Détails
                </div>
              </button>
              <button
                type="button"
                className={`pb-2 px-3 text-sm font-medium ${activeTab === 'performance' ? 'text-brand-burgundy border-b-2 border-brand-burgundy' : 'text-white/60 hover:text-white/80'}`}
                onClick={() => setActiveTab('performance')}
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
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Titre de la tâche</label>
                <input {...register('title', { required: 'Le titre est requis' })} className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow" placeholder="Entrez le titre de la tâche" />
                {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Description</label>
                <textarea {...register('description')} className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow resize-y min-h-[100px]" placeholder="Décrivez la tâche en détail" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-white/40" />
                    </div>
                    <input 
                      type="date" 
                      {...register('dueDate', { required: 'La date est requise' })} 
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow" 
                    />
                  </div>
                  {errors.dueDate && <p className="mt-1 text-xs text-red-400">{errors.dueDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Assigné à</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-white/40" />
                    </div>
                    <select 
                      {...register('assignedTo')} 
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow"
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                      <option value="Alex Johnson">Alex Johnson</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Heures estimées</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow" 
                      placeholder="Heures"
                    />
                  </div>
                  {errors.estimatedHours && <p className="mt-1 text-xs text-red-400">{errors.estimatedHours.message}</p>}
                </div>

                <div className="flex items-center space-x-2 pt-7">
                  <input 
                    type="checkbox" 
                    id="isRecurring" 
                    {...register('isRecurring')} 
                    className="w-4 h-4 rounded border-white/30 bg-white/5 text-brand-burgundy focus:ring-brand-burgundy/40"
                  />
                  <label htmlFor="isRecurring" className="text-sm text-white/70">Tâche récurrente</label>
                </div>
              </div>

              {watch('isRecurring') && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Fréquence</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RefreshCcw size={16} className="text-white/40" />
                    </div>
                    <select 
                      {...register('recurringPattern')} 
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow"
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
                      <div className="bg-brand-burgundy h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Respect des délais</span>
                      <span>92%</span>
                    </div>
                    <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-burgundy h-full rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Score automatique</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSelectedRating(star)}
                          className="focus:outline-none"
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

        <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-brand-burgundy text-white rounded-lg hover:bg-brand-burgundy/90 transition-colors"
          >
            Créer la tâche
          </button>
        </div>
      </form>
    </div>
  );
};