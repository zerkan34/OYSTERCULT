import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-sm text-white/60">{description}</p>
        )}
      </div>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
