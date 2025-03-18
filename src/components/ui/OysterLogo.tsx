import React from 'react';
import { motion } from 'framer-motion';

interface OysterLogoProps {
  size?: number;
  className?: string;
}

export function OysterLogo({ size = 32, className = '' }: OysterLogoProps) {
  return (
    <div 
      className={`flex items-center ${className}`}
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="relative">
        <span 
          className="text-white font-bold tracking-wider"
          style={{
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform'
          }}
        >O</span>
        <motion.div
          className="absolute"
          style={{ 
            left: 1,
            top: '100%',
            marginTop: -6,
            fontSize: '8px',
            lineHeight: 0,
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
        >
          <span className="text-cyan-400 font-mono">≈</span>
        </motion.div>
      </div>
      <span 
        className="text-white font-bold tracking-wider"
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform'
        }}
      >YSTER</span>
      <span 
        className="text-white font-bold tracking-wider ml-[0.3em]"
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform'
        }}
      >CULT</span>
    </div>
  );
}