import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Users, 
  LineChart,
  ShoppingCart,
  Package,
  DollarSign,
  Globe,
  Phone,
  LogOut,
  Calculator,
  Tag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '@/lib/store';

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
  }
];

interface SidebarProps {
  onEmergencyClick: () => void;
  showMobileMenu: boolean;
  onCloseMobileMenu: () => void;
}

export function Sidebar({ onEmergencyClick, showMobileMenu, onCloseMobileMenu }: SidebarProps) {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, setSession } = useStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
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
        className={`fixed top-0 left-0 h-screen bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md text-white z-[66] 
          flex flex-col border-r border-white/10 transition-all duration-300
          ${sidebarCollapsed ? 'w-20' : 'w-64'} 
          ${showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-16 p-4 flex items-center justify-between border-b border-white/10">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <Settings className="w-8 h-8 text-brand-burgundy animate-spin-slow" />
            <span className={`ml-3 font-industry tracking-wide transition-opacity duration-300 
              ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
              OYSTER CULT
            </span>
          </div>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`text-white/70 hover:text-white transition-all duration-300 hidden md:block
              ${sidebarCollapsed ? 'absolute -right-4 bg-brand-dark rounded-full p-1 shadow-lg' : ''}`}
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
                ${location.pathname === item.path ? 'text-white' : 'text-white/60 hover:text-white'}
                ${sidebarCollapsed ? 'justify-center' : ''}`}
              onClick={onCloseMobileMenu}
              title={`${item.label} (Alt + ${item.shortcut.toUpperCase()})`}
            >
              <div className={`absolute inset-0 bg-brand-burgundy opacity-0 transition-opacity duration-300
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

        <div className="p-4 space-y-4 border-t border-white/10">
          <button
            onClick={onEmergencyClick}
            className={`w-full flex items-center px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors
              ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
              <Phone className="text-white" size={20} />
            </div>
            <span className={`ml-3 font-medium whitespace-nowrap transition-opacity duration-300
              ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
              URGENCE
            </span>
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`w-full flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors
              ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={24} />
            <span className={`ml-3 font-medium whitespace-nowrap transition-opacity duration-300
              ${sidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
              Déconnexion
            </span>
          </button>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="glass-effect p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Confirmation de déconnexion</h2>
            <p className="text-white/70 mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
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