import React from 'react';
import { motion } from 'framer-motion';
import { CustomWaves } from './CustomWaves';

interface NewAuthLogoProps {
  size?: number;
  className?: string;
}

export function NewAuthLogo({ size = 160, className = '' }: NewAuthLogoProps) {
  const scale = size / 160; // Base scale factor
  const fontSize = Math.round(72 * scale);
  const iconSize = Math.round(56 * scale);
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.div 
        className="flex items-center py-1.5 px-8 border border-white/10 rounded-lg relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 24,
          duration: 0.7
        }}
      >
        {/* Animated neon snake effect */}
        <motion.div
          className="absolute -inset-[1px] rounded-lg z-0 overflow-hidden"
          style={{
            background: 'transparent',
          }}
        >
          <motion.div
            className="absolute w-[20%] h-[1px]"
            style={{
              top: '-1px',
              background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.3), rgba(34,211,238,0.4), transparent)',
              boxShadow: '0 0 6px rgba(34,211,238,0.2)'
            }}
            animate={{
              left: ['-20%', '120%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-[1px] h-[20%]"
            style={{
              right: '-1px',
              background: 'linear-gradient(180deg, transparent, rgba(34,211,238,0.3), rgba(34,211,238,0.4), transparent)',
              boxShadow: '0 0 6px rgba(34,211,238,0.2)'
            }}
            animate={{
              top: ['-20%', '120%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.75
            }}
          />
          <motion.div
            className="absolute w-[20%] h-[1px]"
            style={{
              bottom: '-1px',
              background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.3), rgba(34,211,238,0.4), transparent)',
              boxShadow: '0 0 6px rgba(34,211,238,0.2)'
            }}
            animate={{
              right: ['-20%', '120%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
          <motion.div
            className="absolute w-[1px] h-[20%]"
            style={{
              left: '-1px',
              background: 'linear-gradient(180deg, transparent, rgba(34,211,238,0.3), rgba(34,211,238,0.4), transparent)',
              boxShadow: '0 0 6px rgba(34,211,238,0.2)'
            }}
            animate={{
              bottom: ['-20%', '120%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.25
            }}
          />
        </motion.div>

        {/* Animated border effect */}
        <motion.div
          className="absolute -inset-[1px] rounded-lg z-0"
          style={{
            background: 'linear-gradient(90deg, rgba(34,211,238,0.03), rgba(56,189,248,0.05), rgba(34,211,238,0.03))',
          }}
          animate={{
            boxShadow: [
              '0 0 2px rgba(34,211,238,0.2), inset 0 0 2px rgba(34,211,238,0.2)',
              '0 0 4px rgba(34,211,238,0.3), inset 0 0 3px rgba(34,211,238,0.3)',
              '0 0 2px rgba(34,211,238,0.2), inset 0 0 2px rgba(34,211,238,0.2)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Content container with backdrop */}
        <div className="flex items-center relative z-10">
          {/* Icon */}
          <motion.div
            className="relative mr-6"
            animate={{ 
              rotate: [0, 10, -10, 10, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <CustomWaves 
                size={iconSize} 
                style={{
                  opacity: 0.9,
                  transform: 'translateY(2px)'
                }}
              />
            </motion.div>
          </motion.div>

          <div className="flex items-center">
            {/* OYSTER */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span 
                className={`tracking-widest`}
                style={{ 
                  fontFamily: "'TT Modernoir', sans-serif",
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.85) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.1em',
                  lineHeight: '1',
                  fontSize: `${fontSize}px`
                }}
              >
                OYSTER
              </span>
            </motion.div>

            {/* CULT */}
            <motion.div 
              className="relative ml-1"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span 
                style={{ 
                  fontFamily: "'TT Modernoir', sans-serif",
                  fontWeight: 300,
                  background: 'linear-gradient(135deg, rgb(34,211,238) 0%, rgb(56,189,248) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1',
                  fontSize: `${fontSize}px`
                }}
              >
                CULT
              </span>
            </motion.div>
          </div>

          {/* Subtle background effect */}
          <div
            className="absolute inset-0 -z-10 opacity-40"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.08), transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
