import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

type AutoTableConfig = {
  startY: number;
  head?: any[];
  body: any[];
  theme?: string;
  styles?: {
    fontSize?: number;
    textColor?: number[];
    cellPadding?: number;
    halign?: 'left' | 'center' | 'right';
    fillColor?: number[];
    lineWidth?: number;
    font?: string;
    fontStyle?: string;
  };
  headStyles?: {
    fillColor?: number[];
    textColor?: number[];
    fontSize?: number;
    fontStyle?: string;
    halign?: 'left' | 'center' | 'right';
  };
  columnStyles?: {
    [key: number]: {
      fontStyle?: string;
      cellWidth?: number;
      halign?: 'left' | 'center' | 'right';
      fillColor?: number[];
      textColor?: number[];
    };
  };
  margin?: { top: number; right: number; bottom: number; left: number };
  didDrawPage?: (data: any) => void;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableConfig) => jsPDF;
    lastAutoTable?: { finalY: number };
  }
}

interface TablePDFData {
  naissainName: string;
  lotNumber: string;
  origin: string;
  startDate: string;
  waterQuality: string;
  mortality: string;
}

export const generateTablePDF = (data: TablePDFData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Fond dégradé subtil
  const gradient = (y: number, h: number) => {
    doc.setFillColor(240, 249, 255);
    doc.rect(0, y, pageWidth, h, 'F');
  };
  
  // En-tête avec logo stylisé
  gradient(0, pageHeight);
  
  doc.setFillColor(0, 180, 216);
  doc.roundedRect(20, 10, 35, 35, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('OC', 37.5, 30, { align: 'center' });
  
  // Titre principal
  doc.setFontSize(32);
  doc.setTextColor(0, 180, 216);
  doc.text('OYSTER CULT', 65, 30);
  
  // Sous-titre
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('Rapport de Production Détaillé', 65, 42);
  
  // Ligne de séparation décorative
  doc.setDrawColor(0, 180, 216);
  doc.setLineWidth(0.75);
  doc.line(20, 50, pageWidth - 20, 50);
  
  // Informations principales avec style moderne
  const mainInfo = [
    [{ content: 'INFORMATIONS DU LOT', colSpan: 2, styles: { fillColor: [0, 180, 216], textColor: [255, 255, 255], fontSize: 12, fontStyle: 'bold' } }],
    ['Naissain', data.naissainName],
    ['Numéro de lot', data.lotNumber],
    ['Origine', data.origin],
    ['Date de mise à l\'eau', data.startDate],
    ['Qualité de l\'eau', data.waterQuality],
    ['Taux de mortalité', data.mortality]
  ];
  
  doc.autoTable({
    startY: 60,
    body: mainInfo,
    theme: 'grid',
    styles: {
      fontSize: 11,
      cellPadding: 10,
      lineWidth: 0.1,
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [240, 249, 255] },
      1: { halign: 'right' }
    },
    margin: { top: 20, right: 20, bottom: 20, left: 20 }
  });
  
  // Détails de production avec style moderne
  const productionInfo = [
    [{ content: 'DÉTAILS DE PRODUCTION', colSpan: 2, styles: { fillColor: [0, 180, 216], textColor: [255, 255, 255], fontSize: 12, fontStyle: 'bold' } }],
    ['Nombre de cordes', '1000'],
    ['Huîtres par corde', '150'],
    ['Type', 'Triploïdes'],
    ['Méthode de fixation', 'Collées en T15'],
    ['Durée de pousse', '11 mois']
  ];
  
  doc.autoTable({
    startY: (doc.lastAutoTable?.finalY || 0) + 15,
    body: productionInfo,
    theme: 'grid',
    styles: {
      fontSize: 11,
      cellPadding: 10,
      lineWidth: 0.1,
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [240, 249, 255] },
      1: { halign: 'right' }
    },
    margin: { top: 20, right: 20, bottom: 20, left: 20 }
  });
  
  // Pied de page
  const footer = (data: any) => {
    const str = `Page ${data.pageCount}`;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(str, pageWidth - 20, pageHeight - 12, { align: 'right' });
    doc.text(' 2025 Oyster Cult - Document généré le ' + new Date().toLocaleDateString('fr-FR'), 20, pageHeight - 12);
  };
  
  doc.autoTable({
    startY: (doc.lastAutoTable?.finalY || 0) + 15,
    body: [],
    didDrawPage: footer,
    margin: { top: 20, right: 20, bottom: 20, left: 20 }
  });
  
  return doc;
};
