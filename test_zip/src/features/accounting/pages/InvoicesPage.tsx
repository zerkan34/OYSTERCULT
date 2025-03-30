import React, { useState } from 'react';
import { Plus, Filter, Search, FileText, Download } from 'lucide-react';
import { InvoiceList } from '../components/InvoiceList';
import { InvoiceForm } from '../components/InvoiceForm';
import type { InvoiceWithItems } from '@/types/accounting';
import { Dialog } from '@/components/ui/Dialog';

export function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases'>('sales');
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithItems | null>(null);

  const handleCreateInvoice = (data: InvoiceWithItems) => {
    console.log('Creating invoice:', data);
    setShowNewInvoice(false);
  };

  const handleEditInvoice = (invoice: InvoiceWithItems) => {
    setEditingInvoice(invoice);
  };

  const handleDeleteInvoice = (invoice: InvoiceWithItems) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la facture ${invoice.id} ?`)) {
      console.log('Deleting invoice:', invoice.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Factures</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewInvoice(true)}
            className="flex items-center px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nouvelle Facture
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('sales')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'sales'
              ? 'border-brand-burgundy text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <FileText size={16} className="mr-2" />
            Factures Clients
          </div>
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'purchases'
              ? 'border-brand-burgundy text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Download size={16} className="mr-2" />
            Factures Fournisseurs
          </div>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une facture..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
          <Filter size={20} className="mr-2" />
          Filtres
        </button>
      </div>

      <InvoiceList
        type={activeTab === 'sales' ? 'sale' : 'purchase'}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
      />

      <Dialog
        open={showNewInvoice || editingInvoice !== null}
        onClose={() => {
          setShowNewInvoice(false);
          setEditingInvoice(null);
        }}
      >
        <div className="max-w-4xl bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
          <InvoiceForm
            type={activeTab === 'sales' ? 'sale' : 'purchase'}
            initialData={editingInvoice || undefined}
            onSubmit={handleCreateInvoice}
            onCancel={() => {
              setShowNewInvoice(false);
              setEditingInvoice(null);
            }}
          />
        </div>
      </Dialog>
    </div>
  );
}