import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Clock, 
  AlertCircle, 
  Tag, 
  Users, 
  Calendar,
  FileText,
  ChevronDown
} from 'lucide-react';

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  category: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  estimatedHours: number;
}

interface TaskFormProps {
  onClose: () => void;
}

export function TaskForm({ onClose }: TaskFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>();

  const onSubmit = (data: TaskFormData) => {
    console.log(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-effect p-6 rounded-lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Titre de la tâche
          </label>
          <input
            {...register('title', { required: 'Le titre est requis' })}
            className="input-modern"
            placeholder="Entrez le titre de la tâche"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="input-modern"
            placeholder="Décrivez la tâche en détail"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Priorité
            </label>
            <div className="relative">
              <select
                {...register('priority')}
                className="input-modern appearance-none"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Date d'échéance
            </label>
            <input
              type="date"
              {...register('dueDate')}
              className="input-modern"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Assigné à
            </label>
            <div className="relative">
              <select
                {...register('assignedTo')}
                className="input-modern appearance-none"
              >
                <option value="">Sélectionner un employé</option>
                <option value="user1">Jean Dupont</option>
                <option value="user2">Marie Martin</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Catégorie
            </label>
            <div className="relative">
              <select
                {...register('category')}
                className="input-modern appearance-none"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="production">Production</option>
                <option value="maintenance">Maintenance</option>
                <option value="quality">Contrôle qualité</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Temps estimé (heures)
            </label>
            <input
              type="number"
              {...register('estimatedHours')}
              className="input-modern"
              min="0"
              step="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Tâche récurrente
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                {...register('isRecurring')}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm text-white">Activer la récurrence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Créer la tâche
        </button>
      </div>
    </form>
  );
}