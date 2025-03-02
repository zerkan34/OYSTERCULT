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

interface ModernSidebarProps {
  showMobileMenu: boolean;
  onCloseMobileMenu: () => void;
  onEmergencyClick: () => void;
  onToggleMessages?: () => void;
  onToggleNotifications?: () => void;
}

// Catégories avec leurs couleurs spécifiques
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
  onEmergencyClick,
  onToggleMessages,
  onToggleNotifications
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

  // Gérer l'ouverture/fermeture avec animation fluide
  const toggleSidebar = () => {
    setIsAnimating(true);
    setCollapsed(!collapsed);
    // Reset animation state after completion
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Animation variants for menu items
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

  // Animation variants for sidebar
  const sidebarVariants = {
    expanded: { 
      width: "18rem", // 72 * 4 = 288px equivalent to 18rem
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        mass: 0.8
      }
    },
    collapsed: { 
      width: "5rem", // 80px equivalent to 5rem
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
      width: "85vw", // Utiliser une largeur relative à l'écran sur mobile
      maxWidth: "300px", // Mais avec une taille maximale
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };

  // Animation variants for content fade
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
        className={`
          fixed top-0 left-0 bottom-0 z-50 bg-gradient-to-b from-brand-dark to-brand-dark/95
          border-r border-white/10 shadow-xl shadow-black/40
          overflow-hidden
          ${showMobileMenu ? 'safe-area-inset-bottom' : ''}
        `}
        initial="collapsed"
        animate={
          window.innerWidth >= 1024 
            ? (collapsed ? "collapsed" : "expanded") 
            : (showMobileMenu ? "mobileVisible" : "mobileHidden")
        }
        variants={sidebarVariants}
      >
        <div className="flex flex-col h-full">
          {/* Logo avec effet de lumière */}
          <motion.div 
            className="p-6 flex items-center justify-between border-b border-white/10 relative overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/5 to-transparent opacity-50"></div>
            <AnimatePresence mode="wait">
              {!collapsed ? (
                <motion.div 
                  key="expanded-logo"
                  className="flex items-center justify-between px-4 py-2 relative z-10 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center">
                    <div className="relative z-10">
                      <OysterLogo />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="collapsed-logo" 
                  className="flex items-center justify-center px-2 py-2 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative z-10">
                    <OysterLogo />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              onClick={toggleSidebar}
              className={`
                rounded-lg hidden lg:flex items-center justify-center transition-all duration-300 relative z-10
                ${collapsed ? 
                  "p-3 bg-white hover:bg-white/90 border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.6)]" : 
                  "p-2.5 bg-white/15 hover:bg-white/25 border border-white/20"
                }
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={isAnimating}
              aria-label={collapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
            >
              {collapsed ? (
                <div className="relative flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6A1B31"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-burgundy"
                  >
                    <path d="M9 6l6 6-6 6"></path>
                    <line x1="3" y1="6" x2="3" y2="18"></line>
                  </svg>
                </div>
              ) : (
                <ChevronLeft size={22} className="text-white hover:text-white" />
              )}
            </motion.button>
          </motion.div>

          {/* Navigation avec catégories colorées */}
          <nav className="flex-1 space-y-2 md:space-y-4 p-3 md:p-4 overflow-y-auto custom-scrollbar">
            {navItems.map((group, index) => {
              const categoryStyle = categories[group.category as keyof typeof categories];
              return (
                <motion.div 
                  key={index} 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  onMouseEnter={() => setHoveredCategory(group.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div 
                        className={`px-4 mb-3 relative rounded-lg`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${categoryStyle.color} opacity-0 rounded-lg ${hoveredCategory === group.category ? 'opacity-30' : ''} transition-opacity duration-300`} />
                        <p className={`text-xs font-medium ${categoryStyle.textColor} uppercase tracking-wider relative z-10`}>
                          {group.category}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="space-y-2">
                    {group.items.map((item, itemIndex) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <motion.div
                          key={item.path}
                          custom={itemIndex}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                          onMouseEnter={() => setHoveredItem(item.path)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <Link
                            to={item.path}
                            className={`
                              relative flex items-center px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm
                              transition-all duration-200 ease-in-out overflow-hidden
                              ${isActive
                                ? `bg-white/10 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)] 
                                   ${
                                     categoryStyle.textColor.includes('blue') ? 'shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
                                     categoryStyle.textColor.includes('green') ? 'shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                                     categoryStyle.textColor.includes('purple') ? 'shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 
                                     categoryStyle.textColor.includes('amber') ? 'shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                                     'shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                                   }`
                                : `text-white/70 hover:bg-white/8 hover:text-white hover:shadow-[0_0_8px_rgba(255,255,255,0.07)]
                                   hover:${
                                     categoryStyle.textColor.includes('blue') ? 'shadow-[0_0_6px_rgba(59,130,246,0.4)]' : 
                                     categoryStyle.textColor.includes('green') ? 'shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 
                                     categoryStyle.textColor.includes('purple') ? 'shadow-[0_0_6px_rgba(139,92,246,0.4)]' : 
                                     categoryStyle.textColor.includes('amber') ? 'shadow-[0_0_6px_rgba(245,158,11,0.4)]' : 
                                     'shadow-[0_0_6px_rgba(6,182,212,0.4)]'
                                   }`
                              }
                            `}
                          >
                            {isActive && (
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.3 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                            <div className={`
                              relative z-10 transition-all duration-200
                              ${isActive ? `text-${categoryStyle.textColor.split('-')[1]}` : 'text-white/70 group-hover:text-white'}
                              flex items-center justify-center w-7 h-7 rounded-full
                              ${!isActive && hoveredItem === item.path ? 'shadow-[0_0_5px_rgba(255,255,255,0.4)] filter brightness-110' : ''}
                              transition-all transform hover:scale-110
                            `}>
                              {isActive ? (
                                <motion.div
                                  animate="pulse"
                                  variants={createColorPulse(
                                    categoryStyle.textColor.includes('blue') ? '#3b82f680' : 
                                    categoryStyle.textColor.includes('green') ? '#10b98180' : 
                                    categoryStyle.textColor.includes('purple') ? '#8b5cf680' : 
                                    categoryStyle.textColor.includes('amber') ? '#f59e0b80' : 
                                    '#06b6d480'
                                  )}
                                  className="flex items-center justify-center"
                                >
                                  {collapsed && item.path === '/config' ? null : item.icon}
                                </motion.div>
                              ) : (
                                <div 
                                  className={hoveredItem === item.path ? "animate-pulse" : ""}
                                >
                                  {collapsed && item.path === '/config' ? null : item.icon}
                                </div>
                              )}
                            </div>
                            <AnimatePresence>
                              {!collapsed && (
                                <motion.span 
                                  className={`ml-2 md:ml-3 relative z-10 ${isActive ? 'font-medium' : ''} whitespace-nowrap`}
                                  variants={contentFadeVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                                >
                                  {item.label}
                                </motion.span>
                              )}
                            </AnimatePresence>

                            {/* Infobulle personnalisée et stylisée qui s'affiche uniquement quand la sidebar est réduite */}
                            {collapsed && (
                              <AnimatePresence>
                                {hoveredItem === item.path && (
                                  <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 20 }}
                                    exit={{ opacity: 0, x: 5 }}
                                    transition={{ 
                                      type: "spring",
                                      stiffness: 350,
                                      damping: 25
                                    }}
                                    className={`
                                      absolute left-14 px-4 py-2 rounded-lg z-50
                                      text-sm font-medium whitespace-nowrap
                                      bg-gradient-to-r 
                                      ${categoryStyle.color.replace('/30', '/70').replace('/10', '/40')} 
                                      backdrop-blur-sm border border-white/10
                                      ${
                                        categoryStyle.textColor.includes('blue') ? 'shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
                                        categoryStyle.textColor.includes('green') ? 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                                        categoryStyle.textColor.includes('purple') ? 'shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 
                                        categoryStyle.textColor.includes('amber') ? 'shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                                        'shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                                      }
                                    `}
                                  >
                                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rotate-45"
                                      style={{
                                        background: categoryStyle.textColor.includes('blue') ? 'rgba(59,130,246,0.3)' : 
                                                    categoryStyle.textColor.includes('green') ? 'rgba(16,185,129,0.3)' : 
                                                    categoryStyle.textColor.includes('purple') ? 'rgba(139,92,246,0.3)' : 
                                                    categoryStyle.textColor.includes('amber') ? 'rgba(245,158,11,0.3)' : 
                                                    'rgba(6,182,212,0.3)'
                                      }}
                                    ></div>
                                    <span className={`text-white font-medium`}>{item.label}</span>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            )}
                            {isActive && (
                              <motion.div 
                                className={`absolute left-0 w-1.5 h-8 rounded-r-md`}
                                style={{ 
                                  background: `linear-gradient(to bottom, ${categoryStyle.textColor.includes('blue') ? '#3b82f6' : 
                                    categoryStyle.textColor.includes('green') ? '#10b981' : 
                                    categoryStyle.textColor.includes('purple') ? '#8b5cf6' : 
                                    categoryStyle.textColor.includes('amber') ? '#f59e0b' : 
                                    '#06b6d4'}, transparent)`
                                }}
                                initial={{ height: 0 }}
                                animate={{ height: 24 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer avec effet de relief */}
          <motion.div 
            className="p-4 border-t border-white/10 space-y-2 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50"></div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEmergencyClick}
              className="w-full flex items-center px-4 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-200 relative z-10 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-100 rounded-lg"></div>
              <Phone size={22} className="relative z-10" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    className="ml-3 relative z-10 font-medium"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Urgence
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/8 rounded-lg transition-all duration-200 relative z-10"
            >
              <LogOut size={22} className="relative z-10" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    className="ml-3 relative z-10"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Déconnexion
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <div className="px-4 relative z-10">
              <ThemeToggle />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}