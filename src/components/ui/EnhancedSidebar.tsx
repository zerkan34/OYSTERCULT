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
  Shell,
  X,
  Camera
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

// Animation des pulsations avec optimisation des performances
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

// Fonction pour créer des pulsations de couleur optimisées
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

interface EnhancedSidebarProps {
  showMobileMenu: boolean;
  onCloseMobileMenu: () => void;
  onEmergencyClick: () => void;
  onToggleMessages: () => void;
  onToggleNotifications: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: JSX.Element;
  notifications?: number;
  color?: string;
  highlight?: boolean;
  ariaLabel?: string;
}

interface NavGroup {
  category: string;
  items: NavItem[];
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
  "Surveillance": {
    color: "from-red-500/30 to-red-600/10",
    textColor: "text-red-300"
  }
};

const navItems: NavGroup[] = [
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
      },
      { 
        path: '/analyses', 
        label: 'Analyses', 
        icon: <Shell size={22} />,
        highlight: true,
        color: "#0d9488" // Couleur teal pour les huîtres
      }
    ]
  },
  {
    category: "Gestion des stocks",
    items: [
      { 
        path: '/stocks', 
        label: 'Stocks', 
        icon: <Package size={22} />,
        notifications: 1
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
        icon: <ShoppingCart size={22} />,
        color: "#3b82f6" // Bleu signature
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
        icon: <Calculator size={22} />,
        notifications: 2,
        color: "rgb(160, 38, 72)" // Burgundy
      },
      { 
        path: '/hr', 
        label: 'Gestion RH', 
        icon: <Users size={22} />,
        notifications: 2,
        color: "rgb(160, 38, 72)" // Burgundy
      },
      { 
        path: '/digital-vault', 
        label: 'Coffre fort numérique', 
        icon: <Lock size={22} />,
        color: "rgb(56, 189, 248)" // Bleu
      }
    ]
  },
  {
    category: "Surveillance",
    items: [
      { 
        path: '/surveillance', 
        label: 'Surveillance', 
        icon: <Camera size={22} />,
        ariaLabel: "Accéder à la surveillance vidéo"
      }
    ]
  }
];

