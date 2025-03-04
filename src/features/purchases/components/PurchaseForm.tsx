import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { Camera, Upload, Star } from 'lucide-react';
import { MessageSquare, X, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PurchaseFormData {
  productName: string;
  supplierName: string;
  expiryDate: string;
  storageLocation: string;
  quantity: number;
  unitPrice: number;
  rating: number;
  notes: string;
  invoice: File | null;
}

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderDetailsProps {
  order: {
    id: string;
    productName: string;
    rating?: number;
  };
  onClose: () => void;
}

export function PurchaseForm({ isOpen, onClose }: PurchaseFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PurchaseFormData>({
    defaultValues: {
      rating: 0,
      quantity: 1,
      unitPrice: 0,
    }
  });
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);
  const rating = watch('rating');
  
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

  const handleRating = (value: number) => {
    setValue('rating', value);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Quantité
            </label>
            <input
              type="number"
              min="1"
              {...register('quantity', { 
                required: 'La quantité est requise',
                min: { value: 1, message: 'La quantité doit être supérieure à 0' }
              })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-400">{errors.quantity.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Prix unitaire (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('unitPrice', { 
                required: 'Le prix unitaire est requis',
                min: { value: 0, message: 'Le prix doit être positif' }
              })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            {errors.unitPrice && (
              <p className="mt-1 text-sm text-red-400">{errors.unitPrice.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Note de qualité
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRating(value)}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  className={`${
                    value <= rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-white/20'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Notes / Commentaires
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
            placeholder="Ajoutez des notes ou commentaires sur l'achat..."
          />
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

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'performance'>('comments');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: Implement message sending
    setMessage('');
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
    >
      <div className="h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Commande #{order.id}</h2>
              <p className="text-white/60 mt-1">{order.productName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10">
          <div className="flex space-x-4 px-6">
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'comments'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare size={16} />
                <span>Commentaires</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'performance'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart2 size={16} />
                <span>Performances</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'comments' ? (
            <div className="p-6 space-y-6">
              {/* Comments list */}
              <div className="space-y-4">
                {/* Add comments here */}
              </div>

              {/* Comment input */}
              <form onSubmit={handleSendMessage} className="mt-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 rounded-lg text-white transition-colors"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Performance content */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Évaluation du produit</h3>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      size={24}
                      className={`${
                        value <= (order.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-white/60">
                  Note: {order.rating}/5
                </p>
                {/* Add more performance metrics here */}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}