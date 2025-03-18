import React, { useState } from 'react';
import { Search, FileText, Eye, Filter, ArrowUpDown, X, Download, Edit2, Save } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Input } from '@/components/ui/Input';

type InvoiceType = {
  id: string;
  type: 'invoice' | 'delivery_note';
  number: string;
  date: string;
  supplier: string;
  amount?: string;
  products: string;
  status: 'validated' | 'pending' | 'rejected';
  expiryDate?: string; // Date Limite de Consommation
};

const MOCK_DATA: InvoiceType[] = [
  {
    id: '1',
    type: 'invoice',
    number: 'FC-2025-001',
    date: '2025-02-15',
    supplier: 'Mareyeur Express',
    amount: '1,250.00 €',
    products: 'Palourdes (150kg)',
    status: 'validated'
  },
  {
    id: '2',
    type: 'delivery_note',
    number: 'BL-2025-001',
    date: '2025-02-15',
    supplier: 'Mareyeur Express',
    products: 'Palourdes (150kg)',
    status: 'validated',
    expiryDate: '2025-03-15'
  },
  {
    id: '3',
    type: 'invoice',
    number: 'FC-2025-002',
    date: '2025-02-10',
    supplier: 'Fruits de Mer Pro',
    amount: '2,340.00 €',
    products: 'Moules (200kg), Huîtres (50kg)',
    status: 'validated'
  },
  {
    id: '4',
    type: 'delivery_note',
    number: 'BL-2025-002',
    date: '2025-02-10',
    supplier: 'Fruits de Mer Pro',
    products: 'Moules (200kg), Huîtres (50kg)',
    status: 'validated',
    expiryDate: '2025-03-10'
  },
  {
    id: '5',
    type: 'invoice',
    number: 'FC-2025-003',
    date: '2025-02-05',
    supplier: 'Mareyeur Express',
    amount: '890.00 €',
    products: 'Huîtres creuses (100kg)',
    status: 'validated'
  },
  {
    id: '6',
    type: 'delivery_note',
    number: 'BL-2025-003',
    date: '2025-02-05',
    supplier: 'Mareyeur Express',
    products: 'Huîtres creuses (100kg)',
    status: 'validated',
    expiryDate: '2025-03-05'
  },
  {
    id: '7',
    type: 'invoice',
    number: 'FC-2025-004',
    date: '2025-01-28',
    supplier: 'Fruits de Mer Pro',
    amount: '1,780.00 €',
    products: 'Palourdes (100kg), Moules (80kg)',
    status: 'validated'
  },
  {
    id: '8',
    type: 'delivery_note',
    number: 'BL-2025-004',
    date: '2025-01-28',
    supplier: 'Fruits de Mer Pro',
    products: 'Palourdes (100kg), Moules (80kg)',
    status: 'validated',
    expiryDate: '2025-02-28'
  }
];

export function InvoicesAndDeliveryNotes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'invoice' | 'delivery_note'>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [selectedItem, setSelectedItem] = useState<InvoiceType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedItem, setEditedItem] = useState<InvoiceType | null>(null);

  const handleViewDocument = (item: InvoiceType) => {
    setSelectedItem(item);
  };

  const handleEdit = (item: InvoiceType) => {
    setEditedItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editedItem) {
      const updatedData = MOCK_DATA.map(item => 
        item.id === editedItem.id ? editedItem : item
      );
      setIsEditModalOpen(false);
      setEditedItem(null);
    }
  };

  const filteredData = MOCK_DATA.filter(item => {
    // Filter by search query
    const matchesSearch = 
      item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.products.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by type
    const matchesType = filterType === 'all' || item.type === filterType;
    
    // Filter by date range
    const matchesDate = 
      (!dateRange.start || item.date >= dateRange.start) &&
      (!dateRange.end || item.date <= dateRange.end);
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'validated':
        return 'bg-green-500/20 text-green-500';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'rejected':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'validated':
        return 'Validé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'Facture';
      case 'delivery_note':
        return 'Bon de livraison';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par numéro, fournisseur ou produits..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="w-48">
            <select
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">Tous les documents</option>
              <option value="invoice">Factures</option>
              <option value="delivery_note">Bons de livraison</option>
            </select>
          </div>
          
          <button 
            className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <Download size={20} className="mr-2" />
            Exporter
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>
        <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
          <Filter size={20} className="mr-2" />
          Filtrer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <AnimatedCard
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-4 cursor-pointer hover:shadow-lg transition-all rounded-xl hover:bg-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.number}</h3>
                <p className="text-sm text-white/60">{item.supplier}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDocument(item);
                  }}
                  className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white/80 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                  className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white/80 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Date</span>
                  <span className="text-sm font-medium text-white">
                    {formatDate(item.date)}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Produits</span>
                  <span className="text-sm font-medium text-white">{item.products}</span>
                </div>
              </div>

              {item.type === 'invoice' && (
                <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Montant</span>
                    <span className="text-sm font-medium text-white">{item.amount}</span>
                  </div>
                </div>
              )}

              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Statut</span>
                  <span className={`text-sm font-medium ${getStatusClass(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {isEditModalOpen && editedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl p-6 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Modifier le document</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Numéro
                </label>
                <Input
                  value={editedItem.number}
                  onChange={(e) => setEditedItem({ ...editedItem, number: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Fournisseur
                </label>
                <Input
                  value={editedItem.supplier}
                  onChange={(e) => setEditedItem({ ...editedItem, supplier: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Date
                </label>
                <Input
                  type="date"
                  value={editedItem.date}
                  onChange={(e) => setEditedItem({ ...editedItem, date: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder-white/40"
                />
              </div>

              {editedItem.type === 'invoice' && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Montant
                  </label>
                  <Input
                    type="number"
                    value={editedItem.amount}
                    onChange={(e) => setEditedItem({ ...editedItem, amount: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder-white/40"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Statut
                </label>
                <select
                  value={editedItem.status}
                  onChange={(e) => setEditedItem({ ...editedItem, status: e.target.value as InvoiceType['status'] })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                >
                  <option value="validated">Validé</option>
                  <option value="pending">En attente</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg"
                >
                  <Save className="w-4 h-4 inline-block mr-2" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
