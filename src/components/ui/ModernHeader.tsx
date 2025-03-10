import { Button } from './Button';
import { Bell, Menu, Phone, MessageCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useStore } from '@/lib/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { OysterLogo } from './OysterLogo';
import { cn } from '@/lib/utils';

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
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 md:h-16 bg-background/80 backdrop-blur-sm border-b z-50 safe-area-inset-top">
      <div className="h-full flex items-center justify-between px-2 md:px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onShowMobileMenu} 
          className="mobile-touch-target md:mr-2"
          aria-label="Menu principal"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="flex-1 flex items-center justify-between md:justify-end">
          <div className="flex items-center">
            <div 
              className="cursor-pointer flex items-center mobile-touch-target" 
              onClick={handleLogoClick}
              role="button"
              aria-label="Retour au tableau de bord"
            >
              <OysterLogo size={32} withText textPosition="right" className="hidden md:block" />
              <div className="md:hidden flex items-center space-x-2">
                <OysterLogo size={24} />
                <span className="mobile-text-base font-bold tracking-wide text-white">OYSTER CULT</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2">
            <Button 
              data-message-button="true"
              variant="ghost" 
              size="sm"
              onClick={onToggleMessages}
              className={cn(
                "mobile-touch-target hidden md:inline-flex",
                "focus:ring-2 focus:ring-white/20 focus:outline-none"
              )}
              aria-label="Messages"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>

            <Button 
              data-notification-bell="true"
              variant="ghost" 
              size="sm"
              onClick={onToggleNotifications}
              className={cn(
                "mobile-touch-target hidden md:inline-flex",
                "focus:ring-2 focus:ring-white/20 focus:outline-none"
              )}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span 
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[14px] h-3.5 px-1 bg-amber-500 text-white text-[9px] font-bold rounded-full"
                  aria-label={`${unreadCount} notifications non lues`}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={onEmergencyClick}
              className={cn(
                "mobile-touch-target hidden md:inline-flex",
                "focus:ring-2 focus:ring-white/20 focus:outline-none"
              )}
              aria-label="Appel d'urgence"
            >
              <div className="flex items-center justify-center h-8 w-8 bg-red-500 rounded-full">
                <Phone className="h-4 w-4 text-white" />
              </div>
            </Button>

            <div className="relative mobile-touch-target">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}