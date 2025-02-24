import React from 'react';
import { motion } from 'framer-motion';

interface DeviceCardProps {
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'warning';
  metrics: {
    label: string;
    value: number;
    unit: string;
  }[];
  onToggle?: () => void;
  onSettings?: () => void;
}

export function ModernDeviceCard({
  name,
  type,
  status,
  metrics,
  onToggle,
  onSettings
}: DeviceCardProps) {
  return (
    <motion.div 
      className="bg-brand-surface border border-white/10 rounded-2xl p-6 hover:bg-brand-surface-light transition-all duration-300"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-white">{name}</h3>
          <p className="text-sm text-white/60">{type}</p>
        </div>
        
        <motion.button
          onClick={onToggle}
          className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
            status === 'active' ? 'bg-brand-accent' : 'bg-white/10'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full"
            animate={{ x: status === 'active' ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-4">
            <div className="text-sm text-white/60">{metric.label}</div>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-bold text-white">{metric.value}</span>
              <span className="ml-1 text-sm text-white/60">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {onSettings && (
        <motion.button
          onClick={onSettings}
          className="w-full mt-4 px-4 py-2 bg-white/5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Paramètres
        </motion.button>
      )}
    </motion.div>
  );
}