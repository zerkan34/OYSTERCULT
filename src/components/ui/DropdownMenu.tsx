import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`relative inline-block text-left ${className}`}>
      {children}
    </div>
  );
};

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ 
  children,
  className = '',
  asChild = false
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'end' | 'center';
  sideOffset?: number;
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ 
  children,
  className = '',
  align = 'end',
  sideOffset = 4
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Ajoutons un petit délai pour que le menu ait le temps de s'ouvrir
    setTimeout(() => {
      setIsOpen(true);
    }, 50);

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Base styles
  const baseStyles = "z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-700 bg-slate-800 p-1 shadow-md";
  
  // Align styles
  const alignStyles = {
    start: "origin-top-left left-0",
    center: "origin-top left-1/2 transform -translate-x-1/2",
    end: "origin-top-right right-0"
  };

  return isOpen ? (
    <div 
      ref={ref}
      className={`absolute mt-${sideOffset} ${alignStyles[align]} ${baseStyles} ${className}`}
      style={{ top: `${sideOffset * 4}px` }}
      role="menu"
      aria-orientation="vertical"
    >
      {children}
    </div>
  ) : null;
};

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ 
  children,
  className = '',
  onClick,
  disabled = false,
  role = "menuitem",
  ...props
}) => {
  const baseStyles = "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

  return (
    <div 
      className={`${baseStyles} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
      data-disabled={disabled}
      role={role}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled ? "true" : undefined}
      {...props}
    >
      {children}
    </div>
  );
};
