import React, { useState, useRef, useEffect } from 'react';
import { Shell, Filter, QrCode, Download, Package, Waves, FileText, Truck, MapPin, History, Thermometer, Droplets, AlertCircle, Edit2, Save, Eye, Search, X, Plus, ChevronDown, Calendar, Lock, Info } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { BrowserQRCodeReader } from '@zxing/browser';

// Ajout du style pour l'animation de fade-in
import './traceability.css';

// Types
interface Lot {
  id: string;
  name: string;
  date: string;
  type: 'lot';
  location: string;
  status: string;
  stock: {
    quantity: string;
    unit: string;
  };
  responsible?: string;
  calibre?: string;
}

interface Bassin {
  id: string;
  name: string;
  date: string;
  type: 'bassin';
  location: string;
  status: string;
  occupation: string;
  nextMaintenance: string;
  stock: {
    quantity: string;
    unit: string;
  };
  stats: { label: string; value: string }[];
}

interface Storage {
  id: string;
  name: string;
  date: string;
  type: 'storage';
  location: string;
  status: string;
  stats: { label: string; value: string }[];
  products: { name: string; quantity: string; dlc: string }[];
}

interface BonLivraison {
  id: string;
  reference: string;
  date: string;
  type: 'bl';
  client: string;
  status: string;
  products: { name: string; quantity: string }[];
  notes: string;
}

interface HistoryItem {
  id: string;
  date: string;
  type: 'history';
  action: string;
  user: string;
  details: string;
}

type TraceabilityItem = Lot | Bassin | Storage | BonLivraison | HistoryItem;

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface EditableItem {
  id: string;
  type: string;
  [key: string]: any;
}

interface FilterOptions {
  date?: string;
  status?: string;
  type?: string;
  search?: string;
}

// Mock data
const mockLots: Lot[] = [
  {
    id: 'lot001',
    name: 'Lot Huîtres A',
    date: '2023-05-12',
    type: 'lot',
    location: 'Bassin 3',
    status: 'Optimal',
    stock: { quantity: '500', unit: 'kg' },
  },
  {
    id: 'lot002',
    name: 'Lot Huîtres B',
    date: '2023-05-15',
    type: 'lot',
    location: 'Bassin 2',
    status: 'Attention',
    stock: { quantity: '350', unit: 'kg' },
  },
  {
    id: 'lot003',
    name: 'Lot Huîtres C',
    date: '2023-06-01',
    type: 'lot',
    location: 'Stockage 1',
    status: 'Optimal',
    stock: { quantity: '200', unit: 'kg' },
  },
];

const mockBassins: Bassin[] = [
  {
    id: 'bassin001',
    name: 'Bassin 1',
    date: '2023-04-01',
    type: 'bassin',
    location: 'Zone production nord',
    status: 'Optimal',
    occupation: '75%',
    nextMaintenance: '2023-07-15',
    stock: { quantity: '850', unit: 'kg' },
    stats: [
      { label: 'Température', value: '12.3°C' },
      { label: 'Oxygène', value: '7.8 mg/L' },
      { label: 'Produit', value: 'Huîtres N°2' },
    ],
  },
  {
    id: 'bassin002',
    name: 'Bassin 2',
    date: '2023-04-05',
    type: 'bassin',
    location: 'Zone production est',
    status: 'Attention',
    occupation: '45%',
    nextMaintenance: '2023-07-10',
    stock: { quantity: '420', unit: 'kg' },
    stats: [
      { label: 'Température', value: '11.9°C' },
      { label: 'Oxygène', value: '6.5 mg/L' },
      { label: 'Produit', value: 'Moules de mer' },
    ],
  },
  {
    id: 'bassin003',
    name: 'Bassin 3',
    date: '2023-04-10',
    type: 'bassin',
    location: 'Zone production sud',
    status: 'Optimal',
    occupation: '90%',
    nextMaintenance: '2023-07-20',
    stock: { quantity: '950', unit: 'kg' },
    stats: [
      { label: 'Température', value: '12.1°C' },
      { label: 'Oxygène', value: '7.2 mg/L' },
      { label: 'Produit', value: 'Huîtres N°3' },
    ],
  },
];

