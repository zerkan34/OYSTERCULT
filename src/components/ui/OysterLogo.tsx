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
            fontSize: "2rem",
            fontFamily: '"TT Modernoir", sans-serif',
            fontWeight: 400,
            letterSpacing: "0.04em",
            lineHeight: 0.9,
            display: "block",
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
            textShadow: "rgba(255,255,255,0.3) 0px 0px 20px, rgba(255,255,255,0.1) 0px 0px 40px",
            WebkitFontSmoothing: "subpixel-antialiased",
            backfaceVisibility: "hidden",
            filter: "drop-shadow(0px 0px 30px rgba(255,255,255,0.2))"
          }}
        >
          O Y S T E R
        </motion.span>
        
        <motion.span
          className="text-white tracking-wider"
          style={{
            fontSize: "2rem",
            fontFamily: '"TT Modernoir", sans-serif',
            fontWeight: 400,
            letterSpacing: "0.04em",
            lineHeight: 0.9,
            display: "block",
            transform: "translate3d(2.5rem, -0.2rem, 0)",
            willChange: "transform",
            textShadow: "rgba(255,255,255,0.3) 0px 0px 20px, rgba(255,255,255,0.1) 0px 0px 40px",
            WebkitFontSmoothing: "subpixel-antialiased",
            backfaceVisibility: "hidden",
            filter: "drop-shadow(0px 0px 30px rgba(255,255,255,0.2))"
          }}
        >
          C&nbsp;&nbsp;U&nbsp;&nbsp;L&nbsp;&nbsp;T
        </motion.span>

        <div className="relative w-12 h-12 mt-2">
          <div className="absolute inset-0 blur-md opacity-80 bg-gradient-radial from-white/60 to-transparent" />
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full">
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
