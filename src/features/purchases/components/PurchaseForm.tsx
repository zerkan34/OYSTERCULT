import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { Camera, Upload } from 'lucide-react';

interface PurchaseFormData {
  productName: string;
  supplierName: string;
  expiryDate: string;
  storageLocation: string;
  invoice: File | null;
}

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseForm({ isOpen, onClose }: PurchaseFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PurchaseFormData>();
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);

  const onSubmit = (data: PurchaseFormData) => {
    console.log(data);
    // Ici, on enverrait les données à traçabilité, comptabilité et stock
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoicePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvel achat"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Nom du produit
            </label>
            <input
              {...register('productName', { required: 'Le nom du produit est requis' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.productName && (
              <p className="mt-1 text-sm text-red-400">{errors.productName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Nom du fournisseur
            </label>
            <input
              {...register('supplierName', { required: 'Le nom du fournisseur est requis' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.supplierName && (
              <p className="mt-1 text-sm text-red-400">{errors.supplierName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              DLC
            </label>
            <input
              type="date"
              {...register('expiryDate', { required: 'La DLC est requise' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-400">{errors.expiryDate.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Lieu de stockage
            </label>
            <input
              {...register('storageLocation', { required: 'Le lieu de stockage est requis' })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.storageLocation && (
              <p className="mt-1 text-sm text-red-400">{errors.storageLocation.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Facture (photo/scan)
          </label>
          <div className="flex flex-col items-center justify-center p-4 border border-dashed border-white/20 rounded-lg bg-white/5">
            {invoicePreview ? (
              <div className="w-full space-y-3">
                <img 
                  src={invoicePreview} 
                  alt="Aperçu de la facture" 
                  className="max-h-48 mx-auto object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setInvoicePreview(null)}
                  className="w-full py-2 text-sm text-white/70 hover:text-white border border-white/10 rounded-lg transition-colors"
                >
                  Supprimer et choisir une autre
                </button>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="flex justify-center">
                  <label htmlFor="invoice-upload" className="cursor-pointer bg-white/10 hover:bg-white/15 text-white rounded-lg px-4 py-3 flex items-center justify-center transition-colors duration-200">
                    <Upload size={20} className="mr-2" />
                    <span>Choisir un fichier</span>
                    <input
                      id="invoice-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <div className="text-center">
                  <span className="text-sm text-white/40">ou</span>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="bg-white/10 hover:bg-white/15 text-white rounded-lg px-4 py-3 flex items-center justify-center transition-colors duration-200"
                  >
                    <Camera size={20} className="mr-2" />
                    <span>Prendre une photo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-white/50">La facture sera disponible dans Traçabilité et Comptabilité</p>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/90 rounded-lg text-white transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  );
}
