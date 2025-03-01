import React, { useState } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { SupplierCard } from '../components/SupplierCard';
import { Plus, Search, Users } from 'lucide-react';
import { SupplierDialog } from '../components/SupplierDialog';
import { useNavigate } from 'react-router-dom';
import { Supplier } from '@/types/supplier';

export function SuppliersPage() {
  const { suppliers, isLoading, updateSupplier } = useSuppliers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg hover:shadow-indigo-500/20 duration-300"
        >
          <Plus className="w-5 h-5" />
          Ajouter un fournisseur
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-[#1a1c25] border border-[#2a2d3a] text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
            placeholder="Rechercher un fournisseur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 text-gray-400 bg-[#1a1c25] px-3 py-1.5 rounded-lg border border-[#2a2d3a]">
          <Users className="w-4 h-4" />
          <span className="text-sm">{filteredSuppliers.length} fournisseurs</span>
        </div>
      </div>

      {filteredSuppliers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
          <div className="bg-[#1a1c25] rounded-full p-4 mb-4">
            <Users className="w-8 h-8 text-indigo-500 opacity-70" />
          </div>
          <h3 className="text-xl font-medium mb-2">Aucun fournisseur trouvé</h3>
          <p className="max-w-md text-gray-500">
            {searchQuery 
              ? "Aucun résultat ne correspond à votre recherche. Essayez avec d'autres termes."
              : "Commencez par ajouter un fournisseur en cliquant sur le bouton ci-dessus."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onDelete={handleDelete}
              onViewCatalog={handleViewCatalog}
            />
          ))}
        </div>
      )}

      <SupplierDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
