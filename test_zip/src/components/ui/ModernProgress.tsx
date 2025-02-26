import React from 'react';
import { motion } from 'framer-motion';

interface ModernProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary';
  label?: string;
}

const colorVariants = {
  primary: {
    bg: 'bg-brand-primary/20',
    fill: 'bg-brand-primary',
    text: 'text-brand-primary',
    shadow: 'shadow-neon'
  },
  secondary: {
    bg: 'bg-brand-secondary/20',
    fill: 'bg-brand-secondary',
    text: 'text-brand-secondary',
    shadow: 'shadow-[0_0_20px_rgba(255,51,102,0.35)]'
  },
  tertiary: {
    bg: 'bg-brand-tertiary/20',
    fill: 'bg-brand-tertiary',
    text: 'text-brand-tertiary',
    shadow: 'shadow-[0_0_20px_rgba(112,0,255,0.35)]'
  }
};

const sizeVariants = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
};

export function ModernProgress({
  value,
  max = 100,
  size = 'md',
  showValue = false,
  color = 'primary',
  label
}: ModernProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = colorVariants[color];
  const height = sizeVariants[size];

  return (
    <div className="space-y-2">
      {(showValue || label) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm text-white/60">{label}</span>
          )}
          {showValue && (
            <div className={`text-sm font-medium ${colors.text}`}>
              {value}/{max}
            </div>
          )}
        </div>
      )}
      
      <div className={`w-full ${colors.bg} rounded-full ${height} relative overflow-hidden group`}>
        <motion.div
          className={`absolute inset-y-0 left-0 ${colors.fill} rounded-full transition-all duration-300 group-hover:${colors.shadow}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}