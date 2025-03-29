import React, { useState, useEffect } from 'react';
import { X, Download, QrCode, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document } from '../hooks/useDocuments';
import { QRCodeSVG } from 'qrcode.react';

interface QrCodeGeneratorProps {
  documents: Document[];
  onClose: () => void;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ documents, onClose }) => {
  const [qrValue, setQrValue] = useState('');
  
  useEffect(() => {
    if (documents.length > 0) {
      // Créer un objet avec des données minimales pour le QR code
      // Dans une application réelle, vous utiliserez un endpoint API sécurisé
      const documentData = documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        type: doc.file.type,
        size: doc.file.size,
        required: doc.isRequired
      }));
      
      // Convertir l'objet en JSON pour le QR code
      // Dans une application réelle, cela serait une URL vers une page sécurisée
      setQrValue(JSON.stringify({
        type: 'OYSTERCULT_DIGITAL_VAULT',
        documents: documentData,
        expiry: Date.now() + 3600000, // Expire dans 1 heure
      }));
    }
  }, [documents]);

  const handleDownload = () => {
    const svgElement = window.document.getElementById('qr-code-svg');
    if (svgElement) {
      // Créer un élément canvas temporaire
      const canvas = window.document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      
      // Convertir SVG en image
      img.onload = () => {
        canvas.width = 200;
        canvas.height = 200;
        ctx?.drawImage(img, 0, 0, 200, 200);
        
        // Télécharger l'image
        const url = canvas.toDataURL('image/png');
        const a = window.document.createElement('a');
        a.href = url;
        a.download = 'coffre-fort-numerique-qrcode.png';
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex justify-center">
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 mx-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">QR Code d'accès</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {documents.length === 0 ? (
              <div className="text-center py-6">
                <QrCode size={60} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucun document obligatoire</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Vous n'avez pas encore ajouté de documents marqués comme obligatoires.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white rounded-lg">
                    <QRCodeSVG 
                      id="qr-code-svg"
                      value={qrValue} 
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Ce QR code donne accès aux documents suivants :
                      </p>
                      <ul className="mt-2 text-sm text-blue-600 dark:text-blue-400 list-disc list-inside">
                        {documents.map(doc => (
                          <li key={doc.id}>{doc.title}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <Download size={18} className="mr-2" />
                    Télécharger le QR Code
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default QrCodeGenerator;
