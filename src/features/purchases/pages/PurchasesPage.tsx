import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { PurchaseConfiguration } from '../components/PurchaseConfiguration';

export function PurchasesPage() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-burgundy/20 blur-xl rounded-full" />
          <ShoppingCart size={24} className="text-brand-burgundy relative z-10" />
        </div>
        <h1 className="text-2xl font-bold text-white">Gestion des Achats</h1>
      </div>

      {/* Contenu */}
      <div className="glass-effect rounded-xl p-6">
        <PurchaseConfiguration />
      </div>
    </div>
  );
}
