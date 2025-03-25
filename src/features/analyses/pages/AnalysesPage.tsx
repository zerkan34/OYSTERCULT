import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { QrCode, Mail, Download, X, Upload, TestTube, FileText, ChevronDown, ChevronRight } from 'lucide-react';
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
        className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 w-full max-w-md relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded-lg transition-all duration-300"
          aria-label="Fermer"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Importer des Analyses</h2>

        <div className="space-y-4">
          <div 
            className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center gap-3"
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
            <Mail className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            <div>
              <h3 className="font-medium text-white">Email du Laboratoire</h3>
              <p className="text-sm text-white/60">Importer directement depuis l'email</p>
            </div>
          </div>

          <div 
            className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center gap-3"
            onClick={onScanQR}
          >
            <QrCode className="w-5 h-5 text-cyan-400" aria-hidden="true" />
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
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <TestTube size={28} className="text-cyan-400" aria-hidden="true" />
            Analyses
          </h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Importer des analyses"
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              <span>Importer Analyses</span>
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Exporter en PDF"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Exporter PDF</span>
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">Résultats d'analyses</h2>
              <p className="text-sm text-white/60">Dernière mise à jour: {format(new Date(), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-t-2 border-b-2 border-cyan-400 rounded-full animate-spin"></div>
            </div>
          ) : analyses?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white/5 rounded-lg border border-white/10">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                <TestTube className="w-8 h-8 text-cyan-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Aucune analyse disponible</h3>
              <p className="text-white/60 max-w-md">
                Commencez par importer des résultats d'analyses de laboratoire.
              </p>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Importer votre première analyse"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>Importer une analyse</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses?.map((analyse) => (
                <div 
                  key={analyse.id}
                  className={`p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 ${
                    selectedAnalyse === analyse.id ? 'shadow-[0_4px_15px_rgba(0,210,200,0.2)]' : 'shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                  }`}
                >
                  <div 
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => setSelectedAnalyse(selectedAnalyse === analyse.id ? null : analyse.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(analyse.status)}`}>
                        {analyse.status.charAt(0).toUpperCase() + analyse.status.slice(1)}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Bassin {analyse.bassinId}</h3>
                        <p className="text-sm text-white/60">
                          {format(new Date(analyse.date), 'd MMMM yyyy', { locale: fr })}
                          {analyse.technicien ? ` • ${analyse.technicien}` : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      aria-label={selectedAnalyse === analyse.id ? "Masquer les détails" : "Afficher les détails"}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      {selectedAnalyse === analyse.id ? (
                        <ChevronDown className="w-5 h-5 text-white/60" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-white/60" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {selectedAnalyse === analyse.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <h4 className="font-medium text-white mb-3">Paramètres analysés</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {analyse.parameters.map((param, index) => (
                          <div key={index} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <p className="text-sm text-white/80">{param.name}</p>
                              <p className={`text-lg font-medium ${getParameterStatusColor(param.status)}`}>
                                {param.value} {param.unit}
                              </p>
                            </div>
                            {param.threshold && (
                              <div className="text-right">
                                <p className="text-xs text-white/60">Seuil</p>
                                <p className="text-sm text-white/80">{param.threshold} {param.unit}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {analyse.nextAnalyseDate && (
                        <div className="mt-4 flex items-center gap-2 text-white/60">
                          <span>Prochaine analyse prévue le:</span>
                          <span className="text-white">
                            {format(new Date(analyse.nextAnalyseDate), 'd MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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
      </AnimatePresence>

      <AnimatePresence>
        {isQRScannerOpen && (
          <QRCodeScanner
            onClose={() => setIsQRScannerOpen(false)}
            onScanSuccess={handleQRCodeScanned}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
