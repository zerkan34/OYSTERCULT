import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Save, Send, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { InvoiceWithItems, PaymentTerms, TaxRate } from '@/types/accounting';

const mockPaymentTerms: PaymentTerms[] = [
  { id: '1', name: 'À réception', days: 0 },
  { id: '2', name: '30 jours', days: 30 },
  { id: '3', name: '60 jours', days: 60 }
];

const mockTaxRates: TaxRate[] = [
  { id: '1', name: 'TVA 20%', rate: 20, isDefault: true },
  { id: '2', name: 'TVA 10%', rate: 10, isDefault: false },
  { id: '3', name: 'TVA 5.5%', rate: 5.5, isDefault: false }
];

interface InvoiceFormProps {
  type: 'sale' | 'purchase';
  initialData?: Partial<InvoiceWithItems>;
  onSubmit: (data: InvoiceWithItems) => void;
  onCancel: () => void;
}

export function InvoiceForm({ type, initialData, onSubmit, onCancel }: InvoiceFormProps) {
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<InvoiceWithItems>({
    defaultValues: {
      type,
      status: 'draft',
      date: format(new Date(), 'yyyy-MM-dd'),
      items: initialData?.items || [{ description: '', quantity: 1, unit_price: 0, tax_rate: 20 }],
      ...initialData
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const items = watch('items');

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const calculateTax = () => {
    return items.reduce((sum, item) => {
      const taxRate = item.tax_rate || 20;
      return sum + (item.quantity * item.unit_price * (taxRate / 100));
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          {type === 'sale' ? 'Nouvelle Facture' : 'Nouvelle Facture Fournisseur'}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
          >
            <Save size={20} className="mr-2" />
            Enregistrer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            {type === 'sale' ? 'Client' : 'Fournisseur'}
          </label>
          <select
            {...register('customer_id')}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="">Sélectionner...</option>
            {/* TODO: Add customers/suppliers list */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Date
          </label>
          <input
            type="date"
            {...register('date')}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Conditions de paiement
          </label>
          <select
            {...register('payment_terms')}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            {mockPaymentTerms.map(term => (
              <option key={term.id} value={term.id}>
                {term.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Articles</h3>
          <button
            type="button"
            onClick={() => append({ description: '', quantity: 1, unit_price: 0, tax_rate: 20 })}
            className="flex items-center px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Ajouter un article
          </button>
        </div>

        <div className="bg-white/5 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Description</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-white">Quantité</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-white">Prix unitaire</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-white">TVA</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-white">Total HT</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b border-white/10">
                  <td className="px-4 py-3">
                    <input
                      {...register(`items.${index}.description`)}
                      className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white"
                      placeholder="Description de l'article"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`)}
                      className="w-24 px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                      min="1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.unit_price`)}
                      className="w-32 px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      {...register(`items.${index}.tax_rate`)}
                      className="w-32 px-3 py-1 bg-white/5 border border-white/10 rounded text-white"
                    >
                      {mockTaxRates.map(tax => (
                        <option key={tax.id} value={tax.rate}>
                          {tax.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right text-white">
                    {(items[index]?.quantity * items[index]?.unit_price).toFixed(2)}€
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1 text-white/60 hover:text-white transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Sous-total HT</span>
              <span className="text-white">{calculateSubtotal().toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">TVA</span>
              <span className="text-white">{calculateTax().toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-base font-medium pt-2 border-t border-white/10">
              <span className="text-white">Total TTC</span>
              <span className="text-white">{calculateTotal().toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Notes
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          placeholder="Notes ou conditions particulières..."
        />
      </div>
    </form>
  );
}