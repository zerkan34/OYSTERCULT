import React from 'react';
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export function FriendSuppliers() {
  const { suppliers } = useSuppliers();
  const friendSuppliers = suppliers.filter(s => s.is_friend);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fournisseurs Partenaires</h2>
        <Badge variant="outline" className="text-[rgb(var(--color-brand-primary))]">
          {friendSuppliers.length} partenaires
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friendSuppliers.map(supplier => (
          <div
            key={supplier.id}
            className="bg-[rgb(var(--color-brand-surface)_/_0.5)] backdrop-blur-sm rounded-xl border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] overflow-hidden hover:border-[rgb(var(--color-brand-primary)_/_0.5)] transition-all duration-300"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">{supplier.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-mono">{supplier.friend_code}</span>
                </div>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