const mockStorage: Storage[] = [
  {
    id: 'storage-0001',
    name: 'Frigo 1',
    type: 'storage',
    date: '2023-04-20',
    location: 'Zone de stockage principale',
    status: 'Optimal',
    stats: [
      { label: 'Type', value: 'Frigo' },
      { label: 'Capacité', value: '500 kg' },
      { label: 'Occupation', value: '65%' },
      { label: 'Température', value: '4.5°C' },
      { label: 'Humidité', value: '85%' },
    ],
    products: [
      { name: 'Huîtres Fines de Claire N°3', quantity: '180 kg', dlc: '05/04/2025' },
      { name: 'Huîtres Spéciales N°2', quantity: '145 kg', dlc: '08/04/2025' },
    ]
  },
  {
    id: 'storage-0002',
    name: 'Frigo 2',
    type: 'storage',
    date: '2023-04-25',
    location: 'Zone de stockage principale',
    status: 'Optimal',
    stats: [
      { label: 'Type', value: 'Frigo' },
      { label: 'Capacité', value: '300 kg' },
      { label: 'Occupation', value: '30%' },
      { label: 'Température', value: '5.2°C' },
      { label: 'Humidité', value: '80%' },
    ],
    products: [
      { name: 'Huîtres Plates', quantity: '60 kg', dlc: '10/04/2025' },
      { name: 'Moules de Bouchot', quantity: '30 kg', dlc: '02/04/2025' },
    ]
  },
  {
    id: 'storage-0003',
    name: 'Congélateur 1',
    type: 'storage',
    date: '2023-04-30',
    location: 'Zone de stockage secondaire',
    status: 'Attention',
    stats: [
      { label: 'Type', value: 'Congélateur' },
      { label: 'Capacité', value: '200 kg' },
      { label: 'Occupation', value: '85%' },
      { label: 'Température', value: '-18.2°C' },
      { label: 'Humidité', value: '40%' },
    ],
    products: [
      { name: 'Fruits de mer congelés', quantity: '95 kg', dlc: '20/10/2025' },
      { name: 'Poissons congelés', quantity: '75 kg', dlc: '15/09/2025' },
    ]
  },
  {
    id: 'storage-0004',
    name: 'Congélateur 2',
    type: 'storage',
    date: '2023-05-05',
    location: 'Zone de stockage secondaire',
    status: 'Optimal',
    stats: [
      { label: 'Type', value: 'Congélateur' },
      { label: 'Capacité', value: '150 kg' },
      { label: 'Occupation', value: '40%' },
      { label: 'Température', value: '-20.5°C' },
      { label: 'Humidité', value: '35%' },
    ],
    products: [
      { name: 'Crustacés congelés', quantity: '35 kg', dlc: '25/11/2025' },
      { name: 'Préparations maison', quantity: '25 kg', dlc: '30/08/2025' },
    ]
  },
  {
    id: 'storage-0005',
    name: 'Remise',
    type: 'storage',
    date: '2023-05-10',
    location: 'Arrière bâtiment',
    status: 'Optimal',
    stats: [
      { label: 'Type', value: 'Remise' },
      { label: 'Capacité', value: '1000 kg' },
      { label: 'Occupation', value: '55%' },
      { label: 'Température', value: '15.0°C' },
      { label: 'Humidité', value: '60%' },
    ],
    products: [
      { name: 'Matériel d\'emballage', quantity: '300 kg', dlc: 'N/A' },
      { name: 'Équipement de manutention', quantity: '250 kg', dlc: 'N/A' },
    ]
  },
  {
    id: 'storage-0006',
    name: 'Cave',
    type: 'storage',
    date: '2023-05-15',
    location: 'Sous-sol',
    status: 'Optimal',
    stats: [
      { label: 'Type', value: 'Remise' },
      { label: 'Capacité', value: '800 kg' },
      { label: 'Occupation', value: '25%' },
      { label: 'Température', value: '12.5°C' },
      { label: 'Humidité', value: '75%' },
    ],
    products: [
      { name: 'Conserves', quantity: '120 kg', dlc: '31/12/2026' },
      { name: 'Fournitures diverses', quantity: '80 kg', dlc: 'N/A' },
    ]
  }
];

const mockBLs: BonLivraison[] = [
  {
    id: 'bl001',
    reference: 'BL-2023-001',
    date: '2023-06-05',
    type: 'bl',
    client: 'Restaurant La Marée',
    status: 'Livré',
    products: [
      { name: 'Huîtres calibre 3', quantity: '20kg' },
      { name: 'Huîtres calibre 2', quantity: '15kg' },
    ],
    notes: 'Livraison effectuée le matin, client satisfait.',
  },
  {
    id: 'bl002',
    reference: 'BL-2023-002',
    date: '2023-06-10',
    type: 'bl',
    client: 'Poissonnerie du Port',
    status: 'En cours',
    products: [
      { name: 'Huîtres calibre 1', quantity: '25kg' },
      { name: 'Huîtres calibre 4', quantity: '10kg' },
    ],
    notes: 'Livraison prévue pour demain matin.',
  },
];

const mockHistory: HistoryItem[] = [
  {
    id: 'hist001',
    date: '2023-06-01 09:30',
    type: 'history',
    action: 'Contrôle qualité',
    user: 'Jean Dupont',
    details: 'Contrôle effectué sur Bassin 1, paramètres normaux.',
  },
  {
    id: 'hist002',
    date: '2023-06-02 11:15',
    type: 'history',
    action: 'Maintenance',
    user: 'Marie Martin',
    details: 'Maintenance du système de filtration Bassin 2.',
  },
  {
    id: 'hist003',
    date: '2023-06-03 14:45',
    type: 'history',
    action: 'Récolte',
    user: 'Pierre Leblanc',
    details: 'Récolte de 100kg depuis Bassin 3 vers Stockage 1.',
  },
  {
    id: 'hist004',
    date: '2023-06-04 16:30',
    type: 'history',
    action: 'Préparation commande',
    user: 'Sophie Leroy',
    details: 'Préparation BL-2023-001 pour Restaurant La Marée.',
  },
];

