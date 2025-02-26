import React from 'react';
import { motion } from 'framer-motion';

interface ModernControlProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  onChange: (value: number) => void;
}

export function ModernControl({ label, value, icon, onChange }: ModernControlProps) {
  return (
    <div className="bg-brand-surface border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
              {icon}
            </div>
          )}
          <span className="text-white/60 font-medium">{label}</span>
        </div>
        <span className="text-white font-medium">{value}%</span>
      </div>

      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-brand-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.3 }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}