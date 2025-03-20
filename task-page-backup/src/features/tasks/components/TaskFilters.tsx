import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

const priorities: FilterOption[] = [
  { label: 'Haute', value: 'high' },
  { label: 'Moyenne', value: 'medium' },
  { label: 'Basse', value: 'low' }
];

const statuses: FilterOption[] = [
  { label: 'En attente', value: 'pending' },
  { label: 'En cours', value: 'in_progress' },
  { label: 'Terminé', value: 'completed' }
];

const categories: FilterOption[] = [
  { label: 'Production', value: 'production' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Contrôle qualité', value: 'quality' }
];

interface TaskFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export function TaskFilters({ isOpen, onClose, onApplyFilters }: TaskFiltersProps) {
  const [selectedPriorities, setSelectedPriorities] = React.useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });

  const handleApplyFilters = () => {
    onApplyFilters({
      priorities: selectedPriorities,
      statuses: selectedStatuses,
      categories: selectedCategories,
      dateRange
    });
    onClose();
  };

  const resetFilters = () => {
    setSelectedPriorities([]);
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setDateRange({ start: '', end: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-effect p-6 rounded-lg w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Filtres avancés</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Priorité</h3>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => {
                    setSelectedPriorities((prev) =>
                      prev.includes(priority.value)
                        ? prev.filter((p) => p !== priority.value)
                        : [...prev, priority.value]
                    );
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedPriorities.includes(priority.value)
                      ? 'bg-brand-burgundy text-white'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-3">Statut</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => {
                    setSelectedStatuses((prev) =>
                      prev.includes(status.value)
                        ? prev.filter((s) => s !== status.value)
                        : [...prev, status.value]
                    );
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedStatuses.includes(status.value)
                      ? 'bg-brand-burgundy text-white'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-3">Catégorie</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(category.value)
                        ? prev.filter((c) => c !== category.value)
                        : [...prev, category.value]
                    );
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCategories.includes(category.value)
                      ? 'bg-brand-burgundy text-white'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-3">Période</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Du</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Au</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={resetFilters}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Réinitialiser les filtres
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}