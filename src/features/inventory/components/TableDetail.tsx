import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { format, differenceInMonths } from 'date-fns';
import { frCA } from 'date-fns/locale';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Clock, 
  Calendar,
  ThermometerSun,
  Droplets,
  ArrowLeft,
  ArrowRight,
  History,
  AlertTriangle,
  MapPin,
  ClipboardCheck,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Plus,
  ShoppingCart,
  Shell,
  Check,
  X,
  Filter,
  FileText,
  Upload,
  Download,
  HelpCircle,
  Table as TableIcon,
  Scale,
  FileSpreadsheet,
  Activity
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Modal } from '../../../components/Modal';

interface TableCell {
  id: string;
  position: number;
  filled: boolean;
  ropeCount?: number;
  spat?: {
    name: string;
    batchNumber: string;
    dateAdded: string;
  };
  history: {
    date: string;
    action: string;
    details: string;
    naissain: string;
    lotNumber: string;
    mortalityRate: number;
    notes: string;
    type?: string;
    ropes?: number;
    tonnage?: number;
  }[];
  exondation?: {
    startTime: string;
    isExonded: boolean;
    exondationCount: number;
  };
}

interface Table {
  id: string;
  name: string;
  cells: TableCell[];
  lastSampling?: {
    date: string;
    mortality: string;
  };
  exondationCount?: number;
  origin?: string;
  history?: any[];
  exondation?: {
    isExonded: boolean;
    date?: string;
  };
  sampling?: {
    date: string;
    mortality: string;
  };
  growthTime?: string;
  temperature?: string;
  lastUpdate: string;
  type?: string;
  zone?: string;
}

interface TableDetailProps {
  table: Table;
  onClose: () => void;
  onTableUpdate: (updatedTable: Table) => void;
}

interface CellModalProps {
  cell: TableCell;
  onClose: () => void;
  onSave: (updatedCell: TableCell) => void;
}

