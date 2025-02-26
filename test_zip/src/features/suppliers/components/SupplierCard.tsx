import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, BadgeCheck, Trash2, BookOpen } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SupplierCardProps {
  supplier: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    friend_code: string | null;
    is_friend: boolean;
  };
  onDelete: (id: string) => void;
  onViewCatalog: (id: string) => void;
}

export function SupplierCard({ supplier, onDelete, onViewCatalog }: SupplierCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="w-[320px] h-[420px] bg-[rgb(var(--color-brand-surface)_/_0.5)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] hover:border-[rgb(var(--color-brand-primary)_/_0.5)] transition-all duration-300">
        <div className="relative">
          {/* En-tête avec dégradé */}
          <div className="h-32 bg-gradient-to-br from-[rgb(var(--color-brand-primary)_/_0.2)] to-[rgb(var(--color-brand-secondary)_/_0.2)] flex items-center justify-center">
            {/* Logo/Initiales de l'entreprise */}
            <div className="w-24 h-24 rounded-2xl bg-[rgb(var(--color-brand-surface))] flex items-center justify-center text-3xl font-bold text-[rgb(var(--color-brand-primary))] border-2 border-[rgb(var(--color-brand-primary)_/_0.3)] shadow-xl transform hover:scale-105 transition-transform duration-300">
              {supplier.name.split(' ').map(word => word[0]).join('')}
            </div>
          </div>

          {/* Badge "Ami" */}
          {supplier.is_friend && (
            <div className="absolute top-4 right-4 bg-emerald-500/10 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border border-emerald-500/20">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Ami</span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-6 flex flex-col h-[calc(420px-128px)]">
          <h3 className="text-xl font-semibold mb-4 text-center text-[rgb(var(--color-text))]">{supplier.name}</h3>
          
          <div className="space-y-3 flex-grow">
            <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="text-sm truncate">{supplier.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
              <Phone className="w-4 h-4 shrink-0" />
              <span className="text-sm">{supplier.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-sm truncate">{supplier.address}</span>
            </div>
            {supplier.friend_code && (
              <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="text-sm font-mono">{supplier.friend_code}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
            <button
              onClick={() => onViewCatalog(supplier.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[rgb(var(--color-brand-primary)_/_0.1)] hover:bg-[rgb(var(--color-brand-primary)_/_0.2)] text-[rgb(var(--color-brand-primary))] rounded-lg transition-colors duration-200"
            >
              <BookOpen className="w-4 h-4" />
              <span>Catalogue</span>
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center justify-center p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(supplier.id);
                setIsDeleteDialogOpen(false);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
