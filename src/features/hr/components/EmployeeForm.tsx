import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  startDate: string;
  employeeId: string;
  emergencyContact: string;
}

interface EmployeeFormProps {
  onClose: () => void;
}

export function EmployeeForm({ onClose }: EmployeeFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>();

  const onSubmit = (data: EmployeeFormData) => {
    console.log(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Nouvel Employé</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Prénom
            </label>
            <input
              {...register('firstName', { required: 'Le prénom est requis' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Nom
            </label>
            <input
              {...register('lastName', { required: 'Le nom est requis' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email', { required: 'L\'email est requis' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Téléphone
            </label>
            <input
              {...register('phone')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Poste
            </label>
            <input
              {...register('position', { required: 'Le poste est requis' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.position && (
              <p className="mt-1 text-sm text-red-400">{errors.position.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Département
            </label>
            <select
              {...register('department')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="production">Production</option>
              <option value="maintenance">Maintenance</option>
              <option value="quality">Contrôle Qualité</option>
              <option value="logistics">Logistique</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Site
            </label>
            <input
              {...register('location')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Date de début
            </label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Identifiant employé
            </label>
            <input
              {...register('employeeId')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Contact d'urgence
            </label>
            <input
              {...register('emergencyContact')}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-white/70 hover:text-white transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
        >
          Créer l'employé
        </button>
      </div>
    </form>
  );
}