export function EnhancedSidebar({ 
  showMobileMenu, 
  onCloseMobileMenu,
  onEmergencyClick,
  onToggleMessages,
  onToggleNotifications
}: EnhancedSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSession } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Marquer la fin du premier rendu
  useEffect(() => {
    // Attendre que le composant soit monté et rendu
    const timer = setTimeout(() => {
      setIsFirstRender(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Fermer le menu lors des changements de page si la résolution est entre 1024px et 1690px
  // useEffect(() => {
  //   const width = window.innerWidth;
  //   // Uniquement pour les résolutions entre 1024px et 1690px
  //   if (width >= 1024 && width <= 1690) {
  //     setCollapsed(true);
  //   }
  //   // Ne rien faire pour les résolutions > 1690px, préserver le choix de l'utilisateur
  // }, [location.pathname]);

  // Détecter les changements de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      setIsMobile(newIsMobile);
      
      // Si on passe du mode mobile au mode desktop, réinitialiser l'état collapsed
      if (isMobile && !newIsMobile) {
        setCollapsed(false);
        setIsAnimating(false);
        // Fermer le menu mobile si ouvert
        if (showMobileMenu) {
          onCloseMobileMenu();
        }
      }
      
      // Pour les résolutions entre 1024px et 1690px, fermer automatiquement le menu
      // const width = window.innerWidth;
      // if (width >= 1024 && width <= 1690) {
      //   setCollapsed(true);
      // }
    };

    window.addEventListener('resize', handleResize);
    
    // Exécuter une fois au chargement
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, showMobileMenu, onCloseMobileMenu]);

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

  // Animation variants for menu items - optimized for performance
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20, overflow: "hidden", whiteSpace: "nowrap" },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      overflow: "visible",
      whiteSpace: "nowrap",
      transition: {
        delay: i * 0.03 + 0.1,
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    })
  };

  // Animation variants for category titles
  const categoryVariants = {
    hidden: { opacity: 0, x: -20, overflow: "hidden", whiteSpace: "nowrap" },
    visible: { 
      opacity: 1, 
      x: 0,
      overflow: "visible",
      whiteSpace: "nowrap",
      transition: { 
        opacity: { duration: 0.3 },
        x: { duration: 0.2, type: "spring", stiffness: 300 }
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      overflow: "hidden",
      whiteSpace: "nowrap",
      transition: { 
        opacity: { duration: 0.2 },
        x: { duration: 0.2 }
      }
    }
  };

  // Animation variants for sidebar - using transform instead of width/height
  const sidebarVariants = {
    expanded: { 
      width: "260px",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30
      }
    },
    collapsed: { 
      width: "90px", // Augmenter la largeur pour que les icônes soient entièrement visibles
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30
      }
    },
    mobileHidden: {
      transform: "translateX(-100%)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    mobileVisible: {
      transform: "translateX(0)",
      width: "85vw", // Utiliser une largeur relative à l'écran sur mobile
      maxWidth: window.innerWidth < 468 ? "100%" : "300px", // Mais avec une taille maximale
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };

  // Animation variants for content fade - optimized
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
          fixed inset-0 z-40 backdrop-blur-sm bg-black/50 lg:hidden
          ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          transition-opacity duration-300
        `}
        onClick={onCloseMobileMenu}
      />

      <motion.div 
        className={`
          fixed inset-y-0 left-0 z-50 overflow-x-hidden
          transition-all duration-300 ease-in-out rounded-tr-3xl rounded-br-3xl
          ${isMobile ? 'hidden lg:block' : ''}
          sidebar-auto-collapse
        `}
        initial={isFirstRender ? false : true}
        animate={collapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ 
          background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
          boxShadow: "rgba(0, 0, 0, 0.45) 10px 0px 30px -5px, rgba(0, 0, 0, 0.3) 5px 5px 20px -5px, rgba(255, 255, 255, 0.15) 0px -1px 5px 0px inset, rgba(0, 210, 200, 0.25) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset",
          borderRight: "none",
          zIndex: 60
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo avec effet de lumière */}
          <motion.div 
            className="p-6 flex items-center justify-between border-b border-white/10 relative overflow-hidden"
            initial={{ opacity: 0, transform: "translateY(-10px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
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
                      {/* Logo removed as requested */}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="collapsed-logo" 
                  className="flex items-center justify-center w-full py-2 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                </motion.div>
              )}
            </AnimatePresence>
            <div className={`flex justify-center ${collapsed ? 'w-full' : ''}`}>
              <motion.button
                onClick={toggleSidebar}
                className={`
                  rounded-lg lg:flex items-center justify-center transition-all duration-300 relative z-10
                  ${collapsed ? 
                    "p-2.5 bg-white/15 hover:bg-white/25 border border-white/20" : 
                    "p-2.5 bg-white/15 hover:bg-white/25 border border-white/20"
                  }
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating || isMobile}
                aria-label={collapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
                style={{ display: isMobile ? 'none' : '' }}
              >
                <div className="flex items-center">
                  {collapsed ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Navigation avec catégories colorées */}
          <nav className="flex-1 space-y-2 md:space-y-4 p-3 md:p-4 overflow-y-auto custom-scrollbar">
            {navItems.map((group, index) => {
              const categoryStyle = categories[group.category as keyof typeof categories];
              return (
                <motion.div 
                  key={index} 
                  className="mb-8"
                  initial={{ opacity: 0, transform: "translateY(20px)" }}
                  animate={{ opacity: 1, transform: "translateY(0)" }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  onMouseEnter={() => setHoveredCategory(group.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div 
                        className={`px-4 mb-3 relative rounded-lg overflow-hidden`}
                        initial={isFirstRender ? { opacity: 1, x: 0 } : "hidden"}
                        animate="visible"
                        exit="exit"
                        variants={categoryVariants}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${categoryStyle.color} opacity-0 rounded-lg ${hoveredCategory === group.category ? 'opacity-30' : ''} transition-opacity duration-300`} />
                        <p className={`text-xs font-medium ${categoryStyle.textColor} uppercase tracking-wider relative z-10 whitespace-nowrap`}>
                          {group.category}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="space-y-2">
                    {group.items.map((item, itemIndex) => {
                      const isActive = location.pathname === item.path;
                      const itemColor = item.color || 
                        (categoryStyle.textColor.includes('blue') ? '#3b82f6' : 
                         categoryStyle.textColor.includes('green') ? '#10b981' : 
                         categoryStyle.textColor.includes('purple') ? '#8b5cf6' : 
                         categoryStyle.textColor.includes('amber') ? '#f59e0b' : 
                         '#06b6d4');
                      
                      return (
                        <motion.div
                          key={item.path}
                          custom={itemIndex}
                          variants={menuItemVariants}
                          initial={isFirstRender ? { opacity: 1, x: 0 } : "hidden"}
                          animate="visible"
                          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                          onMouseEnter={() => setHoveredItem(item.path)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <Link
                            to={item.path}
                            className={`
                              relative flex items-center ${collapsed ? 'justify-center' : ''} px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm
                              transition-all duration-200 ease-in-out overflow-hidden
                              ${isActive
                                ? `bg-white/10 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]`
                                : `text-white/70 hover:bg-white/8 hover:text-white hover:shadow-[0_0_8px_rgba(255,255,255,0.07)]`
                              }
                            `}
                            style={{
                              background: isActive 
                                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)" 
                                : "linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)",
                              boxShadow: isActive 
                                ? "rgba(0, 0, 0, 0.3) 0px 4px 8px 0px, rgba(255, 255, 255, 0.2) 0px 1px 2px 0px inset, rgba(0, 0, 0, 0.5) 0px 2px 4px inset, rgba(255, 255, 255, 0.1) 0px 0px 8px" 
                                : "rgba(0, 0, 0, 0.25) 0px 3px 6px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px inset",
                              border: "none",
                              transform: isActive ? "translateY(-1px)" : "none"
                            }}
                          >
                            <div 
                              className={`
                                relative z-10 transition-all duration-200
                                flex items-center justify-center w-7 h-7 rounded-full
                                ${collapsed ? 'mx-auto' : 'mr-3'}
                                ${isActive 
                                  ? 'bg-white/15 text-white' 
                                  : 'text-white/70 group-hover:text-white'
                                }
                              `}
                              style={{
                                boxShadow: isActive 
                                  ? "rgba(0, 0, 0, 0.3) 0px 2px 4px 0px, rgba(255, 255, 255, 0.2) 0px 1px 2px 0px inset" 
                                  : "none"
                              }}
                            >
                              {item.icon && React.cloneElement(item.icon, {
                                className: `${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`,
                                style: {
                                  color: isActive ? itemColor : '',
                                  filter: isActive ? 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' : ''
                                }
                              })}
                            </div>
                            <AnimatePresence>
                              {!collapsed && (
                                <motion.div className="flex-1 flex items-center justify-between">
                                  <motion.span 
                                    className={`ml-2 md:ml-3 relative z-10 ${isActive ? 'font-medium' : ''} whitespace-nowrap`}
                                    variants={contentFadeVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                  >
                                    {item.label}
                                  </motion.span>
                                  
                                  {/* Badge de notification */}
                                  {item.notifications > 0 && (
                                    <div className="ml-auto min-w-[20px] h-[20px] rounded-full bg-gradient-to-r from-[#00D1FF] to-[#0047FF] flex items-center justify-center text-xs font-medium text-white shadow-lg">
                                      {item.notifications}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Infobulle personnalisée et stylisée qui s'affiche uniquement quand la sidebar est réduite */}
                            {collapsed && (
                              <AnimatePresence>
                                {hoveredItem === item.path && (
                                  <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className={`
                                      absolute left-14 px-4 py-2 rounded-lg z-50
                                      text-sm font-medium whitespace-nowrap
                                      bg-gradient-to-r 
                                      ${categoryStyle.color.replace('/30', '/70').replace('/10', '/40')} 
                                      backdrop-blur-sm border border-white/10
                                    `}
                                    style={item.color ? {
                                      boxShadow: `0 0 10px ${item.color}50`,
                                      background: `linear-gradient(to right, ${item.color}30, ${item.color}05)`
                                    } : {}}
                                  >
                                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rotate-45"
                                      style={{
                                        background: item.color ? `${item.color}30` : 
                                                    categoryStyle.textColor.includes('blue') ? 'rgba(59,130,246,0.3)' : 
                                                    categoryStyle.textColor.includes('green') ? 'rgba(16,185,129,0.3)' : 
                                                    categoryStyle.textColor.includes('purple') ? 'rgba(139,92,246,0.3)' : 
                                                    categoryStyle.textColor.includes('amber') ? 'rgba(245,158,11,0.3)' : 
                                                    'rgba(6,182,212,0.3)'
                                      }}
                                    ></div>
                                    <div className="flex items-center">
                                      <span className="text-white font-medium">{item.label}</span>
                                      {item.notifications > 0 && (
                                        <div className="ml-2 min-w-[20px] h-[20px] rounded-full bg-gradient-to-r from-[#00D1FF] to-[#0047FF] flex items-center justify-center text-xs font-medium text-white shadow-lg">
                                          {item.notifications}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            )}
                            
                            {/* Indicateur coloré pour l'item actif */}
                            {isActive && (
                              <motion.div 
                                className="absolute left-0 w-1.5 h-8 rounded-r-md"
                                style={{ 
                                  background: `linear-gradient(to bottom, ${item.color || 
                                    (categoryStyle.textColor.includes('blue') ? '#3b82f6' : 
                                    categoryStyle.textColor.includes('green') ? '#10b981' : 
                                    categoryStyle.textColor.includes('purple') ? '#8b5cf6' : 
                                    categoryStyle.textColor.includes('amber') ? '#f59e0b' : 
                                    '#06b6d4')}, transparent)`
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
            className="p-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {/* Boutons d'action */}
            <div className="flex flex-col space-y-3">
              {/* Bouton d'urgence */}
              <motion.button
                onClick={onEmergencyClick}
                className={`
                  flex items-center ${collapsed ? 'justify-center' : ''} px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm
                  transition-all duration-200 ease-in-out overflow-hidden
                  relative group w-full
                `}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(185, 28, 28, 0.85) 100%)",
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.35), inset 0 1px 3px rgba(255, 255, 255, 0.2)",
                }}
                aria-label="Appel d'urgence"
              >
                <div className={`
                  relative z-10 transition-all duration-200
                  flex items-center justify-center w-7 h-7 rounded-full
                  ${collapsed ? 'mx-auto' : 'mr-3'}
                  bg-white/15 text-white
                `}>
                  <Phone className="w-4 h-4" />
                </div>
                {!collapsed && <span className="font-medium">Appel d'urgence</span>}
              </motion.button>

              {/* Bouton de déconnexion */}
              <motion.button 
                onClick={handleLogout}
                className={`
                  flex items-center ${collapsed ? 'justify-center' : ''} px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm
                  transition-all duration-200 ease-in-out overflow-hidden
                  bg-white/10 hover:bg-white/15 text-white/80 hover:text-white w-full
                `}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Se déconnecter"
              >
                <div className={`
                  relative z-10 transition-all duration-200
                  flex items-center justify-center w-7 h-7 rounded-full
                  ${collapsed ? 'mx-auto' : 'mr-3'}
                  text-white/70 group-hover:text-white
                `}>
                  <LogOut className="w-4 h-4" />
                </div>
                {!collapsed && <span className="font-medium">Déconnexion</span>}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed inset-0 z-50 bg-black/70 lg:hidden"
          style={{
            WebkitBackdropFilter: "blur(8px)",
            backdropFilter: "blur(8px)"
          }}
        >
          <div className="absolute inset-y-0 left-0 w-full">
            <motion.div 
              className="h-full overflow-y-auto rounded-tr-3xl rounded-br-3xl"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              style={{ 
                background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
                WebkitBackdropFilter: "blur(20px)",
                backdropFilter: "blur(20px)",
                boxShadow: "rgba(0, 0, 0, 0.45) 10px 0px 30px -5px, rgba(0, 0, 0, 0.3) 5px 5px 20px -5px, rgba(255, 255, 255, 0.15) 0px -1px 5px 0px inset, rgba(0, 210, 200, 0.25) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset",
                borderRight: "none",
                zIndex: 60,
                width: window.innerWidth < 468 ? "100%" : undefined
              }}
            >
              {/* Contenu de la sidebar mobile */}
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                  <div className="text-white flex items-center">
                    <span 
                      style={{
                        fontFamily: '"TT Modernoir", sans-serif',
                        fontWeight: 200,
                        letterSpacing: '0.08em',
                        display: 'block',
                        color: 'white',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.2), 0 0 80px rgba(255,255,255,0.1)',
                        filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.4))',
                        opacity: 1,
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        WebkitFontSmoothing: 'antialiased',
                        whiteSpace: 'nowrap',
                        fontSize: '1.5rem'
                      }}
                    >
                      OYSTER
                    </span>
                    <span 
                      style={{
                        fontFamily: '"TT Modernoir", sans-serif',
                        fontWeight: 400,
                        letterSpacing: "0.1em",
                        display: "block",
                        color: 'white',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.2), 0 0 80px rgba(255,255,255,0.1)',
                        filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.4))',
                        opacity: 1,
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        transform: 'translateZ(0)',
                        WebkitFontSmoothing: 'antialiased',
                        marginLeft: '0.5rem',
                        whiteSpace: 'nowrap',
                        fontSize: '1.5rem'
                      }}
                    >
                      CULT
                    </span>
                  </div>
                  <button 
                    onClick={onCloseMobileMenu} 
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white flex items-center justify-center"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                  {navItems.map((group, index) => (
                    <div key={index} className="mb-6">
                      <p className="text-xs font-medium text-white/70 uppercase tracking-wider px-4 mb-2">
                        {group.category}
                      </p>
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const isActive = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`
                                flex items-center px-4 py-3 rounded-lg text-sm
                                ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}
                              `}
                              onClick={onCloseMobileMenu}
                            >
                              {item.icon && React.cloneElement(item.icon, {
                                className: 'w-5 h-5 mr-3'
                              })}
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
                
                {/* Bouton d'urgence */}
                <div className="p-4 pt-2 border-t border-white/10 space-y-3">
                  <button
                    onClick={() => {
                      onEmergencyClick();
                      onCloseMobileMenu();
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 bg-red-600 rounded-lg text-white"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    <span>Appel d'urgence</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-3 bg-white/10 rounded-lg text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default EnhancedSidebar;
