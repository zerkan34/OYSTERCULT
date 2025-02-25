import React from 'react';
import { PurchaseConfiguration } from '../components/PurchaseConfiguration';

export function PurchasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Achats</h1>
      </div>
      
      <PurchaseConfiguration />
    </div>
  );
}
