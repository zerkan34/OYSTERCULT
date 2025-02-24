import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Filter } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

const categories: FilterOption[] = [
  { label: 'Huîtres', value: 'huitres' },
  { label: 'Matériels', value: 'materiels' },
  { label: 'Emballages', value: 'emballages' }
];

const locations: FilterOption[] = [
  { label: 'Zone A', value: 'zone_a' },
  { label: 'Zone B', value: 'zone_b' },
  { label: 'Zone C', value: 'zone_c' }
];

const stockStatus: FilterOption[] = [
  { label: 'En stock', value: 'in_stock' },
  { label: 'Stock faible', value: 'low_stock' },
  { label: 'Rupture', value: 'out_of_stock' }
];

interface InventoryFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export function InventoryFilters({ isOpen, onClose, onApplyFilters }: InventoryFiltersProps) {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<{ min: string; max: string }>({
    min: '',
    max: ''
  });

  const handleApplyFilters = () => {
    onApplyFilters({
      categories: selectedCategories,
      locations: selectedLocations,
      status: selectedStatus,
      priceRange
    });
    onClose();
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedStatus([]);
    setPriceRange({ min: '', max: '' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filtres avancés"
      size="xl"
    >
      <div className="space-y-6">
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
                    ? 'bg-brand-primary text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white mb-3">Emplacement</h3>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <button
                key={location.value}
                onClick={() => {
                  setSelectedLocations((prev) =>
                    prev.includes(location.value)
                      ? prev.filter((l) => l !== location.value)
                      : [...prev, location.value]
                  );
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedLocations.includes(location.value)
                    ? 'bg-brand-primary text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {location.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white mb-3">Statut du stock</h3>
          <div className="flex flex-wrap gap-2">
            {stockStatus.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  setSelectedStatus((prev) =>
                    prev.includes(status.value)
                      ? prev.filter((s) => s !== status.value)
                      : [...prev, status.value]
                  );
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedStatus.includes(status.value)
                    ? 'bg-brand-primary text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white mb-3">Fourchette de prix</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Prix minimum</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Prix maximum</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="100"
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
              className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-brand-primary rounded-lg text-sm text-white hover:bg-brand-primary/90 transition-colors"
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}