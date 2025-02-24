import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Settings,
  Users, 
  LineChart,
  ShoppingCart,
  ClipboardList,
  Package,
  DollarSign,
  Bell,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Phone,
  LogOut,
  Calculator,
  Tag,
  Store
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { OysterLogo } from './OysterLogo';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { 
    path: '/config', 
    label: 'Configuration', 
    icon: <Settings size={20} />,
    shortcut: 'g'
  },
  { 
    path: '/dashboard', 
    label: 'Tableau de bord', 
    icon: <LineChart size={20} />,
    shortcut: 'd'
  },
  { 
    path: '/tasks', 
    label: 'Tâches', 
    icon: <ClipboardList size={20} />,
    shortcut: 't'
  },
  { 
    path: '/inventory', 
    label: 'Stock', 
    icon: <Package size={20} />,
    shortcut: 's'
  },
  { 
    path: '/traceability', 
    label: 'Traçabilité', 
    icon: <Tag size={20} />,
    shortcut: 'r'
  },
  { 
    path: '/purchases', 
    label: 'Achats', 
    icon: <ShoppingCart size={20} />,
    shortcut: 'a'
  },
  { 
    path: '/sales', 
    label: 'Ventes', 
    icon: <DollarSign size={20} />,
    shortcut: 'v'
  },
  { 
    path: '/accounting', 
    label: 'Comptabilité', 
    icon: <Calculator size={20} />,
    shortcut: 'c'
  },
  { 
    path: '/hr', 
    label: 'RH', 
    icon: <Users size={20} />,
    shortcut: 'h'
  },
  { 
    path: '/network', 
    label: 'Entre Pro', 
    icon: <Globe size={20} />,
    shortcut: 'p'
  },
  { 
    path: '/shop', 
    label: 'Shop', 
    icon: <Store size={20} />,
    shortcut: 'b'
  },
  { 
    path: '/profile', 
    label: 'Mon Espace', 
    icon: <UserCircle size={20} />,
    shortcut: 'm'
  }
];

interface SidebarProps {
  onEmergencyClick: () => void;
  showMobileMenu: boolean;
  onCloseMobileMenu: () => void;
}

export function ModernSidebar({ onEmergencyClick, showMobileMenu, onCloseMobileMenu }: SidebarProps) {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, setSession, unreadCount } = useStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setSession(null);
  };

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        const item = navItems.find(item => item.shortcut === e.key.toLowerCase());
        if (item) {
          window.location.href = item.path;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  React.useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    let startX: number;
    let startY: number;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < -50) {
          onCloseMobileMenu();
        }
      }
    };

    sidebar.addEventListener('touchstart', handleTouchStart);
    sidebar.addEventListener('touchmove', handleTouchMove);

    return () => {
      sidebar.removeEventListener('touchstart', handleTouchStart);
      sidebar.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onCloseMobileMenu]);

  return (
    <>
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[65] md:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      <aside 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-[rgb(var(--color-brand-surface)_/_var(--glass-opacity))] backdrop-blur-md z-[66] 
          flex flex-col border-r border-[rgb(var(--color-border)_/_var(--color-border-opacity))] transition-all duration-300
          ${sidebarCollapsed ? 'w-20' : 'w-64'} 
          ${showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-16 p-4 flex items-center justify-center border-b border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
          <OysterLogo 
            size={32} 
            withText={!sidebarCollapsed} 
            textPosition="right"
          />
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] hover:text-[rgb(var(--color-text))] transition-all duration-300 hidden md:block
              ${sidebarCollapsed ? 'absolute -right-4 bg-[rgb(var(--color-brand-dark))] rounded-full p-1 shadow-lg' : 'ml-auto'}`}
            aria-label={sidebarCollapsed ? "Déplier le menu" : "Replier le menu"}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full px-6 py-4 flex items-center transition-all duration-300 relative group
                ${location.pathname === item.path 
                  ? 'text-[rgb(var(--color-text))]' 
                  : 'text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] hover:text-[rgb(var(--color-text))]'}
                ${sidebarCollapsed ? 'justify-center' : ''}`}
              onClick={onCloseMobileMenu}
              title={`${item.label} (Alt + ${item.shortcut.toUpperCase()})`}
            >
              <div className={`absolute inset-0 bg-[rgb(var(--color-brand-burgundy))] opacity-0 transition-opacity duration-300
                ${location.pathname === item.path ? 'opacity-10' : 'group-hover:opacity-5'}`}
              />
              <div className="relative z-10 flex items-center">
                <div className="text-current transition-transform duration-300 transform group-hover:scale-110">
                  {item.icon}
                </div>
                <span className={`ml-4 font-light tracking-wide whitespace-nowrap transition-all duration-300
                  ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 space-y-4 border-t border-[rgb(var(--color-border)_/_var(--color-border-opacity))]">
          <button
            onClick={onEmergencyClick}
            className={`w-full flex items-center px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-[rgb(var(--color-brand-surface))] transition-colors
              ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
              <Phone className="text-[rgb(var(--color-brand-surface))]" size={20} />
            </div>
            <span className={`ml-3 font-medium whitespace-nowrap transition-opacity duration-300
              ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
              URGENCE
            </span>
          </button>

          <div className="flex items-center justify-between px-4">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-background-hover)_/_var(--color-background-hover-opacity))] rounded-lg transition-colors p-2
                  ${sidebarCollapsed ? 'w-full justify-center' : ''}`}
              >
                <LogOut size={24} />
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center px-1 text-xs font-medium text-white shadow-lg">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="glass-effect p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-[rgb(var(--color-text))] mb-4">Confirmation de déconnexion</h2>
            <p className="text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] hover:text-[rgb(var(--color-text))] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[rgb(var(--color-brand-burgundy))] rounded-lg text-[rgb(var(--color-brand-surface))] hover:bg-[rgb(var(--color-brand-burgundy)_/_0.9)] transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}