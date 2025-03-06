import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-white hover:bg-brand-primary/90",
        secondary: "bg-white/10 text-white hover:bg-white/20",
        outline: "border border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 rounded-md px-3 py-1.5 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // If there's no aria-label, try to use the title or the content as a fallback
    const ensureAccessibility = () => {
      if (!props['aria-label'] && !props.title && typeof props.children === 'string') {
        return {
          ...props,
          title: props.children
        };
      }
      return props;
    };
    
    const accessibleProps = ensureAccessibility();
    
    return (
      <Comp
        className={`${buttonVariants({ variant, size, className })} ${fullWidth ? 'w-full' : ''} focus:outline-none focus:ring-2 focus:ring-white/30`}
        ref={ref}
        {...accessibleProps}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
