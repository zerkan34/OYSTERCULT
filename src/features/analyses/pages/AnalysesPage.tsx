import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { QrCode, Mail, Download, X, Upload, TestTube } from 'lucide-react';
import { QRCodeScanner } from '../components/QRCodeScanner';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PageTitle } from '@/components/ui/PageTitle';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportMail: (email: File) => void;
  onScanQR: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImportMail, onScanQR }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="rounded-xl p-6 w-full max-w-md relative backdrop-blur-sm border border-white/10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6">Importer des Analyses</h2>

        <div className="space-y-4">
          <div 
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.eml,.msg';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) onImportMail(file);
              };
              input.click();
            }}
          >
            <Mail className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="font-medium text-white">Email du Laboratoire</h3>
              <p className="text-sm text-white/60">Importer directement depuis l'email</p>
            </div>
          </div>

          <div 
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3"
            onClick={onScanQR}
          >
            <QrCode className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="font-medium text-white">Scanner QR Code</h3>
              <p className="text-sm text-white/60">Scanner le code depuis le rapport</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface AnalyseParameter {
  name: string;
  value: number;
  unit: string;
  threshold?: number;
  status: 'normal' | 'warning' | 'critical';
}

interface AnalyseResult {
  id: string;
  date: string;
  bassinId: string;
  parameters: AnalyseParameter[];
  laboratoire: string;
  status: 'conforme' | 'non-conforme' | 'en-attente';
  notes?: string;
  technicien?: string;
  nextAnalyseDate?: string;
}

const mockAnalyses: AnalyseResult[] = [
  {
    id: 'A123',
    date: '2025-03-15',
    bassinId: 'B001',
    laboratoire: 'Labya',
    status: 'conforme',
    technicien: 'Jean Dupont',
    nextAnalyseDate: '2025-03-22',
    parameters: [
      { name: 'pH', value: 7.8, unit: '', threshold: 8.5, status: 'normal' },
      { name: 'Température', value: 12.5, unit: '°C', threshold: 15, status: 'normal' },
      { name: 'Oxygène dissous', value: 8.2, unit: 'mg/L', threshold: 7, status: 'normal' },
      { name: 'Salinité', value: 33.5, unit: 'g/L', threshold: 35, status: 'normal' },
      { name: 'Turbidité', value: 2.8, unit: 'NTU', threshold: 5, status: 'normal' },
      { name: 'E. coli', value: 45, unit: 'UFC/100mL', threshold: 230, status: 'normal' }
    ]
  },
  {
    id: 'A124',
    date: '2025-03-15',
    bassinId: 'B002',
    laboratoire: 'Labya',
    status: 'en-attente',
    technicien: 'Marie Martin',
    parameters: [
      { name: 'pH', value: 8.3, unit: '', threshold: 8.5, status: 'warning' },
      { name: 'Température', value: 14.8, unit: '°C', threshold: 15, status: 'warning' },
      { name: 'Oxygène dissous', value: 6.8, unit: 'mg/L', threshold: 7, status: 'warning' },
      { name: 'Salinité', value: 34.2, unit: 'g/L', threshold: 35, status: 'normal' },
      { name: 'Turbidité', value: 4.2, unit: 'NTU', threshold: 5, status: 'warning' },
      { name: 'E. coli', value: 180, unit: 'UFC/100mL', threshold: 230, status: 'warning' }
    ]
  }
];

