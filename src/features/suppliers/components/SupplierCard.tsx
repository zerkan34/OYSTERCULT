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
  
  // Fonction pour générer un dégradé cohérent basé sur les initiales
  const getGradientColors = (text: string) => {
    // Génère un hash simple à partir du texte
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Utilise différentes teintes de bleu, violet, et cyan en fonction du hash
    const hue1 = ((hash & 0xFF) % 60) + 220; // 220-280 (bleus et violets)
    const hue2 = ((hash & 0xFF) % 40) + 180; // 180-220 (cyans et bleus)
    
    return {
      from: `hsl(${hue1}, 70%, 65%)`,
      to: `hsl(${hue2}, 80%, 40%)`,
      text: `hsl(${hue1 - 10}, 80%, 75%)`
    };
  };
  
  const colors = getGradientColors(supplier.name);

  return (
    <>
      <div className="w-full glass-effect rounded-xl p-4 space-y-4 bg-[rgba(0,40,80,0.2)] shadow-[rgba(0,0,0,0.15)_0px_5px_12px,rgba(0,210,200,0.05)_0px_0px_3px_inset] hover:shadow-[rgba(0,0,0,0.25)_0px_8px_20px,rgba(0,210,200,0.15)_0px_0px_10px_inset] transition-all duration-300">
        <div className="relative">
          {/* En-tête avec dégradé personnalisé */}
          <div 
            className="h-24 flex items-center justify-center"
          >
            {/* Logo/Initiales stylisé */}
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg transform transition-transform duration-300 relative"
              style={{
                background: `linear-gradient(135deg, ${colors.from}30 0%, ${colors.to}50 100%)`,
                boxShadow: 'rgba(0,0,0,0.2) 0px 4px 12px, rgba(0,210,200,0.1) 0px 0px 8px inset',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {initials}
            </div>
          </div>

          {/* Badge "Ami" */}
          {supplier.is_friend && (
            <div className="absolute top-2 right-2 bg-emerald-500/10 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border border-emerald-500/20 shadow-emerald-500/10 shadow-sm">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Ami</span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">{supplier.name}</h3>
          
          <div className="text-xs text-white/70 space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-3 h-3 shrink-0" />
              <span>{supplier.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 shrink-0" />
              <span>{supplier.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 shrink-0" />
              <span>{supplier.email}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-[#2a2d3a]">
            <button
              onClick={() => onViewCatalog(supplier.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group-hover:translate-y-[-2px]"
              style={{
                background: `linear-gradient(135deg, ${colors.from}30 0%, ${colors.to}50 100%)`,
                color: colors.text,
                boxShadow: `0 4px 10px -2px ${colors.to}20`,
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Catalogue</span>
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
