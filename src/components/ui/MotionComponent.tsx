import React from 'react';
import { motion } from 'framer-motion';

interface MotionComponentProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MotionComponent({ children, className = '', onClick }: MotionComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 90, 90, 0.95) 0%, rgba(0, 10, 40, 0.97) 100%)',
        backdropFilter: 'blur(20px)'
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
