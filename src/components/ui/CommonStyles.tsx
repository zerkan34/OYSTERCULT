import React from 'react';
import { motion } from 'framer-motion';

// Common animation settings
export const modalAnimation = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  content: {
    initial: { opacity: 0, transform: "translateY(30px)" },
    animate: { 
      opacity: 1, 
      transform: "translateY(0)",
      transition: {
        duration: 0.4,
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    },
    exit: { 
      opacity: 0, 
      transform: "translateY(30px)"
    }
  }
};

// Common styles for glass effect
export const glassEffectStyle = "bg-gradient-to-br from-[rgba(10,30,50,0.65)] to-[rgba(20,100,100,0.45)] rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-white/10 shadow-[rgba(0,0,0,0.2)_0px_5px_20px_-5px,rgba(0,200,200,0.1)_0px_5px_12px_-5px,rgba(255,255,255,0.07)_0px_-1px_3px_0px_inset,rgba(0,200,200,0.05)_0px_0px_12px_inset,rgba(0,0,0,0.1)_0px_0px_8px_inset]";

// Progress bar component
export const ProgressBar = ({ value, maxValue = 100, color }: { value: number; maxValue?: number; color: string }) => {
  const percent = Math.min(100, Math.round((value / maxValue) * 100));
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-[rgba(255,255,255,0.1)]">
      <div 
        className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
    </div>
  );
};
