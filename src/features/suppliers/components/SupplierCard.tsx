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
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700/50 hover:border-brand-purple/50 transition-all duration-300">
        <div className="relative">
          {/* En-tête avec dégradé */}
          <div className="h-32 bg-gradient-to-br from-brand-purple/20 to-brand-burgundy/20 flex items-center justify-center">
            {/* Logo/Initiales de l'entreprise */}
            <div className="w-24 h-24 rounded-2xl bg-gray-800 flex items-center justify-center text-3xl font-bold text-brand-purple border-2 border-brand-purple/30 shadow-xl transform hover:scale-105 transition-transform duration-300">
              {supplier.name.split(' ').map(word => word[0]).join('')}
            </div>
          </div>

          {/* Badge "Ami" */}
          {supplier.is_friend && (
            <div className="absolute top-4 right-4 bg-green-500/10 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border border-green-500/20">
              <BadgeCheck className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Ami</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Nom et code ami */}
          <div className="mb-6 text-center">
            <h3 className="text-xl font-bold text-white mb-1">
              {supplier.name}
            </h3>
            {supplier.friend_code && (
              <p className="text-sm text-gray-400">
                Code Ami: {supplier.friend_code}
              </p>
            )}
          </div>

          {/* Informations de contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300 group">
              <Building2 className="w-4 h-4 text-brand-purple group-hover:text-brand-burgundy transition-colors" />
              <span className="text-sm">Fournisseur d'huîtres</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 group">
              <Mail className="w-4 h-4 text-brand-purple group-hover:text-brand-burgundy transition-colors" />
              <span className="text-sm">{supplier.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 group">
              <Phone className="w-4 h-4 text-brand-purple group-hover:text-brand-burgundy transition-colors" />
              <span className="text-sm">{supplier.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 group">
              <MapPin className="w-4 h-4 text-brand-purple group-hover:text-brand-burgundy transition-colors" />
              <span className="text-sm">{supplier.address}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700/50 flex justify-end gap-2">
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewCatalog(supplier.id)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Catalogue
          </button>
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Êtes-vous sûr de vouloir supprimer le fournisseur {supplier.name} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => onDelete(supplier.id)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
