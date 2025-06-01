import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  Network,
  FileText,
  Lock,
  MessageCircle,
  Users,
  PhoneCall,
  Eye
} from 'lucide-react';
import { AdBanner } from '../ui/AdBanner';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  category?: string;
  path: string;
  icon: any;
  label: string;
  notifications?: number;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { category: "PRINCIPAL", path: '/', icon: Home, label: 'Accueil' },
    { category: "GESTION DES STOCKS", path: '/inventory', icon: Network, label: 'Inventaire' },
    { path: '/traceability', icon: FileText, label: 'Traçabilité' },
    { path: '/quality', icon: Package, label: 'Qualité' },
    { category: "COMMERCIAL", path: '/suppliers', icon: Package, label: 'Fournisseurs' },
    { path: '/clients', icon: Package, label: 'Clients' },
    { path: '/orders', icon: Package, label: 'Commandes' },
    { category: "ADMINISTRATION", path: '/hr', icon: Users, label: 'Gestion RH' },
    { path: '/network', icon: MessageCircle, label: 'Messagerie', notifications: 3 },
    { path: '/analytics', icon: Package, label: 'Analyses' },
    { path: '/company', icon: Package, label: 'Entreprise' },
    { path: '/surveillance', icon: Eye, label: 'Surveillance' },
    { path: '/emergency', icon: PhoneCall, label: 'Appel d\'urgence' },
    { path: '/digital-vault', icon: Lock, label: 'Coffre fort numérique' },
    { category: "PARAMETRES", path: '/settings', icon: Package, label: 'Configuration' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md border-r border-white/10 shadow-2xl transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } z-20`}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && (
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8"
          />
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
        >
          {isOpen ? <Package size={24} /> : <Package size={24} />}
        </button>
      </div>

      <nav className="mt-8">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <React.Fragment key={item.path}>
                {/* Insertion de la publicité après la surveillance */}
                {item.path === '/surveillance' && (
                  <li className="my-2">
                    <AdBanner isCollapsed={!isOpen} />
                  </li>
                )}
                {item.category && isOpen && (
                  <li className="px-4 py-2">
                    <span className="text-xs font-semibold tracking-wider text-brand-blue/80 uppercase">
                      {item.category}
                    </span>
                  </li>
                )}
                <li>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-brand-blue text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`${isOpen ? 'mr-3' : 'mx-auto'} transition-all duration-200`}
                    />
                    {isOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {item.notifications && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[20px] h-[20px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-medium text-white shadow-lg">
                        {item.notifications}
                      </div>
                    )}
                    {!isOpen && (
                      <div className="absolute left-20 px-3 py-2 bg-brand-dark rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.category && (
                          <span className="block text-xs font-semibold text-brand-blue/80 mb-1">
                            {item.category}
                          </span>
                        )}
                        <span className="text-white">{item.label}</span>
                        {item.notifications && (
                          <div className="absolute -right-1 top-1/2 -translate-y-1/2 min-w-[20px] h-[20px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-medium text-white shadow-lg">
                            {item.notifications}
                          </div>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}