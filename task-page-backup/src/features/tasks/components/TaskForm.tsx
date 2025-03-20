import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Clock, 
  AlertCircle, 
  Tag, 
  Users, 
  Calendar,
  FileText,
  ChevronDown,
  X
} from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  estimatedHours: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

interface TaskFormProps {
  onClose: () => void;
  task?: any;  // Rendre la propriété task optionnelle
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, task }) => {
  const createTask = useMutation(api.tasks.createTask);
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: {
      priority: 'medium',
      status: 'pending'
    }
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await createTask({
        ...data,
        estimatedHours: Number(data.estimatedHours)
      });
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
        >
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Titre de la tâche
            </label>
            <input
              {...register('title', { required: 'Le titre est requis' })}
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow"
              placeholder="Entrez le titre de la tâche"
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle size={14} />
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow resize-none"
              placeholder="Décrivez la tâche en détail"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Priorité
              </label>
              <div className="relative">
                <select
                  {...register('priority')}
                  className="w-full appearance-none bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-all border-0"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    border: 'none'
                  }}
                >
                  <option value="low" className="bg-[rgba(0,10,40,0.95)] text-white py-2">Basse</option>
                  <option value="medium" className="bg-[rgba(0,10,40,0.95)] text-white py-2">Moyenne</option>
                  <option value="high" className="bg-[rgba(0,10,40,0.95)] text-white py-2">Haute</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Statut
              </label>
              <div className="relative">
                <select
                  {...register('status')}
                  className="w-full appearance-none bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-all border-0"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    border: 'none'
                  }}
                >
                  <option value="pending" className="bg-[rgba(0,10,40,0.95)] text-white py-2">En attente</option>
                  <option value="in_progress" className="bg-[rgba(0,10,40,0.95)] text-white py-2">En cours</option>
                  <option value="completed" className="bg-[rgba(0,10,40,0.95)] text-white py-2">Terminée</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Assigné à
              </label>
              <div className="relative">
                <select
                  {...register('assignedTo')}
                  className="w-full appearance-none bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-all border-0"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    border: 'none'
                  }}
                >
                  <option value="" className="bg-[rgba(0,10,40,0.95)] text-white py-2">Sélectionner un employé</option>
                  <option value="user1" className="bg-[rgba(0,10,40,0.95)] text-white py-2">Jean Dupont</option>
                  <option value="user2" className="bg-[rgba(0,10,40,0.95)] text-white py-2">Marie Martin</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Date d'échéance
              </label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Temps estimé (heures)
              </label>
              <input
                type="number"
                {...register('estimatedHours')}
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40 transition-shadow"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Tâche récurrente
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  {...register('isRecurring')}
                  className="form-checkbox h-4 w-4 bg-white/5 backdrop-blur-sm border border-white/10 text-brand-burgundy rounded focus:ring-2 focus:ring-brand-burgundy/40 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-white/60">Activer la récurrence</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white/60 hover:text-white/90 transition-colors rounded-lg hover:bg-white/5"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-burgundy/40"
          >
            Créer la tâche
          </button>
        </div>
      </form>
    </div>
  );
}