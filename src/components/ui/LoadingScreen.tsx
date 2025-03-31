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
          <div className="flex flex-col items-center justify-center">
            <motion.h1 
              className="flex flex-col items-center text-white whitespace-nowrap"
            >
              <div className="flex flex-row items-center space-x-4">
                <span 
                  className="text-[10rem] md:text-[12rem]"
                  style={{ 
                    fontFamily: "'TT Modernoir', sans-serif",
                    fontWeight: 300,
                    letterSpacing: '0.08em',
                    display: 'block',
                    lineHeight: '0.8'
                  }}
                >
                  OYSTER
                </span>
                <span 
                  className="text-[3rem] md:text-[4rem]"
                  style={{ 
                    fontFamily: "'TT Modernoir', sans-serif",
                    fontWeight: 300,
                    letterSpacing: '0.2em',
                    display: 'block'
                  }}
                >
                  CULT
                </span>
              </div>
            </motion.h1>
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
