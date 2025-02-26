import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  action?: React.ReactNode;
  showArrow?: boolean;
}

export function ModernCard({
  title,
  description,
  footer,
  action,
  showArrow = false,
  className,
  children,
  ...props
}: ModernCardProps) {
  return (
    <div
      className={className}
      {...props}
    >
      {(title || description || action) && (
        <div className="p-6 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h3 className="font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
          {showArrow && (
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      )}
      {children && <div className="p-6 pt-0">{children}</div>}
      {footer && (
        <div className="p-6 pt-0 flex items-center">{footer}</div>
      )}
    </div>
  );
}