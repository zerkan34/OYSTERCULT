import React, { useState, useRef } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentUploaderProps {
  onClose: () => void;
  onUpload: (title: string, file: File, isRequired?: boolean) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRequired, setIsRequired] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Vérifier la taille du fichier (max 10 MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. La taille maximale est de 10 MB.');
        return;
      }
      
      // Vérifier le type de fichier (PDF, JPG, PNG)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Format de fichier non pris en charge. Veuillez utiliser PDF, JPG ou PNG.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      
      // Auto-fill title from filename if not set
      if (!title) {
        // Remove extension from filename
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Veuillez saisir un titre pour le document.');
      return;
    }
    
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }
    
    onUpload(title, selectedFile, isRequired);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Vérifier la taille du fichier (max 10 MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. La taille maximale est de 10 MB.');
        return;
      }
      
      // Vérifier le type de fichier (PDF, JPG, PNG)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Format de fichier non pris en charge. Veuillez utiliser PDF, JPG ou PNG.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      
      // Auto-fill title from filename if not set
      if (!title) {
        // Remove extension from filename
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 mx-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ajouter un document</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre du document
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ex: Carte d'identité, Permis de conduire..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <FileText size={40} className="text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Changer de fichier
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload size={40} className="text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cliquez pour sélectionner un fichier
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ou glissez-déposez ici
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Format supporté: PDF, JPG, PNG (max. 10 MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Document obligatoire (visible dans le QR code)
                </span>
              </label>
            </div>
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                disabled={!selectedFile || !title.trim()}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DocumentUploader;
