import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { StorageLocation, StorageType } from '@/types/inventory.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormMessage } from '@/components/ui/FormMessage';

const storageLocationSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  type: z.nativeEnum(StorageType),
  capacity: z.coerce.number().min(0, 'La capacité doit être supérieure ou égale à 0'),
  temperature: z.coerce.number().optional(),
  idealMinTemp: z.coerce.number().optional(),
  idealMaxTemp: z.coerce.number().optional(),
});

type FormData = z.infer<typeof storageLocationSchema>;

interface StorageLocationFormProps {
  initialData?: Partial<StorageLocation>;
  onSubmit: (data: Partial<StorageLocation>) => void;
  onCancel: () => void;
}

export const StorageLocationForm: React.FC<StorageLocationFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { 
    register, 
    handleSubmit, 
    control, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: zodResolver(storageLocationSchema),
    defaultValues: initialData || {
      name: '',
      type: StorageType.STORAGE,
      capacity: 100,
    }
  });

  const selectedType = watch('type');
  const needsTemperature = 
    selectedType === StorageType.REFRIGERATOR || 
    selectedType === StorageType.FREEZER;

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <form 
      onSubmit={handleSubmit(onFormSubmit)} 
      className="space-y-6 p-1"
      aria-label="Formulaire d'emplacement de stockage"
      noValidate
    >
      <div className="space-y-1">
        <Input
          id="name"
          label="Nom"
          placeholder="Nom de l'emplacement"
          error={errors.name?.message}
          {...register('name')}
          aria-required="true"
          aria-invalid={errors.name ? "true" : "false"}
        />
      </div>

      <div className="space-y-1">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              id="type"
              label="Type"
              value={field.value}
              onChange={field.onChange}
              error={errors.type?.message}
              aria-required="true"
              aria-invalid={errors.type ? "true" : "false"}
            >
              {Object.values(StorageType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          )}
        />
      </div>

      <div className="space-y-1">
        <Input
          id="capacity"
          type="number"
          label="Capacité (en kg)"
          min="0"
          step="0.1"
          placeholder="Capacité de stockage"
          error={errors.capacity?.message}
          {...register('capacity')}
          aria-required="true"
          aria-invalid={errors.capacity ? "true" : "false"}
        />
      </div>

      {needsTemperature && (
        <>
          <div className="space-y-1">
            <Input
              id="temperature"
              type="number"
              label="Température actuelle (°C)"
              step="0.1"
              placeholder="Température actuelle"
              error={errors.temperature?.message}
              {...register('temperature')}
              aria-invalid={errors.temperature ? "true" : "false"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Input
                id="idealMinTemp"
                type="number"
                label="Température minimale idéale (°C)"
                step="0.1"
                placeholder="Min"
                error={errors.idealMinTemp?.message}
                {...register('idealMinTemp')}
                aria-invalid={errors.idealMinTemp ? "true" : "false"}
              />
            </div>

            <div className="space-y-1">
              <Input
                id="idealMaxTemp"
                type="number"
                label="Température maximale idéale (°C)"
                step="0.1"
                placeholder="Max"
                error={errors.idealMaxTemp?.message}
                {...register('idealMaxTemp')}
                aria-invalid={errors.idealMaxTemp ? "true" : "false"}
              />
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Annuler les modifications"
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          aria-label={initialData ? "Mettre à jour l'emplacement" : "Créer l'emplacement"}
        >
          {isSubmitting ? (
            <>
              <span className="sr-only">Chargement</span>
              Traitement en cours...
            </>
          ) : initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};
