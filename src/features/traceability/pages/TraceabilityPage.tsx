import React, { useState, useRef, useEffect } from 'react';
import { Shell, Filter, QrCode, Download, Package, Waves, FileText, Truck, MapPin, History, Thermometer, Droplets, AlertCircle, Edit2, Save, Eye, Search, X } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BrowserQRCodeReader } from '@zxing/browser';

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
    setEditedValues(item);
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

  const handleExport = async () => {
    const element = document.getElementById('traceability-content');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save('tracabilite.pdf');
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
                <label className="block text-sm text-cyan-400 mb-1">Nom</label>
                <input
                  type="text"
                  value={editedValues.name}
                  onChange={(e) => setEditedValues({ ...editedValues, name: e.target.value })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-400 mb-1">Emplacement</label>
                <input
                  type="text"
                  value={editedValues.location}
                  onChange={(e) => setEditedValues({ ...editedValues, location: e.target.value })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-400 mb-1">Quantité</label>
                <input
                  type="text"
                  value={editedValues.stock.quantity}
                  onChange={(e) => setEditedValues({ 
                    ...editedValues, 
                    stock: { ...editedValues.stock, quantity: e.target.value }
                  })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                />
              </div>
            </div>
          );
        case 'bassin':
          return (
            <div className="space-y-4">
              {editingItem.stats.map((stat: any, index: number) => (
                <div key={index}>
                  <label className="block text-sm text-cyan-400 mb-1">{stat.label}</label>
                  <input
                    type="text"
                    value={editedValues.stats[index].value}
                    onChange={(e) => {
                      const newStats = [...editedValues.stats];
                      newStats[index] = { ...newStats[index], value: e.target.value };
                      setEditedValues({ ...editedValues, stats: newStats });
                    }}
                    className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-cyan-400 mb-1">Occupation</label>
                <input
                  type="text"
                  value={editedValues.occupation}
                  onChange={(e) => setEditedValues({ ...editedValues, occupation: e.target.value })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-400 mb-1">Prochaine maintenance</label>
                <input
                  type="text"
                  value={editedValues.nextMaintenance}
                  onChange={(e) => setEditedValues({ ...editedValues, nextMaintenance: e.target.value })}
                  className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                />
              </div>
            </div>
          );
        case 'storage':
          return (
            <div className="space-y-4">
              {editingItem.stats.map((stat: any, index: number) => (
                <div key={index}>
                  <label className="block text-sm text-cyan-400 mb-1">{stat.label}</label>
                  <input
                    type="text"
                    value={editedValues.stats[index].value}
                    onChange={(e) => {
                      const newStats = [...editedValues.stats];
                      newStats[index] = { ...newStats[index], value: e.target.value };
                      setEditedValues({ ...editedValues, stats: newStats });
                    }}
                    className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-cyan-400 mb-1">Produits</label>
                {editedValues.products.map((product: any, index: number) => (
                  <div key={index} className="space-y-2 mb-4 p-3 rounded-lg bg-cyan-500/5">
                    <div>
                      <label className="block text-sm text-cyan-400 mb-1">Nom du produit</label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => {
                          const newProducts = [...editedValues.products];
                          newProducts[index] = { ...newProducts[index], name: e.target.value };
                          setEditedValues({ ...editedValues, products: newProducts });
                        }}
                        className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-cyan-400 mb-1">Quantité</label>
                      <input
                        type="text"
                        value={product.quantity}
                        onChange={(e) => {
                          const newProducts = [...editedValues.products];
                          newProducts[index] = { ...newProducts[index], quantity: e.target.value };
                          setEditedValues({ ...editedValues, products: newProducts });
                        }}
                        className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-cyan-400 mb-1">DLC</label>
                      <input
                        type="text"
                        value={product.dlc}
                        onChange={(e) => {
                          const newProducts = [...editedValues.products];
                          newProducts[index] = { ...newProducts[index], dlc: e.target.value };
                          setEditedValues({ ...editedValues, products: newProducts });
                        }}
                        className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
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
            className="px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
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
          <div className="grid grid-cols-2 gap-4">
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
            <p className="text-sm text-cyan-400 mb-2">Produits</p>
            <div className="space-y-2">
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
            <label className="block text-sm text-cyan-400 mb-1">Recherche</label>
            <div className="relative">
              <input
                type="text"
                value={filterOptions.search || ''}
                onChange={(e) => setFilterOptions({ ...filterOptions, search: e.target.value })}
                className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                placeholder="Rechercher..."
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-cyan-400 mb-1">Date</label>
            <input
              type="date"
              value={filterOptions.date || ''}
              onChange={(e) => setFilterOptions({ ...filterOptions, date: e.target.value })}
              className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
            />
          </div>
          <div>
            <label className="block text-sm text-cyan-400 mb-1">Statut</label>
            <select
              value={filterOptions.status || ''}
              onChange={(e) => setFilterOptions({ ...filterOptions, status: e.target.value })}
              className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
            >
              <option value="">Tous</option>
              <option value="Optimal">Optimal</option>
              <option value="Attention">Attention</option>
              <option value="Livré">Livré</option>
              <option value="En cours">En cours</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-cyan-400 mb-1">Type</label>
            <select
              value={filterOptions.type || ''}
              onChange={(e) => setFilterOptions({ ...filterOptions, type: e.target.value })}
              className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
            >
              <option value="">Tous</option>
              <option value="lot">Lots</option>
              <option value="bassin">Bassins</option>
              <option value="storage">Stockage</option>
              <option value="bl">Bons de livraison</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setFilterOptions({});
                setShowFilterModal(false);
              }}
              className="px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-colors"
            >
              Réinitialiser
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            >
              <Filter className="w-4 h-4 text-cyan-400" />
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
            />
          </div>
          {qrResult && (
            <div className="p-3 rounded-lg bg-cyan-500/10">
              <p className="text-sm text-cyan-400">Résultat du scan</p>
              <p className="text-white break-all">{qrResult}</p>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowQRModal(false);
                setQrResult('');
              }}
              className="px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-colors"
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
          <p className="text-white">Voulez-vous exporter les données de traçabilité en PDF ?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowExportModal(false)}
              className="px-4 py-2 rounded-lg text-white hover:bg-white/5 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exporter en PDF
            </button>
          </div>
        </div>
      </Modal>
    );
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

  return (
    <div className="flex-1 pt-16 md:pt-16 pb-4 px-4 md:px-6 lg:px-8 ml-0 lg:ml-[4.5rem] transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, rgba(0, 10, 40, 0.97) 0%, rgba(0, 90, 90, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        willChange: "transform",
        transform: "translate3d(0px, 0px, 0px)"
      }}
    >
      <main className="flex-1 p-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col h-full">
            <div className="rounded-xl mb-6 overflow-hidden relative p-6"
              style={{
                background: "linear-gradient(135deg, rgba(10, 30, 50, 0.65) 0%, rgba(20, 100, 100, 0.45) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 20px -5px, rgba(0, 200, 200, 0.1) 0px 5px 12px -5px, rgba(255, 255, 255, 0.07) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.05) 0px 0px 12px inset, rgba(0, 0, 0, 0.1) 0px 0px 8px inset"
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Shell size={20} className="text-cyan-400" style={{ filter: "drop-shadow(0px 0px 20px rgba(0, 200, 200, 0.3))" }} />
                  <h1 className="text-2xl font-bold text-white" style={{ textShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)" }}>Traçabilité des lots</h1>
                </div>
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-white rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                    style={{ backdropFilter: "blur(10px)" }}
                  >
                    <Filter size={20} className="text-cyan-400" />
                    Filtrer
                  </button>
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-white rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                    style={{ backdropFilter: "blur(10px)" }}
                  >
                    <QrCode size={20} className="text-cyan-400" />
                    Scanner QR
                  </button>
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-white rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                    style={{ backdropFilter: "blur(10px)" }}
                  >
                    <Download size={20} className="text-cyan-400" />
                    Exporter
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  style={{
                    backdropFilter: "blur(10px)",
                    boxShadow: activeTab === tab.id 
                      ? "rgba(0, 0, 0, 0.1) 0px 4px 12px -2px, rgba(0, 200, 200, 0.1) 0px 3px 8px -2px, rgba(255, 255, 255, 0.05) 0px -1px 2px 0px inset, rgba(0, 200, 200, 0.05) 0px 0px 12px inset, rgba(0, 0, 0, 0.1) 0px 0px 8px inset"
                      : "none"
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div id="traceability-content" className="p-6 rounded-xl border border-cyan-500/20 overflow-hidden relative"
                style={{
                  background: "linear-gradient(135deg, rgba(10, 30, 50, 0.65) 0%, rgba(20, 100, 100, 0.45) 100%)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 20px -5px, rgba(0, 200, 200, 0.1) 0px 5px 12px -5px, rgba(255, 255, 255, 0.07) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.05) 0px 0px 12px inset, rgba(0, 0, 0, 0.1) 0px 0px 8px inset"
                }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at top right, rgba(0, 200, 200, 0.1) 0%, transparent 60%)",
                    opacity: 0.5
                  }}
                />
                
                {/* Contenu dynamique selon l'onglet actif */}
                {activeTab === 'lots' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'LOT-2024-001',
                        name: 'Huîtres Plates Premium',
                        location: 'Bassin A3',
                        responsible: 'Jean Dupont',
                        date: '17/03/2025',
                        stock: {
                          quantity: '2500',
                          unit: 'pièces',
                          calibre: 'N°2',
                          qualite: 'Spéciale'
                        }
                      },
                      {
                        id: 'LOT-2024-002',
                        name: 'Huîtres Creuses Standard',
                        location: 'Bassin B1',
                        responsible: 'Marie Martin',
                        date: '17/03/2025',
                        stock: {
                          quantity: '3800',
                          unit: 'pièces',
                          calibre: 'N°3',
                          qualite: 'Fine'
                        }
                      },
                      {
                        id: 'LOT-2024-003',
                        name: 'Huîtres Plates Sélection',
                        location: 'Bassin C2',
                        responsible: 'Pierre Dubois',
                        date: '17/03/2025',
                        stock: {
                          quantity: '1800',
                          unit: 'pièces',
                          calibre: 'N°1',
                          qualite: 'Spéciale'
                        }
                      }
                    ].map((lot) => (
                      <div key={lot.id} className="p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all relative overflow-hidden group"
                        style={{
                          background: "linear-gradient(135deg, rgba(10, 30, 50, 0.65) 0%, rgba(20, 100, 100, 0.45) 100%)",
                          backdropFilter: "blur(10px)"
                        }}
                      >
                        <button
                          onClick={() => handleEdit({ ...lot, type: 'lot' })}
                          className="absolute top-2 right-2 p-2 rounded-lg bg-cyan-500/10 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500/20"
                        >
                          <Edit2 size={20} />
                        </button>
                        <div className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "radial-gradient(circle at top right, rgba(0, 200, 200, 0.1) 0%, transparent 60%)",
                            opacity: 0.3
                          }}
                        />
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <Package size={20} className="text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{lot.name}</h3>
                            <p className="text-cyan-400/60">{lot.id}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <p className="text-sm text-cyan-400">Emplacement</p>
                            <p className="text-white">{lot.location}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <p className="text-sm text-cyan-400">Responsable</p>
                            <p className="text-white">{lot.responsible}</p>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-cyan-500/10 mb-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-cyan-400">Stock disponible</p>
                              <p className="text-white text-xl font-semibold">{lot.stock.quantity} {lot.stock.unit}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-cyan-400">Calibre</p>
                              <p className="text-white">{lot.stock.calibre}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="p-3 rounded-lg bg-cyan-500/10 flex-1">
                            <p className="text-sm text-cyan-400">Qualité</p>
                            <p className="text-white">{lot.stock.qualite}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-cyan-500/10 flex-1">
                            <p className="text-sm text-cyan-400">Date</p>
                            <p className="text-white">{lot.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'bassins' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'A1',
                        name: 'Bassin A1',
                        type: 'bassin',
                        stats: [
                          { label: 'Température', value: '16.8°C' },
                          { label: 'pH', value: '8.1' },
                          { label: 'Salinité', value: '34.5 g/L' },
                          { label: 'Oxygène', value: '7.2 mg/L' },
                          { label: 'Turbidité', value: '2.8 NTU' }
                        ],
                        lastMaintenance: '15/03/2025',
                        nextMaintenance: '22/03/2025',
                        status: 'Optimal',
                        occupation: '75%',
                        alertes: []
                      },
                      {
                        id: 'A2',
                        name: 'Bassin A2',
                        type: 'bassin',
                        stats: [
                          { label: 'Température', value: '16.5°C' },
                          { label: 'pH', value: '8.0' },
                          { label: 'Salinité', value: '34.2 g/L' },
                          { label: 'Oxygène', value: '6.9 mg/L' },
                          { label: 'Turbidité', value: '3.1 NTU' }
                        ],
                        lastMaintenance: '16/03/2025',
                        nextMaintenance: '23/03/2025',
                        status: 'Attention',
                        occupation: '82%',
                        alertes: ['Oxygène légèrement bas']
                      }
                    ].map((bassin) => (
                      <div key={bassin.id} className="p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all relative overflow-hidden group"
                        style={{
                          background: "linear-gradient(135deg, rgba(10, 30, 50, 0.65) 0%, rgba(20, 100, 100, 0.45) 100%)",
                          backdropFilter: "blur(10px)"
                        }}
                      >
                        <button
                          onClick={() => handleEdit({ ...bassin, type: 'bassin' })}
                          className="absolute top-2 right-2 p-2 rounded-lg bg-cyan-500/10 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500/20"
                        >
                          <Edit2 size={20} />
                        </button>
                        <div className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "radial-gradient(circle at top right, rgba(0, 200, 200, 0.1) 0%, transparent 60%)",
                            opacity: 0.3
                          }}
                        />
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <Waves size={20} className="text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{bassin.name}</h3>
                            <p className={`text-sm ${
                              bassin.status === 'Optimal' ? 'text-green-400' : 'text-yellow-400'
                            }`}>{bassin.status}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          {bassin.stats.map((stat, index) => (
                            <div key={index} className="p-3 rounded-lg bg-cyan-500/10">
                              <p className="text-sm text-cyan-400">{stat.label}</p>
                              <p className="text-white">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <p className="text-sm text-cyan-400">Occupation</p>
                            <p className="text-white">{bassin.occupation}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <p className="text-sm text-cyan-400">Maintenance</p>
                            <p className="text-white text-sm">Dernière: {bassin.lastMaintenance}</p>
                            <p className="text-white text-sm">Prochaine: {bassin.nextMaintenance}</p>
                          </div>
                          {bassin.alertes.length > 0 && (
                            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                              <p className="text-sm text-yellow-400">Alertes</p>
                              {bassin.alertes.map((alerte, index) => (
                                <p key={index} className="text-white text-sm">{alerte}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'autre_emplacement' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'frigo1',
                        name: 'Frigo 1',
                        type: 'storage',
                        stats: [
                          { label: 'Capacité', value: '500 kg' },
                          { label: 'Occupation', value: '65%' }
                        ],
                        products: [
                          { name: 'Huîtres Fines de Claire n°3', quantity: '150 kg', dlc: '25/03/2025' },
                          { name: 'Huîtres Spéciales n°2', quantity: '175 kg', dlc: '23/03/2025' }
                        ]
                      },
                      {
                        id: 'frigo2',
                        name: 'Frigo 2',
                        type: 'storage',
                        stats: [
                          { label: 'Capacité', value: '300 kg' },
                          { label: 'Occupation', value: '30%' }
                        ],
                        products: [
                          { name: 'Huîtres Fines de Claire n°2', quantity: '90 kg', dlc: '24/03/2025' }
                        ]
                      },
                      {
                        id: 'congelateur1',
                        name: 'Congélateur 1',
                        type: 'storage',
                        stats: [
                          { label: 'Capacité', value: '200 kg' },
                          { label: 'Occupation', value: '85%' }
                        ],
                        products: [
                          { name: 'Huîtres Gratinées', quantity: '120 kg', dlc: '15/06/2025' },
                          { name: 'Huîtres Pochées', quantity: '50 kg', dlc: '20/06/2025' }
                        ]
                      },
                      {
                        id: 'congelateur2',
                        name: 'Congélateur 2',
                        type: 'storage',
                        stats: [
                          { label: 'Capacité', value: '150 kg' },
                          { label: 'Occupation', value: '40%' }
                        ],
                        products: [
                          { name: 'Huîtres Gratinées', quantity: '60 kg', dlc: '10/06/2025' }
                        ]
                      },
                      {
                        id: 'remise',
                        name: 'Remise',
                        type: 'storage',
                        stats: [
                          { label: 'Capacité', value: '1000 kg' },
                          { label: 'Occupation', value: '55%' }
                        ],
                        products: [
                          { name: 'Bourriches 1 douzaine', quantity: '300 kg', dlc: '30/03/2025' },
                          { name: 'Bourriches 2 douzaines', quantity: '250 kg', dlc: '30/03/2025' }
                        ]
                      },
                      {
                        id: 'cave',
                        name: 'Cave',
                        type: 'storage',
                        stats: [
                          { label: 'Capacité', value: '800 kg' },
                          { label: 'Occupation', value: '25%' }
                        ],
                        products: [
                          { name: 'Huîtres Fines de Claire n°4', quantity: '200 kg', dlc: '28/03/2025' }
                        ]
                      }
                    ].map((zone) => (
                      <div key={zone.id} className="p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all relative overflow-hidden group"
                        style={{
                          background: "linear-gradient(135deg, rgba(10, 30, 50, 0.65) 0%, rgba(20, 100, 100, 0.45) 100%)",
                          backdropFilter: "blur(10px)"
                        }}
                      >
                        <button
                          onClick={() => handleEdit({ ...zone, type: 'storage' })}
                          className="absolute top-2 right-2 p-2 rounded-lg bg-cyan-500/10 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500/20"
                        >
                          <Edit2 size={20} />
                        </button>
                        <div className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "radial-gradient(circle at top right, rgba(0, 200, 200, 0.1) 0%, transparent 60%)",
                            opacity: 0.3
                          }}
                        />
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <Package size={20} className="text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{zone.name}</h3>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {zone.stats.map((stat, index) => (
                            <div key={index} className="p-3 rounded-lg bg-cyan-500/10">
                              <p className="text-sm text-cyan-400">{stat.label}</p>
                              <p className="text-white">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <p className="text-sm text-cyan-400 mb-2">Produits stockés</p>
                            <div className="space-y-2">
                              {zone.products.map((product, index) => (
                                <div key={index} className="border-t border-cyan-500/10 pt-2 first:border-t-0 first:pt-0">
                                  <p className="text-white font-medium">{product.name}</p>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-cyan-400">{product.quantity}</span>
                                    <span className={`${
                                      new Date(product.dlc.split('/').reverse().join('-')) < new Date() 
                                        ? 'text-red-400' 
                                        : new Date(product.dlc.split('/').reverse().join('-')) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                        ? 'text-yellow-400'
                                        : 'text-green-400'
                                    }`}>
                                      DLC: {product.dlc}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'bl' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'bl1',
                        reference: 'BL-2025-001',
                        date: '15/03/2025',
                        client: 'Restaurant La Marée',
                        status: 'Livré',
                        products: [
                          { name: 'Huîtres Fines de Claire n°3', quantity: '10 douzaines' },
                          { name: 'Huîtres Spéciales n°2', quantity: '5 douzaines' }
                        ],
                        notes: 'Livraison effectuée à 9h30'
                      },
                      {
                        id: 'bl2',
                        reference: 'BL-2025-002',
                        date: '16/03/2025',
                        client: 'Poissonnerie du Port',
                        status: 'En cours',
                        products: [
                          { name: 'Huîtres Fines de Claire n°2', quantity: '20 douzaines' },
                          { name: 'Huîtres Gratinées', quantity: '15 boîtes' }
                        ],
                        notes: 'Livraison prévue pour 14h00'
                      }
                    ].map((bl) => (
                      <div key={bl.id} className="p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all relative overflow-hidden group"
                        style={{
                          background: "linear-gradient(135deg, rgba(10, 30, 50, 0.65) 0%, rgba(20, 100, 100, 0.45) 100%)",
                          backdropFilter: "blur(10px)"
                        }}
                      >
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => handleViewBL(bl)}
                            className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500/20"
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            onClick={() => handleEdit({ ...bl, type: 'bl' })}
                            className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500/20"
                          >
                            <Edit2 size={20} />
                          </button>
                        </div>
                        <div className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "radial-gradient(circle at top right, rgba(0, 200, 200, 0.1) 0%, transparent 60%)",
                            opacity: 0.3
                          }}
                        />
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <FileText size={20} className="text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{bl.reference}</h3>
                            <p className="text-cyan-400">{bl.date}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <p className="text-sm text-cyan-400">Client</p>
                            <p className="text-white">{bl.client}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <p className="text-sm text-cyan-400">Status</p>
                            <p className={`text-${bl.status === 'Livré' ? 'green' : 'yellow'}-400`}>
                              {bl.status}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            <p className="text-sm text-cyan-400 mb-2">Produits</p>
                            <div className="space-y-2">
                              {bl.products.map((product: any, index: number) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <span className="text-white">{product.name}</span>
                                  <span className="text-cyan-400">{product.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'historique' && (
                  <div className="space-y-4">
                    {[
                      { date: '17/03/2025 - 15:30', action: 'Transfert lot #2024-001 vers Bassin A3', type: 'transfer' },
                      { date: '17/03/2025 - 14:15', action: 'Contrôle qualité lot #2024-002', type: 'quality' },
                      { date: '17/03/2025 - 11:30', action: 'Livraison effectuée - BL-2024-003', type: 'delivery' },
                      { date: '17/03/2025 - 10:00', action: 'Nouvelle facture FAC-2024-004', type: 'invoice' },
                      { date: '17/03/2025 - 09:15', action: 'Maintenance Bassin B2', type: 'maintenance' }
                    ].map((event, index) => (
                      <div key={index} className="p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all relative overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, rgba(10, 30, 50, 0.65) 0%, rgba(20, 100, 100, 0.45) 100%)",
                          backdropFilter: "blur(10px)"
                        }}
                      >
                        <div className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "radial-gradient(circle at top right, rgba(0, 200, 200, 0.1) 0%, transparent 60%)",
                            opacity: 0.3
                          }}
                        />
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-cyan-500/10">
                            {event.type === 'transfer' && <Package size={20} className="text-cyan-400" />}
                            {event.type === 'quality' && <Shell size={20} className="text-cyan-400" />}
                            {event.type === 'delivery' && <Truck size={20} className="text-cyan-400" />}
                            {event.type === 'invoice' && <FileText size={20} className="text-cyan-400" />}
                            {event.type === 'maintenance' && <Waves size={20} className="text-cyan-400" />}
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-white">{event.date}</p>
                            <p className="text-cyan-400">{event.action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {renderEditModal()}
      {renderBLModal()}
      {renderFilterModal()}
      {renderQRModal()}
      {renderExportModal()}
    </div>
  );
}