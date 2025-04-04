import React from 'react';
import { motion } from 'framer-motion';

interface OysterLogoProps {
  onClick?: () => void;
  className?: string;
  size?: number;
}

export const OysterLogo: React.FC<OysterLogoProps> = ({ onClick, className = '', size = 32 }) => {
  return (
    <motion.div
      className={`flex flex-col items-center cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{ width: size, height: size }}
    >
      <div className="flex flex-col items-center relative">
        <div className="absolute w-full h-full bg-gradient-radial from-blue-500/20 via-blue-400/10 to-transparent blur-[80px] animate-[pulse_4s_ease-in-out_infinite]" />
        
        <motion.span
          className="text-white tracking-wider"
          style={{
            fontSize: "1.5rem",
            fontFamily: "'TT Modernoir', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.08em",
            lineHeight: "0.8",
            display: "block",
            transform: "translate3d(0, 0, 0)",
            willChange: "transform"
          }}
        >
          OYSTER
        </motion.span>
        
        <motion.div
          className="px-2 py-0.5 bg-white rounded"
          style={{
            transform: "translate3d(-0.05rem, -0.2rem, -2cm)",
            willChange: "transform"
          }}
        >
          <motion.span
            style={{
              fontSize: "0.85rem",
              fontFamily: "'TT Modernoir', sans-serif",
              fontWeight: 50,
              letterSpacing: "0.25em",
              display: "block",
              background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 128, 128, 0.9) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            CULT
          </motion.span>
        </motion.div>

        <div className="relative w-8 h-8 mt-1">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full" style={{ transform: "translate3d(-0.6rem, 0, 0)" }}>
            <path d="M15 20 Q25 12, 35 20 T55 20 T75 20 T95 20" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
            <path d="M15 40 Q25 32, 35 40 T55 40 T75 40 T95 40" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
            <path d="M15 60 Q25 52, 35 60 T55 60 T75 60 T95 60" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
            <path d="M15 80 Q25 72, 35 80 T55 80 T75 80 T95 80" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};
