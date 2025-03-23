import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Settings, Menu } from 'lucide-react';
import { OysterLogo } from './OysterLogo';

interface ModernLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  actions?: React.ReactNode;
}

export function ModernLayout({ children, title, showSearch, onSearch, actions }: ModernLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header avec effet glassmorphism */}
      <header className="sticky top-0 z-50 bg-[#12121A]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 mobile-responsive-container">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <OysterLogo size={32} className="text-[#E5A55D]" />
              {title && (
                <h1 className="text-xl font-industry tracking-wide">{title}</h1>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    onChange={(e) => onSearch?.(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 bg-[#1A1A24] border border-white/10 rounded-full text-white placeholder-white/40 focus:border-[#E5A55D]/50 focus:ring-1 focus:ring-[#E5A55D]/50 transition-all"
                    aria-label="Champ de recherche"
                  />
                </div>
              )}
              
              {actions}
              
              <motion.button
                className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Notifications"
              >
                <Bell size={24} className="text-white/60" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E5A55D] rounded-full" aria-hidden="true" />
              </motion.button>
              
              <motion.button
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Menu principal"
              >
                <Menu size={24} className="text-white/60" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal avec dégradé subtil */}
      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E5A55D]/5 via-[#1A1A24]/5 to-transparent" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 py-8 mobile-responsive-container">
          {children}
        </div>
      </main>
    </div>
  );
}