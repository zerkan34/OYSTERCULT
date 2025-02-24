import React from 'react';
import { motion } from 'framer-motion';
import { Power, Droplets, ThermometerSun, Filter } from 'lucide-react';

interface DeviceControlProps {
  name: string;
  value: number;
  icon?: React.ReactNode;
  status: 'on' | 'off';
  onToggle: () => void;
  onChange: (value: number) => void;
}

export function ModernDeviceControl({
  name,
  value,
  icon,
  status,
  onToggle,
  onChange
}: DeviceControlProps) {
  return (
    <div className="bg-brand-surface border border-white/10 rounded-2xl p-6 hover:bg-brand-surface-light transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{name}</h3>
            <div className="text-sm text-white/60">
              {status === 'on' ? 'Activé' : 'Désactivé'}
            </div>
          </div>
        </div>
        
        <motion.button
          onClick={onToggle}
          className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
            status === 'on' ? 'bg-brand-accent' : 'bg-white/10'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full"
            animate={{ x: status === 'on' ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm text-white/60">
          <span>Intensité</span>
          <span>{value}%</span>
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
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}