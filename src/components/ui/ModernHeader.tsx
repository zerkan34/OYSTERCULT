import { Button } from './Button';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { OysterLogo } from './OysterLogo';
import { modalAnimation, glassEffectStyle, ProgressBar } from './CommonStyles';
import { UserCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

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
    <div className="fixed top-0 left-0 right-0 z-50 hidden md:block">
      <div
        className="absolute inset-0 flex items-center justify-between px-4 md:px-6 lg:px-8 w-full transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
          boxShadow: "rgba(0, 0, 0, 0.45) 0px 10px 30px -5px, rgba(0, 0, 0, 0.3) 5px 5px 20px -5px, rgba(255, 255, 255, 0.1) 0px -1px 5px 0px inset, rgba(0, 210, 200, 0.25) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset",
          height: "97px"
        }}
      >
        <div className="flex items-center h-full">
          <button 
            className="
              inline-flex items-center justify-center font-medium rounded-lg transition-colors
              text-white/60 hover:text-white hover:bg-white/10
              p-2.5 relative group
              will-change-transform
            "
            onClick={onShowMobileMenu}
            style={{ transform: 'translate3d(0,0,0)' }}
            aria-label="Ouvrir le menu"
          >
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Remplacement des vagues par 3 traits horizontaux */}
            <div style={{ width: '24px', height: '24px' }} className="relative flex flex-col justify-center gap-2">
              <div className="h-0.5 w-6 bg-current rounded-full"></div>
              <div className="h-0.5 w-6 bg-current rounded-full"></div>
              <div className="h-0.5 w-6 bg-current rounded-full"></div>
            </div>
          </button>
          <div 
            className="h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent ml-2 hidden md:block" 
            style={{
              transform: 'translate3d(0,0,0)',
              height: 'calc(100% - 16px)',
              marginTop: '8px',
              willChange: 'transform'
            }}
          />
        </div>

        <motion.div
          className="cursor-pointer hidden sm:block"
          style={{ textAlign: 'center' }}
          onClick={handleLogoClick}
          initial={false}
        >
          <motion.div
            className="logo flex flex-col items-center"
            style={{
              willChange: "transform",
              backfaceVisibility: "hidden",
              perspective: "1000px",
              WebkitFontSmoothing: "antialiased"
            }}
          >
            <div className="relative px-0 py-0 flex items-center">
              <motion.div 
                className="flex items-center justify-center relative mx-8"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                style={{ transform: 'translateY(0px)' }}
              >
                <div className="flex flex-col items-center relative">
                  <div style={{ width: '4.5rem', height: '4rem', transform: 'translateX(2px)' }} className="relative flex items-center justify-center">
                    {/* Logo sans vagues */}
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-row items-center space-x-2 relative">
                <motion.span 
                  className="text-[4rem] relative header-title"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    fontFamily: "'TT Modernoir', sans-serif",
                    fontWeight: 300,
                    letterSpacing: '0.08em',
                    display: 'block',
                    color: 'white',
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    WebkitFontSmoothing: 'antialiased',
                    whiteSpace: 'nowrap'
                  }}
                >
                  OYSTER
                </motion.span>

                <motion.div 
                  className="text-[2rem] absolute header-title"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'relative',
                    top: '0px',
                    left: '5px',
                    display: 'inline-block',
                    marginLeft: '0.2em'
                  }}
                >
                  {/* Fond blanc */}
                  <div 
                    className="absolute bg-white rounded border-2 border-white"
                    style={{
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2), inset 0 -1px 2px rgba(255,255,255,0.4), 0 0 15px rgba(255, 255, 255, 0.2)",
                      transform: "translateZ(0)",
                      zIndex: 0,
                      top: "10px",
                      bottom: "10px",
                      left: 0,
                      right: 0
                    }}
                  />
                  
                  {/* Texte au-dessus */}
                  <div
                    style={{
                      fontFamily: "'TT Modernoir', sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      willChange: "transform",
                      WebkitFontSmoothing: 'antialiased',
                      whiteSpace: 'nowrap',
                      padding: "0.15rem 0.6rem",
                      position: "relative",
                      zIndex: 1,
                      background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      textShadow: "0px 1px 2px rgba(0,0,0,0.2)",
                      filter: "drop-shadow(0px -1px 1px rgba(255,255,255,0.3)) drop-shadow(0px 1px 1px rgba(0,0,0,0.15))",
                      transform: "translateY(8px) scale(1.6)",
                      transformOrigin: "center",
                      fontStretch: "ultra-expanded",
                      fontSize: "3.5rem",
                      mixBlendMode: "multiply"
                    }}
                  >
                    <span style={{ marginRight: "0.02em", fontStretch: "200%", display: "inline-block", transform: "scaleX(1.25) translateZ(-2px)", fontWeight: 600, fontSize: "1em" }}>C</span>
                    <span style={{ marginRight: "0.02em", fontStretch: "200%", display: "inline-block", transform: "scaleX(1.25) translateZ(-2px)", fontWeight: 600, fontSize: "1em" }}>U</span>
                    <span style={{ marginRight: "0.02em", fontStretch: "200%", display: "inline-block", transform: "scaleX(1.25) translateZ(-2px)", fontWeight: 600, fontSize: "1em" }}>L</span>
                    <span style={{ fontStretch: "200%", display: "inline-block", transform: "scaleX(1.25) translateZ(-2px)", fontWeight: 600, fontSize: "1em" }}>T</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Version mobile du logo */}
        <motion.div
          className="absolute left-1/2 cursor-pointer sm:hidden"
          style={{ transform: 'translate3d(-50%, 2px, 0)' }}
          onClick={handleLogoClick}
          initial={false}
        >
          <motion.div
            className="logo flex flex-col items-center"
            style={{
              willChange: "transform",
              backfaceVisibility: "hidden",
              perspective: "1000px",
              WebkitFontSmoothing: "antialiased"
            }}
          >
            <div className="relative px-0 py-0 flex items-center">
              <motion.div 
                className="flex items-center justify-center relative mx-2"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                style={{ transform: 'translateY(0px)' }}
              >
                <div className="flex flex-col items-center relative">
                  <div style={{ width: '2.5rem', height: '2.5rem', transform: 'translateX(1px)' }} className="relative flex items-center justify-center">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                      filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.4))',
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
                </div>
              </motion.div>

              <div className="flex flex-row items-center space-x-2">
                <motion.span 
                  className="text-[2rem] relative header-title"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    fontFamily: "'TT Modernoir', sans-serif",
                    fontWeight: 200,
                    letterSpacing: '0.08em',
                    display: 'block',
                    color: 'white',
                    textShadow: 'rgba(0,0,0,0.5) 0px 2px 10px',
                    filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.4))',
                    opacity: 1,
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    WebkitFontSmoothing: 'antialiased',
                    whiteSpace: 'nowrap',
                    lineHeight: 1
                  }}
                >
                  OYSTER
                </motion.span>

                <motion.span 
                  className="text-[2rem] relative header-title"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: "'TT Modernoir', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                    display: "block",
                    color: 'white',
                    textShadow: 'rgba(0,0,0,0.5) 0px 2px 10px',
                    filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.4))',
                    opacity: 1,
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    transform: 'translate3d(0, 45px, 0)',
                    WebkitFontSmoothing: 'antialiased',
                    whiteSpace: 'nowrap',
                    lineHeight: 1
                  }}
                >
                  CULT
                </motion.span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="flex items-center">
          {/* Boutons de notifications et messagerie */}
          <div className="flex items-center space-x-4">
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
  );
};