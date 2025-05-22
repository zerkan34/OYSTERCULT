import { Button } from './Button';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { OysterLogo } from './OysterLogo';
import { modalAnimation, glassEffectStyle, ProgressBar } from './CommonStyles';
import { UserCircle, Waves, Boxes } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Countdown } from './Countdown';
import { LotsEnCoursModal } from './LotsEnCoursModal';

interface ModernHeaderProps {
  onShowMobileMenu: () => void;
  onToggleNotifications: () => void;
  onShowEmergency: () => void;
  onEmergencyClick: () => void;
  onToggleMessages: () => void;
  unreadMessagesCount?: number;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  onShowMobileMenu,
  onToggleNotifications,
  onShowEmergency,
  onEmergencyClick,
  onToggleMessages,
  unreadMessagesCount = 0,
}) => {
  const { unreadCount } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState<string>('/dashboard');
  const [isLotsModalOpen, setIsLotsModalOpen] = useState(false);

  // Mettre à jour le chemin précédent quand on change de page
  useEffect(() => {
    if (location.pathname !== '/profile') {
      setPreviousPath(location.pathname);
    }
  }, [location.pathname]);

  const handleLogoClick = () => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  const handleProfileClick = () => {
    if (location.pathname === '/profile') {
      // Si on est sur la page profile, retourner à la page précédente
      navigate(previousPath);
    } else {
      // Sinon, aller à la page profile
      navigate('/profile');
    }
  };

  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className="absolute inset-0 flex items-center justify-between px-4 md:px-6 lg:px-8 w-full transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(0, 10, 40, 0.97) 0%, rgba(0, 90, 90, 0.95) 100%)",
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 20px -5px, rgba(0, 200, 200, 0.1) 0px 5px 12px -5px, rgba(255, 255, 255, 0.07) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.05) 0px 0px 12px inset, rgba(0, 0, 0, 0.1) 0px 0px 8px inset",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          height: "97px"
        }}
      >
        <div className="w-full h-20 flex items-center justify-between px-4 relative">
          {/* Left section */}
          <div className="flex-1" />

          {/* Logo */}
          <motion.div
            className="flex items-center justify-center flex-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleLogoClick}
          >
            <div className="flex items-center relative py-1.5 px-8 border border-white/20 rounded-lg">
              <motion.div
                className="relative mr-2"
                animate={{ 
                  rotate: [0, 10, -10, 10, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Waves 
                    size={56} 
                    className="text-cyan-400"
                    style={{
                      opacity: 0.9,
                      transform: 'translateY(2px)'
                    }}
                  />
                </motion.div>
              </motion.div>

              <div className="flex items-center">
                {/* OYSTER */}
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span 
                    className="text-6xl tracking-widest"
                    style={{ 
                      fontFamily: "'TT Modernoir', sans-serif",
                      fontWeight: 500,
                      background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.85) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '0.1em',
                      lineHeight: '1'
                    }}
                  >
                    OYSTER
                  </span>
                </motion.div>

                {/* CULT */}
                <motion.div 
                  className="relative ml-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span 
                    className="text-6xl"
                    style={{ 
                      fontFamily: "'TT Modernoir', sans-serif",
                      fontWeight: 300,
                      background: 'linear-gradient(135deg, rgb(34,211,238) 0%, rgb(56,189,248) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: '1'
                    }}
                  >
                    CULT
                  </span>
                </motion.div>
              </div>

              {/* Subtle background effect */}
              <div
                className="absolute inset-0 -z-10 opacity-40"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.08), transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
            </div>
          </motion.div>

          {/* Right section */}
          <div className="flex-1 flex items-center justify-end">
            {/* Timer */}
            <div className="flex items-center -translate-x-1">
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              <motion.div 
                className="flex items-center ml-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Countdown />
              </motion.div>
            </div>

            {/* Boutons de notifications et messagerie */}
            <div className="flex items-center space-x-4 ml-4">
              {/* Bouton Lots en Cours */}
              <button 
                className="
                  inline-flex items-center justify-center font-medium rounded-lg transition-all
                  text-white hover:text-white hover:bg-white/20
                  p-3 relative group
                  will-change-transform
                  shadow-[0_0_15px_rgba(255,255,255,0.3)]
                  border border-white/30 bg-white/10
                  min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40
                "
                onClick={() => setIsLotsModalOpen(true)}
                aria-label="Lots en cours"
                title="Lots en cours"
                style={{ transform: 'translate3d(0,0,0)' }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Boxes className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200" aria-hidden="true" />
              </button>
              <button 
                className="
                  inline-flex items-center justify-center font-medium rounded-lg transition-all
                  text-white hover:text-white hover:bg-white/20
                  p-3 relative group
                  will-change-transform
                  shadow-[0_0_15px_rgba(255,255,255,0.3)]
                  border border-white/30 bg-white/10
                "
                onClick={handleProfileClick}
                aria-label={location.pathname === '/profile' ? "Retour à la page précédente" : "Mon espace"}
                style={{ transform: 'translate3d(0,0,0)' }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <UserCircle 
                  size={26} 
                  className={location.pathname === '/profile' ? 'text-cyan-400' : 'text-white'}
                />
              </button>

              <button 
                className="
                  inline-flex items-center justify-center font-medium rounded-lg transition-all
                  text-white hover:text-white hover:bg-white/20
                  p-3 relative group
                  will-change-transform
                  shadow-[0_0_15px_rgba(255,255,255,0.3)]
                  border border-white/30 bg-white/10
                "
                onClick={onToggleMessages}
                aria-label="Afficher les messages"
                style={{ transform: 'translate3d(0,0,0)' }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-messages-square">
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                </svg>
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(0,210,255,0.5),0_0_5px_rgba(0,0,0,0.3)_inset] min-w-[20px] min-h-[20px]">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              <button 
                className="
                  inline-flex items-center justify-center font-medium rounded-lg transition-all
                  text-white hover:text-white hover:bg-white/20
                  p-3 relative group
                  will-change-transform
                  shadow-[0_0_15px_rgba(255,255,255,0.3)]
                  border border-white/30 bg-white/10
                "
                onClick={onToggleNotifications}
                aria-label="Afficher les notifications"
                style={{ transform: 'translate3d(0,0,0)' }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white shadow-[0_0_10px_rgba(0,210,255,0.5)]">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Modal Lots en Cours */}
    <LotsEnCoursModal
      isOpen={isLotsModalOpen}
      onClose={() => setIsLotsModalOpen(false)}
      onMarkAsRead={(id) => console.log('Marquer comme lu:', id)}
      onMarkAllAsRead={() => console.log('Tout marquer comme lu')}
      onToggleImportant={(id) => console.log('Marquer comme important:', id)}
    />
    </>
  );
};