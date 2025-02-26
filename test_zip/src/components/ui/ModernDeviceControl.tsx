import { Button } from './Button';
import { Power } from 'lucide-react';

interface DeviceControlProps {
  name: string;
  icon?: React.ReactNode;
  onToggle?: () => void;
  isActive?: boolean;
}

export function ModernDeviceControl({
  name,
  icon = <Power className="h-4 w-4" />,
  onToggle,
  isActive = false,
}: DeviceControlProps) {
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      size="sm"
      onClick={onToggle}
      className="w-full justify-start"
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-2">{name}</span>
      </div>
    </Button>
  );
}