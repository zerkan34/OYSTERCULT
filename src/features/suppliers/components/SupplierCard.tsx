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
  const initials = supplier.name.split(' ').map(word => word[0]).join('');

  return (
    <>
      <div className="w-full bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 p-4 space-y-4 transition-all duration-300">
        <div className="relative">
          <div className="h-24 flex items-center justify-center">
            {/* Logo/Initiales stylisé */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg"></div>
              <div className="relative w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-[rgba(15,23,42,0.4)] to-[rgba(20,100,100,0.4)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 z-10">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{initials}</span>
              </div>
            </div>
          </div>

          {/* Badge "Ami" */}
          {supplier.is_friend && (
            <div className="absolute top-2 right-2 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(16,185,129,0.2)] backdrop-filter backdrop-blur-[10px] rounded-full px-3 py-1 flex items-center gap-1 border border-emerald-500/20 shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_5px_rgba(16,185,129,0.2)]">
              <BadgeCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400">Ami</span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">{supplier.name}</h3>
          
          <div className="text-xs text-white/70 space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-3 h-3 shrink-0 text-cyan-400" />
              <span>{supplier.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 shrink-0 text-cyan-400" />
              <span>{supplier.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 shrink-0 text-cyan-400" />
              <span>{supplier.email}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              onClick={() => onViewCatalog(supplier.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
              aria-label={`Voir le catalogue de ${supplier.name}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Catalogue</span>
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center justify-center p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 border border-white/5 hover:border-red-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.3),0_0_10px_rgba(239,68,68,0.2)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500/40"
              aria-label={`Supprimer ${supplier.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gradient-to-br from-[rgba(15,23,42,0.8)] to-[rgba(20,100,100,0.8)] backdrop-filter backdrop-blur-[10px] border border-white/10 shadow-[rgba(0,0,0,0.4)_0px_10px_25px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(supplier.id);
                setIsDeleteDialogOpen(false);
              }}
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(239,68,68,0.2)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all duration-300"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
