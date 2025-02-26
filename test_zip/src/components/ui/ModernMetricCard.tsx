import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export function ModernMetricCard({
  icon,
  label,
  value,
  unit,
  trend
}: MetricCardProps) {
  return (
    <motion.div
      className="bg-brand-surface border border-white/10 rounded-2xl p-6 hover:bg-brand-surface-light transition-all duration-300"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        {trend && (
          <span className={`px-3 py-1 rounded-full text-sm ${
            trend.positive 
              ? 'bg-green-500/20 text-green-300' 
              : 'bg-red-500/20 text-red-300'
          }`}>
            {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      
      <div className="mt-6">
        <div className="text-2xl font-bold text-white">
          {value}
          {unit && <span className="text-lg text-white/60 ml-1">{unit}</span>}
        </div>
        <div className="text-sm text-white/60 mt-1">{label}</div>
      </div>
    </motion.div>
  );
}