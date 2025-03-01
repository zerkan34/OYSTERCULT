import { useState, useEffect } from 'react';

export interface Document {
  id: string;
  title: string;
  file: File;
  date: string;
  isRequired?: boolean;
}

interface UseDocumentsReturn {
  documents: Document[];
  addDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<Omit<Document, 'id'>>) => void;
}

export const useDocuments = (): UseDocumentsReturn => {
  const [documents, setDocuments] = useState<Document[]>([]);

  // Charger les documents depuis le localStorage au démarrage
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        // Dans une application réelle, vous récupéreriez les documents depuis une API 
        // ou une base de données. Pour cet exemple, nous utilisons localStorage pour 
        // simuler le stockage, mais les fichiers ne peuvent pas être sérialisés pour localStorage.
        
        // Cette fonction est donc laissée vide, mais dans une application réelle, 
        // vous implémenteriez ici la logique pour charger les documents.
        
        // Pour l'instant, nous commençons avec un tableau vide.
      } catch (error) {
        console.error('Erreur lors du chargement des documents', error);
      }
    };

    loadDocuments();
  }, []);

  const addDocument = (document: Document) => {
    setDocuments(prev => [...prev, document]);
    
    // Dans une application réelle, vous enverriez le document à une API
    // pour le stocker de manière persistante
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    
    // Dans une application réelle, vous enverriez une requête à une API
    // pour supprimer le document de manière persistante
  };

  const updateDocument = (id: string, updates: Partial<Omit<Document, 'id'>>) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id 
          ? { ...doc, ...updates } 
          : doc
      )
    );
    
    // Dans une application réelle, vous enverriez les mises à jour à une API
    // pour les stocker de manière persistante
  };

  return {
    documents,
    addDocument,
    deleteDocument,
    updateDocument
  };
};
