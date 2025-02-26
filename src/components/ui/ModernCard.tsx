import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Award } from 'lucide-react';

interface ModernCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  status?: 'active' | 'inactive' | 'warning';
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'tertiary';
}

const colorVariants = {
  primary: {
    bg: 'bg-[rgb(var(--color-brand-primary)_/_0.1)]',
    border: 'border-[rgb(var(--color-brand-primary)_/_0.2)]',
    text: 'text-[rgb(var(--color-brand-primary))]',
    shadow: 'shadow-neon'
  },
  secondary: {
    bg: 'bg-[rgb(var(--color-brand-secondary)_/_0.1)]',
    border: 'border-[rgb(var(--color-brand-secondary)_/_0.2)]',
    text: 'text-[rgb(var(--color-brand-secondary))]',
    shadow: 'shadow-[0_0_20px_rgba(255,51,102,0.35)]'
  },
  tertiary: {
    bg: 'bg-[rgb(var(--color-brand-tertiary)_/_0.1)]',
    border: 'border-[rgb(var(--color-brand-tertiary)_/_0.2)]',
    text: 'text-[rgb(var(--color-brand-tertiary))]',
    shadow: 'shadow-[0_0_20px_rgba(112,0,255,0.35)]'
  }
};

export function ModernCard({ 
  icon, 
  title, 
  subtitle, 
  status = 'active',
  onClick,
  color = 'primary'
}: ModernCardProps) {
  const colors = colorVariants[color];

  return (
    <motion.button
      onClick={onClick}
      className="w-full glass-effect rounded-xl p-6 text-left transition-all duration-300 group hover:glass-effect-hover"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-16 h-16 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center relative group-hover:${colors.shadow} transition-all duration-300`}>
          <div className={colors.text}>
            {icon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-[rgb(var(--color-text))] group-hover:text-gradient-primary transition-all duration-300">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] group-hover:text-[rgb(var(--color-text)_/_var(--color-text-opacity-secondary))] transition-colors duration-300">
              {subtitle}
            </p>
          )}
        </div>

        <ChevronRight 
          size={20} 
          className={`${colors.text} transform transition-transform duration-300 group-hover:translate-x-1`}
        />
      </div>
    </motion.button>
  );
}