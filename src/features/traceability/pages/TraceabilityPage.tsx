import React, { useState, useRef, useEffect } from 'react';
import { Shell, Filter, QrCode, Download, Package, Waves, FileText, Truck, MapPin, History, Thermometer, Droplets, AlertCircle, Edit2, Save, Eye, Search, X, Plus, ChevronDown, Calendar, Lock } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import 'jspdf-autotable';
import { BrowserQRCodeReader } from '@zxing/browser';

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
    const createTableHeader = (headers: string[]) => {
      doc.setFillColor(10, 42, 64);
      doc.rect(10, yPosition, pageWidth - 20, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      
      let xPosition = 14;
      headers.forEach((header) => {
        const columnWidth = (pageWidth - 28) / headers.length;
        doc.text(header, xPosition, yPosition + 7);
        xPosition += columnWidth;
      });
      
      yPosition += 10;
    };

    // Fonction pour exporter les données des lots
    const exportLots = () => {
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Lots en cours', 14, yPosition);
      yPosition += 10;

      // En-têtes du tableau
      createTableHeader(['ID', 'Nom', 'Emplacement', 'Stock', 'Status', 'Date']);
      
      // Lignes du tableau
      mockLots.forEach((lot, index) => {
        const y = yPosition + (index * 10);
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(10, y, pageWidth - 20, 10, 'F');
        }
        doc.setTextColor(60, 60, 60);
        doc.text(lot.id, 14, y + 7);
        doc.text(lot.name, 30, y + 7);
        doc.text(lot.location, 70, y + 7);
        doc.text(`${lot.stock.quantity} ${lot.stock.unit}`, 120, y + 7);
        doc.text(lot.status, 160, y + 7);
        doc.text(lot.date, 190, y + 7);
      });

      yPosition += (mockLots.length * 10) + 15;
    };

    // Fonction pour exporter les données des bassins
    const exportBassins = () => {
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Bassins', 14, yPosition);
      yPosition += 10;

      // En-têtes du tableau
      createTableHeader(['ID', 'Nom', 'Emplacement', 'Stock', 'Occupation', 'Statut', 'Proch. Maintenance']);
      
      // Lignes du tableau
      mockBassins.forEach((bassin, index) => {
        const y = yPosition + (index * 10);
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(10, y, pageWidth - 20, 10, 'F');
        }
        doc.setTextColor(60, 60, 60);
        doc.text(bassin.id, 14, y + 7);
        doc.text(bassin.name, 30, y + 7);
        doc.text(bassin.location, 70, y + 7);
        doc.text(`${bassin.stock.quantity} ${bassin.stock.unit}`, 120, y + 7);
        doc.text(bassin.occupation, 160, y + 7);
        doc.text(bassin.status, 190, y + 7);
        doc.text(bassin.nextMaintenance, 230, y + 7);
      });

      yPosition += (mockBassins.length * 10) + 15;
    };

    // Fonction pour exporter les données des emplacements de stockage
    const exportStockage = () => {
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Emplacements de stockage', 14, yPosition);
      yPosition += 10;

      // En-têtes du tableau
      createTableHeader(['ID', 'Nom', 'Emplacement', 'Température', 'Humidité', 'Statut']);
      
      // Lignes du tableau
      mockStorage.forEach((storage, index) => {
        const y = yPosition + (index * 10);
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(10, y, pageWidth - 20, 10, 'F');
        }
        doc.setTextColor(60, 60, 60);
        doc.text(storage.id, 14, y + 7);
        doc.text(storage.name, 30, y + 7);
        doc.text(storage.location, 90, y + 7);
        
        const temperature = storage.stats.find(stat => stat.label === 'Température')?.value || 'N/A';
        const humidite = storage.stats.find(stat => stat.label === 'Humidité')?.value || 'N/A';
        
        doc.text(temperature, 170, y + 7);
        doc.text(humidite, 210, y + 7);
        doc.text(storage.status, 240, y + 7);
      });

      yPosition += (mockStorage.length * 10) + 15;

      // Détails des produits stockés
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Produits stockés', 14, yPosition);
      yPosition += 10;

      // En-têtes du tableau
      createTableHeader(['Emplacement', 'Produit', 'Quantité', 'DLC']);
      
      // Lignes du tableau avec tous les produits de tous les emplacements
      let rowCount = 0;
      mockStorage.forEach(storage => {
        storage.products.forEach((product, pIndex) => {
          const y = yPosition + (rowCount * 10);
          if (rowCount % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(10, y, pageWidth - 20, 10, 'F');
          }
          doc.setTextColor(60, 60, 60);
          doc.text(storage.name, 14, y + 7);
          doc.text(product.name, 90, y + 7);
          doc.text(product.quantity, 170, y + 7);
          doc.text(product.dlc, 220, y + 7);
          rowCount++;
        });
      });

      yPosition += (rowCount * 10) + 15;
    };

    // Fonction pour exporter les bons de livraison
    const exportBL = () => {
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Bons de livraison', 14, yPosition);
      yPosition += 10;

      // En-têtes du tableau
      createTableHeader(['Référence', 'Client', 'Date', 'Statut', 'Montant']);
      
      // Simuler des bons de livraison
      const bls = mockBLs;
      
      // Lignes du tableau
      bls.forEach((bl, index) => {
        const y = yPosition + (index * 10);
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(10, y, pageWidth - 20, 10, 'F');
        }
        doc.setTextColor(60, 60, 60);
        doc.text(bl.reference, 14, y + 7);
        doc.text(bl.client, 60, y + 7);
        doc.text(bl.date, 120, y + 7);
        doc.text(bl.status, 170, y + 7);
        doc.text('N/A', 220, y + 7);
      });

      yPosition += (bls.length * 10) + 15;
    };

    // Fonction pour exporter l'historique
    const exportHistorique = () => {
      doc.setFontSize(14);
      doc.setTextColor(10, 42, 64);
      doc.text('Historique des activités', 14, yPosition);
      yPosition += 10;

      // En-têtes du tableau
      createTableHeader(['Date', 'Utilisateur', 'Action', 'Détails']);
      
      // Simuler un historique
      const historique = mockHistory;
      
      // Lignes du tableau
      historique.forEach((item, index) => {
        const y = yPosition + (index * 10);
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(10, y, pageWidth - 20, 10, 'F');
        }
        doc.setTextColor(60, 60, 60);
        doc.text(item.date, 14, y + 7);
        doc.text(item.user, 60, y + 7);
        doc.text(item.action, 120, y + 7);
        doc.text(item.details, 180, y + 7);
      });

      yPosition += (historique.length * 10) + 15;
    };
    
    // Exporter en fonction de l'onglet actif
    switch(activeTab) {
      case 'lots':
        exportLots();
        break;
      case 'bassins':
        exportBassins();
        break;
      case 'autre_emplacement':
        exportStockage();
        break;
      case 'bl':
        exportBL();
        break;
      case 'historique':
        exportHistorique();
        break;
      default:
        // Si tous les onglets sont inclus, ajouter chaque section
        exportLots();
        doc.addPage();
        yPosition = 60;
        exportBassins();
        doc.addPage();
        yPosition = 60;
        exportStockage();
        doc.addPage();
        yPosition = 60;
        exportBL();
        doc.addPage();
        yPosition = 60;
        exportHistorique();
    }

    // Ajouter un pied de page
    const pageCount = doc.internal.pages.length;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`OYSTER CULT - Traçabilité - Page ${i} / ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
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
              <p className="text-sm text-cyan-400">Client</p>
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
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
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
          <p className="text-white" id="export-description">Voulez-vous exporter les données de traçabilité en PDF ?</p>
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
      <div className={`flex ${className}`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap min-w-[44px] min-h-[44px] ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 focus:ring-2 focus:ring-cyan-500/40'
                : 'text-white/60 hover:text-white hover:bg-white/5 focus:ring-2 focus:ring-white/30'
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
      id: 'coffre_fort',
      label: 'Coffre fort numérique',
      icon: <Lock size={20} />,
      count: 12
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

  return (
    <div className="flex-1 pt-16 md:pt-16 pb-4 px-4 md:px-6 lg:px-8 ml-0 lg:ml-[4.5rem] transition-all duration-300"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(0, 128, 166, 0.95), rgba(0, 166, 155, 0.95)), url("/imgs/bg-waves.svg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="mb-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-white">Traçabilité</h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
              aria-label="Filtrer les résultats"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtrer</span>
            </button>
            <button 
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
              aria-label="Scanner un QR code"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Scanner</span>
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
              aria-label="Exporter les données"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>
        
        <div className="relative mb-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLots.map((lot) => (
                <div 
                  key={lot.id} 
                  className="p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-lg backdrop-filter hover:bg-cyan-500/10 transition-colors"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-white">{lot.name}</h3>
                        <button
                          onClick={() => handleEdit(lot)}
                          className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded min-w-[44px] min-h-[44px] p-2"
                          aria-label={`Modifier ${lot.name}`}
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-sm text-white/60 mb-3">Emplacement: {lot.location}</p>
                    </div>
                    <div className="mt-2 space-y-3">
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
          </>
        )}
        
        {activeTab === 'bassins' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockBassins.map((bassin) => (
                <div 
                  key={bassin.id} 
                  className="p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-lg backdrop-filter hover:bg-cyan-500/10 transition-colors"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-white">{bassin.name}</h3>
                        <button
                          onClick={() => handleEdit(bassin)}
                          className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded min-w-[44px] min-h-[44px] p-2"
                          aria-label={`Modifier ${bassin.name}`}
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-sm text-white/60 mb-3">Emplacement: {bassin.location}</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="mb-2">
                        <p className="text-sm text-cyan-400 mb-1">Occupation</p>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500/50 rounded-full" 
                            style={{ width: bassin.occupation }} 
                            role="progressbar" 
                            aria-valuenow={parseInt(bassin.occupation)} 
                            aria-valuemin={0} 
                            aria-valuemax={100}
                            aria-label={`Occupation du bassin: ${bassin.occupation}`}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-cyan-500/10 rounded-lg p-3">
                        <div className="flex justify-between">
                          <p className="text-sm text-cyan-400">Stock</p>
                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${bassin.status === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            <p className="text-xs text-white/70">{bassin.status}</p>
                          </div>
                        </div>
                        <p className="text-white">{bassin.stock.quantity} {bassin.stock.unit}</p>
                      </div>
                      {bassin.stats.map((stat, index) => (
                        <div key={index} className="bg-cyan-500/10 rounded-lg p-3">
                          <div className="flex justify-between">
                            <p className="text-sm text-cyan-400">{stat.label}</p>
                          </div>
                          <p className="text-white">{stat.value}</p>
                        </div>
                      ))}
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
          </>
        )}
        
        {activeTab === 'autre_emplacement' && (
          <>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MapPin size={20} className="text-cyan-400" aria-hidden="true" />
                  Emplacements de stockage
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                    aria-label="Ajouter un emplacement de stockage"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Ajouter</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  if (occupationValue > 80) {
                    occupationColorClass = 'bg-red-500';
                    occupationTextClass = 'text-red-400';
                  } else if (occupationValue > 60) {
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
                      className="p-4 rounded-lg border border-white/10 hover:border-cyan-400/30 bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)] backdrop-filter backdrop-blur-[20px] shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
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
                              <div key={index} className="bg-cyan-500/10 rounded-lg p-2 text-center">
                                <p className="text-xs text-cyan-400">{stat.label}</p>
                                <p className="text-white font-medium">{stat.value}</p>
                              </div>
                            ))}
                        </div>
                        
                        {/* Produits */}
                        <div className="mt-4">
                          <button 
                            className="w-full text-left px-3 py-2 bg-cyan-500/10 rounded-lg flex justify-between items-center text-white hover:bg-cyan-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                            onClick={() => {
                              // Logique pour afficher les produits dans un modal ou déplier
                            }}
                            aria-label={`Voir les ${storage.products.length} produits dans ${storage.name}`}
                            aria-expanded="false"
                          >
                            <span className="text-sm">
                              <Package className="w-4 h-4 inline mr-1.5" aria-hidden="true" />
                              Produits ({storage.products.length})
                            </span>
                            <ChevronDown className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                          </button>
                        </div>
                        
                        <div className="mt-auto pt-4 text-xs text-white/60 flex justify-between items-center">
                          <span>
                            <Calendar className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                            {storage.date}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                            Details
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'bl' && (
          <>
            <div className="space-y-4">
              {mockBLs.map((bl) => (
                <div 
                  key={bl.id} 
                  className="p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-lg backdrop-filter hover:bg-cyan-500/10 transition-colors cursor-pointer"
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
                      className="text-cyan-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 rounded min-w-[44px] min-h-[44px] p-2"
                      aria-label={`Voir les détails du bon de livraison ${bl.reference}`}
                    >
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {activeTab === 'historique' && (
          <>
            <div className="space-y-4">
              {mockHistory.map((event) => (
                <div 
                  key={event.id} 
                  className="p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-lg backdrop-filter hover:bg-cyan-500/10 transition-colors"
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
          </>
        )}
        
        {activeTab === 'coffre_fort' && (
          <>
            <div className="p-4 mb-6 rounded-lg border border-white/10 hover:border-cyan-400/30 bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)] backdrop-filter backdrop-blur-[20px] shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center">
                  <span aria-hidden="true"><Lock size={20} className="text-cyan-400 mr-2" /></span>
                  <h2 className="text-lg font-medium bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent whitespace-nowrap">
                    Coffre fort numérique
                  </h2>
                </div>
                <div className="hidden md:block text-white/60">Stockage sécurisé des documents importants</div>
                <div className="flex items-center gap-3">
                  <motion.button 
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                    aria-label="Ajouter un document au coffre fort"
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Ajouter un document</span>
                  </motion.button>
                </div>
              </div>
              <div className="md:hidden mt-2 text-white/60">Stockage sécurisé des documents importants</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Document 1 */}
              <motion.div 
                className="bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)] backdrop-filter backdrop-blur-[20px] rounded-lg p-4 border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                whileHover={{ 
                  y: -4,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25), 0 0 10px rgba(0,210,200,0.15) inset',
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-cyan-400">
                        <FileText size={20} aria-hidden="true" />
                      </div>
                      <h3 className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent font-medium">Certification Bio</h3>
                    </div>
                    <div className="flex gap-1">
                      <motion.button
                        className="text-cyan-400 hover:text-white bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                        aria-label="Télécharger Certification Bio"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-4 h-4" aria-hidden="true" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleViewDocument('doc-certification-bio')}
                        className="text-cyan-400 hover:text-white bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                        aria-label="Voir Certification Bio"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-white/60">
                      <span className="w-20">Type:</span>
                      <span className="text-white/80">PDF</span>
                    </div>
                    <div className="flex items-center text-sm text-white/60">
                      <span className="w-20">Taille:</span>
                      <span className="text-white/80">2.4 MB</span>
                    </div>
                    <div className="flex items-center text-sm text-white/60">
                      <span className="w-20">Date:</span>
                      <span className="text-white/80">12/03/2023</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    <span className="text-xs bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                      Certification annuelle
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Document 2 */}
              <motion.div 
                className="bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)] backdrop-filter backdrop-blur-[20px] rounded-lg p-4 border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                whileHover={{ 
                  y: -4,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25), 0 0 10px rgba(0,210,200,0.15) inset',
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-cyan-400">
                        <FileText size={20} aria-hidden="true" />
                      </div>
                      <h3 className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent font-medium">Rapport sanitaire 2023</h3>
                    </div>
                    <div className="flex gap-1">
                      <motion.button
                        className="text-cyan-400 hover:text-white bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                        aria-label="Télécharger Rapport sanitaire 2023"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-4 h-4" aria-hidden="true" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleViewDocument('doc-rapport-sanitaire')}
                        className="text-cyan-400 hover:text-white bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                        aria-label="Voir Rapport sanitaire 2023"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-white/60">
                      <span className="w-20">Type:</span>
                      <span className="text-white/80">PDF</span>
                    </div>
                    <div className="flex items-center text-sm text-white/60">
                      <span className="w-20">Taille:</span>
                      <span className="text-white/80">5.1 MB</span>
                    </div>
                    <div className="flex items-center text-sm text-white/60">
                      <span className="w-20">Date:</span>
                      <span className="text-white/80">05/06/2023</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                    <span className="text-xs bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                      Rapport trimestriel
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Document 3 */}
              <motion.div 
                className="bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)] backdrop-filter backdrop-blur-[20px] rounded-lg p-4 border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                whileHover={{ 
                  y: -4,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25), 0 0 10px rgba(0,210,200,0.15) inset',
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-cyan-400">
                        <FileText size={20} aria-hidden="true" />
                      </div>
                      <h3 className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent font-medium">Procédure HACCP</h3>
                    </div>
                    <div className="flex gap-1">
                      <motion.button
                        className="text-cyan-400 hover:text-white bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                        aria-label="Télécharger Procédure HACCP"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-4 h-4" aria-hidden="true" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleViewDocument('doc-procedure-haccp')}
                        className="text-cyan-400 hover:text-white bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 shadow-[0_0_15px_rgba(0,210,200,0.15),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
                        aria-label="Voir Procédure HACCP"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-white/60">
                      <span className="w-20">Type:</span>
                      <span className="text-white/80">DOCX</span>
                    </div>
                    <div className="flex items-center text-sm text-white/60">
                      <span className="w-20">Taille:</span>
                      <span className="text-white/80">1.8 MB</span>
                    </div>
                    <div className="flex items-center text-sm text-white/60">
                      <span className="w-20">Date:</span>
                      <span className="text-white/80">18/04/2023</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <span className="text-xs bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                      Procédure obligatoire
                    </span>
                  </div>
                </div>
              </motion.div>
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