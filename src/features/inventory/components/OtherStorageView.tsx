import React, { useState } from 'react';
import { DollarSign, Calendar, Tag, Trash2, Edit, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { StorageLocationForm } from './StorageLocationForm';
import { OtherLocations } from './OtherLocations';

interface StorageLocation {
  id: string;
  name: string;
  type: 'frigo' | 'congélateur' | 'remise';
  capacity: number;
  occupation: number;
  icon: 'droplets' | 'thermometer' | 'package' | 'map';
}

export const OtherStorageView: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<StorageLocation | null>(null);

  const handleSubmit = (data: any) => {
    // Traiter les données du formulaire ici
    setShowForm(false);
    setEditingLocation(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-white">Lieux de stockage alternatifs</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
        >
          <Plus size={18} aria-hidden="true" />
          <span>Nouveau lieu</span>
        </button>
      </div>
      <OtherLocations />

      {showForm && (
        <Modal
          title={editingLocation ? "Modifier le lieu" : "Nouveau lieu"}
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingLocation(null);
          }}
        >
          <StorageLocationForm
            initialData={editingLocation || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingLocation(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};
