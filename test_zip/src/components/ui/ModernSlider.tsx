import React from 'react';
import { motion } from 'framer-motion';

interface ModernSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
}

export function ModernSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  icon
}: ModernSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-brand-accent">{icon}</span>}
          <span className="text-sm text-white/60">{label}</span>
        </div>
        <span className="text-sm font-medium text-white">{value}%</span>
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
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}