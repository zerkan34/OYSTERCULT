import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../lib/store';

export function AuthForm() {
  const navigate = useNavigate();
  const { setSession } = useStore();

  const handleLogin = () => {
    // Session de démo avec tous les droits
    setSession({
      user: {
        id: 'demo-user',
        email: 'demo@oystercult.com',
        role: 'admin',
        name: 'Démo Admin',
        permissions: ['all'],
        isActive: true
      },
      token: 'demo-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
    });
    navigate('/inventory');
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-gray-800/50 backdrop-blur-xl border border-gray-700">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">Mode Démo</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Email
          </label>
          <input
            type="email"
            defaultValue="demo@oystercult.com"
            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            defaultValue="demo123"
            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600"
            readOnly
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center font-medium transition-colors"
        >
          Accéder à la démo
        </button>
      </div>
    </div>
  );
}