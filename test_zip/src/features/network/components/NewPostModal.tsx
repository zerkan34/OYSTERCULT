import React from 'react';
import { Modal } from '@/components/ui/Modal';

interface NewPostModalProps {
  onClose: () => void;
  type: 'directory' | 'marketplace' | 'forum';
}

export function NewPostModal({ onClose, type }: NewPostModalProps) {
  const getTitle = () => {
    switch (type) {
      case 'directory':
        return 'Mettre à jour mon profil';
      case 'marketplace':
        return 'Nouvelle annonce';
      case 'forum':
        return 'Nouvelle discussion';
      default:
        return '';
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={getTitle()}
      size="xl"
    >
      {/* Contenu existant */}
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Titre
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            placeholder="Titre de votre publication..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            placeholder="Contenu de votre publication..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Tags
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            placeholder="Ajoutez des tags séparés par des virgules..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
          >
            Publier
          </button>
        </div>
      </form>
    </Modal>
  );
}