export function TraceabilityPage() {
  const [activeTab, setActiveTab] = useState('lots');
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBLModal, setShowBLModal] = useState(false);
  const [selectedBL, setSelectedBL] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [qrResult, setQrResult] = useState<string>('');
  const [expandedStorages, setExpandedStorages] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [codeReader, setCodeReader] = useState<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    if (showQRModal && !codeReader) {
      const reader = new BrowserQRCodeReader();
      setCodeReader(reader);
    }
    return () => {
      setCodeReader(null);
    };
  }, [showQRModal]);

  useEffect(() => {
    if (showQRModal && codeReader && videoRef.current) {
      codeReader
        .decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
          if (result) {
            setQrResult(result.getText());
            // Ici vous pouvez ajouter la logique pour traiter le résultat du QR code
            console.log('QR Code scanné:', result.getText());
          }
        })
        .catch(err => console.error('Erreur lors du scan:', err));
    }
  }, [showQRModal, codeReader]);

  const handleEdit = (item: EditableItem) => {
    setEditingItem(item);
    setEditedValues(JSON.parse(JSON.stringify(item)));
  };

  const handleSave = () => {
    // Ici, vous ajouteriez la logique pour sauvegarder les modifications
    console.log('Saving:', editedValues);
    setEditingItem(null);
  };

  const handleViewBL = (bl: any) => {
    setSelectedBL(bl);
    setShowBLModal(true);
  };

  const handleExport = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Variable globale pour la position Y, sera utilisée par toutes les fonctions d'export
    let yPosition = 60;

    // Titre du rapport
    doc.setFillColor(10, 42, 64);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Rapport de Traçabilité OYSTER CULT', pageWidth/2, 15, { align: 'center' });
    
    // Informations d'export
    doc.setTextColor(10, 42, 64);
    doc.setFontSize(10);
    doc.text(`Date d'export: ${new Date().toLocaleDateString('fr-FR')}`, 14, 35);
    doc.text(`Exporté par: ${'Utilisateur'}`, 14, 42);
    doc.text(`Période: ${new Date().toLocaleDateString('fr-FR')} - ${new Date().toLocaleDateString('fr-FR')}`, 14, 49);
    
    // Fonction helper pour créer l'en-tête d'un tableau
    const createTableHeader = (headers: string[], columnWidths: number[]) => {
      doc.setFillColor(10, 42, 64);
      doc.rect(10, yPosition, pageWidth - 20, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      
      let xPosition = 10;
      headers.forEach((header, index) => {
        const columnWidth = columnWidths[index];
        doc.text(header, xPosition + (columnWidth / 2), yPosition + 7, { align: 'center' });
        xPosition += columnWidth;
      });
      
      yPosition += 10;
    };

    // Vérifier si on a besoin d'une nouvelle page
    const checkPageBreak = (rowsToAdd: number, rowHeight: number = 10) => {
      const requiredSpace = rowsToAdd * rowHeight;
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage();
        
        // Réinitialiser la position Y et ajouter l'en-tête de page
        yPosition = 30;
        
        // Ajouter un en-tête de page
        doc.setFillColor(10, 42, 64);
        doc.rect(0, 0, pageWidth, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text('Rapport de Traçabilité OYSTER CULT (suite)', pageWidth/2, 13, { align: 'center' });
        
        return true;
      }
      return false;
    };

    // Fonction pour exporter les données des lots
    const exportLots = () => {
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Lots en cours', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 10;

      // Définir les largeurs des colonnes (sans la colonne ID)
      const columnWidths = [(pageWidth - 20) * 0.25, (pageWidth - 20) * 0.25, (pageWidth - 20) * 0.20, (pageWidth - 20) * 0.15, (pageWidth - 20) * 0.15];
      
      // En-têtes du tableau (sans ID)
      createTableHeader(['Nom', 'Emplacement', 'Stock', 'Status', 'Date'], columnWidths);
      
      // Vérifier si on a besoin d'une nouvelle page
      checkPageBreak(mockLots.length);
      
      // Lignes du tableau
      mockLots.forEach((lot, index) => {
        const y = yPosition + (index * 10);
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(10, y, pageWidth - 20, 10, 'F');
        }
        doc.setTextColor(60, 60, 60);
        
        let xPosition = 10;
        // Nom
        doc.text(lot.name, xPosition + (columnWidths[0] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[0];
        
        // Emplacement
        doc.text(lot.location, xPosition + (columnWidths[1] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[1];
        
        // Stock
        doc.text(`${lot.stock.quantity} ${lot.stock.unit}`, xPosition + (columnWidths[2] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[2];
        
        // Status
        doc.text(lot.status, xPosition + (columnWidths[3] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[3];
        
        // Date
        doc.text(lot.date, xPosition + (columnWidths[4] / 2), y + 7, { align: 'center' });
      });

      yPosition += (mockLots.length * 10) + 15;
    };

    // Fonction pour exporter les données des bassins
    const exportBassins = () => {
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Bassins', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 10;

      // Définir les largeurs des colonnes (sans la colonne ID)
      const columnWidths = [(pageWidth - 20) * 0.20, (pageWidth - 20) * 0.20, (pageWidth - 20) * 0.15, (pageWidth - 20) * 0.15, (pageWidth - 20) * 0.15, (pageWidth - 20) * 0.15];
      
      // En-têtes du tableau (sans ID)
      createTableHeader(['Nom', 'Emplacement', 'Stock', 'Occupation', 'Statut', 'Proch. Maintenance'], columnWidths);
      
      // Vérifier si on a besoin d'une nouvelle page
      checkPageBreak(mockBassins.length);
      
      // Lignes du tableau
      mockBassins.forEach((bassin, index) => {
        const y = yPosition + (index * 10);
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(10, y, pageWidth - 20, 10, 'F');
        }
        doc.setTextColor(60, 60, 60);
        
        let xPosition = 10;
        // Nom
        doc.text(bassin.name, xPosition + (columnWidths[0] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[0];
        
        // Emplacement
        doc.text(bassin.location, xPosition + (columnWidths[1] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[1];
        
        // Stock
        doc.text(`${bassin.stock.quantity} ${bassin.stock.unit}`, xPosition + (columnWidths[2] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[2];
        
        // Occupation
        doc.text(bassin.occupation, xPosition + (columnWidths[3] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[3];
        
        // Statut
        doc.text(bassin.status, xPosition + (columnWidths[4] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[4];
        
        // Maintenance
        doc.text(bassin.nextMaintenance, xPosition + (columnWidths[5] / 2), y + 7, { align: 'center' });
      });

      yPosition += (mockBassins.length * 10) + 15;
    };

    // Fonction pour exporter les données des emplacements de stockage
    const exportStockage = () => {
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Emplacements de stockage', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 10;

      // Définir les largeurs des colonnes (sans la colonne ID)
      const columnWidths = [(pageWidth - 20) * 0.25, (pageWidth - 20) * 0.25, (pageWidth - 20) * 0.20, (pageWidth - 20) * 0.15, (pageWidth - 20) * 0.15];
      
      // En-têtes du tableau (sans ID)
      createTableHeader(['Nom', 'Emplacement', 'Température', 'Humidité', 'Statut'], columnWidths);
      
      // Vérifier si on a besoin d'une nouvelle page
      checkPageBreak(mockStorage.length);
      
      // Lignes du tableau
      mockStorage.forEach((storage, index) => {
        const y = yPosition + (index * 10);
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(10, y, pageWidth - 20, 10, 'F');
        }
        doc.setTextColor(60, 60, 60);
        
        let xPosition = 10;
        // Nom
        doc.text(storage.name, xPosition + (columnWidths[0] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[0];
        
        // Emplacement
        doc.text(storage.location, xPosition + (columnWidths[1] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[1];
        
        // Température
        const temperature = storage.stats.find(stat => stat.label === 'Température')?.value || 'N/A';
        doc.text(temperature, xPosition + (columnWidths[2] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[2];
        
        // Humidité
        const humidite = storage.stats.find(stat => stat.label === 'Humidité')?.value || 'N/A';
        doc.text(humidite, xPosition + (columnWidths[3] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[3];
        
        // Statut
        doc.text(storage.status, xPosition + (columnWidths[4] / 2), y + 7, { align: 'center' });
      });

      yPosition += (mockStorage.length * 10) + 15;

      // Détails des produits stockés
      doc.addPage();
      yPosition = 30; // Position Y plus haute pour avoir plus d'espace

      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Produits stockés', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 10;

      // Définir les largeurs des colonnes
      const productColumnWidths = [(pageWidth - 20) * 0.25, (pageWidth - 20) * 0.35, (pageWidth - 20) * 0.20, (pageWidth - 20) * 0.20];
      
      // En-têtes du tableau
      createTableHeader(['Emplacement', 'Produit', 'Quantité', 'DLC'], productColumnWidths);
      
      // Calculer le nombre total de produits
      let totalProducts = 0;
      mockStorage.forEach(storage => {
        totalProducts += storage.products.length;
      });
      
      // Vérifier si on a besoin d'une nouvelle page
      checkPageBreak(totalProducts);
      
      // Lignes du tableau avec tous les produits de tous les emplacements
      let rowCount = 0;
      mockStorage.forEach(storage => {
        storage.products.forEach((product, pIndex) => {
          // Si nous atteignons la limite de la page, créer une nouvelle page
          if (rowCount > 0 && rowCount % 25 === 0) {
            doc.addPage();
            yPosition = 30;
            createTableHeader(['Emplacement', 'Produit', 'Quantité', 'DLC'], productColumnWidths);
          }
          
          const y = yPosition + (rowCount % 25) * 10;
          if (rowCount % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(10, y, pageWidth - 20, 10, 'F');
          }
          doc.setTextColor(60, 60, 60);
          
          let xPosition = 10;
          // Emplacement
          doc.text(storage.name, xPosition + (productColumnWidths[0] / 2), y + 7, { align: 'center' });
          xPosition += productColumnWidths[0];
          
          // Produit
          doc.text(product.name, xPosition + (productColumnWidths[1] / 2), y + 7, { align: 'center' });
          xPosition += productColumnWidths[1];
          
          // Quantité
          doc.text(product.quantity, xPosition + (productColumnWidths[2] / 2), y + 7, { align: 'center' });
          xPosition += productColumnWidths[2];
          
          // DLC
          doc.text(product.dlc, xPosition + (productColumnWidths[3] / 2), y + 7, { align: 'center' });
          
          rowCount++;
        });
      });

      yPosition += ((rowCount % 25) * 10) + 15;
    };

    // Fonction pour exporter les bons de livraison
    const exportBL = () => {
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Bons de livraison', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 10;

      // Définir les largeurs des colonnes
      const columnWidths = [(pageWidth - 20) * 0.20, (pageWidth - 20) * 0.30, (pageWidth - 20) * 0.25, (pageWidth - 20) * 0.25];
      
      // En-têtes du tableau
      createTableHeader(['Référence', 'Client', 'Date', 'Statut'], columnWidths);
      
      // Vérifier si on a besoin d'une nouvelle page
      checkPageBreak(mockBLs.length);
      
      // Lignes du tableau
      mockBLs.forEach((bl, index) => {
        const y = yPosition + (index * 10);
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(10, y, pageWidth - 20, 10, 'F');
        }
        doc.setTextColor(60, 60, 60);
        
        let xPosition = 10;
        // Référence
        doc.text(bl.reference, xPosition + (columnWidths[0] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[0];
        
        // Client
        doc.text(bl.client, xPosition + (columnWidths[1] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[1];
        
        // Date
        doc.text(bl.date, xPosition + (columnWidths[2] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[2];
        
        // Statut
        doc.text(bl.status, xPosition + (columnWidths[3] / 2), y + 7, { align: 'center' });
      });

      yPosition += (mockBLs.length * 10) + 15;
    };

    // Fonction pour exporter l'historique
    const exportHistorique = () => {
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Historique des activités', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 10;

      // Définir les largeurs des colonnes
      const columnWidths = [(pageWidth - 20) * 0.20, (pageWidth - 20) * 0.20, (pageWidth - 20) * 0.20, (pageWidth - 20) * 0.40];
      
      // En-têtes du tableau
      createTableHeader(['Date', 'Utilisateur', 'Action', 'Détails'], columnWidths);
      
      // Vérifier si on a besoin d'une nouvelle page
      checkPageBreak(mockHistory.length);
      
      // Lignes du tableau
      mockHistory.forEach((item, index) => {
        const y = yPosition + (index * 10);
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(10, y, pageWidth - 20, 10, 'F');
        }
        doc.setTextColor(60, 60, 60);
        
        let xPosition = 10;
        // Date
        doc.text(item.date, xPosition + (columnWidths[0] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[0];
        
        // Utilisateur
        doc.text(item.user, xPosition + (columnWidths[1] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[1];
        
        // Action
        doc.text(item.action, xPosition + (columnWidths[2] / 2), y + 7, { align: 'center' });
        xPosition += columnWidths[2];
        
        // Détails
        doc.text(item.details, xPosition + (columnWidths[3] / 2), y + 7, { align: 'center' });
      });

      yPosition += (mockHistory.length * 10) + 15;
    };
    
    // Toujours exporter toutes les données, indépendamment de l'onglet actif
    // Premier onglet : Lots
    exportLots();
    
    // Ajouter une nouvelle page pour chaque onglet suivant
    doc.addPage();
    yPosition = 30; // Réinitialiser la position Y pour la nouvelle page
    exportBassins();
    
    doc.addPage();
    yPosition = 30;
    exportStockage();
    
    doc.addPage();
    yPosition = 30;
    exportBL();
    
    doc.addPage();
    yPosition = 30;
    exportHistorique();

    // Ajouter un pied de page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      
      // Formatage corrigé pour éviter le problème de pagination
      const pageText = `Page ${i}/${pageCount}`;
      doc.text(`OYSTER CULT - Traçabilité - ${pageText}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Sauvegarder le PDF
    doc.save('traceabilite-oyster-cult.pdf');
    
    // Fermer le modal
    setShowExportModal(false);
  };

  const renderEditModal = () => {
    if (!editingItem) return null;

    const renderEditFields = () => {
      switch (editingItem.type) {
        case 'lot':
          return (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm text-cyan-400 mb-1">Nom</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editedValues.name}
                  onChange={(e) => setEditedValues({ ...editedValues, name: e.target.value })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  autoComplete="off"
                />
              </div>
              <div>
                <label htmlFor="edit-location" className="block text-sm text-cyan-400 mb-1">Emplacement</label>
                <input
                  id="edit-location"
                  type="text"
                  value={editedValues.location}
                  onChange={(e) => setEditedValues({ ...editedValues, location: e.target.value })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  autoComplete="off"
                />
              </div>
              <div>
                <label htmlFor="edit-quantity" className="block text-sm text-cyan-400 mb-1">Quantité</label>
                <input
                  id="edit-quantity"
                  type="text"
                  value={editedValues.stock.quantity}
                  onChange={(e) => setEditedValues({ 
                    ...editedValues, 
                    stock: { ...editedValues.stock, quantity: e.target.value }
                  })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  autoComplete="off"
                />
              </div>
            </div>
          );
        case 'bassin':
          return (
            <div className="space-y-4">
              {editingItem.stats.map((stat: any, index: number) => (
                <div key={index}>
                  <label htmlFor={`edit-stat-${index}`} className="block text-sm text-cyan-400 mb-1">{stat.label}</label>
                  <input
                    id={`edit-stat-${index}`}
                    type="text"
                    value={editedValues.stats[index].value}
                    onChange={(e) => {
                      const newStats = [...editedValues.stats];
                      newStats[index] = { ...newStats[index], value: e.target.value };
                      setEditedValues({ ...editedValues, stats: newStats });
                    }}
                    className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    autoComplete="off"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="edit-occupation" className="block text-sm text-cyan-400 mb-1">Occupation</label>
                <input
                  id="edit-occupation"
                  type="text"
                  value={editedValues.occupation}
                  onChange={(e) => setEditedValues({ ...editedValues, occupation: e.target.value })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  autoComplete="off"
                />
              </div>
              <div>
                <label htmlFor="edit-maintenance" className="block text-sm text-cyan-400 mb-1">Prochaine maintenance</label>
                <input
                  id="edit-maintenance"
                  type="text"
                  value={editedValues.nextMaintenance}
                  onChange={(e) => setEditedValues({ ...editedValues, nextMaintenance: e.target.value })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  autoComplete="off"
                />
              </div>
              <div>
                <label htmlFor="edit-stock" className="block text-sm text-cyan-400 mb-1">Stock</label>
                <input
                  id="edit-stock"
                  type="text"
                  value={editedValues.stock.quantity}
                  onChange={(e) => setEditedValues({ 
                    ...editedValues, 
                    stock: { ...editedValues.stock, quantity: e.target.value }
                  })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  autoComplete="off"
                />
              </div>
            </div>
          );
        case 'storage':
          return (
            <div className="space-y-4">
              {editingItem.stats.map((stat: any, index: number) => (
                <div key={index}>
                  <label htmlFor={`edit-storage-stat-${index}`} className="block text-sm text-cyan-400 mb-1">{stat.label}</label>
                  <input
                    id={`edit-storage-stat-${index}`}
                    type="text"
                    value={editedValues.stats[index].value}
                    onChange={(e) => {
                      const newStats = [...editedValues.stats];
                      newStats[index] = { ...newStats[index], value: e.target.value };
                      setEditedValues({ ...editedValues, stats: newStats });
                    }}
                    className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    autoComplete="off"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-cyan-400 mb-1">Produits</label>
                {editedValues.products.map((product: any, index: number) => (
                  <div key={index} className="space-y-2 mb-4 p-3 rounded-lg bg-cyan-500/5">
                    <div>
                      <label htmlFor={`edit-product-name-${index}`} className="block text-sm text-cyan-400 mb-1">Nom du produit</label>
                      <input
                        id={`edit-product-name-${index}`}
                        type="text"
                        value={product.name}
                        onChange={(e) => {
                          const newProducts = [...editedValues.products];
                          newProducts[index] = { ...newProducts[index], name: e.target.value };
                          setEditedValues({ ...editedValues, products: newProducts });
                        }}
                        className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label htmlFor={`edit-product-quantity-${index}`} className="block text-sm text-cyan-400 mb-1">Quantité</label>
                      <input
                        id={`edit-product-quantity-${index}`}
                        type="text"
                        value={product.quantity}
                        onChange={(e) => {
                          const newProducts = [...editedValues.products];
                          newProducts[index] = { ...newProducts[index], quantity: e.target.value };
                          setEditedValues({ ...editedValues, products: newProducts });
                        }}
                        className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label htmlFor={`edit-product-dlc-${index}`} className="block text-sm text-cyan-400 mb-1">DLC</label>
                      <input
                        id={`edit-product-dlc-${index}`}
                        type="text"
                        value={product.dlc}
                        onChange={(e) => {
                          const newProducts = [...editedValues.products];
                          newProducts[index] = { ...newProducts[index], dlc: e.target.value };
                          setEditedValues({ ...editedValues, products: newProducts });
                        }}
                        className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <Modal
        isOpen={true}
        onClose={() => setEditingItem(null)}
        title={`Modifier ${editingItem.name}`}
      >
        {renderEditFields()}
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={() => setEditingItem(null)}
            className="px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Annuler la modification"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            aria-label="Enregistrer les modifications"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </Modal>
    );
  };

  const renderBLModal = () => {
    if (!showBLModal || !selectedBL) return null;

    return (
      <Modal
        isOpen={true}
        onClose={() => setShowBLModal(false)}
        title={`Bon de livraison - ${selectedBL.reference}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-cyan-400">Date</p>
              <p className="text-white">{selectedBL.date}</p>
            </div>
            <div>
              <p className="text-sm text-cyan-400 mb-1">Client</p>
              <p className="text-white">{selectedBL.client}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-cyan-400 mb-2" id="products-heading">Produits</p>
            <div className="space-y-2" aria-labelledby="products-heading">
              {selectedBL.products.map((product: any, index: number) => (
                <div key={index} className="p-3 rounded-lg bg-cyan-500/10">
                  <div className="flex justify-between items-center">
                    <p className="text-white">{product.name}</p>
                    <p className="text-cyan-400">{product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-cyan-400">Notes</p>
            <p className="text-white">{selectedBL.notes}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowBLModal(false)}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              aria-label="Fermer le bon de livraison"
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const renderFilterModal = () => {
    if (!showFilterModal) return null;

    return (
      <Modal
        isOpen={true}
        onClose={() => setShowFilterModal(false)}
        title="Filtrer les éléments"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="filter-search" className="block text-sm text-cyan-400 mb-1">Recherche</label>
            <div className="relative">
              <input
                id="filter-search"
                type="text"
                value={filterOptions.search || ''}
                onChange={(e) => setFilterOptions({ ...filterOptions, search: e.target.value })}
                className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                placeholder="Rechercher..."
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400" aria-hidden="true" />
            </div>
          </div>
          <div>
            <label htmlFor="filter-date" className="block text-sm text-cyan-400 mb-1">Date</label>
            <input
              id="filter-date"
              type="date"
              value={filterOptions.date || ''}
              onChange={(e) => setFilterOptions({ ...filterOptions, date: e.target.value })}
              className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>
          <div>
            <label htmlFor="filter-status" className="block text-sm text-cyan-400 mb-1">Statut</label>
            <select
              id="filter-status"
              value={filterOptions.status || ''}
              onChange={(e) => setFilterOptions({ ...filterOptions, status: e.target.value })}
              className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              <option value="">Tous</option>
              <option value="Optimal">Optimal</option>
              <option value="Attention">Attention</option>
              <option value="Livré">Livré</option>
              <option value="En cours">En cours</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-type" className="block text-sm text-cyan-400 mb-1">Type</label>
            <select
              id="filter-type"
              value={filterOptions.type || ''}
              onChange={(e) => setFilterOptions({ ...filterOptions, type: e.target.value })}
              className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              <option value="">Tous</option>
              <option value="lot">Lots</option>
              <option value="bassin">Bassins</option>
              <option value="storage">Stockage</option>
              <option value="bl">Bons de livraison</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setFilterOptions({});
                setShowFilterModal(false);
              }}
              className="px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Réinitialiser les filtres"
            >
              Réinitialiser
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              aria-label="Appliquer les filtres"
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
              Appliquer
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const renderQRModal = () => {
    if (!showQRModal) return null;

    return (
      <Modal
        isOpen={true}
        onClose={() => {
          setShowQRModal(false);
          setQrResult('');
        }}
        title="Scanner un QR Code"
      >
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg bg-black aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-lg"
              aria-label="Flux vidéo pour le scan de QR code"
            />
          </div>
          {qrResult && (
            <div className="p-3 rounded-lg bg-cyan-500/10">
              <p className="text-sm text-cyan-400" id="qr-result-label">Résultat du scan</p>
              <p className="text-white break-all" aria-labelledby="qr-result-label">{qrResult}</p>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowQRModal(false);
                setQrResult('');
              }}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              aria-label="Fermer le scanner QR"
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const renderExportModal = () => {
    if (!showExportModal) return null;

    return (
      <Modal
        isOpen={true}
        onClose={() => setShowExportModal(false)}
        title="Exporter les données"
      >
        <div className="space-y-4">
          <p className="text-white" id="export-description">Voulez-vous exporter toutes les données de traçabilité en PDF ? Le document contiendra toutes les informations de chaque onglet (Lots, Bassins, Stockage, Bons de livraison et Historique).</p>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
            <h3 className="text-cyan-400 font-medium mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Informations importantes
            </h3>
            <ul className="list-disc pl-5 text-sm text-white/80 space-y-2">
              <li>Le PDF généré contiendra <strong>toutes les données</strong> de tous les onglets, quelle que soit la page actuellement affichée.</li>
              <li>Les données seront organisées par sections avec une mise en page optimisée.</li>
              <li>Pour les sections contenant beaucoup de données, plusieurs pages seront créées automatiquement.</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => setShowExportModal(false)}
              className="px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Annuler l'export"
            >
              Annuler
            </button>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              aria-labelledby="export-description"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Exporter en PDF
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const TabList = ({ tabs, activeTab, onChange, className }: { tabs: any[], activeTab: string, onChange: (id: string) => void, className?: string }) => {
    return (
      <div className={`flex gap-4 ${className}`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap min-w-[44px] min-h-[44px] ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] focus:ring-2 focus:ring-cyan-500/40 transform hover:-translate-y-1 hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] transition-all duration-300'
                : 'text-white/60 hover:text-white hover:bg-white/5 shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-white/30 transform hover:-translate-y-1 transition-all duration-300'
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            <span className="w-4 h-4" aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const tabs: TabData[] = [
    {
      id: 'lots',
      label: 'Lots en cours',
      icon: <Package size={20} />,
      count: 28
    },
    {
      id: 'bassins',
      label: 'Bassins',
      icon: <Waves size={20} />,
      count: 15
    },
    {
      id: 'autre_emplacement',
      label: 'Autre emplacement',
      icon: <MapPin size={20} />,
      count: 8
    },
    {
      id: 'bl',
      label: 'Bons de livraison',
      icon: <Truck size={20} />,
      count: 36
    },
    {
      id: 'historique',
      label: 'Historique',
      icon: <History size={20} />
    }
  ];

  const handleViewDocument = (documentId: string) => {
    // Logique pour afficher le document
    console.log('Visualisation du document:', documentId);
  };

  const toggleStorageExpand = (storageId: string) => {
    setExpandedStorages(prev => 
      prev.includes(storageId) 
        ? prev.filter(id => id !== storageId) 
        : [...prev, storageId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-4">
            <Shell size={28} className="text-cyan-400" aria-hidden="true" />
            Traçabilité
          </h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Filtrer les lots"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtrer</span>
            </button>
            <button
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Ajouter un lot"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Exporter les données"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>
        
        <div className="relative mb-6 mt-4">
          <TabList 
            tabs={tabs} 
            activeTab={activeTab} 
            onChange={handleTabChange} 
            className="overflow-x-auto pb-2 hide-scrollbar"
          />
        </div>
      </div>
      
      <div id="traceability-content" className="space-y-6">
        {activeTab === 'lots' && (
          <>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-8">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Package size={20} className="text-cyan-400" aria-hidden="true" />
                  Lots de production
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Ajouter un lot"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Ajouter</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {mockLots.map((lot) => (
                  <div 
                    key={lot.id} 
                    className="p-4 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] hover:bg-cyan-500/10 transition-colors"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-white">{lot.name}</h3>
                          <p className="text-sm text-white/60 mt-1">Emplacement: {lot.location}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(lot)}
                            className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded min-w-[44px] min-h-[44px] p-2 flex items-center justify-center"
                            aria-label={`Modifier ${lot.name}`}
                          >
                            <Edit2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        <div className="bg-cyan-500/10 rounded-lg p-3">
                          <div className="flex justify-between">
                            <p className="text-sm text-cyan-400">Stock</p>
                            <div className="flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${lot.status === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                              <p className="text-xs text-white/70">{lot.status}</p>
                            </div>
                          </div>
                          <p className="text-white">{lot.stock.quantity} {lot.stock.unit}</p>
                        </div>
                        <div className="text-sm text-white/70">
                          <div className="flex justify-between mb-1">
                            <p>Date de création</p>
                            <p>{lot.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'bassins' && (
          <>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-8">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Waves size={20} className="text-cyan-400" aria-hidden="true" />
                  Occupation des bassins
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Ajouter un bassin"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Ajouter</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {mockBassins.map((bassin) => (
                  <div 
                    key={bassin.id} 
                    className="p-4 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] hover:bg-cyan-500/10 transition-colors"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-white">{bassin.name}</h3>
                          <p className="text-sm text-white/60 mt-1">Emplacement: {bassin.location}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(bassin)}
                            className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded min-w-[44px] min-h-[44px] p-2 flex items-center justify-center"
                            aria-label={`Modifier ${bassin.name}`}
                          >
                            <Edit2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        <div className="bg-cyan-500/10 rounded-lg p-3">
                          <div className="flex justify-between">
                            <p className="text-sm text-cyan-400">Stock</p>
                            <div className="flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${bassin.status === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                              <p className="text-xs text-white/70">{bassin.status}</p>
                            </div>
                          </div>
                          <p className="text-white">{bassin.stock.quantity} {bassin.stock.unit}</p>
                          <p className="text-sm text-white/70 mt-1">
                            {bassin.stats.find(stat => stat.label === 'Produit')?.value || 'Non spécifié'}
                          </p>
                        </div>
                        <div className="text-sm text-white/70">
                          <div className="flex justify-between mb-1">
                            <p>Statut</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              bassin.status === 'Optimal' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {bassin.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <p>Prochaine maintenance</p>
                            <p>{bassin.nextMaintenance}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'bl' && (
          <>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-8">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Truck size={20} className="text-cyan-400" aria-hidden="true" />
                  Bons de livraison
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Ajouter un bon de livraison"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Ajouter</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                {mockBLs.map((bl) => (
                  <div 
                    key={bl.id} 
                    className="p-4 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] hover:bg-cyan-500/10 transition-colors cursor-pointer"
                    onClick={() => handleViewBL(bl)}
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 md:gap-4">
                      <div>
                        <h3 className="font-medium text-white">{bl.reference}</h3>
                        <p className="text-sm text-white/60">Client: {bl.client}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bl.status === 'Livré' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {bl.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-cyan-400">Produits</p>
                      <ul className="mt-1 space-y-1">
                        {bl.products.map((product, index) => (
                          <li key={index} className="text-sm text-white flex justify-between">
                            <span>{product.name}</span>
                            <span>{product.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-white/60">Date: {bl.date}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewBL(bl);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded min-w-[44px] min-h-[44px] p-2 flex items-center justify-center"
                        aria-label={`Voir les détails du bon de livraison ${bl.reference}`}
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'historique' && (
          <>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="text-cyan-400" aria-hidden="true" />
                  Historique des activités
                </h2>
              </div>
              
              <div className="space-y-4 mt-6">
                {mockHistory.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-4 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] hover:bg-cyan-500/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <h3 className="font-medium text-white mb-1">{event.action}</h3>
                          <span className="text-sm text-white/60">{event.date}</span>
                        </div>
                        <p className="text-sm text-white/60 mb-2">Par: {event.user}</p>
                        <p className="text-sm text-white">{event.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'autre_emplacement' && (
          <>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-8">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MapPin size={20} className="text-cyan-400" aria-hidden="true" />
                  Emplacements de stockage
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Ajouter un emplacement de stockage"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Ajouter</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {mockStorage.map((storage) => {
                  // Déterminer le type d'emplacement
                  const storageType = storage.stats.find(stat => stat.label === 'Type')?.value || 'Stockage';
                  
                  // Déterminer l'occupation et la capacité
                  const occupationStat = storage.stats.find(stat => stat.label === 'Occupation')?.value || '0%';
                  const capacityStat = storage.stats.find(stat => stat.label === 'Capacité')?.value || 'N/A';
                  
                  // Extraire la valeur numérique de l'occupation (ex: "65%" -> 65)
                  const occupationValue = parseInt(occupationStat) || 0;
                  
                  // Déterminer la couleur de la barre d'occupation
                  let occupationColorClass = 'bg-emerald-500';
                  let occupationTextClass = 'text-emerald-400';
                  if (occupationValue < 20) {
                    occupationColorClass = 'bg-red-500';
                    occupationTextClass = 'text-red-400';
                  } else if (occupationValue < 40) {
                    occupationColorClass = 'bg-amber-500';
                    occupationTextClass = 'text-amber-400';
                  }
                  
                  // Déterminer la classe de statut
                  let statusClass = 'bg-emerald-500/10 text-emerald-400';
                  if (storage.status === 'Attention') {
                    statusClass = 'bg-amber-500/10 text-amber-400';
                  } else if (storage.status === 'Critique') {
                    statusClass = 'bg-red-500/10 text-red-400';
                  }
                  
                  return (
                    <div 
                      key={storage.id} 
                      className="p-4 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] hover:bg-cyan-500/10 transition-colors"
                      aria-label={`Emplacement de stockage ${storage.name}, ${storageType}, occupation ${occupationStat}`}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-white">{storage.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-white/60 mt-1">
                              <span className="inline-block px-2 py-0.5 bg-cyan-500/10 rounded text-cyan-400 text-xs">
                                {storageType}
                              </span>
                              <span aria-hidden="true">•</span>
                              <span>{storage.location}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(storage)}
                              className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded min-w-[44px] min-h-[44px] p-2 flex items-center justify-center"
                              aria-label={`Modifier ${storage.name}`}
                            >
                              <Edit2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleViewDocument(storage.id)}
                              className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded min-w-[44px] min-h-[44px] p-2 flex items-center justify-center"
                              aria-label={`QR Code pour ${storage.name}`}
                            >
                              <QrCode className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Capacité et occupation */}
                        <div className="mt-2 space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-cyan-400">Capacité</span>
                              <span className="text-white font-medium">{capacityStat}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-cyan-400">Occupation</span>
                              <span className={`text-sm font-medium ${occupationTextClass}`}>{occupationStat}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full ${occupationColorClass} rounded-full transition-all duration-500 ease-in-out`} 
                                style={{ width: `${occupationValue}%` }}
                                role="progressbar"
                                aria-valuenow={occupationValue}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`Occupation: ${occupationStat}`}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Température et humidité */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {storage.stats
                            .filter(stat => ['Température', 'Humidité'].includes(stat.label))
                            .map((stat, index) => (
                              <div key={index} className="bg-cyan-500/10 rounded-lg p-2">
                                <p className="text-xs text-cyan-400">{stat.label}</p>
                                <p className="text-white font-medium">{stat.value}</p>
                              </div>
                            ))}
                        </div>
                        
                        {/* Statut */}
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm text-white/60">Statut</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                            {storage.status}
                          </span>
                        </div>
                        
                        {/* Produits - Bouton pour développer/réduire */}
                        {storage.products && storage.products.length > 0 && (
                          <div className="mt-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStorageExpand(storage.id);
                              }}
                              className="w-full flex justify-between items-center py-2 px-3 rounded-lg bg-cyan-500/10 text-white hover:bg-cyan-500/20 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                              aria-expanded={expandedStorages.includes(storage.id)}
                              aria-controls={`products-${storage.id}`}
                            >
                              <span className="flex items-center text-sm font-medium">
                                <Package className="w-4 h-4 mr-2" aria-hidden="true" />
                                Produits ({storage.products.length})
                              </span>
                              <ChevronDown 
                                className={`w-4 h-4 transition-transform duration-300 ${expandedStorages.includes(storage.id) ? 'rotate-180' : ''}`}
                                aria-hidden="true" 
                              />
                            </button>
                            
                            {/* Liste des produits */}
                            {expandedStorages.includes(storage.id) && (
                              <div 
                                id={`products-${storage.id}`}
                                className="mt-2 space-y-2 p-3 bg-cyan-500/5 rounded-lg border border-cyan-500/10 animate-fadeIn"
                              >
                                <h4 className="text-sm font-medium text-cyan-400 mb-2">Produits stockés</h4>
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="text-left text-white/60">
                                      <th className="pb-2 font-medium">Produit</th>
                                      <th className="pb-2 font-medium">Quantité</th>
                                      <th className="pb-2 font-medium">DLC</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {storage.products.map((product, idx) => {
                                      // Vérifier si la DLC est proche ou dépassée
                                      const isDLC = product.dlc !== 'N/A';
                                      let dlcStatus = '';
                                      
                                      if (isDLC) {
                                        const today = new Date();
                                        const dlcDate = new Date(product.dlc.split('/').reverse().join('-'));
                                        const diffTime = dlcDate.getTime() - today.getTime();
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        
                                        if (diffDays < 0) {
                                          dlcStatus = 'text-red-400 font-medium';
                                        } else if (diffDays <= 7) {
                                          dlcStatus = 'text-amber-400 font-medium';
                                        }
                                      }
                                      
                                      return (
                                        <tr key={idx} className="border-t border-white/10">
                                          <td className="py-2 text-white">{product.name}</td>
                                          <td className="py-2 text-white">{product.quantity}</td>
                                          <td className="py-2">
                                            <span className={product.dlc === 'N/A' ? 'text-white/60' : `text-white ${dlcStatus}`}>
                                              {product.dlc}
                                              {dlcStatus === 'text-red-400 font-medium' && (
                                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-red-500/20">
                                                  Dépassée
                                                </span>
                                              )}
                                              {dlcStatus === 'text-amber-400 font-medium' && (
                                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-amber-500/20">
                                                  Bientôt
                                                </span>
                                              )}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Métadonnées */}
                        <div className="mt-auto pt-4">
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/60">
                            <span className="w-20">Date:</span>
                            <span className="text-white/80">{storage.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {renderEditModal()}
      {renderBLModal()}
      {renderFilterModal()}
      {renderQRModal()}
      {renderExportModal()}
    </div>
  );
}