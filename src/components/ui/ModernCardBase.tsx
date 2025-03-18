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
        "border border-white/10 rounded-lg overflow-hidden",
        className
      )}
      style={{
        background: "linear-gradient(135deg, rgba(0, 20, 40, 0.98) 0%, rgba(0, 80, 80, 0.95) 100%)",
        WebkitBackdropFilter: "blur(20px)",
        backdropFilter: "blur(20px)",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px, rgba(0, 180, 180, 0.1) 0px 0px 10px inset"
      }}
      {...props}
    >
      {children}
    </div>
  );
}
