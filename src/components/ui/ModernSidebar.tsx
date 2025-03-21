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
  MessageCircle,
  Phone as LucidePhone
} from 'lucide-react';
import { useStore } from '@/lib/store';
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
  isOpen: boolean;
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
  isOpen, 
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
          fixed top-0 left-0 bottom-0 z-50
          border-r border-white/10 shadow-xl shadow-black/40
          overflow-hidden
          ${showMobileMenu ? 'safe-area-inset-bottom' : ''}
        `}
        style={{
          background: "linear-gradient(135deg, rgba(0, 10, 40, 0.97) 0%, rgba(0, 90, 90, 0.95) 100%)",
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
          boxShadow: "rgba(0, 0, 0, 0.45) 10px 0px 30px -5px, rgba(255, 255, 255, 0.1) 0px -1px 5px 0px inset, rgba(0, 180, 180, 0.15) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset, rgba(255, 255, 255, 0.1) 0px 0px 8px",
          borderRight: "none",
          zIndex: 60,
          width: collapsed ? "72px" : "260px",
          willChange: "transform",
          transform: "translate3d(0,0,0)"
        }}
        initial="collapsed"
        animate={
          showMobileMenu 
            ? "mobileVisible" 
            : collapsed 
              ? "collapsed" 
              : "expanded"
        }
        variants={sidebarVariants}
      >
        <div className="flex flex-col h-full">
          {/* Logo avec effet de lumière */}
          <motion.div 
            className="py-6 flex items-center justify-between border-b-2 border-cyan-500/20 relative overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/5 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
            <AnimatePresence mode="wait">
              {!collapsed ? (
                <motion.div 
                  key="expanded-logo"
                  className="flex items-center justify-between px-6 py-2 relative z-10 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center">
                    <div className="relative z-10">
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="collapsed-logo" 
                  className="flex items-center justify-center px-2 py-2 relative z-10 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              onClick={toggleSidebar}
              className={`
                rounded-lg hidden lg:flex items-center justify-center transition-all duration-300 relative z-10
                ${collapsed ? 
                  "p-2.5 bg-white/15 hover:bg-white/25 border border-white/20" : 
                  "p-2.5 bg-white/15 hover:bg-white/25 border border-white/20"
                }
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={isAnimating}
              aria-label={collapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
            >
              {collapsed ? (
                <ChevronRight className="w-[22px] h-[22px] text-white hover:text-white" />
              ) : (
                <ChevronLeft className="w-[22px] h-[22px] text-white hover:text-white" />
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
                              ${isActive ? 'text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]' : 'text-white/70 hover:bg-white/8 hover:text-white hover:shadow-[0_0_8px_rgba(255,255,255,0.07)]'}
                            `}
                            style={{
                              background: isActive 
                                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)"
                                : "linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)",
                              boxShadow: isActive
                                ? "rgba(0, 0, 0, 0.3) 0px 4px 8px 0px, rgba(255, 255, 255, 0.2) 0px 1px 2px 0px inset, rgba(0, 180, 180, 0.15) 0px 0px 20px inset, rgba(0, 0, 0, 0.4) 0px 2px 4px inset, rgba(255, 255, 255, 0.1) 0px 0px 8px"
                                : "rgba(0, 0, 0, 0.25) 0px 3px 6px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px inset",
                              border: "none",
                              transform: isActive ? "translateY(-1px)" : "none",
                              willChange: "transform"
                            }}
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
                                  {item.icon}
                                </motion.div>
                              ) : (
                                <div 
                                  className={hoveredItem === item.path ? "animate-pulse" : ""}
                                >
                                  {item.icon}
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
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-50"></div>
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
            className="p-4 pt-2 border-t border-white/10 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50"></div>
            <div className="mt-6 px-3">
              <motion.button
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={onEmergencyClick}
                className="
                  flex items-center justify-center px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white transition-all duration-200
                  relative group animate-pulse
                "
                style={{
                  background: "linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(185, 28, 28, 0.85) 100%)",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 10px, rgba(255, 255, 255, 0.2) 0px 1px 3px inset, rgba(0, 0, 0, 0.3) 0px 2px 5px inset, rgba(255, 255, 255, 0.1) 0px 0px 10px",
                  border: "none",
                  transform: "translate3d(0,0,0)"
                }}
                aria-label="Appel d'urgence"
              >
                <div className="absolute inset-0 bg-red-500/30 rounded-lg animate-[pulse_2s_ease-in-out_infinite]"></div>
                <LucidePhone className="w-4 h-4 mr-2 relative z-10" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span 
                      className="font-medium relative z-10 whitespace-nowrap"
                      variants={contentFadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      Appel d'urgence
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="
                flex items-center justify-center px-4 py-2.5 rounded-lg text-sm text-white transition-all duration-200
                relative group
              "
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 10px, rgba(255, 255, 255, 0.2) 0px 1px 3px inset, rgba(0, 0, 0, 0.3) 0px 2px 5px inset, rgba(255, 255, 255, 0.1) 0px 0px 10px",
                border: "none"
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
                transition={{ duration: 0.2 }}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out w-4 h-4 mr-2 text-white/90 drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    className={`ml-2 relative z-10 ${false ? 'font-medium' : ''} whitespace-nowrap`}
                    variants={contentFadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
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