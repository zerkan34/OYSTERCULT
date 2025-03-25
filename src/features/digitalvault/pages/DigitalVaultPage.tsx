import React, { useState } from 'react';
import { Upload, File, QrCode, Search, Lock, Shell } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <Lock size={28} className="text-cyan-400" aria-hidden="true" />
            Coffre fort numérique
          </h1>
          <p className="text-white/70 md:hidden">Stockez et gérez vos documents importants en toute sécurité</p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploader(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Ajouter un document"
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              <span>Ajouter un document</span>
            </button>
            <button
              onClick={() => setShowQrCode(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25),0_0_5px_rgba(0,0,0,0.2)_inset] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Générer QR Code"
            >
              <QrCode className="w-4 h-4" aria-hidden="true" />
              <span>Générer QR Code</span>
            </button>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-white/70 hidden md:block mb-6">Stockez et gérez vos documents importants en toute sécurité</p>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-white/60" size={18} />
              <input
                type="text"
                placeholder="Rechercher un document..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-500/40 shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_5px_rgba(0,0,0,0.2)_inset] transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Rechercher un document"
              />
            </div>
          </div>

          {filteredDocuments.length > 0 ? (
            <DocumentList 
              documents={filteredDocuments} 
              onDelete={deleteDocument} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white/5 rounded-lg border border-white/10">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Votre coffre-fort est vide</h3>
              <p className="text-white/60 max-w-md">
                Commencez à ajouter des documents pour les protéger et y accéder à tout moment.
              </p>
              <button
                onClick={() => setShowUploader(true)}
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Ajouter votre premier document"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>Ajouter votre premier document</span>
              </button>
            </div>
          )}
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
