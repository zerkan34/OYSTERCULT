import React, { useState } from 'react';
import { Plus, Edit2, Trash2, QrCode } from 'lucide-react';
import { useSuppliers } from '../hooks/useSuppliers';
import { SupplierForm } from './SupplierForm';
import { QRCodeDialog } from './QRCodeDialog';
import type { Supplier } from '@/types/supplier';

export function SuppliersList() {
  const { suppliers, deleteSupplier } = useSuppliers();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showQRCode, setShowQRCode] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      await deleteSupplier.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Ajouter un fournisseur</span>
        </button>
      </div>

      <div className="grid gap-4">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">{supplier.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {supplier.email} • {supplier.phone}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {supplier.address}
                </p>
                {supplier.friend_code && (
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Code Ami: {supplier.friend_code}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowQRCode(supplier.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  title="Voir le QR Code"
                >
                  <QrCode size={20} />
                </button>
                <button
                  onClick={() => setEditingSupplier(supplier)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  title="Modifier"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                  title="Supprimer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(showAddForm || editingSupplier) && (
        <SupplierForm
          supplier={editingSupplier}
          onClose={() => {
            setShowAddForm(false);
            setEditingSupplier(null);
          }}
        />
      )}

      {showQRCode && (
        <QRCodeDialog
          supplierId={showQRCode}
          onClose={() => setShowQRCode(null)}
        />
      )}
    </div>
  );
}
