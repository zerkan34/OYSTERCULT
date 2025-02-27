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
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="container h-full flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onShowMobileMenu}>
          <Menu className="h-4 w-4" />
        </Button>

        <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer" onClick={handleLogoClick}>
          <OysterLogo size={32} withText textPosition="right" />
        </div>

        <div className="flex items-center mr-[-1rem]">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleMessages}
            className="relative group"
            data-message-button="true"
          >
            <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Mail className="h-4 w-4 text-cyan-500 drop-shadow-[0_0_3px_rgba(6,182,212,0.5)]" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleNotifications}
            className="relative group"
            data-notification-bell="true"
          >
            <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bell className="h-4 w-4 text-blue-500 drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEmergencyClick}
            className="relative"
          >
            <div className="absolute inset-0 bg-red-500/30 rounded-full blur-lg" />
            <div className="relative flex items-center justify-center h-8 w-8 bg-red-500 rounded-full">
              <Phone className="h-4 w-4 text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]" />
            </div>
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