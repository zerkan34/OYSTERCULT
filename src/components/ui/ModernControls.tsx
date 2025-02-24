import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Home, Search, Grid, User } from 'lucide-react';

interface ControlProps {
  label: string;
  value: number | boolean;
  onChange: (value: any) => void;
  type: 'slider' | 'toggle';
  icon?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
}

export function ModernControl({ label, value, onChange, type, icon, min = 0, max = 100, step = 1 }: ControlProps) {
  if (type === 'slider') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white/60">
            {icon}
            <span>{label}</span>
          </div>
          <span className="text-white/60">{value}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="modern-slider"
          />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-brand-accent rounded-full -translate-y-1/2 pointer-events-none"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-2 text-white/60">
        {icon}
        <span>{label}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="modern-toggle"
      >
        <motion.span
          className="modern-toggle-handle"
          animate={{ translateX: value ? 24 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

export function ModernNavigation() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-brand-surface/90 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-glass">
      <div className="flex items-center space-x-2">
        <button className="p-3 text-brand-accent hover:bg-white/5 rounded-xl transition-colors">
          <Home size={24} />
        </button>
        <button className="p-3 text-white/60 hover:bg-white/5 rounded-xl transition-colors">
          <Search size={24} />
        </button>
        <button className="p-3 text-white/60 hover:bg-white/5 rounded-xl transition-colors">
          <Grid size={24} />
        </button>
        <button className="p-3 text-white/60 hover:bg-white/5 rounded-xl transition-colors">
          <User size={24} />
        </button>
      </div>
    </div>
  );
}

export function ModernHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <motion.div
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={24} className="text-white/60" />
            </motion.div>
          </button>
        )}
        <h1 className="text-xl font-medium text-white">{title}</h1>
      </div>
      <button className="relative p-2 hover:bg-white/5 rounded-xl transition-colors">
        <Bell size={24} className="text-white/60" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-brand-accent rounded-full" />
      </button>
    </div>
  );
}