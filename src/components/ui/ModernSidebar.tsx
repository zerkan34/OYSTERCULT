import React, { useState } from 'react';
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
  Store,
  Truck
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { OysterLogo } from './OysterLogo';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  {
    category: "Principal",
    items: [
      { 
        path: '/dashboard', 
        label: 'Tableau de bord', 
        icon: <LineChart size={20} />
      },
      { 
        path: '/tasks', 
        label: 'Tâches', 
        icon: <ClipboardList size={20} />
      }
    ]
  },
  {
    category: "Gestion des stocks",
    items: [
      { 
        path: '/inventory', 
        label: 'Stock', 
        icon: <Package size={20} />
      },
      { 
        path: '/traceability', 
        label: 'Traçabilité', 
        icon: <Tag size={20} />
      }
    ]
  },
  {
    category: "Commercial",
    items: [
      { 
        path: '/network', 
        label: 'Entre Pro', 
        icon: <Globe size={20} />
      },
      { 
        path: '/suppliers', 
        label: 'Fournisseurs', 
        icon: <Truck size={20} /> 
      },
      { 
        path: '/sales', 
        label: 'Ventes', 
        icon: <DollarSign size={20} />
      },
      { 
        path: '/purchases', 
        label: 'Commandes', 
        icon: <ShoppingCart size={20} />
      },
      { 
        path: '/shop', 
        label: 'Boutique', 
        icon: <Store size={20} />
      }
    ]
  },
  {
    category: "Administration",
    items: [
      { 
        path: '/accounting', 
        label: 'Comptabilité', 
        icon: <Calculator size={20} />
      },
      { 
        path: '/hr', 
        label: 'RH', 
        icon: <Users size={20} />
      }
    ]
  },
  {
    category: "Paramètres",
    items: [
      { 
        path: '/config', 
        label: 'Configuration', 
        icon: <Settings size={20} />
      },
      { 
        path: '/profile', 
        label: 'Mon Espace', 
        icon: <UserCircle size={20} />
      }
    ]
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
      <div
        className={`
          fixed inset-0 z-40 bg-black/50 lg:hidden
          ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          transition-opacity duration-300
        `}
        onClick={onCloseMobileMenu}
      />

      <div
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-72 bg-brand-dark border-r border-white/10
          transform transition-transform duration-300 lg:translate-x-0
          ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'lg:w-20' : 'lg:w-72'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            {!collapsed && <OysterLogo />}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/5 rounded-lg hidden lg:block"
            >
              {collapsed ? 
                <ChevronRight size={20} className="text-white/60" /> :
                <ChevronLeft size={20} className="text-white/60" />
              }
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
            {navItems.map((group, index) => (
              <div key={index} className="mb-6">
                {!collapsed && (
                  <div className="px-4 mb-2">
                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                      {group.category}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center px-4 py-2 rounded-lg text-sm
                        ${location.pathname === item.path
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      {item.icon}
                      {!collapsed && <span className="ml-3">{item.label}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button
              onClick={onEmergencyClick}
              className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg"
            >
              <Phone size={20} />
              {!collapsed && <span className="ml-3">Urgence</span>}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-white/60 hover:bg-white/5 hover:text-white rounded-lg"
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-3">Déconnexion</span>}
            </button>
            <div className="px-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}