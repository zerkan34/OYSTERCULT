import React, { useState } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { SupplierCard } from '../components/SupplierCard';
import { Plus, Search, Users, Truck } from 'lucide-react';
import { SupplierDialog } from '../components/SupplierDialog';
import { useNavigate } from 'react-router-dom';
import { Supplier } from '@/types/supplier';
import { motion } from 'framer-motion';
import { PageTitle } from '@/components/ui/PageTitle';

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
    console.log('Bouton Catalogue cliqué, ID du fournisseur:', id);
    console.log('Navigation vers:', `/suppliers/${id}/catalog`);
    navigate(`/suppliers/${id}/catalog`);
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center mb-8">
          <div className="relative mr-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg" />
            <div className="relative z-10 p-3 rounded-full bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10">
              <Truck size={28} className="text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Fournisseurs
          </h1>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-white/70">Gérez vos fournisseurs et accédez à leurs catalogues</p>
          </div>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus size={20} />
            Ajouter un fournisseur
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-white/40" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 hover:border-cyan-400/30 transition-all text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              placeholder="Rechercher un fournisseur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher un fournisseur"
            />
          </div>
          
          <div className="flex items-center gap-2 text-white/70 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] px-4 py-2 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px] border border-white/10 min-w-[44px] min-h-[44px]">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-sm">{filteredSuppliers.length} fournisseurs</span>
          </div>
        </div>

        {filteredSuppliers.length === 0 ? (
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gradient-to-br from-[rgba(15,23,42,0.5)] to-[rgba(20,100,100,0.5)] backdrop-filter backdrop-blur-[10px] rounded-full p-4 mb-4 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]">
              <Users className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-white">Aucun fournisseur trouvé</h3>
            <p className="max-w-md text-white/70">
              {searchQuery 
                ? "Aucun résultat ne correspond à votre recherche. Essayez avec d'autres termes."
                : "Commencez par ajouter un fournisseur en cliquant sur le bouton ci-dessus."}
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
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
          </div>
        )}

        <SupplierDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </motion.div>
    </div>
  );
}
