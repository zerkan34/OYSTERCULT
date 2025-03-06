import React from 'react';
import { motion } from 'framer-motion';

interface ModernStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
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
    padding: 'p-3 md:p-4',
    iconSize: 'w-8 h-8 md:w-10 md:h-10',
    valueSize: 'text-xl md:text-2xl',
    labelSize: 'text-xs md:text-sm'
  },
  md: {
    padding: 'p-4 md:p-6',
    iconSize: 'w-10 h-10 md:w-12 md:h-12',
    valueSize: 'text-2xl md:text-3xl',
    labelSize: 'text-sm md:text-base'
  },
  lg: {
    padding: 'p-5 md:p-8',
    iconSize: 'w-12 h-12 md:w-14 md:h-14',
    valueSize: 'text-3xl md:text-4xl',
    labelSize: 'text-base md:text-lg'
  }
};

export function ModernStatCard({
  icon,
  label,
  value,
  unit,
  trend,
  color = 'primary',
  size = 'md'
}: ModernStatCardProps) {
  const colors = colorVariants[color];
  const sizes = sizeVariants[size];
  const cardId = `stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const trendText = trend ? `${trend.positive ? 'Augmentation' : 'Diminution'} de ${Math.abs(trend.value)}%` : '';
  const fullValueText = unit ? `${value} ${unit}` : `${value}`;

  return (
    <motion.div
      className={`relative glass-effect rounded-xl ${sizes.padding} group hover:glass-effect-hover touch-manipulation`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      role="region"
      aria-labelledby={cardId}
    >
      {/* Background glow effect */}
      <div 
        className={`absolute inset-0 ${colors.bg} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} 
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          {/* Icon container with glow */}
          <div 
            className={`${sizes.iconSize} rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center group-hover:${colors.shadow} transition-all duration-300`}
            aria-hidden="true"
          >
            <div className={`${colors.text}`}>
              {icon}
            </div>
          </div>

          {/* Trend indicator */}
          {trend && (
            <div 
              className={`flex items-center ${trend.positive ? 'text-green-500' : 'text-red-500'} text-xs md:text-sm font-medium`}
              aria-live="polite"
              aria-label={trendText}
            >
              <span className="mr-1" aria-hidden="true">{trend.positive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 
            id={cardId}
            className={`${sizes.valueSize} font-bold text-white tracking-tight`}
          >
            {fullValueText}
            {unit && <span className="sr-only">{` ${unit}`}</span>}
          </h3>
          <p className={`${sizes.labelSize} text-gray-300 mt-1 font-medium`}>{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ModernStatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      role="group"
      aria-label="Statistiques clés"
    >
      {children}
    </div>
  );
}