interface HarvestModalProps {
  cell: TableCell;
  onClose: () => void;
  onSave: (updatedCell: TableCell) => void;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table;
}

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const generateBatchNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${year}${month}-${random}`;
};

const CellModal: React.FC<CellModalProps> = ({ cell, onClose, onSave }) => {
  const [ropeCount, setRopeCount] = useState<number>(cell.ropeCount || 0);
  const [spatName, setSpatName] = useState(cell.spat?.name || '');
  const [batchNumber, setBatchNumber] = useState(cell.spat?.batchNumber || generateBatchNumber());

  const handleSave = () => {
    const now = new Date().toISOString();
    const historyEntry = {
      date: now,
      action: 'Ajout de cordes',
      details: `${ropeCount} cordes ajoutées`,
      naissain: spatName,
      lotNumber: batchNumber,
      mortalityRate: 0,
      notes: '',
      type: 'add'
    };

    onSave({
      ...cell,
      ropeCount: (cell.ropeCount || 0) + ropeCount,
      spat: {
        name: spatName,
        batchNumber: batchNumber,
        dateAdded: new Date().toISOString()
      },
      history: [...(cell.history || []), historyEntry]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg w-[480px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10"
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg"></div>
          <div className="relative">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Ajouter des cordes
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Nombre de cordes</label>
                <input
                  type="number"
                  value={ropeCount}
                  onChange={(e) => setRopeCount(Number(e.target.value))}
                  className="w-full bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-3 rounded-lg border border-white/10 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white min-h-[44px] transition-all duration-300"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Naissain</label>
                <input
                  type="text"
                  value={spatName}
                  onChange={(e) => setSpatName(e.target.value)}
                  className="w-full bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-3 rounded-lg border border-white/10 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white min-h-[44px] transition-all duration-300"
                  placeholder="Nom du naissain"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Numéro de lot</label>
                <div className="relative">
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-3 rounded-lg border border-white/10 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white min-h-[44px] transition-all duration-300"
                    placeholder="Numéro de lot"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                    <ClipboardCheck size={20} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 transform hover:-translate-y-1 text-white/70 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/50 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Check size={20} />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HarvestModal: React.FC<HarvestModalProps> = ({ cell, onClose, onSave }) => {
  const [ropesToHarvest, setRopesToHarvest] = useState<number>(1);

  // Constantes pour les calculs
  const ROPES_PER_POLE = 10;
  const POLES_PER_CELL = 5;
  const TOTAL_ROPES_PER_CELL = ROPES_PER_POLE * POLES_PER_CELL;
  const OYSTERS_PER_ROPE = 150;

  const handleSave = () => {
    const now = new Date().toISOString();
    const currentRopes = cell.ropeCount || TOTAL_ROPES_PER_CELL;
    const remainingRopes = Math.max(0, currentRopes - ropesToHarvest);

    // Si on récolte toutes les cordes de la cellule
    const isFullyHarvested = remainingRopes === 0;

    const historyEntry = {
      date: now,
      action: 'Récolte',
      details: `${ropesToHarvest} cordes récoltées`,
      naissain: cell.spat?.name || '',
      lotNumber: cell.spat?.batchNumber || '',
      mortalityRate: 0,
      notes: '',
      type: 'harvest'
    };

    onSave({
      ...cell,
      filled: !isFullyHarvested,
      ropeCount: remainingRopes,
      spat: isFullyHarvested ? undefined : cell.spat,
      history: [...(cell.history || []), historyEntry]
    });
    onClose();
  };

  const calculateOysterCount = (ropes: number) => {
    return ropes * OYSTERS_PER_ROPE;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg w-[480px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10"
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg"></div>
          <div className="relative">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Récolter des cordes
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Nombre de cordes à récolter</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={ropesToHarvest}
                    onChange={(e) => setRopesToHarvest(Math.min(Math.max(1, Number(e.target.value)), cell.ropeCount || TOTAL_ROPES_PER_CELL))}
                    className="flex-1 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-3 rounded-lg border border-white/10 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white min-h-[44px] transition-all duration-300"
                    min="1"
                    max={cell.ropeCount || TOTAL_ROPES_PER_CELL}
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setRopesToHarvest(prev => Math.min(prev + 1, cell.ropeCount || TOTAL_ROPES_PER_CELL))}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => setRopesToHarvest(prev => Math.max(1, prev - 1))}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-white/70">
                  <span className="font-medium">Numéro de lot :</span>{' '}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-2 rounded-lg border border-white/10">
                      <span className="text-white">{cell.spat?.batchNumber || generateBatchNumber()}</span>
                    </div>
                    <button
                      onClick={() => {
                        const newBatchNumber = generateBatchNumber();
                        const historyEntry = {
                          date: new Date().toISOString(),
                          action: 'Mise à jour du numéro de lot',
                          details: `Nouveau numéro de lot : ${newBatchNumber}`,
                          naissain: cell.spat?.name || '',
                          lotNumber: newBatchNumber,
                          mortalityRate: 0,
                          notes: '',
                          type: 'update'
                        };

                        onSave({
                          ...cell,
                          spat: { ...cell.spat, batchNumber: newBatchNumber },
                          history: [...(cell.history || []), historyEntry]
                        });
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-white/70">
                  <span className="font-medium">Naissain à récolter :</span>{' '}
                  <span className="text-white">Marennes-Oléron</span>
                </div>
                <div className="text-sm text-white/70">
                  <span className="font-medium">Cordes restantes après récolte :</span>{' '}
                  <span className="text-white">{(cell.ropeCount || TOTAL_ROPES_PER_CELL) - ropesToHarvest}</span>
                </div>
                <div className="text-sm text-white/70">
                  <span className="font-medium">Huîtres restantes après récolte :</span>{' '}
                  <span className="text-white">{calculateOysterCount((cell.ropeCount || TOTAL_ROPES_PER_CELL) - ropesToHarvest)}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    const now = new Date().toISOString();
                    const newExondationCount = (cell.exondation?.exondationCount || 0) + 1;
                    
                    const historyEntry = {
                      date: now,
                      action: 'Exondation',
                      details: `Exondation #${newExondationCount}`,
                      naissain: '',
                      lotNumber: '',
                      mortalityRate: 0,
                      notes: '',
                      type: 'exondation'
                    };

                    onSave({
                      ...cell,
                      exondation: {
                        startTime: now,
                        isExonded: true,
                        exondationCount: newExondationCount
                      },
                      history: [...(cell.history || []), historyEntry]
                    });

                    setTimeout(() => {
                      if (cell.exondation?.isExonded) {
                        alert('⚠️ ATTENTION : Cette table est exondée depuis plus de 24 heures !');
                        // Ici, vous pouvez ajouter votre logique de notification
                      }
                    }, 24 * 60 * 60 * 1000); // 24 heures
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    cell.exondation?.isExonded 
                      ? 'bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
                  } transition-colors`}
                  aria-label={cell.exondation?.isExonded ? 'Table exondée' : 'Exonder'}
                >
                  <div className="flex items-center gap-2">
                    <Droplets size={16} />
                    {cell.exondation?.isExonded ? 'Exondé' : 'Exonder'}
                  </div>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                >
                  Récolter
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, table }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  useEffect(() => {
    registerLocale('fr', frCA);
  }, []);

  const handleExportHistoryPDF = () => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(24);
    doc.setTextColor(0, 150, 180);
    doc.text("OYSTER CULT", 20, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("Historique de la table", 20, 30);
    
    // Informations de la table
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Table ${table.name}`, 20, 45);
    doc.text(`Type: ${table.type || 'Standard'}`, 20, 52);
    doc.text(`Zone: ${table.zone || 'Non spécifiée'}`, 20, 59);
    doc.text(`Naissain: ${table.origin || 'Non spécifié'}`, 20, 66);
    doc.text(`Période: ${selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Toutes les dates'}`, 20, 73);
    
    // Statistiques globales
    doc.setFontSize(14);
    doc.setTextColor(0, 150, 180);
    doc.text("Statistiques globales", 20, 88);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const stats = calculateStats(table.history);
    
    // Colonne 1
    doc.text(`Mortalité moyenne: ${stats.avgMortality}%`, 25, 95);
    doc.text(`Temps de croissance: ${stats.growthTime} mois`, 25, 102);
    doc.text(`Nombre d'interventions: ${table.history?.length || 0}`, 25, 109);
    doc.text(`Dernière mise à jour: ${format(new Date(stats.lastUpdate), 'dd/MM/yyyy')}`, 25, 116);
    
    // Colonne 2
    doc.text(`Nombre de cordes: ${stats.totalRopes || 'N/A'}`, 120, 95);
    doc.text(`Tonnage estimé: ${stats.estimatedTonnage.toFixed(1) || 'N/A'} tonnes`, 120, 102);
    doc.text(`Densité moyenne: ${stats.avgDensity || 'N/A'} huîtres/m²`, 120, 109);
    doc.text(`Taille moyenne: ${stats.avgSize || 'N/A'}mm`, 120, 116);

    // Évolution de la mortalité
    doc.setFontSize(14);
    doc.setTextColor(0, 150, 180);
    doc.text("Évolution de la mortalité", 20, 131);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Initial: ${stats.initialMortality || 0}%`, 25, 138);
    doc.text(`Maximum: ${stats.maxMortality || 0}%`, 85, 138);
    doc.text(`Actuel: ${stats.currentMortality || 0}%`, 145, 138);
    
    // Ligne de séparation
    doc.setDrawColor(0, 150, 180);
    doc.line(20, 145, 190, 145);
    
    // Production
    doc.setFontSize(14);
    doc.setTextColor(0, 150, 180);
    doc.text("Données de production", 20, 160);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Quantité initiale: ${stats.initialQuantity || 'N/A'} pièces`, 25, 167);
    doc.text(`Quantité actuelle: ${stats.currentQuantity || 'N/A'} pièces`, 25, 174);
    doc.text(`Perte estimée: ${stats.estimatedLoss || 'N/A'} pièces`, 25, 181);
    doc.text(`Rendement: ${stats.productionYield || 'N/A'}%`, 25, 188);
    
    // Ligne de séparation
    doc.line(20, 195, 190, 195);
    
    // Historique détaillé
    doc.setFontSize(14);
    doc.setTextColor(0, 150, 180);
    doc.text("Détail des interventions", 20, 210);
    
    // Contenu
    let yPos = 225;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const historyToExport = selectedDate 
      ? table.history?.filter(entry => {
          const entryDate = new Date(entry.date);
          return format(entryDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
        })
      : table.history;
    
    historyToExport?.forEach((entry: any) => {
      // Date et action
      doc.setFont(undefined, 'bold');
      doc.text(`${format(new Date(entry.date), 'dd/MM/yyyy')} - ${entry.action}`, 20, yPos);
      yPos += 7;
      
      // Détails
      doc.setFont(undefined, 'normal');
      if (entry.details) {
        doc.text(`Détails: ${entry.details}`, 30, yPos);
        yPos += 7;
      }
      if (entry.mortalityRate) {
        doc.text(`Mortalité: ${entry.mortalityRate}%`, 30, yPos);
        yPos += 7;
      }
      if (entry.naissain) {
        doc.text(`Naissain: ${entry.naissain}`, 30, yPos);
        yPos += 7;
      }
      if (entry.lotNumber) {
        doc.text(`N° de lot: ${entry.lotNumber}`, 30, yPos);
        yPos += 7;
      }
      if (entry.quantity) {
        doc.text(`Quantité: ${entry.quantity} pièces`, 30, yPos);
        yPos += 7;
      }
      if (entry.density) {
        doc.text(`Densité: ${entry.density} huîtres/m²`, 30, yPos);
        yPos += 7;
      }
      if (entry.size) {
        doc.text(`Taille moyenne: ${entry.size}mm`, 30, yPos);
        yPos += 7;
      }
      if (entry.ropes) {
        doc.text(`Nombre de cordes: ${entry.ropes}`, 30, yPos);
        yPos += 7;
      }
      if (entry.tonnage) {
        doc.text(`Tonnage: ${entry.tonnage} tonnes`, 30, yPos);
        yPos += 7;
      }
      
      yPos += 5;
      
      // Nouvelle page si nécessaire
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    // Pied de page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        `Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm')}`,
        20,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Sauvegarde
    doc.save(`historique_table_${table.name}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  // Fonction utilitaire pour calculer les statistiques
  const calculateStats = (history: any[]) => {
    if (!history?.length) {
      return {
        avgMortality: 0,
        growthTime: 0,
        lastUpdate: new Date(),
        totalRopes: 0,
        estimatedTonnage: 0,
        avgDensity: 0,
        avgSize: 0,
        initialMortality: 0,
        maxMortality: 0,
        currentMortality: 0,
        initialQuantity: 0,
        currentQuantity: 0,
        estimatedLoss: 0,
        productionYield: 0
      };
    }

    const mortalityRates = history
      .filter(entry => entry.mortalityRate)
      .map(entry => Number(entry.mortalityRate));
    
    const avgMortality = mortalityRates.length
      ? (mortalityRates.reduce((a, b) => a + b, 0) / mortalityRates.length).toFixed(1)
      : 0;
    
    const firstDate = new Date(history[0].date);
    const lastDate = new Date(history[history.length - 1].date);
    const growthTime = Math.ceil(differenceInMonths(lastDate, firstDate));

    // Calculs supplémentaires
    const lastEntry = history[history.length - 1];
    const firstEntry = history[0];
    
    const totalRopes = lastEntry.ropes || 0;
    const estimatedTonnage = totalRopes * 0.5; // Estimation: 0.5 tonnes par corde
    
    const densities = history
      .filter(entry => entry.density)
      .map(entry => Number(entry.density));
    const avgDensity = densities.length
      ? Math.round(densities.reduce((a, b) => a + b, 0) / densities.length)
      : 0;
    
    const sizes = history
      .filter(entry => entry.size)
      .map(entry => Number(entry.size));
    const avgSize = sizes.length
      ? Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length)
      : 0;
    
    const initialMortality = Number(firstEntry.mortalityRate) || 0;
    const maxMortality = Math.max(...mortalityRates, 0);
    const currentMortality = Number(lastEntry.mortalityRate) || 0;
    
    const initialQuantity = Number(firstEntry.quantity) || 0;
    const currentQuantity = Number(lastEntry.quantity) || 0;
    const estimatedLoss = initialQuantity - currentQuantity;
    const productionYield = initialQuantity ? Math.round((currentQuantity / initialQuantity) * 100) : 0;

    return {
      avgMortality,
      growthTime,
      lastUpdate: lastDate,
      totalRopes,
      estimatedTonnage,
      avgDensity,
      avgSize,
      initialMortality,
      maxMortality,
      currentMortality,
      initialQuantity,
      currentQuantity,
      estimatedLoss,
      productionYield
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="flex items-center justify-center min-h-screen p-4 pt-[15vh]">
            <motion.div
              initial={{ opacity: 0, transform: "translateY(30px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(30px)" }}
              className="bg-[rgba(15,23,42,0.45)] backdrop-blur-[16px] p-8 rounded-xl w-[900px] border border-white/10 relative overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Historique {table.name}
                  </h2>
                  <p className="text-white/70 text-sm mt-1">
                    Suivi détaillé des lots et performances
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* En-tête avec stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/5 flex flex-col items-center">
                    <span className="text-white/70 text-sm mb-1">Mortalité moyenne</span>
                    <span className="text-2xl font-bold text-emerald-400">15%</span>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/5 flex flex-col items-center">
                    <span className="text-white/70 text-sm mb-1">Temps de croissance</span>
                    <span className="text-2xl font-bold text-cyan-400">11 mois</span>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/5 flex flex-col items-center">
                    <span className="text-white/70 text-sm mb-1">Dernière mise à jour</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {format(new Date(), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>

                {/* Filtres et recherche */}
                <div className="flex justify-end items-center gap-4">
                  {/* Bouton Calendrier */}
                  <button
                    onClick={() => {
                      const input = document.getElementById('date-picker');
                      if (input) input.click();
                    }}
                    className="h-[52px] w-[52px] flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] transition-all duration-300"
                    aria-label="Filtrer par date"
                  >
                    <Calendar size={20} className="text-cyan-400" aria-hidden="true" />
                  </button>

                  {/* DatePicker caché */}
                  <div className="hidden">
                    <DatePicker
                      id="date-picker"
                      selected={selectedDate}
                      onChange={(date: Date) => setSelectedDate(date)}
                      locale="fr"
                      dateFormat="dd/MM/yyyy"
                      isClearable
                      showPopperArrow={false}
                      popperClassName="datepicker-popper"
                      popperPlacement="bottom-end"
                      customInput={<div />}
                    />
                  </div>

                  {/* Bouton Export */}
                  <button
                    onClick={handleExportHistoryPDF}
                    className="h-[52px] px-6 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 flex items-center gap-2"
                  >
                    <FileText size={18} className="text-cyan-400" aria-hidden="true" />
                    <span className="text-white font-medium">Exporter PDF</span>
                  </button>
                </div>

                {/* Liste d'historique */}
                <div className="bg-gray-800/50 rounded-lg border border-white/5 divide-y divide-white/5">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="group p-5 first:rounded-t-lg last:rounded-b-lg hover:bg-white/5 transition-colors">
                      <div className="flex items-start justify-between">
                        {/* Info principale */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]" />
                              <span className="text-sm font-medium text-cyan-400">Naissain Premium</span>
                            </div>
                            <div className="h-3.5 w-[1px] bg-white/10" />
                            <span className="text-sm text-white/70">
                              {format(new Date(2025, 3 - index, 1), 'dd/MM/yyyy')}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-white/70">
                              <MapPin size={14} className="text-cyan-400" />
                              <span className="font-medium">Lot T15-{1000 + index}</span>
                            </div>
                            <div className="h-3.5 w-[1px] bg-white/10" />
                            <span className="text-white/70">Bretagne Sud</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/20">
                            <Activity size={14} className="text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-400">
                              Mortalité: {14 + index}%
                            </span>
                          </div>
                          <div className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                            <div className="h-2 w-2 rounded-full bg-emerald-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ExcelImportModal: React.FC<ExcelImportModalProps> = ({ isOpen, onClose, onUpload }) => {
  const generateExcelTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        ropeCount: 10,
        spatName: "Naissain exemple",
        batchNumber: "2503-001",
        dateAdded: new Date().toISOString()
      }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_import_table.xlsx");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg w-[600px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg"></div>
              <div className="relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Import Excel
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Format requis</h4>
                    <p className="text-white/70">Le fichier Excel doit contenir les colonnes suivantes :</p>
                    <ul className="mt-2 space-y-2 text-white/70">
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-cyan-400 rounded-full"></span>
                        <strong>ropeCount</strong> - Nombre de cordes (requis)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-cyan-400 rounded-full"></span>
                        <strong>spatName</strong> - Nom du naissain (requis)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-white/30 rounded-full"></span>
                        <strong>batchNumber</strong> - Numéro de lot (optionnel)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-white/30 rounded-full"></span>
                        <strong>dateAdded</strong> - Date d'ajout (optionnel)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <TableIcon size={20} className="text-cyan-400" />
                      Exemple de format
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="text-left text-white/70 px-4 py-2">ropeCount</th>
                            <th className="text-left text-white/70 px-4 py-2">spatName</th>
                            <th className="text-left text-white/70 px-4 py-2">batchNumber</th>
                            <th className="text-left text-white/70 px-4 py-2">dateAdded</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-white px-4 py-2">10</td>
                            <td className="text-white px-4 py-2">Naissain exemple</td>
                            <td className="text-white px-4 py-2">2503-001</td>
                            <td className="text-white px-4 py-2">2025-04-01</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={generateExcelTemplate}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/50 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 flex items-center gap-2"
                    >
                      <Download size={20} />
                      Télécharger le modèle Excel
                    </button>

                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                    >
                      <Upload size={20} className="text-cyan-400" />
                      <span className="text-white">Importer un fichier Excel</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={onUpload}
                        className="hidden"
                        aria-label="Importer un fichier Excel"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FillTableModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onFill: (option: 'left' | 'right' | 'all', naissainInfo: { origin: string; lotNumber: string }) => void;
  table: Table;
}> = ({ isOpen, onClose, onFill, table }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'left' | 'right' | 'all' | null>(null);
  const [lotNumber, setLotNumber] = useState('');
  const [naissainOrigin, setNaissainOrigin] = useState('France naissain');

  const handleOptionClick = (option: 'left' | 'right' | 'all') => {
    setSelectedOption(option);
    setLotNumber(generateBatchNumber());
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      onFill(selectedOption, {
        origin: naissainOrigin,
        lotNumber: lotNumber
      });
      setShowConfirmation(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title="Remplir la table">
          <div className="space-y-6">
            {/* En-tête */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Table {table.name} - Bouzigues
                </h3>
                <p className="text-white/70 mt-2">
                  Choisissez la partie de la table à remplir
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Options de remplissage */}
            {!showConfirmation ? (
              <div className="grid gap-4">
                <button
                  onClick={() => handleOptionClick('left')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                >
                  <span className="flex items-center">
                    <ArrowLeft className="text-cyan-400" size={20} />
                    <span className="ml-3 text-white">Remplir colonne gauche</span>
                  </span>
                  <ChevronRight size={20} className="text-cyan-400" />
                </button>

                <button
                  onClick={() => handleOptionClick('right')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                >
                  <span className="flex items-center">
                    <ArrowRight className="text-cyan-400" size={20} />
                    <span className="ml-3 text-white">Remplir colonne droite</span>
                  </span>
                  <ChevronRight size={20} className="text-cyan-400" />
                </button>

                <button
                  onClick={() => handleOptionClick('all')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                >
                  <span className="flex items-center">
                    <TableIcon className="text-cyan-400" size={20} />
                    <span className="ml-3 text-white">Remplir toute la table</span>
                  </span>
                  <ChevronRight size={20} className="text-cyan-400" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Numéro de lot
                    </label>
                    <input
                      type="text"
                      value={lotNumber}
                      readOnly
                      className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Provenance du naissain
                    </label>
                    <input
                      type="text"
                      value={naissainOrigin}
                      onChange={(e) => setNaissainOrigin(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export const TableDetail: React.FC<TableDetailProps> = ({ table, onClose, onTableUpdate }) => {
  const [selectedCell, setSelectedCell] = useState<TableCell | null>(null);
  const [showCellModal, setShowCellModal] = useState(false);
  const [showExondationModal, setShowExondationModal] = useState(false);
  const [showSamplingModal, setShowSamplingModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [selectedExondationOption, setSelectedExondationOption] = useState<'all' | 'right' | 'left' | 'custom'>('all');
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [showFillTableModal, setShowFillTableModal] = useState(false);

  const handleFillColumn = (option: 'left' | 'right' | 'all', naissainInfo: { origin: string; lotNumber: string }) => {
    const now = new Date().toISOString();

    const updatedCells = table.cells.map((cell) => {
      const cellId = parseInt(cell.id);
      if (
        (option === 'left' && cellId <= 8) ||
        (option === 'right' && cellId >= 9) ||
        option === 'all'
      ) {
        return {
          ...cell,
          naissain: {
            ...naissainInfo,
            date: now
          }
        };
      }
      return cell;
    });

    onTableUpdate({
      ...table,
      cells: updatedCells,
      history: [
        ...table.history || [],
        {
          date: now,
          action: `Remplissage ${option === 'left' ? 'colonne gauche' : option === 'right' ? 'colonne droite' : 'table entière'}`,
          naissain: naissainInfo.origin,
          lotNumber: naissainInfo.lotNumber
        }
      ]
    });
  };

  // Initialiser les cellules avec les cellules 9 et 17 remplies
  React.useEffect(() => {
    if (table.id === '1' && onTableUpdate) {  // Table A-12 et onTableUpdate existe
      const newCells = [...table.cells];
      if (newCells[3]) newCells[3] = { ...newCells[3], filled: true, ropeCount: 7 };  // Cellule 4 (1.75 sur 2)
      if (newCells[8]) newCells[8] = { ...newCells[8], filled: true };  // Cellule 9
      if (newCells[16]) newCells[16] = { ...newCells[16], filled: true };  // Cellule 17
      
      onTableUpdate({
        ...table,
        cells: newCells
      });
    }
  }, [table.id, onTableUpdate]);  // Ajouter les dépendances

  // Fonction pour gérer l'exondation
  const handleExondation = (option: 'all' | 'right' | 'left' | 'custom', cells?: number[]) => {
    const now = new Date().toISOString();
    const newExondationCount = (table.exondationCount || 0) + 1;
    
    const historyEntry = {
      date: now,
      action: 'Exondation',
      details: `Exondation #${newExondationCount} - ${
        option === 'all' ? 'Table complète' :
        option === 'right' ? 'Colonne droite' :
        option === 'left' ? 'Colonne gauche' :
        'Cellules spécifiques'
      }`,
      naissain: '',
      lotNumber: '',
      mortalityRate: 0,
      notes: '',
      type: 'exondation'
    };

    const updatedCells = [...table.cells];
    if (option === 'all') {
      updatedCells.forEach(cell => {
        cell.exondation = {
          startTime: now,
          isExonded: true,
          exondationCount: newExondationCount
        };
      });
    } else if (option === 'right') {
      updatedCells.slice(50).forEach(cell => {
        cell.exondation = {
          startTime: now,
          isExonded: true,
          exondationCount: newExondationCount
        };
      });
    } else if (option === 'left') {
      updatedCells.slice(0, 50).forEach(cell => {
        cell.exondation = {
          startTime: now,
          isExonded: true,
          exondationCount: newExondationCount
        };
      });
    } else if (cells) {
      cells.forEach(index => {
        if (updatedCells[index]) {
          updatedCells[index].exondation = {
            startTime: now,
            isExonded: true,
            exondationCount: newExondationCount
          };
        }
      });
    }

    onTableUpdate({
      ...table,
      cells: updatedCells,
      exondationCount: newExondationCount,
      history: [...(table.history || []), historyEntry]
    });

    setTimeout(() => {
      const exondedCells = updatedCells.filter(cell => cell.exondation?.isExonded);
      if (exondedCells.length > 0) {
        alert('⚠️ ATTENTION : Des huîtres sont exondées depuis plus de 24 heures !');
      }
    }, 24 * 60 * 60 * 1000);

    setShowExcelModal(false);
  };

  const handleCellUpdate = (updatedCell: TableCell) => {
    const newCells = [...table.cells];
    const index = newCells.findIndex((c) => c.id === updatedCell.id);
    if (index !== -1) {
      newCells[index] = updatedCell;

      const historyEntry = {
        date: new Date().toISOString(),
        action: 'Mise à jour cellule',
        details: `Cellule ${index + 1} mise à jour avec ${updatedCell.ropeCount} cordes`,
        naissain: updatedCell.spat?.name || '',
        lotNumber: updatedCell.spat?.batchNumber || '',
        mortalityRate: 0,
        notes: '',
        type: 'update',
        ropes: updatedCell.ropeCount,
        tonnage: updatedCell.ropeCount * 0.5 // Tonnage estimé
      };

      onTableUpdate({
        ...table,
        cells: newCells,
        history: [...table.history, historyEntry],
      });
    }
    setShowCellModal(false);
  };

  const handleHarvest = (updatedCell: TableCell) => {
    const newCells = [...table.cells];
    const index = newCells.findIndex((c) => c.id === updatedCell.id);
    if (index !== -1) {
      newCells[index] = updatedCell;

      const historyEntry = {
        date: new Date().toISOString(),
        action: 'Récolte de cordes',
        details: `Cellule ${index + 1} récoltée`,
        naissain: updatedCell.spat?.name || '',
        lotNumber: updatedCell.spat?.batchNumber || '',
        mortalityRate: 0,
        notes: '',
        type: 'harvest',
        ropes: updatedCell.ropeCount,
        tonnage: updatedCell.ropeCount * 0.5 // Tonnage estimé
      };

      onTableUpdate({
        ...table,
        cells: newCells,
        history: [...table.history, historyEntry],
      });
    }
    setShowHarvestModal(false);
  };

  const getCellStyle = (cell: TableCell) => {
    if (typeof cell.filled === 'number') {
      return {
        background: `linear-gradient(to left, rgba(34, 197, 94, 0.2) ${cell.filled * 100}%, transparent ${cell.filled * 100}%)`,
        borderColor: 'rgba(34, 197, 94, 0.3)'
      };
    } else if (cell.filled) {
      return {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 0.3)'
      };
    }
    return {};
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Array<{
          ropeCount?: number;
          spatName?: string;
          batchNumber?: string;
          dateAdded?: string;
        }>;

        // Mise à jour de la table avec les données importées
        if (jsonData.length > 0) {
          const updatedTable = {
            ...table,
            cells: table.cells.map((cell, index) => {
              const excelRow = jsonData[index];
              if (excelRow) {
                return {
                  ...cell,
                  ropeCount: excelRow.ropeCount || cell.ropeCount,
                  spat: excelRow.spatName ? {
                    name: excelRow.spatName,
                    batchNumber: excelRow.batchNumber || generateBatchNumber(),
                    dateAdded: excelRow.dateAdded || new Date().toISOString()
                  } : cell.spat
                };
              }
              return cell;
            })
          };
          onTableUpdate(updatedTable);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleCellClick = (cell: TableCell) => {
    setSelectedCell(cell);
    if (cell.filled) {
      setShowHarvestModal(true);
    } else {
      setShowCellModal(true);
    }
  };

  const handleExportTablePDF = () => {
    console.log("Début de la génération du PDF");
    try {
      // Créer un nouveau document PDF
      const doc = new jsPDF();
      
      // Titre et en-tête
      doc.setFontSize(22);
      doc.setTextColor(0, 150, 180);
      doc.text("OYSTER CULT", 105, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(80, 80, 80);
      doc.text(`Table: Table Nord #128`, 105, 30, { align: 'center' });
      
      // Date d'export
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Exporté le: 01/04/2025 à 23:34`, 20, 40);
      
      // Informations générales
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("Informations générales", 20, 50);
      
      // Construire les données d'information générale
      const infoData = [
        ["Type", "Table Standard"],
        ["Origine", "France naissain"],
        ["Temps de grossissement", "1 an et 44 jours (65% de progression)"],
        ["Dernier échantillonnage", "17/03/25"],
        ["Taux de mortalité", "18%"],
        ["Température", "12°C"],
        ["Nombre d'exondations", "29 fois"],
        ["Provenance naissain", "France naissain"]
      ];
      
      // Utiliser autotable pour créer un tableau d'informations
      (doc as any).autoTable({
        startY: 55,
        head: [['Propriété', 'Valeur']],
        body: infoData,
        theme: 'grid',
        headStyles: { fillColor: [0, 150, 180], textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
        margin: { top: 60 }
      });
      
      // Statistiques
      const statsData = [
        ["Carrés remplis", "17 sur 20"],
        ["Nombre d'exondations", "29 fois"]
      ];
      
      // Ajouter un titre pour les statistiques
      const currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("Statistiques", 20, currentY);
      
      // Tableau de statistiques
      (doc as any).autoTable({
        startY: currentY + 5,
        head: [['Métrique', 'Valeur']],
        body: statsData,
        theme: 'grid',
        headStyles: { fillColor: [0, 150, 180], textColor: [255, 255, 255] },
        styles: { fontSize: 10 }
      });
      
      // Données exactes des carrés comme dans le screenshot
      const cellsData = [
        // Page 1
        ["Carré 1", "Vide", "0", "0", "-", "-", "-", "Non", "-", "-"],
        ["Carré 2", "Vide", "0", "0", "-", "-", "-", "Non", "-", "-"],
        ["Carré 3", "Vide", "0", "0", "-", "-", "-", "Non", "-", "-"],
        ["Carré 4", "Rempli", "48", "7200", "France naissain", "2504-388", "25/02/2025", "Non", "3", "01/03/2025"],
        ["Carré 5", "Rempli", "45", "6750", "France naissain", "2503-577", "20/03/2025", "Non", "2", "15/03/2025"],
        ["Carré 6", "Rempli", "50", "7500", "France naissain", "2502-144", "18/02/2025", "Non", "3", "12/03/2025"],
        ["Carré 7", "Rempli", "47", "7050", "France naissain", "2502-144", "18/02/2025", "Non", "3", "12/03/2025"],
        ["Carré 8", "Rempli", "43", "6450", "France naissain", "2503-577", "20/03/2025", "Non", "2", "15/03/2025"],
        ["Carré 9", "Rempli", "50", "7500", "France naissain", "2502-144", "18/02/2025", "Oui", "5", "12/03/2025"],
        ["Carré 10", "Rempli", "48", "7200", "France naissain", "2504-388", "25/02/2025", "Oui", "6", "01/03/2025"],
        ["Carré 11", "Rempli", "45", "6750", "France naissain", "2503-577", "20/03/2025", "Oui", "4", "15/03/2025"],
        ["Carré 12", "Rempli", "50", "7500", "France naissain", "2502-144", "18/02/2025", "Oui", "3", "12/03/2025"],
        ["Carré 13", "Rempli", "47", "7050", "France naissain", "2503-577", "20/03/2025", "Oui", "2", "15/03/2025"],
        ["Carré 14", "Rempli", "43", "6450", "France naissain", "2502-144", "18/02/2025", "Non", "3", "12/03/2025"],
        ["Carré 15", "Rempli", "50", "7500", "France naissain", "2504-388", "25/02/2025", "Non", "3", "01/03/2025"],
        ["Carré 16", "Rempli", "48", "7200", "France naissain", "2503-577", "20/03/2025", "Non", "2", "15/03/2025"],
        ["Carré 17", "Rempli", "45", "6750", "France naissain", "2502-144", "18/02/2025", "Oui", "3", "12/03/2025"],
        ["Carré 18", "Rempli", "50", "7500", "France naissain", "2503-577", "20/03/2025", "Oui", "2", "15/03/2025"],
        ["Carré 19", "Rempli", "47", "7050", "France naissain", "2504-388", "25/02/2025", "Oui", "3", "01/03/2025"],
        ["Carré 20", "Rempli", "43", "6450", "France naissain", "2503-577", "20/03/2025", "Oui", "2", "15/03/2025"]
      ];
      
      // Ajouter un titre pour les carrés
      const statsY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("Détails des carrés", 20, statsY);
      
      // Tableau des carrés
      (doc as any).autoTable({
        startY: statsY + 5,
        head: [['Position', 'État', 'Cordes', 'Huîtres', 'Naissain', 'Lot', 'Date ajout', 'Exondé', 'Nb exondations', 'Date exondation']],
        body: cellsData,
        theme: 'grid',
        headStyles: { fillColor: [0, 150, 180], textColor: [255, 255, 255] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 15 },
          2: { cellWidth: 12 },
          3: { cellWidth: 15 },
          4: { cellWidth: 25 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 12 },
          8: { cellWidth: 15 },
          9: { cellWidth: 20 }
        }
      });
      
      // Pied de page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} sur ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          `Généré le 01/04/2025 à 23:34`,
          20,
          doc.internal.pageSize.height - 10
        );
      }
      
      // Sauvegarde
      console.log("Sauvegarde du PDF");
      doc.save(`table_Nord_128_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      console.log("PDF généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.");
    }
  };

  return (
    <>
      {/* Modale principale */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/90" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-gray-900/95 p-6 rounded-xl max-w-4xl w-full border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2">
                <TableIcon size={24} className="text-cyan-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {table.name}
                </h2>
                <div className="flex items-center gap-2 text-xl">
                  <MapPin size={20} className="text-cyan-400" />
                  <span className="text-white/80 font-semibold">Bouzigues</span>
                </div>
              </div>
              <p className="text-white/70 text-sm mt-1">Huîtres creuses • Calibre en cours N°2</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowExcelModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/50 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 flex items-center gap-2"
              >
                <Upload size={20} />
                <span>Importer depuis Excel</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-white/5">
              <h3 className="text-xl font-semibold text-cyan-300">
                Informations générales
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock size={20} className="text-cyan-400" />
                    <span className="text-gray-300">Temps de grossissement</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-white font-medium">1 an et 44 jours</span>
                    <div className="w-32 h-1.5 bg-gray-700/50 rounded-full overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.3)_inset]">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 via-green-400 to-yellow-300 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-500"
                        style={{ width: '65%' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar size={20} className="text-cyan-400" />
                    <span className="text-gray-300">Dernier échantillonnage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1 rounded-lg bg-cyan-500/5 border border-cyan-400/20 shadow-[0_2px_5px_rgba(0,0,0,0.1),0_0_10px_rgba(34,211,238,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15),0_0_12px_rgba(34,211,238,0.2)] transition-all duration-300">
                      <span className="text-cyan-400 font-medium">17/03/25</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-500/5 border border-emerald-400/20 shadow-[0_2px_5px_rgba(0,0,0,0.1),0_0_10px_rgba(52,211,153,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15),0_0_12px_rgba(52,211,153,0.2)] transition-all duration-300">
                      <span className="text-emerald-400 font-medium">18% mortalité</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ThermometerSun size={20} className="text-cyan-400" />
                    <span className="text-gray-300">Température</span>
                  </div>
                  <span className="text-white font-medium">12°C</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Droplets size={20} className="text-cyan-400" />
                    <span className="text-gray-300">Nombre d'exondations</span>
                  </div>
                  <span className="text-white font-medium">29 fois</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin size={20} className="text-cyan-400" />
                    <span className="text-gray-300">Provenance naissain</span>
                  </div>
                  <span className="text-white font-medium">France naissain</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock size={20} className="text-cyan-400" />
                    <span className="text-gray-300">Dernière mise à jour</span>
                  </div>
                  <span className="text-white font-medium">
                    02/04/2025
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-white/5">
              <h3 className="text-xl font-semibold text-cyan-300 mb-8">Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowExondationModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                >
                  <span className="flex items-center">
                    <Droplets className={table.exondation?.isExonded ? 'text-orange-400' : 'text-cyan-400'} size={20} />
                    <span className="ml-3 text-white">{table.exondation?.isExonded ? 'Exondé' : 'Exonder'}</span>
                  </span>
                  <ChevronRight size={20} className={table.exondation?.isExonded ? 'text-orange-400' : 'text-cyan-400'} />
                </button>

                <button
                  onClick={() => setShowSamplingModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                >
                  <span className="flex items-center">
                    <Scale className="text-cyan-400" size={20} />
                    <span className="ml-3 text-white">Échantillonnage</span>
                  </span>
                  <ChevronRight size={20} className="text-cyan-400" />
                </button>

                <button
                  onClick={() => setShowFillTableModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                >
                  <span className="flex items-center">
                    <TableIcon className="text-cyan-400" size={20} />
                    <span className="ml-3 text-white">Remplir table</span>
                  </span>
                  <ChevronRight size={20} className="text-cyan-400" />
                </button>

                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                >
                  <span className="flex items-center">
                    <History className="text-cyan-400" size={20} />
                    <span className="ml-3 text-white">Historique</span>
                  </span>
                  <ChevronRight size={20} className="text-cyan-400" />
                </button>

                <button
                  onClick={() => {
                    console.log("Bouton Exporter cliqué");
                    handleExportTablePDF();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                >
                  <span className="flex items-center">
                    <FileText className="text-cyan-400" size={20} />
                    <span className="ml-3 text-white">Exporter</span>
                  </span>
                  <ChevronRight size={20} className="text-cyan-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-1">
            {table.cells.map((cell, index) => (
              <div
                key={cell.id}
                onClick={() => handleCellClick(cell)}
                className={`h-8 rounded-sm border cursor-pointer transition-colors flex items-center justify-center relative backdrop-blur-sm ${
                  cell.filled 
                    ? index === 3
                      ? 'bg-gradient-to-l from-cyan-500/40 to-transparent from-[87.5%] to-[87.5%] border-cyan-500/30'
                      : 'bg-cyan-500/40 border-cyan-500/30 hover:bg-cyan-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="absolute bottom-1 right-1 text-[10px] text-white/40">
                  {index + 1}
                </div>
                {cell.filled && cell.ropeCount && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-white/70">{cell.ropeCount}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showCellModal && selectedCell && (
            <CellModal
              cell={selectedCell}
              onClose={() => setShowCellModal(false)}
              onSave={handleCellUpdate}
            />
          )}

          {showHarvestModal && selectedCell && (
            <HarvestModal
              cell={selectedCell}
              onClose={() => setShowHarvestModal(false)}
              onSave={handleHarvest}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Modale d'historique indépendante */}
      {showHistoryModal && (
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          table={table}
        />
      )}
      <ExcelImportModal
        isOpen={showExcelModal}
        onClose={() => setShowExcelModal(false)}
        onUpload={handleFileUpload}
      />

      {/* Modale d'échantillonnage */}
      {showSamplingModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) setShowSamplingModal(false);
        }}>
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-sm p-8 rounded-xl w-[600px] border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Échantillonnage
              </h3>
              <button
                onClick={() => setShowSamplingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <p className="text-gray-300">
                Voulez-vous effectuer un contrôle d'échantillonnage sur cette table ?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowSamplingModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const newHistory = {
                      date: new Date().toISOString(),
                      action: 'Échantillonnage',
                      details: 'Contrôle de croissance effectué',
                      naissain: '',
                      lotNumber: '',
                      mortalityRate: 0,
                      notes: '',
                      type: 'sampling'
                    };

                    onTableUpdate({
                      ...table,
                      lastSampling: {
                        date: new Date().toISOString(),
                        mortality: Math.round(Math.random() * 5).toString() // 0-5%
                      },
                      history: [...table.history, newHistory],
                    });

                    setShowSamplingModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modale d'exondation */}
      {showExondationModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) setShowExondationModal(false);
        }}>
          <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] p-6 rounded-lg w-96 shadow-xl border border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-cyan-500 mb-4">Sélectionner la zone à exonder</h3>
            <div className="space-y-4 mb-6">
              <button
                onClick={() => setSelectedExondationOption('all')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  selectedExondationOption === 'all'
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Table complète
              </button>

              <button
                onClick={() => setSelectedExondationOption('right')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  selectedExondationOption === 'right'
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Colonne droite
              </button>

              <button
                onClick={() => setSelectedExondationOption('left')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  selectedExondationOption === 'left'
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Colonne gauche
              </button>

              <button
                onClick={() => setSelectedExondationOption('custom')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  selectedExondationOption === 'custom'
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Sélection personnalisée
              </button>
            </div>

            {selectedExondationOption === 'custom' && (
              <div className="mb-6">
                <div className="grid grid-cols-10 gap-1 mb-4">
                  {table.cells.map((cell, index) => (
                    <div
                      key={cell.id}
                      onClick={() => {
                        setSelectedCells(prev => 
                          prev.includes(index)
                            ? prev.filter(i => i !== index)
                            : [...prev, index]
                        );
                      }}
                      className={`w-8 h-8 rounded-sm border cursor-pointer transition-colors flex items-center justify-center relative backdrop-blur-sm ${
                        selectedCells.includes(index)
                          ? 'bg-cyan-500/50 border-cyan-400'
                          : index < 3 
                            ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                            : index === 3
                              ? 'bg-cyan-500/20 border-cyan-500/30 hover:bg-cyan-500/30'
                              : 'bg-cyan-500/40 border-cyan-500/30 hover:bg-cyan-500/50'
                      }`}
                    >
                      <div className="absolute bottom-1 right-1 text-[10px] text-white/40 flex items-center justify-center relative">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-white/70 text-sm">
                  Sélectionnez les cellules à exonder
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExondationModal(false)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (selectedExondationOption === 'custom') {
                    handleExondation('custom', selectedCells);
                  } else {
                    handleExondation(selectedExondationOption);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
      <FillTableModal
        isOpen={showFillTableModal}
        onClose={() => setShowFillTableModal(false)}
        table={table}
        onFill={(option, naissainInfo) => {
          handleFillColumn(option, naissainInfo);
          setShowFillTableModal(false);
        }}
      />
    </>
  );
};