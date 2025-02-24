import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    path: '/dashboard', 
    label: 'Tableau de bord', 
    icon: <LineChart size={20} />
  },
  { 
    path: '/tasks', 
    label: 'Tâches', 
    icon: <ClipboardList size={20} />
  },
  { 
    path: '/inventory', 
    label: 'Stock', 
    icon: <Package size={20} />
  },
  { 
    path: '/traceability', 
    label: 'Traçabilité', 
    icon: <Tag size={20} />
  },
  { 
    path: '/network', 
    label: 'Entre Pro', 
    icon: <Globe size={20} />
  },
  { 
    path: '/sales', 
    label: 'Ventes', 
    icon: <DollarSign size={20} />
  },
  { 
    path: '/purchases', 
    label: 'Achats', 
    icon: <ShoppingCart size={20} />
  },
  { 
    path: '/accounting', 
    label: 'Comptabilité', 
    icon: <Calculator size={20} />
  },
  { 
    path: '/hr', 
    label: 'RH', 
    icon: <Users size={20} />
  },
  { 
    path: '/shop', 
    label: 'Boutique', 
    icon: <Store size={20} />
  },
  { 
    path: '/config', 
    label: 'Configuration', 
    icon: <Settings size={20} />
  }
];

interface SidebarProps {
  onEmergencyClick: () => void;
  showMobileMenu: boolean;
  onCloseMobileMenu: () => void;
}

export function ModernSidebar({ onEmergencyClick, showMobileMenu, onCloseMobileMenu }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSession } = useStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    setSession(null);
    navigate('/auth');
  };

  return (
    <>
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white/5 backdrop-blur-xl border-r border-white/10
          transition-all duration-300 z-50
          ${collapsed ? 'w-20' : 'w-64'}
          ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            {!collapsed && <OysterLogo className="w-32" />}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-3 py-2 rounded-lg transition-colors
                      ${location.pathname === item.path
                        ? 'bg-brand-purple text-white'
                        : 'text-gray-300 hover:bg-white/5'
                      }
                    `}
                  >
                    {item.icon}
                    {!collapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <ThemeToggle />
              {!collapsed && (
                <button
                  onClick={onEmergencyClick}
                  className="flex items-center px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Phone size={20} />
                  <span className="ml-2">Urgence</span>
                </button>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-2">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}