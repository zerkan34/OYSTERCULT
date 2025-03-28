import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Chargement' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
      {/* Fond dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,10,40,0.95)] to-[rgba(0,128,128,0.9)]" />
      
      {/* Effet de vagues animées */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <motion.path
              d="M0,50 C30,60 70,40 100,50 L100,100 L0,100 Z"
              fill="rgb(56, 189, 248)"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M0,60 C40,70 60,50 100,60 L100,100 L0,100 Z"
              fill="rgb(14, 165, 233)"
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.5, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.path
              d="M0,70 C20,80 80,60 100,70 L100,100 L0,100 Z"
              fill="rgb(0, 128, 155)"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 3, ease: "easeInOut", delay: 0.4 }}
            />
          </svg>
        </div>
      </div>
      
      {/* Contenu central */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo avec animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center relative">
            <div className="absolute w-full h-full bg-gradient-radial from-blue-500/20 via-blue-400/10 to-transparent blur-[80px] animate-[pulse_4s_ease-in-out_infinite]" />
            
            <motion.span
              className="text-white tracking-wider"
              style={{
                fontSize: "3rem",
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
                fontSize: "3rem",
                fontFamily: '"TT Modernoir", sans-serif',
                fontWeight: 400,
                letterSpacing: "0.04em",
                lineHeight: 0.9,
                display: "block",
                transform: "translate3d(3.75rem, -0.3rem, 0)",
                willChange: "transform",
                textShadow: "rgba(255,255,255,0.3) 0px 0px 20px, rgba(255,255,255,0.1) 0px 0px 40px",
                WebkitFontSmoothing: "subpixel-antialiased",
                backfaceVisibility: "hidden",
                filter: "drop-shadow(0px 0px 30px rgba(255,255,255,0.2))"
              }}
            >
              C&nbsp;&nbsp;U&nbsp;&nbsp;L&nbsp;&nbsp;T
            </motion.span>

            <div className="relative w-16 h-16 mt-3">
              <div className="absolute inset-0 blur-md opacity-80 bg-gradient-radial from-white/60 to-transparent" />
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full">
                <motion.path 
                  d="M15 20 Q25 12, 35 20 T55 20 T75 20 T95 20" 
                  stroke="white" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
                <motion.path 
                  d="M15 40 Q25 32, 35 40 T55 40 T75 40 T95 40" 
                  stroke="white" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                />
                <motion.path 
                  d="M15 60 Q25 52, 35 60 T55 60 T75 60 T95 60" 
                  stroke="white" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                />
                <motion.path 
                  d="M15 80 Q25 72, 35 80 T55 80 T75 80 T95 80" 
                  stroke="white" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                />
              </svg>
            </div>
          </div>
        </motion.div>
        
        {/* Indicateur de chargement */}
        <motion.div 
          className="w-64 bg-white/10 h-1 rounded-full overflow-hidden glass-effect"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div 
            className="h-full bg-brand-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
        </motion.div>
        
        {/* Message de chargement */}
        <motion.p 
          className="mt-4 text-white/80 text-sm font-light tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;
