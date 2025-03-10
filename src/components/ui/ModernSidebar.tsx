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
  Truck,
  Mail,
  Lock,
  Menu,
  MessageCircle
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { OysterLogo } from './OysterLogo';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Category {
  id: string;
  name: string;
  items: NavItem[];
}

interface ModernSidebarProps {
  showMobileMenu: boolean;
  onCloseMobileMenu: () => void;
  onShowEmergency: () => void;
  onEmergencyClick: () => void;
  onToggleMessages: () => void;
  categories: Category[];
}

const pulseAnimation = {
  pulse: {
    boxShadow: [
      '0 0 4px rgba(255, 255, 255, 0.5)',
      '0 0 8px rgba(255, 255, 255, 0.6)',
      '0 0 4px rgba(255, 255, 255, 0.5)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const createColorPulse = (color: string) => ({
  pulse: {
    boxShadow: [
      `0 0 4px ${color}`,
      `0 0 8px ${color}`,
      `0 0 4px ${color}`
    ],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
});

const categories = {
  "Principal": {
    color: "from-blue-500/30 to-blue-600/10",
    textColor: "text-blue-300"
  },
  "Gestion des stocks": {
    color: "from-green-500/30 to-green-600/10",
    textColor: "text-green-300"
  },
  "Commercial": {
    color: "from-purple-500/30 to-purple-600/10",
    textColor: "text-purple-300"
  },
  "Administration": {
    color: "from-amber-500/30 to-amber-600/10",
    textColor: "text-amber-300"
  },
  "Paramètres": {
    color: "from-cyan-500/30 to-cyan-600/10",
    textColor: "text-cyan-300"
  }
};

const navItems = [
  {
    category: "Principal",
    items: [
      { 
        path: '/dashboard', 
        label: 'Tableau de bord', 
        icon: <LineChart size={22} />
      },
      { 
        path: '/tasks', 
        label: 'Tâches', 
        icon: <ClipboardList size={22} />
      }
    ]
  },
  {
    category: "Gestion des stocks",
    items: [
      { 
        path: '/inventory', 
        label: 'Stock', 
        icon: <Package size={22} />
      },
      { 
        path: '/traceability', 
        label: 'Traçabilité', 
        icon: <Tag size={22} />
      }
    ]
  },
  {
    category: "Commercial",
    items: [
      { 
        path: '/network', 
        label: 'Entre Pro', 
        icon: <Globe size={22} />
      },
      { 
        path: '/suppliers', 
        label: 'Fournisseurs', 
        icon: <Truck size={22} /> 
      },
      { 
        path: '/purchases', 
        label: 'Commandes', 
        icon: <ShoppingCart size={22} />
      },
      { 
        path: '/sales', 
        label: 'Ventes', 
        icon: <DollarSign size={22} />
      },
      { 
        path: '/shop', 
        label: 'Boutique', 
        icon: <Store size={22} />
      }
    ]
  },
  {
    category: "Administration",
    items: [
      { 
        path: '/accounting', 
        label: 'Comptabilité', 
        icon: <Calculator size={22} />
      },
      { 
        path: '/hr', 
        label: 'RH', 
        icon: <Users size={22} />
      },
      { 
        path: '/digitalvault', 
        label: 'Mon coffre-fort numérique', 
        icon: <Lock size={22} />
      }
    ]
  },
  {
    category: "Paramètres",
    items: [
      { 
        path: '/config', 
        label: 'Configuration', 
        icon: <Settings size={22} />
      },
      { 
        path: '/profile', 
        label: 'Mon Espace', 
        icon: <UserCircle size={22} />
      }
    ]
  }
];

export function ModernSidebar({
  showMobileMenu,
  onCloseMobileMenu,
  onShowEmergency,
  onEmergencyClick,
  onToggleMessages,
  categories
}: ModernSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSession } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLogout = () => {
    setSession(null);
    navigate('/auth');
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  const toggleSidebar = () => {
    setIsAnimating(true);
    setCollapsed(!collapsed);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    })
  };

  const sidebarVariants = {
    expanded: { 
      width: "18rem", 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        mass: 0.8
      }
    },
    collapsed: { 
      width: "5rem", 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        mass: 0.8
      }
    },
    mobileHidden: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    mobileVisible: {
      x: 0,
      width: "85vw", 
      maxWidth: "300px", 
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };

  const contentFadeVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    }
  };

  return (
    <>
      <div
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden
          ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          transition-opacity duration-300
        `}
        onClick={onCloseMobileMenu}
      />

      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-background border-r z-50",
          "md:w-[var(--sidebar-width)] md:relative md:block",
          "transition-transform duration-300 ease-in-out",
          "mobile-sidebar safe-area-top safe-area-bottom",
          !showMobileMenu && "transform -translate-x-full md:translate-x-0"
        )}
        initial="collapsed"
        animate={
          window.innerWidth >= 1024 
            ? (collapsed ? "collapsed" : "expanded") 
            : (showMobileMenu ? "mobileVisible" : "mobileHidden")
        }
        variants={sidebarVariants}
      >
        <div className="flex flex-col h-full">
          <div 
            className="cursor-pointer flex items-center mobile-touch-target" 
            onClick={handleLogoClick}
            role="button"
            aria-label="Retour au tableau de bord"
          >
            <OysterLogo size={24} />
            <span className="ml-2 text-base font-bold tracking-wide text-white">OYSTER CULT</span>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="px-2 py-2 space-y-1">
              {categories.map((category) => (
                <div key={category.id} className="mb-4">
                  <div className="px-3 mb-2">
                    <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                      {category.name}
                    </h2>
                  </div>
                  {category.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "mobile-nav-item group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          "mobile-touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                        onClick={() => onCloseMobileMenu()}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className="flex-shrink-0 w-5 h-5 mr-3" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-white/5">
            <motion.button
              onClick={onEmergencyClick}
              className={cn(
                "mobile-touch-target w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg",
                "bg-red-500 text-white hover:bg-red-600 transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              )}
              aria-label="Appel d'urgence"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>Appel d'urgence</span>
            </motion.button>

            <motion.button
              onClick={handleLogout}
              className={cn(
                "mobile-touch-target w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg mt-2",
                "text-white/60 hover:text-white hover:bg-white/8 transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              )}
              aria-label="Déconnexion"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Déconnexion</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={toggleSidebar}
        className={cn(
          "hidden md:flex items-center justify-center w-6 h-6 rounded-lg transition-colors",
          "hover:bg-white/5",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
          "absolute -right-3 top-[72px]",
          "bg-background border border-border shadow-lg shadow-black/20"
        )}
        aria-label={collapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
      >
        {collapsed ? (
          <ChevronRight className="w-[22px] h-[22px] text-white hover:text-white" />
        ) : (
          <ChevronLeft className="w-[22px] h-[22px] text-white hover:text-white" />
        )}
      </motion.button>
    </>
  );
}