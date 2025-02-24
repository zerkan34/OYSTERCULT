import React, { useState, useRef } from 'react';
import { Filter, Calendar, QrCode, Tag, FileText, Package, Download } from 'lucide-react';
import { BatchList } from '../components/BatchList';
import { BatchHistory } from '../components/BatchHistory';
import { QualityChecks } from '../components/QualityChecks';
import { PurificationPools } from '../components/PurificationPools';
import { MarketPurchases } from '../components/MarketPurchases';
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import { useStore } from '@/lib/store';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type TabType = 'batches' | 'pools' | 'history' | 'market';

export function TraceabilityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('batches');
  const [showQRCode, setShowQRCode] = useState(false);
  const [quickScanMode, setQuickScanMode] = useState(false);
  const [historyDateRange, setHistoryDateRange] = useState<{ start: string; end: string }>({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const pageRef = useRef<HTMLDivElement>(null);

  const generateTraceabilityPDF = () => {
    const doc = new jsPDF();
    const companyName = "OYSTER CULT";
    const currentDate = format(new Date(), 'PPP', { locale: fr });

    // En-tête
    doc.setFontSize(20);
    doc.text(companyName, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Rapport de traçabilité - ${currentDate}`, 105, 30, { align: 'center' });

    // Période
    doc.setFontSize(14);
    doc.text('Période du rapport:', 14, 45);
    doc.text(`${format(new Date(historyDateRange.start), 'PPP', { locale: fr })} au ${format(new Date(historyDateRange.end), 'PPP', { locale: fr })}`, 14, 55);
    
    // Lots en cours
    doc.setFontSize(16);
    doc.text('Lots en cours dans les bassins', 14, 70);
    
    const batchData = [
      ['Bassin', 'N° Lot', 'Type', 'Quantité', 'Temps restant', 'Qualité'],
      ['Bassin A1', 'LOT-2025-001', 'Plates', '500 unités', '12h', '98%'],
      ['Bassin A1', 'LOT-2025-002', 'Creuses', '300 unités', '24h', '95%'],
      ['Bassin A2', 'LOT-2025-003', 'Spéciales', '600 unités', '4h', '92%']
    ];

    (doc as any).autoTable({
      startY: 75,
      head: [batchData[0]],
      body: batchData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [139, 0, 0] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Achats
    doc.setFontSize(16);
    doc.text('Achats et stockage', 14, (doc as any).lastAutoTable.finalY + 20);

    const purchaseData = [
      ['Produit', 'Fournisseur', 'DLC', 'Stockage', 'Qualité'],
      ['Palourdes', 'Mareyeur Express', '25/02/2025', 'Bassin A3', '95%'],
      ['Moules', 'Fruits de Mer Pro', '22/02/2025', 'Bassin B1', '92%']
    ];

    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [purchaseData[0]],
      body: purchaseData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [139, 0, 0] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Maintenance des bassins
    doc.setFontSize(16);
    doc.text('Maintenance des bassins', 14, (doc as any).lastAutoTable.finalY + 20);

    const maintenanceData = [
      ['Bassin', 'Dernier nettoyage', 'Prochain nettoyage', 'État filtre', 'Qualité eau'],
      ['Bassin A1', '15/02/2025', '22/02/2025', 'Optimal', '98%'],
      ['Bassin A2', '10/02/2025', '17/02/2025', 'À vérifier', '92%']
    ];

    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [maintenanceData[0]],
      body: maintenanceData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [139, 0, 0] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Contrôles qualité
    doc.setFontSize(16);
    doc.text('Contrôles qualité', 14, (doc as any).lastAutoTable.finalY + 20);

    const qualityData = [
      ['Date', 'Lot', 'Score', 'Inspecteur', 'Observations'],
      ['19/02/2025', 'LOT-2025-001', '92%', 'Marie Martin', 'RAS'],
      ['19/02/2025', 'LOT-2025-002', '88%', 'Jean Dupont', 'Surveillance accrue']
    ];

    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [qualityData[0]],
      body: qualityData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [139, 0, 0] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Pied de page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        `Généré le ${format(new Date(), 'PPPp', { locale: fr })}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    // Téléchargement du PDF
    doc.save(`tracabilite_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div ref={pageRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Traçabilité</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowQRCode(true)}
            className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <QrCode size={20} className="mr-2" />
            QR Code
          </button>
          <button
            onClick={generateTraceabilityPDF}
            className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
          >
            <Download size={20} className="mr-2" />
            Télécharger la traçabilité
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('batches')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'batches'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Tag size={16} className="mr-2" />
            Lots en cours
          </div>
        </button>
        <button
          onClick={() => setActiveTab('pools')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pools'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <FileText size={16} className="mr-2" />
            Bassins
          </div>
        </button>
        <button
          onClick={() => setActiveTab('market')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'market'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Package size={16} className="mr-2" />
            Achats
          </div>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-brand-primary text-white'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            Historique
          </div>
        </button>
      </div>

      {activeTab === 'history' && (
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={historyDateRange.start}
                onChange={(e) => setHistoryDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Date de fin
              </label>
              <input
                type="date"
                value={historyDateRange.end}
                onChange={(e) => setHistoryDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>
          <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
            <Filter size={20} className="mr-2" />
            Filtrer
          </button>
        </div>
      )}

      {activeTab === 'batches' && <BatchList searchQuery="" />}
      {activeTab === 'pools' && <PurificationPools />}
      {activeTab === 'market' && <MarketPurchases />}
      {activeTab === 'history' && <BatchHistory searchQuery="" />}

      {showQRCode && (
        <QRCodeGenerator onClose={() => setShowQRCode(false)} />
      )}
    </div>
  );
}