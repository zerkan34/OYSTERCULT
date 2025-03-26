import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Calendar, Tag, AlertCircle } from 'lucide-react';

interface ChargeFormProps {
  initialData?: {
    id?: string;
    name: string;
    amount: number;
    category: string;
    date: string;
    description?: string;
  };
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const chargeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  amount: z.number().min(0, 'Le montant doit être positif'),
  category: z.string().min(1, 'La catégorie est requise'),
  date: z.string().min(1, 'La date est requise'),
  description: z.string().optional()
});

type FormData = z.infer<typeof chargeSchema>;

const categories = [
  'Énergie',
  'Équipement',
  'Transport',
  'Maintenance',
  'Personnel',
  'Fournitures',
  'Autre'
];

export const ChargeForm: React.FC<ChargeFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(chargeSchema),
    defaultValues: initialData || {
      name: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
            Nom de la charge
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            placeholder="Ex: Électricité"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-white mb-1">
            Montant
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-white/40" />
            </div>
            <input
              type="number"
              id="amount"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.amount.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-white mb-1">
            Catégorie
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag size={16} className="text-white/40" />
            </div>
            <select
              id="category"
              {...register('category')}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 appearance-none"
            >
              <option value="" className="bg-gray-900">Sélectionner une catégorie</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-900">
                  {category}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-white mb-1">
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-white/40" />
            </div>
            <input
              type="date"
              id="date"
              {...register('date')}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
            Description (optionnelle)
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 resize-none"
            placeholder="Description détaillée de la charge..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          {isSubmitting ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};
