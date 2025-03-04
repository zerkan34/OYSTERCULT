import React, { useState } from 'react';
import { Search, FileText, Eye, Filter, ArrowUpDown, X, Download } from 'lucide-react';

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
  const [showModal, setShowModal] = useState(false);

  const handleViewDocument = (item: InvoiceType) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
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

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer hover:text-white">
                    <span>Type</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer hover:text-white">
                    <span>Numéro</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer hover:text-white">
                    <span>Date</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer hover:text-white">
                    <span>Fournisseur</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer hover:text-white">
                    <span>Produits</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                {filterType !== 'delivery_note' && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    <div className="flex items-center space-x-1 cursor-pointer hover:text-white">
                      <span>Montant</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-brand-primary" />
                      <span className="text-white">{getTypeText(item.type)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">{item.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">{formatDate(item.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">{item.supplier}</td>
                  <td className="px-6 py-4 text-white">{item.products}</td>
                  {filterType !== 'delivery_note' && item.type === 'invoice' && (
                    <td className="px-6 py-4 whitespace-nowrap text-white">{item.amount}</td>
                  )}
                  {filterType !== 'delivery_note' && item.type === 'delivery_note' && (
                    <td className="px-6 py-4 whitespace-nowrap text-white">-</td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      className="text-brand-primary hover:text-brand-primary/80"
                      onClick={() => handleViewDocument(item)}
                      title="Voir le document"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-white/60">
                    Aucun document trouvé correspondant aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale pour afficher le document */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {selectedItem.type === 'invoice' ? 'Facture' : 'Bon de livraison'} - {selectedItem.number}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-white/60 mb-1">Fournisseur</p>
                <p className="text-white font-medium">{selectedItem.supplier}</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Date</p>
                <p className="text-white font-medium">{formatDate(selectedItem.date)}</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Produits</p>
                <p className="text-white font-medium">{selectedItem.products}</p>
              </div>
              {selectedItem.type === 'invoice' && (
                <div>
                  <p className="text-white/60 mb-1">Montant</p>
                  <p className="text-white font-medium">{selectedItem.amount}</p>
                </div>
              )}
              {selectedItem.type === 'delivery_note' && selectedItem.expiryDate && (
                <div>
                  <p className="text-white/60 mb-1">Date Limite de Consommation</p>
                  <p className="text-white font-medium">{formatDate(selectedItem.expiryDate)}</p>
                </div>
              )}
              <div>
                <p className="text-white/60 mb-1">Statut</p>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(selectedItem.status)}`}>
                  {getStatusText(selectedItem.status)}
                </span>
              </div>
            </div>
            
            <div className="border border-white/10 rounded-lg p-6 mb-6 bg-white/5">
              <div className="flex justify-center items-center">
                <FileText size={64} className="text-brand-primary mb-4" />
              </div>
              <p className="text-center text-white/60 mb-4">Aperçu du document</p>
              <p className="text-center text-white mb-4">
                {selectedItem.type === 'invoice' ? 'Facture' : 'Bon de livraison'} {selectedItem.number} du fournisseur {selectedItem.supplier}
              </p>
              <div className="flex justify-center">
                <button className="px-4 py-2 bg-brand-blue/20 border border-brand-blue/30 rounded-lg text-white hover:bg-brand-blue/30 transition-colors">
                  <Download size={16} className="inline-block mr-2" />
                  Télécharger le document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
