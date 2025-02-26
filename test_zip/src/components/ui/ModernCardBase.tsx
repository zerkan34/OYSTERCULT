import React from 'react';
import { cn } from '@/lib/utils';

interface ModernCardBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function ModernCardBase({ children, className, ...props }: ModernCardBaseProps) {
  return (
    <div 
      className={cn(
        "bg-brand-dark border border-white/10 rounded-lg overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
