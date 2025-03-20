import React, { useState, useRef, useEffect } from 'react';
import { Shell, Filter, QrCode, Download, Package, Waves, FileText, Truck, MapPin, History, Thermometer, Droplets, AlertCircle, Edit2, Save, Eye, Search, X } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BrowserQRCodeReader } from '@zxing/browser';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface BatchData {
  _id: Id<"traceability">;
  _creationTime: number;
  batchNumber: string;
  productType: "oyster" | "clam" | "mussel";
  quantity: number;
  origin: {
    producer: Id<"users">;
    location: string;
    harvestDate: string;
  };
  destination: {
    customer: Id<"users">;
    location: string;
    expectedDeliveryDate: string;
  };
  quality: {
    size: string;
    grade: string;
    temperature: number;
  };
  certifications: string[];
  notes?: string;
  status: "in_transit" | "delivered" | "rejected";
  currentLocation: string;
  checkpoints: Array<{
    location: string;
    timestamp: number;
    temperature: number;
    status: "in_transit" | "delivered" | "rejected";
    notes: string;
  }>;
  createdAt: number;
  updatedAt: number;
}

interface EditableItem {
  id: Id<"traceability">;
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
  const [selectedBL, setSelectedBL] = useState<BatchData | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [qrResult, setQrResult] = useState<string>('');

  // Convex queries et mutations
  const batches = useQuery(api.traceability.getBatches, {});
  const createBatch = useMutation(api.traceability.createBatch);
  const addCheckpoint = useMutation(api.traceability.addCheckpoint);
  const updateBatch = useMutation(api.traceability.updateBatch);
  const generateReport = editingItem?.id ? useQuery(api.traceability.generateTraceabilityReport, { batchId: editingItem.id }) : null;

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

  const handleEdit = (batch: BatchData) => {
    setEditingItem({
      id: batch._id,
      type: 'batch',
      ...batch
    });
    setEditedValues(batch);
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      if (editingItem.type === 'lot') {
        await updateBatch({
          id: editingItem.id,
          quantity: editedValues.stock.quantity,
          quality: {
            size: editedValues.size,
            grade: editedValues.grade,
            temperature: editedValues.temperature
          },
          notes: editedValues.notes
        });
      }
      setEditingItem(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleAddCheckpoint = async (batchId: string, location: string, temperature: number, status: "in_transit" | "delivered" | "rejected", notes?: string) => {
    try {
      await addCheckpoint({
        batchId,
        location,
        temperature,
        status,
        notes
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du checkpoint:', error);
    }
  };

  const handleCreateBatch = async (batchData: BatchData) => {
    try {
      await createBatch(batchData);
    } catch (error) {
      console.error('Erreur lors de la création du lot:', error);
    }
  };

  const handleViewBL = (bl: BatchData) => {
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

  // Rendu des lots
  const renderBatches = () => {
    if (!batches) return <div>Chargement...</div>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch: BatchData) => (
          <div key={batch._id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{batch.batchNumber}</h3>
                <p className="text-cyan-400">{batch.productType}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(batch)}
                  className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
                >
                  <Edit2 size={16} className="text-cyan-400" />
                </button>
                <button
                  onClick={() => handleViewBL(batch)}
                  className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
                >
                  <Eye size={16} className="text-cyan-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Quantité:</span>
                <span className="text-white">{batch.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className="text-white">{batch.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Origine:</span>
                <span className="text-white">{batch.origin.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Destination:</span>
                <span className="text-white">{batch.destination.location}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-sm text-gray-400 mb-2">Derniers checkpoints:</div>
              <div className="space-y-2">
                {batch.checkpoints.slice(-2).map((checkpoint, index) => (
                  <div key={index} className="text-sm flex justify-between items-center">
                    <span className="text-cyan-400">{checkpoint.location}</span>
                    <span className="text-gray-400">{new Date(checkpoint.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Rendu du modal d'édition
  const renderEditModal = () => {
    if (!editingItem) return null;

    return (
      <div className="space-y-4">
        {editingItem.type === 'lot' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Quantité
              </label>
              <input
                type="number"
                value={editedValues.quantity}
                onChange={(e) => setEditedValues({ ...editedValues, quantity: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Taille
              </label>
              <input
                type="text"
                value={editedValues.quality?.size}
                onChange={(e) => setEditedValues({
                  ...editedValues,
                  quality: { ...editedValues.quality, size: e.target.value }
                })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Grade
              </label>
              <input
                type="text"
                value={editedValues.quality?.grade}
                onChange={(e) => setEditedValues({
                  ...editedValues,
                  quality: { ...editedValues.quality, grade: e.target.value }
                })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Température
              </label>
              <input
                type="number"
                value={editedValues.quality?.temperature}
                onChange={(e) => setEditedValues({
                  ...editedValues,
                  quality: { ...editedValues.quality, temperature: Number(e.target.value) }
                })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Notes
              </label>
              <textarea
                value={editedValues.notes}
                onChange={(e) => setEditedValues({ ...editedValues, notes: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                rows={4}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shell className="text-cyan-400" />
          Traçabilité
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Filter size={16} className="text-cyan-400" />
            <span className="text-white">Filtrer</span>
          </button>
          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <QrCode size={16} className="text-cyan-400" />
            <span className="text-white">Scanner QR</span>
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Download size={16} className="text-cyan-400" />
            <span className="text-white">Exporter</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {[
          { id: 'lots', label: 'Lots', icon: <Package size={18} />, count: batches?.length },
          { id: 'bassins', label: 'Bassins', icon: <Waves size={18} /> },
          { id: 'bl', label: 'Bordereaux', icon: <FileText size={18} /> },
          { id: 'transport', label: 'Transport', icon: <Truck size={18} /> },
          { id: 'stockage', label: 'Stockage', icon: <MapPin size={18} /> },
          { id: 'historique', label: 'Historique', icon: <History size={18} /> }
        ].map((tab: TabData) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
              ${activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white hover:bg-white/10'}
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      <div id="traceability-content">
        {activeTab === 'lots' && renderBatches()}
        {/* ... autres onglets ... */}
      </div>

      {/* Modals */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Modifier"
      >
        {renderEditModal()}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setEditingItem(null)}
            className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </Modal>

      {/* ... autres modals ... */}
    </div>
  );
}