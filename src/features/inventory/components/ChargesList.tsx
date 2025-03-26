import React, { useState } from 'react';
import { DollarSign, Calendar, Tag, Trash2, Edit, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { ChargeForm } from './ChargeForm';

interface Charge {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

const mockCharges: Charge[] = [
  {
    id: '1',
    name: 'Électricité',
    amount: 450.50,
    category: 'Énergie',
    date: '2025-03-15',
    description: 'Facture mensuelle d\'électricité'
  },
  {
    id: '2',
    name: 'Maintenance',
    amount: 250.00,
    category: 'Équipement',
    date: '2025-03-10',
    description: 'Entretien des bassins'
  },
  {
    id: '3',
    name: 'Carburant',
    amount: 180.75,
    category: 'Transport',
    date: '2025-03-08'
  }
];

export const ChargesList: React.FC = () => {
  const [selectedCharge, setSelectedCharge] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleEdit = (charge: Charge) => {
    setEditingCharge(charge);
    setShowForm(true);
  };

  const handleSubmit = (data: any) => {
    // Traiter les données du formulaire ici
    setShowForm(false);
    setEditingCharge(null);
  };

  return (
    <>
      <div className="space-y-4">
        {mockCharges.map((charge) => (
          <motion.div
            key={charge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <DollarSign className="text-cyan-400" size={20} aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white font-medium">{charge.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar size={14} aria-hidden="true" />
                    <span>{formatDate(charge.date)}</span>
                    <Tag size={14} aria-hidden="true" />
                    <span>{charge.category}</span>
                  </div>
                  {charge.description && (
                    <p className="text-sm text-white/70">{charge.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-medium text-white">
                  {formatAmount(charge.amount)}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(charge)}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-cyan-400 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    aria-label={`Modifier la charge ${charge.name}`}
                  >
                    <Edit size={16} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => {/* Supprimer la charge */}}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-red-400 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    aria-label={`Supprimer la charge ${charge.name}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showForm && (
        <Modal
          title={editingCharge ? "Modifier la charge" : "Nouvelle charge"}
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingCharge(null);
          }}
        >
          <ChargeForm
            initialData={editingCharge || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingCharge(null);
            }}
          />
        </Modal>
      )}
    </>
  );
};
