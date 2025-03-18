import React from 'react';
import { motion } from 'framer-motion';

interface OysterWavesLogoProps {
  size?: number;
}

export const OysterWavesLogo: React.FC<OysterWavesLogoProps> = ({ size = 40 }) => {
  return (
    <div className="logo flex flex-col items-center">
      <span 
        className="text-white font-bold tracking-wider" 
        style={{ fontSize: `${size}px` }}
      >
        OYSTER
      </span>
      <motion.div
        className="waves relative -mt-1.5"
        style={{ fontSize: `${size * 0.45}px` }}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 1.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <span className="text-cyan-400 font-mono tracking-[3px]">≈≈≈</span>
      </motion.div>
    </div>
  );
};
