import React, { useState } from 'react';
import { Upload, File, QrCode, Search } from 'lucide-react';
import DocumentUploader from '../components/DocumentUploader';
import DocumentList from '../components/DocumentList';
import QrCodeGenerator from '../components/QrCodeGenerator';
import { useDocuments } from '../hooks/useDocuments';

const DigitalVaultPage: React.FC = () => {
  const { documents, addDocument, deleteDocument } = useDocuments();
  const [showUploader, setShowUploader] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Mon coffre-fort numérique</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUploader(true)}
              className="flex items-center px-4 py-2 bg-brand-burgundy text-white rounded-lg hover:bg-brand-burgundy/90 transition-colors"
            >
              <Upload size={18} className="mr-2" />
              Ajouter un document
            </button>
            <button
              onClick={() => setShowQrCode(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              <QrCode size={18} className="mr-2" />
              Générer QR Code
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un document..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <DocumentList 
            documents={filteredDocuments} 
            onDelete={deleteDocument} 
          />
        </div>
      </div>

      {showUploader && (
        <DocumentUploader 
          onClose={() => setShowUploader(false)} 
          onUpload={(title, file) => {
            addDocument({ id: Date.now().toString(), title, file, date: new Date().toISOString() });
            setShowUploader(false);
          }}
        />
      )}

      {showQrCode && (
        <QrCodeGenerator 
          documents={documents.filter(doc => doc.isRequired)} 
          onClose={() => setShowQrCode(false)}
        />
      )}
    </div>
  );
};

export default DigitalVaultPage;
