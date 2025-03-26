import React from 'react';
import { motion } from 'framer-motion';

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300 ${className}`}
    >
      <div className="relative z-10">
        {children}
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg -z-10" />
      </div>
    </motion.div>
  );
};
