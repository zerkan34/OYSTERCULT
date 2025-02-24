import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/lib/store';

type AuthMode = 'login' | 'register';

const inputVariants = {
  focus: { scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const { setSession } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSession({ user: 'test' });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        className="text-center mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Settings className="w-16 h-16 text-brand-burgundy mx-auto" />
        <h1 className="text-3xl font-industry text-white mt-4">OYSTER CULT</h1>
      </motion.div>

      <motion.div 
        className="glass-effect p-8 rounded-lg shadow-glass"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={inputVariants} whileFocus="focus">
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-burgundy/50 focus:ring-1 focus:ring-brand-burgundy/50 transition-all duration-300"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={inputVariants} whileFocus="focus">
            <label className="block text-sm font-medium text-white mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-burgundy/50 focus:ring-1 focus:ring-brand-burgundy/50 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Se connecter</span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-burgundy to-brand-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          <div className="text-center">
            <motion.button
              type="button"
              onClick={() => setMode('register')}
              className="text-sm text-white/60 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Nouvel utilisateur ? S'enregistrer
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}