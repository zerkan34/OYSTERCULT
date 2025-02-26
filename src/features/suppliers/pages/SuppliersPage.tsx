import React, { useState } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { SupplierCard } from '../components/SupplierCard';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SuppliersPage() {
  const { suppliers, isLoading, updateSupplier } = useSuppliers();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await updateSupplier.mutateAsync({ id, deleted: true });
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleViewCatalog = (id: string) => {
    navigate(`/suppliers/${id}/catalog`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Fournisseurs</h1>
          <p className="text-gray-400">Gérez vos fournisseurs et accédez à leurs catalogues</p>
        </div>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Ajouter un fournisseur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {suppliers.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            onDelete={handleDelete}
            onViewCatalog={handleViewCatalog}
          />
        ))}
      </div>

      {/* TODO: Add SupplierDialog component for adding/editing suppliers */}
    </div>
  );
}
