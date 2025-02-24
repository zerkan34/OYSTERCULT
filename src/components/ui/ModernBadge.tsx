import React from 'react';
import { motion } from 'framer-motion';

interface ModernBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export function ModernBadge({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon 
}: ModernBadgeProps) {
  const variants = {
    default: 'bg-brand-surface text-white/80',
    success: 'bg-green-500/20 text-green-300',
    warning: 'bg-yellow-500/20 text-yellow-300',
    error: 'bg-red-500/20 text-red-300',
    info: 'bg-blue-500/20 text-blue-300'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <motion.span
      className={`inline-flex items-center rounded-full ${variants[variant]} ${sizes[size]}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </motion.span>
  );
}