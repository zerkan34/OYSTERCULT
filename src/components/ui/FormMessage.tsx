import React from 'react';
import { cn } from '@/lib/utils';

interface FormMessageProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({ 
  children, 
  className,
  id
}) => {
  return (
    <p 
      id={id}
      className={cn('text-sm text-red-500 mt-1', className)}
      role="alert"
      aria-live="polite"
    >
      {children}
    </p>
  );
};
