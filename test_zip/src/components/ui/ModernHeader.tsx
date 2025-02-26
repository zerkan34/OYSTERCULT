import { Button } from './Button';
import { Bell, Menu, Phone } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

interface ModernHeaderProps {
  onShowMobileMenu: () => void;
  onShowNotifications: () => void;
  onShowEmergency: () => void;
  onEmergencyClick: () => void;
}

export function ModernHeader({
  onShowMobileMenu,
  onShowNotifications,
  onShowEmergency,
  onEmergencyClick,
}: ModernHeaderProps) {
  const { unreadCount } = useStore();
  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate('/network', { state: { activeTab: 'messages' } });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="container h-full flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onShowMobileMenu}>
          <Menu className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onShowNotifications}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={onEmergencyClick}>
            <Phone className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}