import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/index";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { useSuppliers } from '../hooks/useSuppliers';
import { Building2, User, Mail, Phone, MapPin } from 'lucide-react';

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSupplier?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export function SupplierDialog({ open, onOpenChange, editingSupplier }: SupplierDialogProps) {
  const { addSupplier, updateSupplier } = useSuppliers();
  const isEditing = !!editingSupplier;

  const [formState, setFormState] = useState({
    name: editingSupplier?.name || '',
    email: editingSupplier?.email || '',
    phone: editingSupplier?.phone || '',
    address: editingSupplier?.address || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));

    // Effacer l'erreur lorsque l'utilisateur corrige le champ
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formState.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formState.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }
    
    if (!formState.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && editingSupplier) {
        await updateSupplier.mutateAsync({
          id: editingSupplier.id,
          ...formState,
        });
      } else {
        await addSupplier.mutateAsync(formState);
      }
      
      onOpenChange(false);
      setFormState({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
    } catch (error) {
      console.error('Error saving supplier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#1a1c25] text-white border-[#2a2d3a]">
        <DialogHeader>
          <DialogTitle className="text-white">{isEditing ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations du fournisseur ci-dessous.'
              : 'Remplissez les informations du nouveau fournisseur.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 my-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-indigo-400" />
              Nom du fournisseur
            </Label>
            <Input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Atlantique Coquillages"
              className={`bg-[#12141d] border-[#2a2d3a] focus:border-indigo-500 text-white ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-indigo-400" />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="contact@atlantique-coquillages.fr"
              className={`bg-[#12141d] border-[#2a2d3a] focus:border-indigo-500 text-white ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-indigo-400" />
              Téléphone
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              placeholder="01 23 45 67 89"
              className={`bg-[#12141d] border-[#2a2d3a] focus:border-indigo-500 text-white ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-indigo-400" />
              Adresse
            </Label>
            <Input
              id="address"
              name="address"
              value={formState.address}
              onChange={handleChange}
              placeholder="42 Avenue du Port, 85230 Bouin"
              className={`bg-[#12141d] border-[#2a2d3a] focus:border-indigo-500 text-white ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-[#2a2d3a] text-white hover:bg-[#2a2d3a] hover:text-white"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
            >
              {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
