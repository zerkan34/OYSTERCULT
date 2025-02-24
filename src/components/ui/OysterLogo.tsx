import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

interface OysterLogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
  textPosition?: 'right' | 'bottom';
}

export function OysterLogo({ 
  size = 32, 
  className = '', 
  withText = false,
  textPosition = 'right'
}: OysterLogoProps) {
  return (
    <div 
      className={`flex ${textPosition === 'bottom' ? 'flex-col items-center' : 'items-center'} ${className}`}
      style={{ gap: size / 4 }}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Effet de lueur */}
        <div 
          className="absolute inset-0 bg-brand-burgundy/20 blur-xl rounded-full"
          style={{ transform: 'scale(1.2)' }}
        />
        
        {/* Cercle de fond */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-burgundy/30 to-brand-burgundy rounded-full" />
        
        {/* Icône qui tourne */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <Settings className="w-full h-full text-white" />
        </motion.div>
      </div>

      {withText && (
        <div className={`font-industry tracking-wider whitespace-nowrap text-center`} style={{ fontSize: size / 2 }}>
          <span className="text-gradient-cool font-bold">OYSTER</span>
          <span className="text-white font-bold ml-1">CULT</span>
        </div>
      )}
    </div>
  );
}