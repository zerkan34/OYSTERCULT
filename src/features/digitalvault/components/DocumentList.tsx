import React from 'react';
import { File, Download, Trash2, Calendar, Check } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Document } from '../hooks/useDocuments';

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDelete }) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-brand-dark via-brand-purple/30 to-brand-burgundy/30 rounded-lg border border-white/10">
        <File size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white">Aucun document</h3>
        <p className="mt-2 text-sm text-gray-300">
          Ajoutez vos documents importants pour y accéder facilement lors d'un contrôle.
        </p>
      </div>
    );
  }

  const handleDownload = (document: Document) => {
    // Créer un URL pour le fichier
    const url = URL.createObjectURL(document.file);
    
    // Créer un lien temporaire
    const a = window.document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = document.title + '.' + document.file.name.split('.').pop();
    
    // Ajouter à la page, cliquer et supprimer
    window.document.body.appendChild(a);
    a.click();
    
    // Nettoyer
    window.URL.revokeObjectURL(url);
    window.document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div 
          key={doc.id}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <File size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                {doc.title}
                {doc.isRequired && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    <Check size={12} className="mr-1" />
                    Obligatoire
                  </span>
                )}
              </h3>
              <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={14} className="mr-1" />
                <span>
                  Ajouté le {format(new Date(doc.date), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDownload(doc)}
              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/40"
              title="Télécharger"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => onDelete(doc.id)}
              className="p-1.5 text-red-600 hover:bg-red-100 rounded-full dark:text-red-400 dark:hover:bg-red-900/40"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
