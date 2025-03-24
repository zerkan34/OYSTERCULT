import React, { ReactNode, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  noPadding?: boolean;
  fullWidth?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', noPadding, fullWidth, ...props }, ref) => {
    // Define basic card styles
    const baseStyles = "rounded-lg backdrop-blur-sm bg-black/40 border transition-all duration-200";
    
    // Apply different styles based on variant
    const variantStyles = {
      default: "border-white/10",
      outlined: "border-white/20 shadow-sm",
      elevated: "border-white/10 shadow-lg",
    };
    
    // Handle padding
    const paddingStyles = noPadding ? "p-0" : "p-6";
    
    // Handle width
    const widthStyles = fullWidth ? "w-full" : "";
    
    // Handle focus and hover states for accessibility
    const interactionStyles = "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50";
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles,
          widthStyles,
          interactionStyles,
          className
        )}
        {...props}
        whileHover={{ scale: 1.005 }}
        transition={{ 
          type: "spring", 
          duration: 0.3,
          // Respect user preference for reduced motion
          ...props.transition
        }}
        style={{
          // Add vendor prefixes for backdrop-filter for cross-browser support
          WebkitBackdropFilter: "blur(8px)",
          ...props.style
        }}
        tabIndex={props.tabIndex || 0}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn("text-xl font-semibold text-white mb-1", className)}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return (
    <p className={cn("text-sm text-gray-400", className)}>
      {children}
    </p>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn("py-2", className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={cn("flex items-center justify-end mt-4 pt-4 border-t border-white/10", className)}>
      {children}
    </div>
  );
};

export default Card;
