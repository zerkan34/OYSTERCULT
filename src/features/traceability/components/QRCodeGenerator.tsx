import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Calendar, Download, Share2 } from 'lucide-react';

interface QRCodeGeneratorProps {
  onClose: () => void;
}

export function QRCodeGenerator({ onClose }: QRCodeGeneratorProps) {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const generateQRCode = () => {
    // Simuler la génération d'un QR Code
    const data = {
      producer: "OYSTER CULT",
      dateRange,
      timestamp: new Date().toISOString()
    };
    
    // Dans un cas réel, nous générerions une URL sécurisée avec un token
    const url = `https://api.oystercult.com/trace/${btoa(JSON.stringify(data))}`;
    setQrCodeUrl(url);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Générer un QR Code"
      size="md"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Période de traçabilité
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {!qrCodeUrl ? (
          <button
            onClick={generateQRCode}
            className="w-full px-4 py-2 bg-brand-burgundy rounded-lg text-white"
          >
            Générer le QR Code
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              {/* Ici, nous afficherions le QR Code généré */}
              <div className="w-full aspect-square bg-white flex items-center justify-center">
                QR Code
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {/* Action de téléchargement */}}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-white/10 rounded-lg text-white"
              >
                <Download size={20} className="mr-2" />
                Télécharger
              </button>
              <button
                onClick={() => {/* Action de partage */}}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-white/10 rounded-lg text-white"
              >
                <Share2 size={20} className="mr-2" />
                Partager
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}