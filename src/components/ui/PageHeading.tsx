import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeadingProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const PageHeading: React.FC<PageHeadingProps> = ({ 
  title, 
  description, 
  icon, 
  actions 
}) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row md:items-center justify-between mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        {icon && (
          <div className="mr-4 p-2 rounded-lg bg-white/5 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight" id="page-title">{title}</h1>
          {description && (
            <p className="text-gray-400 mt-1 max-w-2xl">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="mt-4 md:mt-0 flex space-x-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </motion.div>
  );
};

export default PageHeading;
