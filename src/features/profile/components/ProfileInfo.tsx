import React, { useState } from 'react';
import { UserCircle, Mail, Phone, MapPin, Calendar, Building2, Upload } from 'lucide-react';
import { useStore } from '@/lib/store';

export function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const { session } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-brand-burgundy/20 flex items-center justify-center overflow-hidden">
            {session?.user?.avatar_url ? (
              <img
                src={session.user.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle size={64} className="text-brand-burgundy" />
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-full">
            <Upload size={24} />
            <input type="file" className="hidden" accept="image/*" />
          </label>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Nikko DURAND</h2>
          <p className="text-white/60">Responsable Production</p>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center text-white/60">
              <Mail size={16} className="mr-2" />
              nikkodurand@gmail.com
            </div>
            <div className="flex items-center text-white/60">
              <Phone size={16} className="mr-2" />
              06 51 94 48 44
            </div>


          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Prénom
              </label>
              <input
                type="text"
                defaultValue="Nikko"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Nom
              </label>
              <input
                type="text"
                defaultValue="DURAND"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="nikkodurand@gmail.com"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                defaultValue="06 51 94 48 44"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Adresse
            </label>
            <textarea
              rows={3}
              defaultValue="126 chemin du mas d'argent, 34140 Bouzigues"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Informations complémentaires</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-white/60">Adresse</div>
              <div className="text-white mt-1">126 chemin du mas d'argent, 34140 Bouzigues</div>
            </div>
            
            <div>
              <div className="text-sm text-white/60">Numéro de sécurité sociale</div>
              <div className="text-white mt-1">1 85 12 17 123 456 78</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}