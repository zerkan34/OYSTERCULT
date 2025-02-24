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

interface ModernActionCardProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'tertiary';
}

export function ModernActionCard({ 
  icon, 
  label, 
  active = false, 
  onClick,
  color = 'primary'
}: ModernActionCardProps) {
  const colors = colorVariants[color];

  return (
    <motion.button
      onClick={onClick}
      className={`w-full glass-effect rounded-xl p-6 text-left transition-all duration-300 group hover:glass-effect-hover ${
        active ? colors.border : 'border-[rgb(var(--color-border)_/_var(--color-border-opacity))]'
      }`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className={`w-12 h-12 rounded-xl ${active ? colors.bg : 'bg-[rgb(var(--color-background-hover)_/_var(--color-background-hover-opacity))]'} flex items-center justify-center relative group-hover:${colors.shadow} transition-all duration-300`}>
          <div className={active ? colors.text : 'text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] group-hover:text-[rgb(var(--color-text))] transition-colors duration-300'}>
            {icon}
          </div>
        </div>
        
        <span className={`text-sm font-medium ${
          active ? 'text-[rgb(var(--color-text))]' : 'text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] group-hover:text-[rgb(var(--color-text))]'
        } transition-colors duration-300`}>
          {label}
        </span>
      </div>
    </motion.button>
  );
}

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
            <div className={colors.text}>
              {icon}
            </div>
          </div>

          {/* Trend indicator */}
          {trend && (
            <div className={`px-2 py-1 rounded-lg text-sm ${
              trend.positive 
                ? 'bg-[rgb(var(--color-brand-primary)_/_0.1)] text-[rgb(var(--color-brand-primary))]' 
                : 'bg-[rgb(var(--color-brand-secondary)_/_0.1)] text-[rgb(var(--color-brand-secondary))]'
            }`}>
              {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
            </div>
          )}
        </div>

        {/* Value and label */}
        <div className="mt-4">
          <div className={`${sizes.valueSize} font-bold text-[rgb(var(--color-text))] group-hover:text-gradient-primary transition-all duration-300`}>
            {value}
          </div>
          <div className={`${sizes.labelSize} text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))] group-hover:text-[rgb(var(--color-text)_/_var(--color-text-opacity-secondary))] transition-colors duration-300`}>
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

// Add the missing components
export function ModernDeviceCard({
  icon,
  name,
  description,
  status = 'active',
  metrics = [],
  onToggle,
  onSettings
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  status?: 'active' | 'inactive' | 'warning';
  metrics?: Array<{ label: string; value: string | number; unit?: string }>;
  onToggle?: () => void;
  onSettings?: () => void;
}) {
  return (
    <motion.div
      className="glass-effect rounded-xl p-6 hover:glass-effect-hover"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-brand-burgundy/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{name}</h3>
            <p className="text-sm text-white/60">{description}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          status === 'active' ? 'bg-green-500/20 text-green-300' :
          status === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
          'bg-red-500/20 text-red-300'
        }`}>
          {status === 'active' ? 'Actif' :
           status === 'warning' ? 'Attention' : 'Inactif'}
        </div>
      </div>

      {metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <div className="text-sm text-white/60">{metric.label}</div>
              <div className="text-lg font-medium text-white">
                {metric.value}{metric.unit && ` ${metric.unit}`}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex space-x-3 mt-6">
        {onToggle && (
          <button
            onClick={onToggle}
            className="flex-1 px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
          >
            {status === 'active' ? 'Désactiver' : 'Activer'}
          </button>
        )}
        {onSettings && (
          <button
            onClick={onSettings}
            className="px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            Paramètres
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function ModernZoneCard({
  name,
  icon,
  devices,
  status = 'optimal',
  onClick
}: {
  name: string;
  icon: React.ReactNode;
  devices: number;
  status?: 'optimal' | 'warning' | 'critical';
  onClick?: () => void;
}) {
  return (
    <motion.div
      onClick={onClick}
      className={`glass-effect rounded-xl p-6 cursor-pointer hover:glass-effect-hover ${
        status === 'optimal' ? 'border-green-500/20' :
        status === 'warning' ? 'border-yellow-500/20' :
        'border-red-500/20'
      }`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-brand-burgundy/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{name}</h3>
            <p className="text-sm text-white/60">{devices} appareils</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          status === 'optimal' ? 'bg-green-500' :
          status === 'warning' ? 'bg-yellow-500' :
          'bg-red-500'
        }`} />
      </div>

      <div className="mt-4">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              status === 'optimal' ? 'bg-green-500' :
              status === 'warning' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: '70%' }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}