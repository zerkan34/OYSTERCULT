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
  task?: any;  // Rendre la propriété task optionnelle
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, task }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>();

  const onSubmit = (data: TaskFormData) => {
    console.log(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-900 p-6 rounded-lg relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white"
      >
        <X size={20} />
      </button>

      <h2 className="text-xl font-medium text-white mb-6">
        Nouvelle Tâche
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-white/60 mb-1">
            Titre de la tâche
          </label>
          <input
            {...register('title', { required: 'Le titre est requis' })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            placeholder="Entrez le titre de la tâche"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            placeholder="Décrivez la tâche en détail"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">
              Priorité
            </label>
            <div className="relative">
              <select
                {...register('priority')}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">
              Date d'échéance
            </label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">
              Assigné à
            </label>
            <div className="relative">
              <select
                {...register('assignedTo')}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="">Sélectionner un employé</option>
                <option value="user1">Jean Dupont</option>
                <option value="user2">Marie Martin</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">
              Catégorie
            </label>
            <div className="relative">
              <select
                {...register('category')}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
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
            <label className="block text-sm text-white/60 mb-1">
              Temps estimé (heures)
            </label>
            <input
              type="number"
              {...register('estimatedHours')}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              min="0"
              step="0.5"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">
              Tâche récurrente
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                {...register('isRecurring')}
                className="form-checkbox bg-white/5 border border-white/10 text-brand-blue rounded"
              />
              <span className="ml-2 text-sm text-white/60">Activer la récurrence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-white/60 hover:text-white transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-medium rounded-lg transition-colors"
        >
          Créer la tâche
        </button>
      </div>
    </form>
  );
}