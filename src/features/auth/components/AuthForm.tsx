import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../lib/store';

export function AuthForm() {
  const navigate = useNavigate();
  const { setSession } = useStore();

  const handleLogin = () => {
    // Simuler une session pour la démo
    setSession({
      user: {
        email: 'demo@oystercult.com',
        role: 'admin'
      },
      token: 'demo-token'
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-800">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">OYSTER CULT</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue="demo@oystercult.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
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
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
              readOnly
            />
          </div>

          <button
            onClick={handleLogin}
            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}