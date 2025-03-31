import React from 'react';
import { motion } from 'framer-motion';

const slideInVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

interface PageTitleProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
}

export function PageTitle({ icon, title, className }: PageTitleProps) {
  return (
    <motion.div 
      variants={slideInVariants}
      className={`flex items-center mb-8 mt-6 ${className}`}
    >
      <div className="relative mr-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,128,128,0.9)] to-[rgba(0,160,160,0.7)] blur-xl opacity-70 rounded-full"></div>
        <div className="relative z-10 p-3 rounded-full bg-gradient-to-br from-[rgba(0,128,128,0.3)] to-[rgba(0,60,100,0.3)] shadow-[rgba(0,0,0,0.3)_0px_5px_15px,rgba(0,210,200,0.15)_0px_0px_10px_inset]">
          {icon}
        </div>
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
        {title}
      </h1>
    </motion.div>
  );
}
