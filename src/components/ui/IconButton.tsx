import React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  label,
  icon,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-brand-primary))]";
  
  const variantStyles = {
    default: "bg-[rgb(var(--color-brand-primary))] text-white hover:bg-[rgb(var(--color-brand-primary-hover))]",
    ghost: "bg-transparent hover:bg-[rgb(var(--color-brand-surface-hover))]",
    outline: "border border-[rgb(var(--color-border))] bg-transparent hover:bg-[rgb(var(--color-brand-surface-hover))]"
  };
  
  const sizeStyles = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3"
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
};
