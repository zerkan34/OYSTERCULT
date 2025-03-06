import React, { useState } from 'react';
import { Key, Smartphone, Shield, AlertTriangle } from 'lucide-react';

export function SecuritySettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [show2FAForm, setShow2FAForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">Mot de passe</h3>
            <p className="text-white/60 mt-1">Dernière modification il y a 3 mois</p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
          >
            Modifier
          </button>
        </div>

        {showPasswordForm && (
          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Mot de passe actuel
              </label>
              <input
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">Double authentification</h3>
            <p className="text-white/60 mt-1">Sécurisez votre compte avec la 2FA</p>
          </div>
          <button
            onClick={() => setShow2FAForm(!show2FAForm)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            Configurer
          </button>
        </div>

        {show2FAForm && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-start space-x-3">
                <Smartphone size={20} className="text-white/60 mt-1" />
                <div>
                  <h4 className="text-white font-medium">Application d'authentification</h4>
                  <p className="text-white/60 mt-1">
                    Utilisez une application comme Google Authenticator pour générer des codes
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-start space-x-3">
                <Key size={20} className="text-white/60 mt-1" />
                <div>
                  <h4 className="text-white font-medium">Clé de sécurité</h4>
                  <p className="text-white/60 mt-1">
                    Utilisez une clé de sécurité physique (YubiKey, etc.)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Sessions actives</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Chrome - Windows</div>
                <div className="text-sm text-white/60">Dernière activité: Il y a 2 minutes</div>
                <div className="text-sm text-white/60">IP: 192.168.1.1</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                  Session actuelle
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Safari - iPhone</div>
                <div className="text-sm text-white/60">Dernière activité: Il y a 1 heure</div>
                <div className="text-sm text-white/60">IP: 192.168.1.2</div>
              </div>
              <button className="text-brand-primary hover:text-brand-primary/80 transition-colors">
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-6">
        <h3 className="text-lg font-medium text-brand-primary mb-4">Zone dangereuse</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Supprimer le compte</div>
            <div className="text-white/60 mt-1">
              Cette action est irréversible et supprimera toutes vos données
            </div>
          </div>
          <button className="px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-lg hover:bg-brand-primary/30 transition-colors">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}