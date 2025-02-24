import React from 'react';
import { motion } from 'framer-motion';
import { Settings, AlertTriangle } from 'lucide-react';

interface ZoneControlProps {
  name: string;
  image?: string;
  metrics: {
    label: string;
    value: number;
    unit: string;
    status: 'normal' | 'warning' | 'critical';
  }[];
  devices: number;
  onSettings?: () => void;
}

export function ModernZoneControl({
  name,
  image,
  metrics,
  devices,
  onSettings
}: ZoneControlProps) {
  return (
    <div className="bg-brand-surface border border-white/10 rounded-2xl overflow-hidden">
      {image && (
        <div className="relative h-48">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-surface to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-white">{name}</h3>
            <p className="text-sm text-white/60">{devices} appareils connectés</p>
          </div>
          
          {onSettings && (
            <motion.button
              onClick={onSettings}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings size={20} className="text-white/60" />
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className={`bg-white/5 rounded-xl p-4 ${
                metric.status === 'warning' ? 'border border-yellow-500/20' :
                metric.status === 'critical' ? 'border border-red-500/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">{metric.label}</span>
                {metric.status !== 'normal' && (
                  <AlertTriangle 
                    size={16} 
                    className={metric.status === 'warning' ? 'text-yellow-400' : 'text-red-400'} 
                  />
                )}
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-bold text-white">{metric.value}</span>
                <span className="ml-1 text-sm text-white/60">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}