import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stock, Product, StorageLocation, UnitType, StockStatus } from '@/types/inventory.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { FormMessage } from '@/components/ui/FormMessage';
import { Textarea } from '@/components/ui/Textarea';
import { useInventory } from '../hooks/useInventory';
import '../pages/StockPage.css';

const stockSchema = z.object({
  productId: z.string().min(1, 'Veuillez sélectionner un produit'),
  storageLocationId: z.string().min(1, 'Veuillez sélectionner un emplacement'),
  quantity: z.coerce.number().min(0.01, 'La quantité doit être supérieure à 0'),
  unitType: z.nativeEnum(UnitType),
  batchNumber: z.string().optional(),
  arrivalDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Date d\'arrivée invalide',
  }),
  expiryDate: z.string().optional()
    .refine(val => !val || !isNaN(Date.parse(val)), {
      message: 'Date d\'expiration invalide',
    }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof stockSchema>;

interface StockFormProps {
  initialData?: Stock;
  locationId?: string;
  productId?: string;
  onSubmit?: (data: Partial<Stock>) => void;
  onCancel: () => void;
}

export const StockForm: React.FC<StockFormProps> = ({
  initialData,
  locationId,
  productId,
  onSubmit,
  onCancel
}) => {
  const { 
    products, 
    storageLocations,
    loadProducts,
    loadStorageLocations,
    addStock,
    isLoading
  } = useInventory();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { 
    register, 
    handleSubmit, 
    control, 
    watch,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: zodResolver(stockSchema),
    defaultValues: initialData ? {
      ...initialData,
      arrivalDate: new Date(initialData.arrivalDate).toISOString().split('T')[0],
      expiryDate: initialData.expiryDate 
        ? new Date(initialData.expiryDate).toISOString().split('T')[0] 
        : undefined,
    } : {
      productId: productId || '',
      storageLocationId: locationId || '',
      quantity: 0,
      unitType: UnitType.KG,
      arrivalDate: new Date().toISOString().split('T')[0],
    }
  });

  const selectedProductId = watch('productId');
  
  // Charger les produits et emplacements de stockage
  useEffect(() => {
    loadProducts();
    loadStorageLocations();
  }, [loadProducts, loadStorageLocations]);
  
  // Mettre à jour l'unité en fonction du produit sélectionné
  useEffect(() => {
    const product = products.find(p => p.id === selectedProductId);
    if (product) {
      setSelectedProduct(product);
      setValue('unitType', product.unitType);
    }
  }, [selectedProductId, products, setValue]);

  const onFormSubmit = async (data: FormData) => {
    // Convertir les dates
    const stockData: Omit<Stock, "id" | "createdAt" | "updatedAt"> = {
      arrivalDate: new Date(data.arrivalDate),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      batchNumber: data.batchNumber,
      quantity: data.quantity,
      notes: data.notes,
      productId: data.productId,
      storageLocationId: data.storageLocationId,
      unitType: data.unitType,
      status: StockStatus.AVAILABLE
    };
    
    try {
      if (initialData) {
        // Mode mise à jour
        if (onSubmit) {
          onSubmit(stockData);
        }
      } else {
        // Mode ajout
        await addStock(stockData);
        onCancel(); // Fermer le formulaire après ajout
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="stock-form space-y-4">
      <div>
        <Label htmlFor="productId">Produit</Label>
        <Controller
          control={control}
          name="productId"
          render={({ field }) => (
            <div>
              <select
                id="productId"
                value={field.value}
                onChange={field.onChange}
                disabled={!!productId || isSubmitting}
                className={`stock-input ${errors.productId ? 'border-red-500' : ''}`}
              >
                <option value="">Sélectionner un produit</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.productId && <FormMessage>{errors.productId.message}</FormMessage>}
            </div>
          )}
        />
      </div>

      <div>
        <Label htmlFor="storageLocationId">Emplacement</Label>
        <Controller
          control={control}
          name="storageLocationId"
          render={({ field }) => (
            <div>
              <select
                id="storageLocationId"
                value={field.value}
                onChange={field.onChange}
                disabled={!!locationId || isSubmitting}
                className={`stock-input ${errors.storageLocationId ? 'border-red-500' : ''}`}
              >
                <option value="">Sélectionner un emplacement</option>
                {storageLocations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {errors.storageLocationId && <FormMessage>{errors.storageLocationId.message}</FormMessage>}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantité</Label>
          <Input
            id="quantity"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Quantité"
            {...register('quantity')}
            className={`stock-input ${errors.quantity ? 'border-red-500' : ''}`}
          />
          {errors.quantity && <FormMessage>{errors.quantity.message}</FormMessage>}
        </div>

        <div>
          <Label htmlFor="unitType">Unité</Label>
          <Controller
            control={control}
            name="unitType"
            render={({ field }) => (
              <div>
                <select
                  id="unitType"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!!selectedProduct}
                  className={`stock-input ${errors.unitType ? 'border-red-500' : ''}`}
                >
                  <option value="">Sélectionner une unité</option>
                  {Object.values(UnitType).map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                {errors.unitType && <FormMessage>{errors.unitType.message}</FormMessage>}
              </div>
            )}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="batchNumber">Numéro de lot (optionnel)</Label>
        <Input
          id="batchNumber"
          placeholder="Numéro de lot ou de série"
          {...register('batchNumber')}
          className={`stock-input ${errors.batchNumber ? 'border-red-500' : ''}`}
        />
        {errors.batchNumber && <FormMessage>{errors.batchNumber.message}</FormMessage>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="arrivalDate">Date d'arrivée</Label>
          <Input
            id="arrivalDate"
            type="date"
            {...register('arrivalDate')}
            className={`stock-input ${errors.arrivalDate ? 'border-red-500' : ''}`}
          />
          {errors.arrivalDate && <FormMessage>{errors.arrivalDate.message}</FormMessage>}
        </div>

        <div>
          <Label htmlFor="expiryDate">Date d'expiration (optionnel)</Label>
          <Input
            id="expiryDate"
            type="date"
            {...register('expiryDate')}
            className={`stock-input ${errors.expiryDate ? 'border-red-500' : ''}`}
          />
          {errors.expiryDate && <FormMessage>{errors.expiryDate.message}</FormMessage>}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Textarea
          id="notes"
          placeholder="Notes additionnelles sur ce stock"
          {...register('notes')}
          className={`stock-input ${errors.notes ? 'border-red-500' : ''}`}
        />
        {errors.notes && <FormMessage>{errors.notes.message}</FormMessage>}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
          className="stock-btn"
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting || isLoading}
          className="stock-btn stock-btn-primary"
        >
          {isSubmitting || isLoading ? 'Traitement en cours...' : initialData ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};
