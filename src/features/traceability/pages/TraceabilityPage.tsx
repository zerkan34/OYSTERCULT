import React, { useState, useRef, useEffect } from 'react';
import { Filter, Calendar, QrCode, Tag, FileText, Package, Download, Droplets, Waves, Grid, History, Edit2, Box } from 'lucide-react';
import { BatchList } from '../components/BatchList';
import { BatchHistory } from '../components/BatchHistory';
import { QualityChecks } from '../components/QualityChecks';
import { PurificationPools } from '../components/PurificationPools';
import { MarketPurchases } from '../components/MarketPurchases';
import { StorageLocations } from '../components/StorageLocations';
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import { InvoicesAndDeliveryNotes } from '../components/InvoicesAndDeliveryNotes';
import { useStore } from '@/lib/store';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type TabType = 'batches' | 'pools' | 'storage' | 'market' | 'invoices' | 'history';

export function TraceabilityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('batches');
  const [showQRCode, setShowQRCode] = useState(false);
  const [quickScanMode, setQuickScanMode] = useState(false);
  const [historyDateRange, setHistoryDateRange] = useState<{ start: string; end: string }>({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const pageRef = useRef<HTMLDivElement>(null);
  const { addBatch } = useStore();

  useEffect(() => {
    // Lots de test pour la table 1
    addBatch({
      batchNumber: "LOT-001",
      type: "Plates",
      quantity: 100,
      status: "table1",
      perchNumber: 1,
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 heures
    });
    
    addBatch({
      batchNumber: "LOT-002",
      type: "Creuses",
      quantity: 150,
      status: "table1",
      perchNumber: 2,
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 25 heures (alerte)
    });

    // Lot de test pour la table 2
    addBatch({
      batchNumber: "LOT-003",
      type: "Plates",
      quantity: 200,
      status: "table2",
      perchNumber: 1,
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 heures
    });
  }, []);

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
      ['Bassin A1', 'LOT-2025-001', 'Plates', '500 kg', '12h', '98%'],
      ['Bassin A1', 'LOT-2025-002', 'Creuses', '300 kg', '24h', '95%'],
      ['Bassin A2', 'LOT-2025-003', 'Spéciales', '600 kg', '4h', '92%']
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

  const tabs = [
    { id: 'batches', label: 'Lots en cours', icon: Package },
    { id: 'pools', label: 'Bassins', icon: Waves },
    { id: 'storage', label: 'Autres emplacements', icon: Box },
    { id: 'market', label: 'Achats', icon: Grid },
    { id: 'invoices', label: 'Factures et BL', icon: FileText },
    { id: 'history', label: 'Historique', icon: History }
  ];

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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-brand-primary text-white'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </div>
          </button>
        ))}
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

      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                <Package className="text-brand-blue" size={20} />
              </div>
              <h2 className="text-lg font-medium text-white">Lots en trempe</h2>
            </div>
          </div>
          <BatchList searchQuery="" />
        </div>
      )}

      {activeTab === 'pools' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                <Waves className="text-brand-blue" size={20} />
              </div>
              <h2 className="text-lg font-medium text-white">Bassins de purification</h2>
            </div>
          </div>
          <PurificationPools />
        </div>
      )}
      
      {activeTab === 'storage' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                <Box className="text-brand-blue" size={20} />
              </div>
              <h2 className="text-lg font-medium text-white">Autres emplacements de stockage</h2>
            </div>
          </div>
          <StorageLocations />
        </div>
      )}
      
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                <Grid className="text-brand-blue" size={20} />
              </div>
              <h2 className="text-lg font-medium text-white">Achats</h2>
            </div>
          </div>
          <MarketPurchases />
        </div>
      )}
      
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                <FileText className="text-brand-blue" size={20} />
              </div>
              <h2 className="text-lg font-medium text-white">Factures et bons de livraison</h2>
            </div>
          </div>
          <InvoicesAndDeliveryNotes />
        </div>
      )}
      
      {activeTab === 'history' && (
        <BatchHistory searchQuery="" />
      )}

      {showQRCode && (
        <QRCodeGenerator onClose={() => setShowQRCode(false)} />
      )}
    </div>
  );
}