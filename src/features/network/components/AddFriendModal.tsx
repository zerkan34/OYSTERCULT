import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Users, Search, AlertTriangle } from 'lucide-react';
import { useStore } from '@/lib/store';

interface AddFriendModalProps {
  onClose: () => void;
}

export function AddFriendModal({ onClose }: AddFriendModalProps) {
  const [friendCode, setFriendCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Vérifier le format du code
      if (!isValidFriendCode(friendCode)) {
        throw new Error('Format de code invalide');
      }

      // TODO: Implémenter la logique de vérification et d'ajout d'ami
      await new Promise(resolve => setTimeout(resolve, 1000));

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Ajouter un contact"
      size="md"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-brand-burgundy/20 rounded-full flex items-center justify-center">
            <Users size={32} className="text-brand-burgundy" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Code ami
            </label>
            <input
              type="text"
              value={friendCode}
              onChange={(e) => {
                const formatted = formatFriendCode(e.target.value);
                setFriendCode(formatted);
                setError(null);
              }}
              placeholder="XXXX-XXXX-XXXX"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center font-mono text-xl tracking-wider"
              maxLength={14}
            />
            <p className="mt-2 text-sm text-white/60">
              Entrez le code ami de la personne que vous souhaitez ajouter
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center text-red-400">
                <AlertTriangle size={20} className="mr-2" />
                {error}
              </div>
            </div>
          )}

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
              disabled={!isValidFriendCode(friendCode) || loading}
              className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Recherche...' : 'Ajouter'}
            </button>
          </div>
        </form>

        <div className="p-4 bg-white/5 rounded-lg">
          <h4 className="text-white font-medium mb-2">Comment obtenir un code ami ?</h4>
          <p className="text-sm text-white/60">
            Chaque utilisateur dispose d'un code ami unique disponible dans son profil. 
            Demandez à votre contact de partager son code avec vous pour l'ajouter à votre réseau.
          </p>
        </div>
      </div>
    </Modal>
  );
}

// Fonctions utilitaires pour la gestion des codes amis
function formatFriendCode(code: string): string {
  // Supprime tous les caractères non alphanumériques
  const cleaned = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  // Groupe les caractères par 4
  const groups = cleaned.match(/.{1,4}/g) || [];
  
  // Joint les groupes avec des tirets
  return groups.join('-');
}

function isValidFriendCode(code: string): boolean {
  return /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code);
}