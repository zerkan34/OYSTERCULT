import { Button } from './Button';
import { Bell, Menu, Phone, Mail } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useStore } from '@/lib/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { OysterLogo } from './OysterLogo';

interface ModernHeaderProps {
  onShowMobileMenu: () => void;
  onToggleNotifications: () => void;
  onShowEmergency: () => void;
  onEmergencyClick: () => void;
  onToggleMessages: () => void;
}

export function ModernHeader({
  onShowMobileMenu,
  onToggleNotifications,
  onShowEmergency,
  onEmergencyClick,
  onToggleMessages,
}: ModernHeaderProps) {
  const { unreadCount } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    // Ne navigue vers le dashboard que si on n'est pas déjà sur cette page
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 md:h-16 bg-background/80 backdrop-blur-sm border-b z-50 safe-area-inset-top">
      <div className="container h-full flex items-center justify-between px-2 md:px-4">
        <Button variant="ghost" size="sm" onClick={onShowMobileMenu} className="md:mr-2">
          <Menu className="h-4 w-4" />
        </Button>

        <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer hidden sm:block" onClick={handleLogoClick}>
          <OysterLogo size={32} withText textPosition="right" />
        </div>
        
        {/* Logo pour mobile uniquement */}
        <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer sm:hidden" onClick={handleLogoClick}>
          <OysterLogo size={26} />
        </div>

        <div className="flex items-center mr-[-0.5rem] md:mr-[-1rem] space-x-1 md:space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleNotifications}
            className="relative group p-1.5 md:p-2"
          >
            <div className="absolute inset-0 bg-amber-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bell className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500 drop-shadow-[0_0_3px_rgba(245,158,11,0.5)]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[14px] h-3.5 px-1 bg-amber-500 text-white text-[9px] font-bold rounded-full shadow-lg shadow-amber-900/20">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEmergencyClick}
            className="relative group p-1.5 md:p-2"
          >
            <div className="absolute inset-0 bg-red-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-500 drop-shadow-[0_0_3px_rgba(239,68,68,0.5)]" />
          </Button>

          <div className="relative group">
            <div className="absolute inset-0 bg-blue-800/50 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-1 relative z-10">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}