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
  X
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
        badge: "Nouveau"
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
        icon: <Calculator size={22} />
      },
      { 
        path: '/hr', 
        label: 'Gestion RH', 
        icon: <Users size={22} />,
        badge: "2 tâches",
        color: "rgb(160, 38, 72)" // Burgundy
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
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.03 + 0.1,
        duration: 0.3
      }
    })
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
      width: "72px",
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
      maxWidth: "300px", // Mais avec une taille maximale
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
          hidden lg:block fixed inset-y-0 left-0 z-[60] overflow-x-hidden
          transition-all duration-300 ease-in-out rounded-tr-3xl rounded-br-3xl
        `}
        initial="collapsed"
        animate={
          window.innerWidth >= 1024 
            ? (collapsed ? "collapsed" : "expanded") 
            : (showMobileMenu ? "mobileVisible" : "mobileHidden")
        }
        variants={sidebarVariants}
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
                  className="flex items-center justify-center px-2 py-2 relative z-10"
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
              <div className="flex items-center">
                <div style={{ width: '30px', height: '30px', marginRight: '6px' }}>
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                    filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.4))',
                    opacity: 1,
                    width: '100%',
                    height: '100%'
                  }}>
                    <path d="M15 20 Q25 12, 35 20 T55 20 T75 20 T95 20" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
                    <path d="M15 40 Q25 32, 35 40 T55 40 T75 40 T95 40" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
                    <path d="M15 60 Q25 52, 35 60 T55 60 T75 60 T95 60" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
                    <path d="M15 80 Q25 72, 35 80 T55 80 T75 80 T95 80" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
                  </svg>
                </div>
                
                {collapsed ? (
                  <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M2 11H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M16 3L22 11L16 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M22 11H2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M8 3L2 11L8 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
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
                  initial={{ opacity: 0, transform: "translateY(20px)" }}
                  animate={{ opacity: 1, transform: "translateY(0)" }}
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
                                ${item.highlight ? 'bg-[#0d9488] bg-opacity-20' : ''}
                                ${!isActive && hoveredItem === item.path ? 'shadow-[0_0_5px_rgba(255,255,255,0.4)] filter brightness-110' : ''}
                                transform hover:scale-110
                              `}
                              style={{ color: item.color || '' }}
                            >
                              {isActive ? (
                                <motion.div
                                  animate="pulse"
                                  variants={createColorPulse(itemColor + '80')}
                                  className="flex items-center justify-center"
                                >
                                  {item.icon}
                                </motion.div>
                              ) : (
                                <div className={hoveredItem === item.path ? "animate-pulse" : ""}>
                                  {item.icon}
                                </div>
                              )}
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
                                  {item.badge && (
                                    <motion.span
                                      className="ml-auto bg-brand-burgundy text-white text-xs px-2 py-1 rounded-full"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                      {item.badge}
                                    </motion.span>
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
                                      {item.badge && (
                                        <span className="ml-2 bg-brand-burgundy text-white text-xs px-2 py-0.5 rounded-full">
                                          {item.badge}
                                        </span>
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
            className="p-4 border-t border-white/10 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {/* Bouton d'urgence */}
            <motion.button
              onClick={onEmergencyClick}
              className={`
                flex items-center justify-center px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white transition-all duration-200
                relative group
              `}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97, y: 0 }}
              style={{
                background: "linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(185, 28, 28, 0.85) 100%)",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.35), inset 0 1px 3px rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.3) 0px 2px 5px inset, rgba(255, 255, 255, 0.1) 0px 0px 10px",
                border: "none"
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              {!collapsed && <span>Appel d'urgence</span>}
            </motion.button>

            {/* Actions flottantes (visible uniquement en mode déplié) */}
            {!collapsed && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {onToggleMessages && (
                    <motion.button 
                      onClick={onToggleMessages}
                      className="p-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Messages"
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                    </motion.button>
                  )}
                  
                  {onToggleNotifications && (
                    <motion.button 
                      onClick={onToggleNotifications}
                      className="p-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Notifications"
                    >
                      <Bell className="w-5 h-5 text-white" />
                    </motion.button>
                  )}
                </div>
                
                <motion.button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-white/80 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            )}
            
            {/* Bouton de déconnexion (visible uniquement en mode replié) */}
            {collapsed && (
              <motion.button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-white/80 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            )}
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
          <div className="absolute inset-y-0 left-0 w-full max-w-xs">
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
                zIndex: 60
              }}
            >
              {/* Contenu de la sidebar mobile */}
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                  <div className="text-white font-medium">Menu</div>
                  <button 
                    onClick={onCloseMobileMenu}
                    className="p-2 rounded-lg bg-white/10"
                    aria-label="Fermer le menu"
                  >
                    <X size={18} />
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
                              <div className="mr-3">{item.icon}</div>
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
                
                {/* Bouton d'urgence */}
                <div className="p-4 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      onEmergencyClick();
                      onCloseMobileMenu();
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 bg-red-600 rounded-lg text-white mb-4"
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
