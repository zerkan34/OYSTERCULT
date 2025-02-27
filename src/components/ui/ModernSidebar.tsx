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
  Mail
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { OysterLogo } from './OysterLogo';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

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
        path: '/sales', 
        label: 'Ventes', 
        icon: <DollarSign size={22} />
      },
      { 
        path: '/purchases', 
        label: 'Commandes', 
        icon: <ShoppingCart size={22} />
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

  const handleLogout = () => {
    setSession(null);
    navigate('/auth');
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
          transform transition-all duration-300 lg:translate-x-0
          ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'lg:w-20' : 'lg:w-72'}
        `}
        initial={{ x: -280 }}
        animate={{ 
          x: showMobileMenu || window.innerWidth >= 1024 ? 0 : -280,
          width: collapsed && window.innerWidth >= 1024 ? 80 : 288
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
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
            {!collapsed && (
              <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
                <OysterLogo />
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/10 rounded-lg hidden lg:block transition-colors relative z-10"
            >
              {collapsed ? 
                <ChevronRight size={20} className="text-white/60 hover:text-white" /> :
                <ChevronLeft size={20} className="text-white/60 hover:text-white" />
              }
            </button>
            {!collapsed && (
              <div className="absolute right-4 flex space-x-2 z-10">
                <button 
                  className="p-1.5 rounded-full hover:bg-white/10 transition-all duration-200 hover:shadow-[0_0_8px_rgba(255,255,255,0.15)]"
                  onClick={onToggleMessages}
                  data-message-button="true"
                >
                  <Mail size={16} className="text-white/60 hover:text-white transition-colors" />
                </button>
                <button 
                  className="p-1.5 rounded-full hover:bg-white/10 transition-all duration-200 hover:shadow-[0_0_8px_rgba(255,255,255,0.15)]"
                  onClick={onToggleNotifications}
                  data-notification-bell="true"
                >
                  <Bell size={16} className="text-white/60 hover:text-white transition-colors" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Navigation avec catégories colorées */}
          <nav className="flex-1 space-y-4 p-4 overflow-y-auto">
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
                  {!collapsed && (
                    <motion.div 
                      className={`px-4 mb-3 relative rounded-lg`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${categoryStyle.color} opacity-0 rounded-lg ${hoveredCategory === group.category ? 'opacity-30' : ''} transition-opacity duration-300`} />
                      <p className={`text-xs font-medium ${categoryStyle.textColor} uppercase tracking-wider relative z-10`}>
                        {group.category}
                      </p>
                    </motion.div>
                  )}
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
                        >
                          <Link
                            to={item.path}
                            className={`
                              relative flex items-center px-4 py-3 rounded-lg text-sm
                              transition-all duration-200 ease-in-out overflow-hidden
                              ${isActive
                                ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                                : 'text-white/70 hover:bg-white/8 hover:text-white hover:shadow-[0_0_8px_rgba(255,255,255,0.07)]'
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
                              relative z-10 transition-transform duration-200
                              ${isActive ? `text-${categoryStyle.textColor.split('-')[1]}` : 'text-white/70 group-hover:text-white'}
                            `}>
                              {item.icon}
                            </div>
                            {!collapsed && (
                              <span className={`ml-3 relative z-10 ${isActive ? 'font-medium' : ''}`}>
                                {item.label}
                              </span>
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
              {!collapsed && <span className="ml-3 relative z-10 font-medium">Urgence</span>}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/8 rounded-lg transition-all duration-200 relative z-10"
            >
              <LogOut size={22} className="relative z-10" />
              {!collapsed && <span className="ml-3 relative z-10">Déconnexion</span>}
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