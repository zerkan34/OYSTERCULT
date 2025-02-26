import React from 'react';
import { motion } from 'framer-motion';

interface ModernStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
}

const colorVariants = {
  primary: {
    bg: 'bg-brand-primary/10',
    border: 'border-brand-primary/20',
    text: 'text-brand-primary',
    shadow: 'shadow-neon'
  },
  secondary: {
    bg: 'bg-brand-secondary/10',
    border: 'border-brand-secondary/20',
    text: 'text-brand-secondary',
    shadow: 'shadow-[0_0_20px_rgba(255,51,102,0.35)]'
  },
  tertiary: {
    bg: 'bg-brand-tertiary/10',
    border: 'border-brand-tertiary/20',
    text: 'text-brand-tertiary',
    shadow: 'shadow-[0_0_20px_rgba(112,0,255,0.35)]'
  }
};

const sizeVariants = {
  sm: {
    padding: 'p-4',
    iconSize: 'w-10 h-10',
    valueSize: 'text-2xl',
    labelSize: 'text-sm'
  },
  md: {
    padding: 'p-6',
    iconSize: 'w-12 h-12',
    valueSize: 'text-3xl',
    labelSize: 'text-base'
  },
  lg: {
    padding: 'p-8',
    iconSize: 'w-14 h-14',
    valueSize: 'text-4xl',
    labelSize: 'text-lg'
  }
};

export function ModernStatCard({
  icon,
  label,
  value,
  trend,
  color = 'primary',
  size = 'md'
}: ModernStatCardProps) {
  const colors = colorVariants[color];
  const sizes = sizeVariants[size];

  return (
    <motion.div
      className={`relative glass-effect rounded-xl ${sizes.padding} group hover:glass-effect-hover`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 ${colors.bg} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          {/* Icon container with glow */}
          <div className={`${sizes.iconSize} rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center group-hover:${colors.shadow} transition-all duration-300`}>
            <div className={`${colors.text}`}>
              {icon}
            </div>
          </div>

          {/* Trend indicator */}
          {trend && (
            <div className={`px-2 py-1 rounded-lg text-sm ${
              trend.positive 
                ? 'bg-brand-primary/10 text-brand-primary' 
                : 'bg-brand-secondary/10 text-brand-secondary'
            }`}>
              {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
            </div>
          )}
        </div>

        {/* Value and label */}
        <div className="mt-4">
          <div className={`${sizes.valueSize} font-bold text-white group-hover:text-gradient-primary transition-all duration-300`}>
            {value}
          </div>
          <div className={`${sizes.labelSize} text-white/60 group-hover:text-white/80 transition-colors duration-300`}>
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ModernStatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
}