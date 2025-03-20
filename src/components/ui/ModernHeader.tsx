import { Button } from './Button';
import { Bell, Menu, Phone, MessageCircle, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useStore } from '@/lib/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { OysterLogo } from './OysterLogo';
import { modalAnimation, glassEffectStyle, ProgressBar } from './CommonStyles';

interface ModernHeaderProps {
  onShowMobileMenu: () => void;
  onToggleNotifications: () => void;
  onShowEmergency: () => void;
  onEmergencyClick: () => void;
  onToggleMessages: () => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  onShowMobileMenu,
  onToggleNotifications,
  onShowEmergency,
  onEmergencyClick,
  onToggleMessages,
}) => {
  const { unreadCount } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className="absolute inset-0 flex items-center justify-between px-4 md:px-6 lg:px-8 w-full transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
          boxShadow: "rgba(0, 0, 0, 0.45) 0px 10px 30px -5px, rgba(0, 0, 0, 0.3) 5px 5px 20px -5px, rgba(255, 255, 255, 0.1) 0px -1px 5px 0px inset, rgba(0, 210, 200, 0.25) 0px 0px 20px inset, rgba(0, 0, 0, 0.3) 0px 0px 15px inset",
          height: "92px"
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
          >
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Menu className="h-5 w-5 relative z-10" />
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
          className="absolute left-1/2 cursor-pointer hidden sm:block"
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
                className="flex items-center justify-center relative mx-8"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                style={{ transform: 'translateY(0px)' }}
              >
                <div className="flex flex-col items-center relative">
                  <div style={{ width: '4.5rem', height: '4rem', transform: 'translateX(2px)' }} className="relative flex items-center justify-center">
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

              <motion.span 
                className="text-[4rem] relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  fontFamily: "'TT Modernoir', sans-serif",
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
                  WebkitFontSmoothing: 'antialiased'
                }}
              >
                OYSTER
              </motion.span>

              <motion.span 
                className="text-[4rem] relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
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
                  marginLeft: '1rem'
                }}
              >
                CULT
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute left-1/2 cursor-pointer sm:hidden"
          style={{ transform: 'translate3d(-50%, 2px, 0)' }}
          onClick={handleLogoClick}
          initial={false}
        >
          <motion.div
            className="logo flex flex-col items-center scale-[0.5] origin-center"
            style={{
              willChange: "transform",
              backfaceVisibility: "hidden",
              perspective: "1000px",
              WebkitFontSmoothing: "antialiased"
            }}
          >
            <div className="relative px-0 py-0 flex items-center scale-75">
              <motion.div 
                className="flex items-center justify-center relative mx-8"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                style={{ transform: 'translateY(0px)' }}
              >
                <div className="flex flex-col items-center relative">
                  <div style={{ width: '5rem', height: '5rem', transform: 'translateX(2px)' }} className="relative flex items-center justify-center">
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

              <motion.span 
                className="text-[4rem] relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  fontFamily: "'TT Modernoir', sans-serif",
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
                  WebkitFontSmoothing: 'antialiased'
                }}
              >
                OYSTER
              </motion.span>

              <motion.span 
                className="text-[4rem] relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
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
                  marginLeft: '2rem'
                }}
              >
                CULT
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        <div className="flex items-center space-x-3">
          <button 
            className="
              inline-flex items-center justify-center font-medium rounded-lg transition-colors
              text-white hover:text-white hover:bg-white/20
              px-3 py-2 text-sm
              relative group p-2 md:p-2.5
              will-change-transform
              shadow-lg shadow-white/5
              bg-white/10 backdrop-blur-sm border border-white/10
            "
            onClick={onToggleMessages}
            style={{ transform: 'translate3d(0,0,0)' }}
            aria-label="Messages"
          >
            <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <MessageCircle className="h-5 w-5 relative z-10 text-white" />
          </button>

          <button 
            className="
              inline-flex items-center justify-center font-medium rounded-lg transition-colors
              text-white hover:text-white hover:bg-white/20
              px-3 py-2 text-sm
              relative group p-2 md:p-2.5
              will-change-transform
              shadow-lg shadow-white/5
              bg-white/10 backdrop-blur-sm border border-white/10
            "
            onClick={onToggleNotifications}
            style={{ transform: 'translate3d(0,0,0)' }}
            aria-label="Notifications"
          >
            <div className="absolute inset-0 bg-amber-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Bell className="h-5 w-5 relative z-10 text-white" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-medium z-20 border border-white/30 shadow-lg shadow-red-500/30">
                {unreadCount}
              </span>
            )}
          </button>

          <button 
            className="
              inline-flex items-center justify-center font-medium rounded-full transition-colors
              text-white hover:text-white hover:bg-red-600
              p-2 md:p-2.5
              will-change-transform
              shadow-lg shadow-red-500/30
              bg-red-500 border-2 border-red-400
              relative
              animate-pulse
            "
            onClick={onEmergencyClick}
            style={{ transform: 'translate3d(0,0,0)' }}
            aria-label="Téléphone d'urgence"
          >
            <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse"></div>
            <Phone className="h-5 w-5 text-white" />
          </button>

          <div 
            className="h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" 
            style={{
              transform: 'translate3d(0,0,0)',
              height: 'calc(100% - 16px)',
              marginTop: '8px',
              willChange: 'transform'
            }}
          />

          <button
            className="
              inline-flex items-center justify-center font-medium rounded-lg transition-colors
              text-white hover:text-white hover:bg-white/20
              px-3 py-2 text-sm
              relative group p-2 md:p-2.5
              will-change-transform
              shadow-lg shadow-white/5
              bg-white/10 backdrop-blur-sm border border-white/10
            "
            aria-label="Changer de thème"
          >
            <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Sun className="h-5 w-5 text-amber-300 dark:opacity-0 dark:scale-0 transition-all" />
            <Moon className="absolute h-5 w-5 text-blue-300 opacity-0 scale-0 dark:opacity-100 dark:scale-100 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};