export const AnalysesPage: React.FC = () => {
  const [selectedAnalyse, setSelectedAnalyse] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const { data: analyses, isLoading } = useQuery<AnalyseResult[]>({
    queryKey: ['analyses'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockAnalyses;
    },
  });

  const handleImportMail = async (file: File) => {
    // TODO: Implémenter la logique d'import depuis l'email
    console.log('Importing from email:', file);
    setIsImportModalOpen(false);
  };

  const handleScanQR = () => {
    setIsImportModalOpen(false);
    setIsQRScannerOpen(true);
  };

  const handleQRCodeScanned = (data: string) => {
    try {
      // Décoder les données du QR code
      const decodedData = JSON.parse(atob(data.split('/').pop() || ''));
      console.log('QR Code data:', decodedData);
      
      // TODO: Traiter les données du QR code et mettre à jour les analyses
      
    } catch (error) {
      console.error('Erreur lors du décodage du QR code:', error);
    }
  };

  const handleExport = async () => {
    try {
      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text("Rapport d'Analyses OYSTER CULT", 15, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Généré le ${format(new Date(), "d MMMM yyyy 'à' HH:mm", { locale: fr })}`, 15, 30);

      // Logo du laboratoire (à remplacer par le vrai logo)
      // doc.addImage("/labya-logo.png", "PNG", 160, 10, 35, 35);

      // Tableau des analyses
      const tableData = analyses?.map(analyse => {
        const row = [
          format(new Date(analyse.date), 'dd/MM/yyyy'),
          analyse.bassinId,
          analyse.status.charAt(0).toUpperCase() + analyse.status.slice(1),
          analyse.technicien || '-',
          format(new Date(analyse.nextAnalyseDate || ''), 'dd/MM/yyyy')
        ];
        return row;
      }) || [];

      (doc as any).autoTable({
        startY: 40,
        head: [['Date', 'Bassin', 'Statut', 'Technicien', 'Prochaine Analyse']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: [255, 255, 255]
        },
        styles: {
          fontSize: 10
        }
      });

      // Pour chaque analyse, ajouter une page avec les détails
      analyses?.forEach((analyse, index) => {
        if (index > 0) doc.addPage();
        const startY = 20;

        // En-tête de la page de détails
        doc.setFontSize(16);
        doc.setTextColor(44, 62, 80);
        doc.text(`Détails Analyse - Bassin ${analyse.bassinId}`, 15, startY);

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Date: ${format(new Date(analyse.date), 'd MMMM yyyy', { locale: fr })}`, 15, startY + 10);
        doc.text(`Technicien: ${analyse.technicien || '-'}`, 15, startY + 20);
        doc.text(`Statut: ${analyse.status.charAt(0).toUpperCase() + analyse.status.slice(1)}`, 15, startY + 30);

        // Tableau des paramètres
        const paramData = analyse.parameters.map(param => [
          param.name,
          param.value.toString(),
          param.unit,
          param.threshold ? param.threshold.toString() : '-',
          param.status.charAt(0).toUpperCase() + param.status.slice(1)
        ]);

        (doc as any).autoTable({
          startY: startY + 40,
          head: [['Paramètre', 'Valeur', 'Unité', 'Seuil', 'Statut']],
          body: paramData,
          theme: 'grid',
          headStyles: {
            fillColor: [44, 62, 80],
            textColor: [255, 255, 255]
          },
          styles: {
            fontSize: 10
          },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 30 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 30 }
          }
        });
      });

      // Sauvegarder le PDF
      doc.save(`analyses_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  const getStatusColor = (status: AnalyseResult['status']) => {
    switch (status) {
      case 'conforme':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'non-conforme':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-amber-500/20 text-amber-400';
    }
  };

  const getParameterStatusColor = (status: AnalyseParameter['status']) => {
    switch (status) {
      case 'normal':
        return 'text-emerald-400';
      case 'warning':
        return 'text-amber-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageTitle 
        icon={<TestTube size={28} className="text-white" />}
        title="Analyses"
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Résultats d'Analyses</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <Upload size={18} />
            Importer Analyses
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download size={18} />
            Exporter PDF
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <motion.div 
          className="rounded-lg p-6 bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)] backdrop-blur-[20px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 p-2 flex items-center justify-center">
                <img src="/labya-logo.png" alt="Labya" className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Laboratoire Labya</h3>
                <p className="text-sm text-white/60">Partenaire officiel</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Dernière mise à jour</p>
              <p className="text-white">{format(new Date(), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : analyses?.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>Aucun résultat d'analyse disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses?.map((analyse) => (
                <div
                  key={analyse.id}
                  className={`p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer ${
                    selectedAnalyse === analyse.id ? 'ring-1 ring-cyan-500/50' : ''
                  }`}
                  onClick={() => setSelectedAnalyse(analyse.id === selectedAnalyse ? null : analyse.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">Bassin #{analyse.bassinId}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(analyse.status)}`}>
                          {analyse.status.charAt(0).toUpperCase() + analyse.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-white/60 mt-1">
                        <p>Analysé le {format(new Date(analyse.date), 'd MMMM yyyy', { locale: fr })}</p>
                        {analyse.technicien && (
                          <p>Par {analyse.technicien}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {analyse.nextAnalyseDate && (
                        <p className="text-sm text-cyan-400">
                          Prochaine analyse : {format(new Date(analyse.nextAnalyseDate), 'd MMMM yyyy', { locale: fr })}
                        </p>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedAnalyse === analyse.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 grid grid-cols-3 gap-4 overflow-hidden"
                      >
                        {analyse.parameters.map((param, index) => (
                          <div key={index} className="p-3 rounded-lg bg-white/5">
                            <div className="flex justify-between items-start">
                              <p className="text-sm text-white/60">{param.name}</p>
                              <div className={`h-2 w-2 rounded-full ${getParameterStatusColor(param.status)}`} />
                            </div>
                            <div className="flex items-end gap-1 mt-2">
                              <span className="text-lg font-medium text-white">{param.value}</span>
                              <span className="text-sm text-white/60">{param.unit}</span>
                            </div>
                            {param.threshold && (
                              <p className="text-xs text-white/40 mt-1">
                                Seuil: {param.threshold} {param.unit}
                              </p>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isImportModalOpen && (
          <ImportModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onImportMail={handleImportMail}
            onScanQR={handleScanQR}
          />
        )}
        {isQRScannerOpen && (
          <QRCodeScanner
            onClose={() => setIsQRScannerOpen(false)}
            onScanSuccess={handleQRCodeScanned}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
