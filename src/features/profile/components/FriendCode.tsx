import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Users, QrCode } from 'lucide-react';
import { useStore } from '@/lib/store';

export function FriendCode() {
  const { session } = useStore();
  const friendCode = generateFriendCode(session?.user?.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(friendCode);
    // TODO: Show toast notification
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-white">Mon Code Ami</h3>
            <p className="text-white/60 mt-1">
              Partagez ce code pour vous connecter avec d'autres professionnels
            </p>
          </div>
          <div className="w-12 h-12 bg-brand-burgundy/20 rounded-lg flex items-center justify-center">
            <Users size={24} className="text-brand-burgundy" />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-burgundy/20 blur-xl rounded-xl" />
            <motion.div
              className="relative bg-gradient-to-br from-brand-dark to-brand-purple p-8 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="text-4xl font-mono font-bold tracking-wider text-center text-white">
                {friendCode}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <motion.button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy size={20} className="mr-2" />
            Copier le code
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <QrCode size={20} className="mr-2" />
            Afficher le QR Code
          </motion.button>
        </div>

        <div className="mt-8 p-4 bg-white/5 rounded-lg">
          <h4 className="text-white font-medium mb-2">Comment ça marche ?</h4>
          <ol className="space-y-2 text-white/60">
            <li>1. Partagez votre code ami avec un autre professionnel</li>
            <li>2. Utilisez son code dans la section "Entre Pro" pour vous connecter</li>
            <li>3. Une fois connectés, vous pourrez échanger et collaborer facilement</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// Fonction pour générer un code ami unique basé sur l'ID utilisateur
function generateFriendCode(userId?: string): string {
  if (!userId) return 'XXXX-XXXX-XXXX';
  
  // Utilise l'ID utilisateur pour générer un code unique
  const hash = Array.from(userId)
    .reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)
    .toString(36)
    .toUpperCase();
  
  // Format le code en groupes de 4 caractères
  const code = (hash + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    .slice(0, 12)
    .match(/.{1,4}/g)
    ?.join('-');
  
  return code || 'XXXX-XXXX-XXXX';
}