import { Button } from './Button';
import { Bell, Menu, Phone, MessageCircle, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useStore } from '@/lib/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { OysterWavesLogo } from './OysterWavesLogo';
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
            className="logo flex flex-col items-center scale-[0.6] origin-center"
            style={{
              background: "linear-gradient(135deg, rgba(10,30,50,0.3) 0%, rgba(20,100,100,0.2) 100%)",
              backdropFilter: "blur(8px)",
              borderRadius: "1rem",
              padding: "1.5rem 2rem",
              boxShadow: "rgba(0,0,0,0.2) 0px 2px 12px -2px, rgba(0,200,200,0.1) 0px 2px 8px -2px, rgba(255,255,255,0.07) 0px -1px 2px 0px inset, rgba(0,200,200,0.05) 0px 0px 8px 0px inset, rgba(0,0,0,0.1) 0px 0px 4px 0px inset",
              border: "1px solid rgba(255,255,255,0.1)",
              transform: "scale(0.6)",
              willChange: "transform",
              backfaceVisibility: "hidden",
              perspective: "1000px",
              WebkitFontSmoothing: "antialiased"
            }}
          >
            <div className="flex flex-col items-center">
              <motion.span
                className="text-white tracking-wider"
                style={{
                  fontSize: "2rem",
                  fontFamily: '"TT Modernoir", sans-serif',
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  lineHeight: 0.9,
                  display: "block",
                  transform: "translate3d(0, 0, 0)",
                  willChange: "transform",
                  textShadow: "rgba(255,255,255,0.3) 0px 0px 20px, rgba(255,255,255,0.1) 0px 0px 40px",
                  WebkitFontSmoothing: "subpixel-antialiased",
                  backfaceVisibility: "hidden",
                  filter: "drop-shadow(0px 0px 30px rgba(255,255,255,0.2))"
                }}
              >
                O Y S T E R
              </motion.span>
              <motion.span
                className="text-white tracking-wider"
                style={{
                  fontSize: "2rem",
                  fontFamily: '"TT Modernoir", sans-serif',
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  lineHeight: 0.9,
                  display: "block",
                  transform: "translate3d(2.5rem, -0.2rem, 0)",
                  willChange: "transform",
                  textShadow: "rgba(255,255,255,0.3) 0px 0px 20px, rgba(255,255,255,0.1) 0px 0px 40px",
                  WebkitFontSmoothing: "subpixel-antialiased",
                  backfaceVisibility: "hidden",
                  filter: "drop-shadow(0px 0px 30px rgba(255,255,255,0.2))"
                }}
              >
                C&nbsp;&nbsp;U&nbsp;&nbsp;L&nbsp;&nbsp;T
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
              background: "linear-gradient(135deg, rgba(10,30,50,0.3) 0%, rgba(20,100,100,0.2) 100%)",
              backdropFilter: "blur(8px)",
              borderRadius: "1rem",
              padding: "1.5rem 2rem",
              boxShadow: "rgba(0,0,0,0.2) 0px 2px 12px -2px, rgba(0,200,200,0.1) 0px 2px 8px -2px, rgba(255,255,255,0.07) 0px -1px 2px 0px inset, rgba(0,200,200,0.05) 0px 0px 8px 0px inset, rgba(0,0,0,0.1) 0px 0px 4px 0px inset",
              border: "1px solid rgba(255,255,255,0.1)",
              transform: "scale(0.5)",
              willChange: "transform",
              backfaceVisibility: "hidden",
              perspective: "1000px",
              WebkitFontSmoothing: "antialiased"
            }}
          >
            <div className="flex flex-col items-center">
              <motion.span
                className="text-white tracking-wider"
                style={{
                  fontSize: "2rem",
                  fontFamily: '"TT Modernoir", sans-serif',
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  lineHeight: 0.9,
                  display: "block",
                  transform: "translate3d(0, 0, 0)",
                  willChange: "transform",
                  textShadow: "rgba(255,255,255,0.3) 0px 0px 20px, rgba(255,255,255,0.1) 0px 0px 40px",
                  WebkitFontSmoothing: "subpixel-antialiased",
                  backfaceVisibility: "hidden",
                  filter: "drop-shadow(0px 0px 30px rgba(255,255,255,0.2))"
                }}
              >
                O Y S T E R
              </motion.span>
              <motion.span
                className="text-white tracking-wider"
                style={{
                  fontSize: "2rem",
                  fontFamily: '"TT Modernoir", sans-serif',
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  lineHeight: 0.9,
                  display: "block",
                  transform: "translate3d(2.5rem, -0.2rem, 0)",
                  willChange: "transform",
                  textShadow: "rgba(255,255,255,0.3) 0px 0px 20px, rgba(255,255,255,0.1) 0px 0px 40px",
                  WebkitFontSmoothing: "subpixel-antialiased",
                  backfaceVisibility: "hidden",
                  filter: "drop-shadow(0px 0px 30px rgba(255,255,255,0.2))"
                }}
              >
                C&nbsp;&nbsp;U&nbsp;&nbsp;L&nbsp;&nbsp;T
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        <div className="flex items-center space-x-3">
          <button 
            className="
              inline-flex items-center justify-center font-medium rounded-lg transition-colors
              text-white/60 hover:text-white hover:bg-white/10
              px-3 py-2 text-sm
              relative group p-2 md:p-2.5
              will-change-transform
            "
            onClick={onToggleMessages}
            style={{ transform: 'translate3d(0,0,0)' }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <MessageCircle className="h-5 w-5 relative z-10" />
          </button>

          <button 
            className="
              inline-flex items-center justify-center font-medium rounded-lg transition-colors
              text-white/60 hover:text-white hover:bg-white/10
              px-3 py-2 text-sm
              relative group p-2 md:p-2.5
              will-change-transform
            "
            onClick={onToggleNotifications}
            style={{ transform: 'translate3d(0,0,0)' }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Bell className="h-5 w-5 relative z-10" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-medium z-20">
                {unreadCount}
              </span>
            )}
          </button>

          <button 
            className="
              inline-flex items-center justify-center font-medium rounded-lg transition-colors
              text-white/60 hover:text-white hover:bg-white/10
              px-3 py-2 text-sm
              relative group p-2 md:p-2.5
              will-change-transform
            "
            onClick={onEmergencyClick}
            style={{ transform: 'translate3d(0,0,0)' }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Phone className="h-5 w-5 relative z-10" />
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

          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};