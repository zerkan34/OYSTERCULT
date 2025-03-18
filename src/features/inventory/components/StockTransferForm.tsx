import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stock, Product } from '@/types/inventory.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { FormMessage } from '@/components/ui/FormMessage';
import { useInventory } from '../hooks/useInventory';
import '../pages/StockPage.css';

const transferSchema = z.object({
  targetLocationId: z.string().min(1, 'Veuillez sélectionner un emplacement de destination'),
  quantity: z.coerce.number()
    .min(0.01, 'La quantité doit être supérieure à 0')
    .refine(val => val > 0, {
      message: 'La quantité de transfert doit être supérieure à 0',
    }),
});

type FormData = z.infer<typeof transferSchema>;

interface StockTransferFormProps {
  stock: Stock;
  onSubmit: (targetLocationId: string, quantity: number) => void;
  onCancel: () => void;
}

export const StockTransferForm: React.FC<StockTransferFormProps> = ({
  stock,
  onSubmit,
  onCancel
}) => {
  const { 
    storageLocations,
    loadStorageLocations,
    isLoading
  } = useInventory();
  
  const { 
    register, 
    handleSubmit, 
    control, 
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      targetLocationId: '',
      quantity: stock.quantity > 0 ? Math.min(stock.quantity, 1) : 0,
    }
  });

  // Charger les emplacements de stockage
  const loadStorageLocationsEffect = () => {
    loadStorageLocations();
  };

  React.useEffect(loadStorageLocationsEffect, [loadStorageLocations]);

  const onFormSubmit = (data: FormData) => {
    onSubmit(data.targetLocationId, data.quantity);
  };

  // Filtrer les emplacements pour exclure l'emplacement actuel
  const availableLocations = storageLocations.filter(
    location => location.id !== stock.storageLocationId
  );

  const getProductName = (productId: string) => {
    // Implement the logic to get the product name from the product ID
    // For now, just return the product ID
    return productId;
  };

  return (
    <div className="stock-modal-overlay" onClick={onCancel}>
      <div 
        className="stock-modal stock-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        <div className="stock-modal-header">
          <h2 className="stock-modal-title">Transférer le stock</h2>
          <button className="close-modal-btn" onClick={onCancel}>
            {/* <X size={24} /> */}
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="stock-form space-y-4">
          <div>
            <Label htmlFor="product">Produit</Label>
            <Input 
              id="product"
              type="text"
              value={getProductName(stock.productId)}
              disabled
              className="stock-input"
            />
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantité disponible</Label>
            <Input 
              id="quantity"
              type="text"
              value={`${stock.quantity} ${stock.unitType}`}
              disabled
              className="stock-input"
            />
          </div>
          
          <div>
            <Label htmlFor="transferQuantity">Quantité à transférer</Label>
            <Controller
              control={control}
              name="quantity"
              render={({ field }) => (
                <div>
                  <Input 
                    id="transferQuantity"
                    type="number"
                    {...field}
                    min="0"
                    max={stock.quantity}
                    className={`stock-input ${errors.quantity ? 'border-red-500' : ''}`}
                  />
                  {errors.quantity && <FormMessage>{errors.quantity.message}</FormMessage>}
                </div>
              )}
            />
          </div>
          
          <div>
            <Label htmlFor="targetLocationId">Emplacement de destination</Label>
            <Controller
              control={control}
              name="targetLocationId"
              render={({ field }) => (
                <div>
                  <select
                    id="targetLocationId"
                    {...field}
                    className={`stock-input ${errors.targetLocationId ? 'border-red-500' : ''}`}
                  >
                    <option value="">Sélectionner un emplacement</option>
                    {availableLocations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {errors.targetLocationId && <FormMessage>{errors.targetLocationId.message}</FormMessage>}
                </div>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              type="button"
              onClick={onCancel}
              className="stock-btn"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="stock-btn stock-btn-primary"
            >
              {isSubmitting || isLoading ? 'Transfert en cours...' : 'Transférer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
