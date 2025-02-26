import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  FileText, 
  Download, 
  MoreVertical, 
  Send, 
  Edit, 
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import type { InvoiceWithItems } from '@/types/accounting';

const mockInvoices: InvoiceWithItems[] = [
  {
    id: '1',
    type: 'sale',
    number: 'FACT-2025-001',
    date: '2025-02-20',
    due_date: '2025-03-20',
    customer_id: '1',
    customer: {
      id: '1',
      name: 'Restaurant La Marée',
      email: 'contact@lamaree.fr',
      address: '123 Avenue de la Mer, 17000 La Rochelle'
    },
    status: 'sent',
    subtotal: 1250.00,
    tax: 250.00,
    total: 1500.00,
    notes: '',
    items: [
      {
        id: '1',
        invoice_id: '1',
        description: 'Huîtres Plates N°3',
        quantity: 50,
        unit_price: 25.00,
        tax_rate: 20,
        total: 1500.00
      }
    ]
  },
  {
    id: '2',
    type: 'purchase',
    number: 'FACT-2025-002',
    date: '2025-02-19',
    due_date: '2025-03-19',
    supplier_id: '1',
    supplier: {
      id: '1',
      name: 'Naissain Express',
      email: 'contact@naissain-express.fr',
      address: '456 Route des Parcs, 17560 Bourcefranc-le-Chapus'
    },
    status: 'paid',
    subtotal: 800.00,
    tax: 160.00,
    total: 960.00,
    notes: '',
    items: [
      {
        id: '2',
        invoice_id: '2',
        description: 'Naissain d\'huîtres',
        quantity: 1000,
        unit_price: 0.80,
        tax_rate: 20,
        total: 960.00
      }
    ]
  }
];

const statusColors = {
  draft: 'bg-gray-500/20 text-gray-300',
  sent: 'bg-blue-500/20 text-blue-300',
  paid: 'bg-green-500/20 text-green-300',
  overdue: 'bg-red-500/20 text-red-300',
  cancelled: 'bg-yellow-500/20 text-yellow-300'
};

const statusIcons = {
  draft: Clock,
  sent: Send,
  paid: CheckCircle,
  overdue: AlertTriangle,
  cancelled: XCircle
};

interface InvoiceListProps {
  type: 'sale' | 'purchase';
  onEdit: (invoice: InvoiceWithItems) => void;
  onDelete: (invoice: InvoiceWithItems) => void;
}

export function InvoiceList({ type, onEdit, onDelete }: InvoiceListProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const filteredInvoices = mockInvoices.filter(invoice => invoice.type === type);

  const handleDownload = (invoice: InvoiceWithItems) => {
    // TODO: Implement PDF generation
    console.log('Downloading invoice:', invoice.number);
  };

  const handleSend = (invoice: InvoiceWithItems) => {
    // TODO: Implement email sending
    console.log('Sending invoice:', invoice.number);
  };

  return (
    <div className="space-y-4">
      {filteredInvoices.map((invoice) => {
        const StatusIcon = statusIcons[invoice.status];

        return (
          <div
            key={invoice.id}
            className="bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-burgundy/20 flex items-center justify-center">
                    <FileText size={20} className="text-brand-burgundy" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-white">
                        {invoice.number}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center ${
                        statusColors[invoice.status]
                      }`}>
                        <StatusIcon size={12} className="mr-1" />
                        {invoice.status}
                      </span>
                    </div>
                    
                    <div className="mt-1 text-sm text-white/60">
                      {type === 'sale' ? invoice.customer?.name : invoice.supplier?.name}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <div className="text-white/60">Date</div>
                        <div className="text-white">
                          {format(new Date(invoice.date), 'PP', { locale: fr })}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60">Échéance</div>
                        <div className="text-white">
                          {format(new Date(invoice.due_date), 'PP', { locale: fr })}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60">Montant TTC</div>
                        <div className="text-white font-medium">
                          {invoice.total.toFixed(2)}€
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setSelectedInvoice(selectedInvoice === invoice.id ? null : invoice.id)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <MoreVertical size={20} className="text-white/60" />
                  </button>
                  
                  {selectedInvoice === invoice.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg py-1 z-10">
                      <button
                        onClick={() => handleDownload(invoice)}
                        className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center"
                      >
                        <Download size={16} className="mr-2" />
                        Télécharger
                      </button>
                      {invoice.status === 'draft' && (
                        <button
                          onClick={() => handleSend(invoice)}
                          className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center"
                        >
                          <Send size={16} className="mr-2" />
                          Envoyer
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(invoice)}
                        className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center"
                      >
                        <Edit size={16} className="mr-2" />
                        Modifier
                      </button>
                      <button
                        onClick={() => onDelete(invoice)}
                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5 flex items-center"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}